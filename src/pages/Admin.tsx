import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2, ChevronLeft, ChevronRight, Search, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { ImportStatus } from '../components/sso/ImportStatus'
import { ConfidenceBadge } from '../components/sso/ConfidenceBadge'

interface AdminApp {
  app_key: string
  app_name: string
  vendor: string | null
  import_source: string
  confidence: number
  saml2: number
  oidc: number
  scim: number
  updated_at: number
}

interface AdminAppsResponse {
  apps: AdminApp[]
  total: number
  page: number
  pages: number
}

const SOURCE_LABELS: Record<string, string> = {
  manual: 'Manual',
  'entra-docs': 'Entra Docs',
  entra: 'Entra API',
  keycloak: 'Keycloak/Ping',
}

const SOURCE_COLORS: Record<string, string> = {
  manual: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'entra-docs': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  entra: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  keycloak: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
}

async function fetchAdminApps(page: number, source: string, q: string): Promise<AdminAppsResponse> {
  const params = new URLSearchParams({ page: String(page) })
  if (source) params.set('source', source)
  if (q) params.set('q', q)
  const res = await fetch(`/api/sso/admin/apps?${params}`)
  if (!res.ok) throw new Error('Failed to load apps')
  return res.json()
}

async function deleteApp(appKey: string): Promise<void> {
  const res = await fetch(`/api/sso/apps/${encodeURIComponent(appKey)}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any).error || 'Delete failed')
  }
}

export default function Admin() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [sourceFilter, setSourceFilter] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)
  const [confirmKey, setConfirmKey] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-apps', page, sourceFilter, search],
    queryFn: () => fetchAdminApps(page, sourceFilter, search),
    staleTime: 10_000,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleSourceFilter = (s: string) => {
    setSourceFilter(s)
    setPage(1)
  }

  const handleDelete = async (app: AdminApp) => {
    if (confirmKey !== app.app_key) {
      setConfirmKey(app.app_key)
      return
    }
    setDeleting(app.app_key)
    setDeleteError(null)
    setDeleteSuccess(null)
    setConfirmKey(null)
    try {
      await deleteApp(app.app_key)
      setDeleteSuccess(`"${app.app_name}" deleted`)
      queryClient.invalidateQueries({ queryKey: ['admin-apps'] })
      queryClient.invalidateQueries({ queryKey: ['sso-apps'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    } catch (e) {
      setDeleteError(String(e))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Admin</h1>
        <p className="text-gray-400 text-sm">Manage imports and database entries</p>
      </div>

      {/* Import panel */}
      <section className="p-5 bg-[hsl(222,84%,6%)] border border-[hsl(217,32%,17%)] rounded-xl">
        <h2 className="text-sm font-semibold text-white mb-3">Database Imports</h2>
        <ImportStatus />
      </section>

      {/* App list */}
      <section>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h2 className="text-sm font-semibold text-white flex-1">
            All Apps {data && <span className="text-gray-500 font-normal">({data.total.toLocaleString()})</span>}
          </h2>

          {/* Source filter */}
          <div className="flex gap-1.5">
            {['', 'manual', 'entra-docs', 'entra', 'keycloak'].map(s => (
              <button
                key={s}
                onClick={() => handleSourceFilter(s)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  sourceFilter === s
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-[hsl(217,32%,12%)] border-[hsl(217,32%,17%)] text-gray-400 hover:text-white'
                }`}
              >
                {s === '' ? 'All' : SOURCE_LABELS[s] || s}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-1.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Filter apps…"
                className="pl-8 pr-3 py-1.5 bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-lg text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
              />
            </div>
            <button type="submit" className="px-3 py-1.5 bg-[hsl(217,32%,17%)] hover:bg-[hsl(217,32%,22%)] text-gray-300 text-xs rounded-lg transition-colors">
              Search
            </button>
            {search && (
              <button type="button" onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}
                className="px-3 py-1.5 text-gray-500 hover:text-gray-300 text-xs transition-colors">
                Clear
              </button>
            )}
          </form>
        </div>

        {deleteError && (
          <div className="flex items-center gap-2 mb-3 p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" /> {deleteError}
          </div>
        )}
        {deleteSuccess && (
          <div className="flex items-center gap-2 mb-3 p-2.5 bg-green-500/10 border border-green-500/30 rounded-lg text-xs text-green-400">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" /> {deleteSuccess}
          </div>
        )}

        <div className="border border-[hsl(217,32%,17%)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(217,32%,17%)] bg-[hsl(222,84%,6%)]">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">App</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">SAML</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">OIDC</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">SCIM</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-sm">Loading…</td></tr>
              )}
              {!isLoading && data?.apps.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-sm">No apps found</td></tr>
              )}
              {data?.apps.map((app, i) => {
                const isManual = app.import_source === 'manual'
                const isConfirm = confirmKey === app.app_key
                return (
                  <tr
                    key={app.app_key}
                    className={`border-b border-[hsl(217,32%,17%)] last:border-0 ${
                      i % 2 === 0 ? 'bg-[hsl(222,84%,8%)]' : 'bg-[hsl(222,84%,7%)]'
                    }`}
                  >
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-white text-sm">{app.app_name}</div>
                      {app.vendor && <div className="text-xs text-gray-500">{app.vendor}</div>}
                      <div className="text-xs text-gray-600 font-mono">{app.app_key}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex px-2 py-0.5 text-xs rounded border ${SOURCE_COLORS[app.import_source] || 'text-gray-400 bg-gray-400/10 border-gray-400/20'}`}>
                        {SOURCE_LABELS[app.import_source] || app.import_source}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center text-sm">{app.saml2 ? '✅' : '—'}</td>
                    <td className="px-3 py-2.5 text-center text-sm">{app.oidc  ? '✅' : '—'}</td>
                    <td className="px-3 py-2.5 text-center text-sm">{app.scim  ? '✅' : '—'}</td>
                    <td className="px-3 py-2.5 text-center">
                      <ConfidenceBadge value={app.confidence} importSource={app.import_source} />
                    </td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap">
                      {isManual && (
                        isConfirm ? (
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs text-yellow-400">Delete?</span>
                            <button
                              onClick={() => handleDelete(app)}
                              disabled={deleting === app.app_key}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded-md transition-colors disabled:opacity-50"
                            >
                              Yes, delete
                            </button>
                            <button
                              onClick={() => setConfirmKey(null)}
                              className="px-2.5 py-1 text-gray-500 hover:text-gray-300 text-xs transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDelete(app)}
                            className="p-1.5 text-gray-600 hover:text-red-400 transition-colors rounded"
                            title="Delete app"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              Page {data.page} of {data.pages} · {data.total.toLocaleString()} total
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
