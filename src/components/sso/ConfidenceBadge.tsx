import * as Tooltip from '@radix-ui/react-tooltip'

interface Props {
  value: number
  importSource?: string
}

interface TooltipContent {
  label: string
  detail: string
}

function getTooltip(value: number, importSource?: string): TooltipContent {
  if (importSource === 'entra') return {
    label: 'Entra Graph API',
    detail: 'Sourced directly from Microsoft Entra Graph API — machine-readable protocol metadata, highest accuracy.',
  }
  if (importSource === 'entra-docs') return {
    label: 'Entra Documentation',
    detail: 'Extracted from official Microsoft Entra integration tutorials via text analysis. Protocol detection is pattern-based, not machine-readable.',
  }
  if (importSource === 'keycloak') return {
    label: 'Inferred by rule',
    detail: 'Apps supporting SAML or OIDC are assumed compatible with standard IdPs like Keycloak and Ping Identity.',
  }
  if (importSource === 'manual') {
    if (value >= 90) return {
      label: 'Manually verified',
      detail: 'Curated and verified against official vendor documentation.',
    }
    return {
      label: 'Manually curated',
      detail: 'Curated from vendor documentation; confidence reflects partial or inferred coverage.',
    }
  }
  if (value >= 90) return {
    label: 'High confidence',
    detail: 'Directly sourced or manually verified against official documentation.',
  }
  if (value >= 70) return {
    label: 'Medium confidence',
    detail: 'Inferred from documentation or pattern matching — may not be exhaustive.',
  }
  return {
    label: 'Low confidence',
    detail: 'Limited information available; treat with caution.',
  }
}

export function ConfidenceBadge({ value, importSource }: Props) {
  const color = value >= 90 ? 'text-green-400 bg-green-400/10 border-green-400/20'
               : value >= 70 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
               : 'text-red-400 bg-red-400/10 border-red-400/20'

  const { label, detail } = getTooltip(value, importSource)

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-medium ${color} cursor-help select-none`}>
            {value}%
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={6}
            className="z-[200] max-w-xs rounded-lg bg-[hsl(222,84%,10%)] border border-[hsl(217,32%,22%)] shadow-xl px-3.5 py-3 text-left"
          >
            <p className="text-xs font-semibold text-white mb-1">{value}% confidence · {label}</p>
            <p className="text-xs text-gray-400 leading-relaxed">{detail}</p>
            <Tooltip.Arrow className="fill-[hsl(217,32%,22%)]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
