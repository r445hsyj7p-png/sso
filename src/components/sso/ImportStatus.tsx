import { useQuery } from '@tanstack/react-query'
import { Database, Clock } from 'lucide-react'

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

const SOURCE_LABELS: Record<string, string> = {
  manual: 'Curated',
  entra: 'Microsoft Entra',
  okta: 'Okta OIN',
  keycloak: 'Keycloak Rules',
  ping: 'Ping Identity',
}

function timeAgo(ts: number): string {
  const diff = Math.floor(Date.now() / 1000) - ts
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function ImportStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ['import-status'],
    queryFn: getImportStatus,
    staleTime: 60_000,
  })

  if (isLoading || !data) return null

  // Get last successful import per source
  const lastBySource = new Map<string, ImportLog>()
  for (const log of data.logs) {
    if (log.status === 'done' || log.status === 'done_with_errors') {
      if (!lastBySource.has(log.source)) lastBySource.set(log.source, log)
    }
  }

  return (
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

      {lastBySource.size > 0 && (
        <div className="flex items-center gap-1 text-gray-600">
          <Clock className="h-3 w-3" />
          <span>Updated {timeAgo(Math.max(...[...lastBySource.values()].map(l => l.finished_at || l.started_at)))}</span>
        </div>
      )}
    </div>
  )
}
