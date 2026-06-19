import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Database, Clock, RefreshCw, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'

interface ImportLog {
  source: string
  status: string
  started_at: number
  finished_at: number | null
  apps_added: number
  apps_updated: number
  error_message: string | null
}

interface StatusData {
  totalApps: number
  bySource: Array<{ import_source: string; c: number }>
  logs: ImportLog[]
}

async function getImportStatus(): Promise<StatusData> {
  const res = await fetch('/api/sso/import/status')
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

async function triggerImport(source: string): Promise<void> {
  const res = await fetch('/api/sso/import/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source }),
  })
  if (!res.ok) throw new Error('Failed to trigger import')
}

const SOURCE_LABELS: Record<string, string> = {
  manual: 'Curated',
  entra: 'Microsoft Entra',
  okta: 'Okta OIN',
  keycloak: 'Keycloak/Ping Rules',
  ping: 'Ping Identity',
}

const IMPORT_SOURCES = [
  { key: 'all', label: 'All Sources' },
  { key: 'entra', label: 'Microsoft Entra' },
  { key: 'okta', label: 'Okta OIN' },
  { key: 'keycloak', label: 'Keycloak/Ping Rules' },
]

function timeAgo(ts: number): string {
  const diff = Math.floor(Date.now() / 1000) - ts
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleString()
}

export function ImportStatus() {
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState(false)
  const [importing, setImporting] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['import-status'],
    queryFn: getImportStatus,
    staleTime: 30_000,
    refetchInterval: importing ? 3_000 : false,
  })

  if (isLoading || !data) return null

  const lastBySource = new Map<string, ImportLog>()
  for (const log of data.logs) {
    if (log.status === 'done' || log.status === 'done_with_errors') {
      if (!lastBySource.has(log.source)) lastBySource.set(log.source, log)
    }
  }

  const runningLog = data.logs.find(l => l.status === 'running')

  const handleImport = async (source: string) => {
    setImporting(source)
    setImportError(null)
    try {
      await triggerImport(source)
      // Poll until done
      const poll = setInterval(async () => {
        await queryClient.invalidateQueries({ queryKey: ['import-status'] })
        const fresh = queryClient.getQueryData<StatusData>(['import-status'])
        const stillRunning = fresh?.logs.some(l => l.status === 'running')
        if (!stillRunning) {
          clearInterval(poll)
          setImporting(null)
          // Refresh app stats too
          queryClient.invalidateQueries({ queryKey: ['stats'] })
        }
      }, 2000)
    } catch (e) {
      setImportError(String(e))
      setImporting(null)
    }
  }

  const lastUpdate = lastBySource.size > 0
    ? Math.max(...[...lastBySource.values()].map(l => l.finished_at || l.started_at))
    : null

  return (
    <div className="mt-3">
      {/* Compact status bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Database className="h-3 w-3 text-blue-400" />
          <span className="text-white font-medium">{data.totalApps.toLocaleString()}</span>
          <span>apps</span>
        </div>

        {data.bySource.map(({ import_source, c }) => (
          <div key={import_source} className="flex items-center gap-1">
            <span className="text-gray-600">{SOURCE_LABELS[import_source] || import_source}:</span>
            <span className="text-gray-400">{c}</span>
          </div>
        ))}

        {lastUpdate && (
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="h-3 w-3" />
            <span>Updated {timeAgo(lastUpdate)}</span>
          </div>
        )}

        {runningLog && (
          <div className="flex items-center gap-1 text-yellow-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Importing {SOURCE_LABELS[runningLog.source] || runningLog.source}…</span>
          </div>
        )}

        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors ml-1"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Manage imports</span>
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Expanded import panel */}
      {expanded && (
        <div className="mt-3 p-4 bg-[hsl(222,84%,6%)] border border-[hsl(217,32%,17%)] rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Database Import</h3>
            <button onClick={() => queryClient.invalidateQueries({ queryKey: ['import-status'] })}
              className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors">
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>

          {/* Trigger buttons */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Trigger import manually (runs in background):</p>
            <div className="flex flex-wrap gap-2">
              {IMPORT_SOURCES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleImport(key)}
                  disabled={!!importing || !!runningLog}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(217,32%,17%)] hover:bg-[hsl(217,32%,22%)] disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 text-xs rounded-lg transition-colors"
                >
                  {importing === key
                    ? <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
                    : <RefreshCw className="h-3 w-3 text-gray-500" />}
                  {label}
                </button>
              ))}
            </div>
            {importError && (
              <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {importError}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-600">
              Entra/Okta require credentials in environment variables. Keycloak/Ping rules work without credentials.
            </p>
          </div>

          {/* Recent import log */}
          {data.logs.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Recent imports:</p>
              <div className="space-y-1.5">
                {data.logs.slice(0, 8).map((log, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs py-1.5 border-b border-[hsl(217,32%,14%)] last:border-0">
                    <div className="w-4 flex-shrink-0">
                      {log.status === 'done' && <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />}
                      {log.status === 'done_with_errors' && <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />}
                      {log.status === 'running' && <Loader2 className="h-3.5 w-3.5 text-blue-400 animate-spin" />}
                      {log.status === 'error' && <AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
                    </div>
                    <span className="text-gray-400 w-28 flex-shrink-0">{SOURCE_LABELS[log.source] || log.source}</span>
                    {log.status === 'running' ? (
                      <span className="text-yellow-400">Running… (started {timeAgo(log.started_at)})</span>
                    ) : (
                      <>
                        <span className="text-gray-500">{formatDate(log.started_at)}</span>
                        <span className="text-green-400 ml-auto whitespace-nowrap">+{log.apps_added} added</span>
                        <span className="text-blue-400 whitespace-nowrap">~{log.apps_updated} updated</span>
                      </>
                    )}
                    {log.error_message && (
                      <span className="text-red-400 truncate max-w-xs" title={log.error_message}>
                        {log.error_message}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.logs.length === 0 && (
            <p className="text-xs text-gray-600 italic">No imports have run yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
