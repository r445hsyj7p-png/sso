/**
 * URL Lookup: fetch a vendor support page and extract SSO capability hints.
 * Rule-based text analysis — no LLM required.
 */

export interface URLLookupResult {
  url: string
  pageTitle: string | null
  detectedProtocols: Array<{ protocol: string; confidence: number; evidence: string }>
  detectedIdPs: string[]
  licenseHints: string[]
  rawExcerpts: string[]
  appNameGuess: string | null
  error?: string
}

const PROTOCOL_PATTERNS: Array<{
  protocol: string
  patterns: RegExp[]
  confidence: number
}> = [
  {
    protocol: 'SAML 2.0',
    patterns: [/\bSAML\s*2\.0\b/i, /\bSAML\b/i, /Security Assertion Markup Language/i],
    confidence: 90,
  },
  {
    protocol: 'OpenID Connect (OIDC)',
    patterns: [/\bOIDC\b/i, /OpenID Connect/i, /openid-configuration/i],
    confidence: 90,
  },
  {
    protocol: 'OAuth 2\.0',
    patterns: [/\bOAuth\s*2\.0\b/i, /\bOAuth2\b/i],
    confidence: 85,
  },
  {
    protocol: 'SCIM',
    patterns: [/\bSCIM\s*2?\.0?\b/i, /System for Cross-domain Identity Management/i, /user provisioning/i, /automated provisioning/i],
    confidence: 85,
  },
  {
    protocol: 'LDAP / Active Directory',
    patterns: [/\bLDAP\b/i, /Active Directory/i, /\bAD\s+sync\b/i],
    confidence: 80,
  },
  {
    protocol: 'WS-Federation',
    patterns: [/WS-Fed(eration)?/i, /\bWS-Fed\b/i],
    confidence: 85,
  },
  {
    protocol: 'Kerberos',
    patterns: [/\bKerberos\b/i],
    confidence: 85,
  },
  {
    protocol: 'CAS',
    patterns: [/\bCAS\b.*auth/i, /Central Authentication Service/i],
    confidence: 75,
  },
]

const IDP_PATTERNS: Array<{ name: string; patterns: RegExp[] }> = [
  { name: 'Microsoft Entra ID (Azure AD)', patterns: [/Entra\s*ID/i, /Azure\s*AD/i, /Azure Active Directory/i, /Microsoft\s+SSO/i] },
  { name: 'Okta', patterns: [/\bOkta\b/i] },
  { name: 'Google Workspace', patterns: [/Google\s+Workspace/i, /G Suite/i, /Google\s+SSO/i, /accounts\.google\.com/i] },
  { name: 'Ping Identity', patterns: [/Ping\s*Identity/i, /PingFed/i, /PingOne/i] },
  { name: 'Keycloak', patterns: [/\bKeycloak\b/i] },
  { name: 'Auth0', patterns: [/\bAuth0\b/i] },
  { name: 'OneLogin', patterns: [/\bOneLogin\b/i] },
  { name: 'ForgeRock / PingAM', patterns: [/ForgeRock/i, /\bPingAM\b/i, /OpenAM/i] },
  { name: 'ADFS', patterns: [/\bADFS\b/i, /Active Directory Federation/i] },
]

const LICENSE_PATTERNS: RegExp[] = [
  /enterprise\s+plan/i,
  /professional\s+plan/i,
  /business\s+plan/i,
  /premium\s+(plan|only|feature)/i,
  /paid\s+plan/i,
  /requires?\s+(an?\s+)?(enterprise|professional|business|premium)/i,
  /available\s+(on|with|in)\s+(the\s+)?(enterprise|professional|business|premium)/i,
  /upgrade\s+(to|your)\s+plan/i,
  /contact\s+sales/i,
  /add-?on/i,
]

function extractTextFromHtml(html: string): string {
  // Remove scripts, styles, nav, footer
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()

  return text
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return match ? match[1].trim() : null
}

