import db from '../db.js'
import { importEntra } from './entra.js'
import { importKeycloak } from './keycloak.js'
import { importEntraDocs } from './entra-scraper.js'
import type { ImportResult } from './types.js'

type SourceName = 'entra' | 'keycloak' | 'entra-docs' | 'all'

function logStart(source: string): number {
  const result = db.prepare(`
    INSERT INTO sso_import_log (source, started_at, status) VALUES (?, unixepoch(), 'running')
  `).run(source)
  return result.lastInsertRowid as number
}

function logFinish(id: number, result: ImportResult) {
  db.prepare(`
    UPDATE sso_import_log SET
      finished_at = unixepoch(),
      apps_added = ?,
      apps_updated = ?,
      status = ?,
      error_message = ?
    WHERE id = ?
  `).run(
    result.appsAdded,
    result.appsUpdated,
    result.errors.length > 0 ? 'done_with_errors' : 'done',
    result.errors.length > 0 ? result.errors.slice(0, 5).join('\n') : null,
    id
  )
}

function logError(id: number, error: Error) {
  db.prepare(`
    UPDATE sso_import_log SET
      finished_at = unixepoch(),
      status = 'error',
      error_message = ?
    WHERE id = ?
  `).run(error.message, id)
}

export async function runImport(source: SourceName): Promise<ImportResult[]> {
  const results: ImportResult[] = []

  const sources = source === 'all'
    ? ['entra-docs', 'keycloak'] as const
    : [source] as const

  for (const src of sources) {
    const logId = logStart(src)
    console.log(`Starting ${src} import...`)

    try {
      let result: ImportResult

      switch (src) {
        case 'entra':
          result = await importEntra(db)
          break
        case 'keycloak':
          result = await importKeycloak(db)
          break
        case 'entra-docs':
          result = await importEntraDocs(db)
          break
        default:
          throw new Error(`Unknown source: ${src}`)
      }

      logFinish(logId, result)
      results.push(result)

      console.log(`✓ ${src}: +${result.appsAdded} added, ~${result.appsUpdated} updated (${result.duration}ms)`)
      if (result.errors.length > 0) {
        console.warn(`  ${result.errors.length} errors:`, result.errors.slice(0, 3))
      }
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e))
      logError(logId, error)
      console.error(`✗ ${src} import failed:`, error.message)
      results.push({
        source: src,
        appsAdded: 0,
        appsUpdated: 0,
        errors: [error.message],
        duration: 0,
      })
    }

    // After Entra/entra-docs, apply Keycloak rules automatically
    if ((src === 'entra' || src === 'entra-docs') && source !== 'all') {
      await importKeycloak(db)
    }
  }

  return results
}

export function getImportStatus() {
  const logs = db.prepare(`
    SELECT source, status, started_at, finished_at, apps_added, apps_updated, error_message
    FROM sso_import_log
    ORDER BY started_at DESC
    LIMIT 20
  `).all()

  const totalApps = (db.prepare('SELECT COUNT(*) as c FROM sso_apps').get() as { c: number }).c
  const bySource = db.prepare(`
    SELECT import_source, COUNT(*) as c FROM sso_apps GROUP BY import_source
  `).all() as Array<{ import_source: string; c: number }>

  return { logs, totalApps, bySource }
}
