interface Props {
  value: number
}

export function ConfidenceBadge({ value }: Props) {
  const color = value >= 90 ? 'text-green-400 bg-green-400/10'
               : value >= 70 ? 'text-yellow-400 bg-yellow-400/10'
               : 'text-red-400 bg-red-400/10'

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium ${color}`}>
      {value}%
    </span>
  )
}
