import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Globe, Loader2, AlertCircle, CheckCircle2, Shield, Building2, Tag, FileText, DatabaseZap } from 'lucide-react'
import { ConfidenceBadge } from './ConfidenceBadge'

interface LookupResult {
  url: string
  pageTitle: string | null
  detectedProtocols: Array<{ protocol: string; confidence: number; evidence: string }>
  detectedIdPs: string[]
  licenseHints: string[]
  rawExcerpts: string[]
  appNameGuess: string | null
  error?: string
}

interface SavePayload {
  appName: string
  url: string
  protocols: Record<string, boolean>
  idps: string[]
}

async function lookupSupportUrl(url: string): Promise<LookupResult> {
  const res = await fetch('/api/sso/lookup-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) throw new Error('Lookup failed')
  return res.json()
}

async function saveApp(payload: SavePayload): Promise<{ success: boolean; app_key: string; added: boolean; updated: boolean }> {
  const res = await fetch('/api/sso/lookup-url/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any).error || 'Save failed')
  }
  return res.json()
}

const PROTOCOL_MAP: Array<{ key: string; label: string; pattern: RegExp }> = [
  { key: 'saml2',        label: 'SAML 2.0',        pattern: /saml/i },
  { key: 'oidc',         label: 'OIDC',             pattern: /oidc|openid connect/i },
  { key: 'oauth2',       label: 'OAuth 2.0',        pattern: /oauth/i },
  { key: 'scim',         label: 'SCIM',             pattern: /scim/i },
  { key: 'ldap',         label: 'LDAP',             pattern: /ldap/i },
  { key: 'kerberos',     label: 'Kerberos',         pattern: /kerberos/i },
  { key: 'ws_federation',label: 'WS-Federation',    pattern: /ws-fed/i },
  { key: 'cas',          label: 'CAS',              pattern: /\bcas\b/i },
]

function resultToProtocols(result: LookupResult): Record<string, boolean> {
  const names = result.detectedProtocols.map(p => p.protocol)
  const joined = names.join(' ')
  const obj: Record<string, boolean> = {}
  for (const { key, pattern } of PROTOCOL_MAP) {
    obj[key] = pattern.test(joined)
  }
  return obj
}

const EXAMPLE_URLS = [
  { label: 'Personio SSO', url: 'https://support.personio.de/hc/en-us/articles/360000507225' },
  { label: 'HubSpot SSO', url: 'https://knowledge.hubspot.com/account-management/set-up-sso-through-a-saml-provider' },
  { label: 'Notion SSO', url: 'https://www.notion.so/help/saml-sso-configuration' },
  { label: 'Monday SSO', url: 'https://support.monday.com/hc/en-us/articles/360000433209' },
]

export function SupportPageLookup() {
  const queryClient = useQueryClient()
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<LookupResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Save dialog state
  const [showSave, setShowSave] = useState(false)
  const [saveAppName, setSaveAppName] = useState('')
  const [saveProtocols, setSaveProtocols] = useState<Record<string, boolean>>({})
  const [saveIdps, setSaveIdps] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saveResult, setSaveResult] = useState<{ added: boolean; updated: boolean; app_key: string } | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setIsLoading(true)
    setError(null)
    setResult(null)
    setShowSave(false)
    setSaveResult(null)
    try {
      const r = await lookupSupportUrl(url.trim())
      if (r.error) setError(`Page error: ${r.error}`)
      else setResult(r)
    } catch (e) {
      setError(String(e))
    } finally {
      setIsLoading(false)
    }
  }

  const handleExample = (exUrl: string) => {
    setUrl(exUrl)
    setResult(null)
    setError(null)
    setShowSave(false)
    setSaveResult(null)
  }

  const handleOpenSave = () => {
    if (!result) return
    setSaveAppName(result.appNameGuess || '')
    setSaveProtocols(resultToProtocols(result))
    setSaveIdps(result.detectedIdPs)
    setSaveError(null)
    setSaveResult(null)
    setShowSave(true)
  }

  const handleSave = async () => {
    if (!result || !saveAppName.trim()) return
    setIsSaving(true)
    setSaveError(null)
    try {
      const r = await saveApp({ appName: saveAppName, url: result.url, protocols: saveProtocols, idps: saveIdps })
      setSaveResult(r)
      setShowSave(false)
      // Invalidate search cache so Discovery mode shows the new app immediately
      queryClient.invalidateQueries({ queryKey: ['sso-apps'] })
    } catch (e) {
      setSaveError(String(e))
    } finally {
      setIsSaving(false)
    }
  }

  const noProtocols = result && result.detectedProtocols.length === 0

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-gray-400 mb-3">
          Paste a vendor's SSO documentation URL. The page will be fetched and analyzed for SSO protocol mentions, supported Identity Providers, and license requirements.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://support.example.com/en/articles/sso-setup"
              className="w-full pl-9 pr-4 py-2.5 bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!url.trim() || isLoading}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            {isLoading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Globe className="h-4 w-4" />}
            Analyze Page
          </button>
        </form>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 items-center">
          <span className="text-xs text-gray-600">Examples:</span>
          {EXAMPLE_URLS.map(ex => (
            <button
              key={ex.url}
              onClick={() => handleExample(ex.url)}
              className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {saveResult && (
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-400">
            {saveResult.added ? 'App added to database' : 'App updated in database'} — searchable as <span className="font-mono">{saveResult.app_key}</span>
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          {/* Header + Verify button */}
          <div className="flex items-start gap-3 p-4 bg-[hsl(222,84%,6%)] border border-[hsl(217,32%,17%)] rounded-xl">
            <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              {result.appNameGuess && (
                <div className="font-semibold text-white mb-0.5">{result.appNameGuess}</div>
              )}
              {result.pageTitle && (
                <div className="text-xs text-gray-500 truncate">{result.pageTitle}</div>
              )}
              <a href={result.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-purple-400 hover:text-purple-300 truncate block mt-0.5">
                {result.url}
              </a>
            </div>
            <button
              onClick={handleOpenSave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
            >
              <DatabaseZap className="h-3.5 w-3.5" />
              Verify &amp; Save
            </button>
          </div>

          {/* Save dialog */}
          {showSave && (
            <div className="p-4 bg-[hsl(222,84%,6%)] border border-emerald-500/30 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white">Verify &amp; Save to Database</h3>
              <p className="text-xs text-gray-500">Review and correct the detected information before saving.</p>

              {/* App name */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">App Name *</label>
                <input
                  value={saveAppName}
                  onChange={e => setSaveAppName(e.target.value)}
                  placeholder="e.g. Cato Networks"
                  className="w-full px-3 py-2 bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              {/* Protocols */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Supported Protocols</label>
                <div className="flex flex-wrap gap-2">
                  {PROTOCOL_MAP.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSaveProtocols(p => ({ ...p, [key]: !p[key] }))}
                      className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                        saveProtocols[key]
                          ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-[hsl(217,32%,12%)] border-[hsl(217,32%,17%)] text-gray-500'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* IdPs */}
              {saveIdps.length > 0 && (
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Detected Identity Providers</label>
                  <div className="flex flex-wrap gap-2">
                    {saveIdps.map(idp => (
                      <span key={idp} className="px-2.5 py-1 text-xs bg-blue-600/15 border border-blue-500/25 text-blue-300 rounded-md">
                        {idp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {saveError && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {saveError}
                </p>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowSave(false)}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !saveAppName.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
                >
                  {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <DatabaseZap className="h-3 w-3" />}
                  Save to Database
                </button>
              </div>
            </div>
          )}

          {/* Protocols */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="h-3 w-3" />
              Detected Protocols {noProtocols && <span className="text-yellow-500 normal-case font-normal">— none found</span>}
            </h3>
            {result.detectedProtocols.length > 0 ? (
              <div className="space-y-2">
                {result.detectedProtocols.map((p, i) => (
                  <div key={i} className="p-3 bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-lg">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span className="font-medium text-white text-sm">{p.protocol}</span>
                      <ConfidenceBadge value={p.confidence} />
                    </div>
                    <p className="text-xs text-gray-500 italic leading-relaxed line-clamp-3">{p.evidence}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No protocol keywords (SAML, OIDC, SCIM, LDAP…) found on this page.</p>
            )}
          </div>

          {/* IdPs */}
          {result.detectedIdPs.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building2 className="h-3 w-3" />
                Mentioned Identity Providers
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.detectedIdPs.map(idp => (
                  <span key={idp} className="px-3 py-1.5 bg-blue-600/15 border border-blue-500/25 text-blue-300 text-sm rounded-lg">
                    {idp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* License hints */}
          {result.licenseHints.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Tag className="h-3 w-3" />
                License / Plan Hints
              </h3>
              <div className="space-y-2">
                {result.licenseHints.map((hint, i) => (
                  <p key={i} className="text-xs text-gray-400 italic bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-lg px-3 py-2 leading-relaxed">
                    {hint}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Raw excerpts */}
          {result.rawExcerpts.length > 0 && (
            <details className="group">
              <summary className="text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-400 flex items-center gap-2">
                <FileText className="h-3 w-3" />
                Raw Text Excerpts ({result.rawExcerpts.length})
              </summary>
              <div className="mt-3 space-y-2">
                {result.rawExcerpts.map((excerpt, i) => (
                  <p key={i} className="text-xs text-gray-400 font-mono bg-[hsl(222,84%,6%)] border border-[hsl(217,32%,17%)] rounded p-3 leading-relaxed whitespace-pre-wrap break-words">
                    {excerpt}
                  </p>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  )
}
