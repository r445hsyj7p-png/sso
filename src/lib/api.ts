const BASE = '/api/sso'

export async function searchApps(query: string) {
  const res = await fetch(`${BASE}/apps?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export async function getApp(key: string) {
  const res = await fetch(`${BASE}/apps/${key}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

export async function getStats() {
  const res = await fetch(`${BASE}/stats`)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export async function analyzeFile(file: File) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/analyze`, { method: 'POST', body: form })
  if (!res.ok) throw new Error('Analysis failed')
  return res.json()
}

export async function analyzeURL(url: string) {
  const res = await fetch(`${BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) throw new Error('Analysis failed')
  return res.json()
}

export async function analyzeText(content: string, filename: string) {
  const res = await fetch(`${BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, filename }),
  })
  if (!res.ok) throw new Error('Analysis failed')
  return res.json()
}