function findExcerpts(text: string, pattern: RegExp, contextChars = 150): string[] {
  const excerpts: string[] = []
  let match: RegExpExecArray | null
  const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g')
  let count = 0

  while ((match = re.exec(text)) !== null && count < 3) {
    const start = Math.max(0, match.index - contextChars)
    const end = Math.min(text.length, match.index + match[0].length + contextChars)
    const excerpt = text.slice(start, end).trim()
    excerpts.push('...' + excerpt + '...')
    count++
  }

  return excerpts
}

// For Zendesk Help Center URLs, extract article ID and call the public JSON API
function buildZendeskApiUrl(url: string): string | null {
  const m = url.match(/^(https?:\/\/[^/]+)\/hc\/[^/]+\/articles\/(\d+)/)
  if (!m) return null
  return `${m[1]}/api/v2/help_center/articles/${m[2]}.json`
}

async function fetchZendeskArticle(url: string): Promise<string | null> {
  const apiUrl = buildZendeskApiUrl(url)
  if (!apiUrl) return null
  try {
    const res = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    const data = await res.json() as { article?: { title?: string; body?: string } }
    const article = data?.article
    if (!article) return null
    // Return as minimal HTML so existing parser works
    const title = article.title ? `<title>${article.title}</title>` : ''
    const body = article.body || ''
    return `<html><head>${title}</head><body>${body}</body></html>`
  } catch {
    return null
  }
}

export async function lookupUrl(url: string): Promise<URLLookupResult> {
  const result: URLLookupResult = {
    url,
    pageTitle: null,
    detectedProtocols: [],
    detectedIdPs: [],
    licenseHints: [],
    rawExcerpts: [],
    appNameGuess: null,
  }

  let html: string
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: AbortSignal.timeout(15_000),
    })

    if (!res.ok) {
      // Try Zendesk API fallback for Help Center articles
      const zendeskHtml = await fetchZendeskArticle(url)
      if (zendeskHtml) {
        html = zendeskHtml
      } else if (res.status === 403) {
        result.error = `This page blocks server-side requests (HTTP 403). Workaround: open the page in your browser, select all text (Ctrl+A → Ctrl+C), then paste it into the "Paste text" tab in the Analyzer.`
        return result
      } else {
        result.error = `HTTP ${res.status}: ${res.statusText}`
        return result
      }
    } else {
      html = await res.text()
    }
  } catch (e) {
    result.error = `Fetch failed: ${String(e)}`
    return result
  }

  result.pageTitle = extractTitle(html)
  const text = extractTextFromHtml(html)

  // Guess app name from title
  if (result.pageTitle) {
    const titleClean = result.pageTitle
      .replace(/\s*[-|–]\s*.+$/, '') // remove "- Help Center" etc.
      .replace(/\s*(SSO|Single Sign.On|Authentication|Login).*/i, '')
      .trim()
    if (titleClean.length > 1 && titleClean.length < 60) {
      result.appNameGuess = titleClean
    }
  }

  // Detect protocols
  const seenProtocols = new Set<string>()
  for (const { protocol, patterns, confidence } of PROTOCOL_PATTERNS) {
    if (seenProtocols.has(protocol)) continue
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        const excerpts = findExcerpts(text, pattern, 120)
        result.detectedProtocols.push({
          protocol,
          confidence,
          evidence: excerpts[0] || `Pattern matched: ${pattern.source}`,
        })
        result.rawExcerpts.push(...excerpts.slice(0, 2))
        seenProtocols.add(protocol)
        break
      }
    }
  }

  // Detect IdPs
  const seenIdPs = new Set<string>()
  for (const { name, patterns } of IDP_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(text) && !seenIdPs.has(name)) {
        result.detectedIdPs.push(name)
        seenIdPs.add(name)
        break
      }
    }
  }

  // License hints
  for (const pattern of LICENSE_PATTERNS) {
    const excerpts = findExcerpts(text, pattern, 100)
    for (const excerpt of excerpts) {
      if (!result.licenseHints.some(h => h.includes(excerpt.slice(10, 30)))) {
        result.licenseHints.push(excerpt)
        if (result.licenseHints.length >= 3) break
      }
    }
    if (result.licenseHints.length >= 3) break
  }

  // Deduplicate excerpts
  result.rawExcerpts = [...new Set(result.rawExcerpts)].slice(0, 6)

  return result
}
