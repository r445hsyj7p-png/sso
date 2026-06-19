#!/usr/bin/env tsx
import { runImport } from '../server/importers/runner.js'

const source = (process.argv[2] || 'all') as 'entra' | 'okta' | 'keycloak' | 'all'

console.log(`\nSSO Capability Checker — Import: ${source}\n`)

try {
  const results = await runImport(source)

  console.log('\nSummary:')
  for (const r of results) {
    const status = r.errors.length > 0 ? '[WARN]' : '[OK]'
    console.log(`  ${status} ${r.source}: +${r.appsAdded} added, ~${r.appsUpdated} updated (${(r.duration / 1000).toFixed(1)}s)`)
  }

  const total = results.reduce((sum, r) => sum + r.appsAdded + r.appsUpdated, 0)
  console.log(`\nTotal apps touched: ${total}`)
  process.exit(0)
} catch (e) {
  console.error('\nImport failed:', e)
  process.exit(1)
}
