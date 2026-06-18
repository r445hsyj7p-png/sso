import db from '../db.js'
import type { SSOApp } from './types.js'

export function searchApps(query: string): SSOApp[] {
  const terms = query.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
  if (terms.length === 0) return []

  const results: SSOApp[] = []
  const seen = new Set<string>()

  for (const term of terms) {
    const pattern = `%${term}%`
    const rows = db.prepare(`
      SELECT * FROM sso_apps
      WHERE lower(app_key) LIKE ? OR lower(app_name) LIKE ? OR lower(vendor) LIKE ?
      ORDER BY
        CASE WHEN lower(app_key) = ? THEN 0
             WHEN lower(app_name) = ? THEN 1
             WHEN lower(app_key) LIKE ? THEN 2
             ELSE 3 END,
        confidence DESC
      LIMIT 10
    `).all(pattern, pattern, pattern, term, term, `${term}%`) as SSOApp[]

    for (const row of rows) {
      if (!seen.has(row.app_key)) {
        seen.add(row.app_key)
        results.push(row)
      }
    }
  }

  return results.slice(0, 30)
}
