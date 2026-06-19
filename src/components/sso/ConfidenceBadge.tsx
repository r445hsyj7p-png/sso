interface Props {
  value: number
  importSource?: string
}

function getTooltip(value: number, importSource?: string): string {
  if (importSource === 'entra') {
    return `${value}% — Sourced directly from Microsoft Entra Graph API (machine-readable protocol metadata)`
  }
  if (importSource === 'entra-docs') {
    return `${value}% — Extracted from official Microsoft Entra integration tutorials via text analysis. Protocol detection is pattern-based, not machine-readable.`
  }
  if (importSource === 'keycloak') {
    return `${value}% — Inferred by rule: apps supporting SAML or OIDC are compatible with Keycloak/Ping Identity`
  }
  if (importSource === 'manual') {
    if (value >= 95) return `${value}% — Manually curated and verified against official vendor documentation`
    if (value >= 90) return `${value}% — Manually curated; some fields inferred from documentation`
    return `${value}% — Manually curated; confidence reflects partial documentation coverage`
  }
  if (value >= 90) return `${value}% — High confidence: directly sourced or manually verified`
  if (value >= 70) return `${value}% — Medium confidence: inferred from documentation or pattern matching`
  return `${value}% — Low confidence: limited information available`
}

export function ConfidenceBadge({ value, importSource }: Props) {
  const color = value >= 90 ? 'text-green-400 bg-green-400/10'
               : value >= 70 ? 'text-yellow-400 bg-yellow-400/10'
               : 'text-red-400 bg-red-400/10'

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium ${color} cursor-help`}
      title={getTooltip(value, importSource)}
    >
      {value}%
    </span>
  )
}
