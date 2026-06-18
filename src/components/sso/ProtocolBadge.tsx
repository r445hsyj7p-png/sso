import { Check, X, HelpCircle } from 'lucide-react'

interface Props {
  value: number | boolean | null
  size?: 'sm' | 'md'
}

export function ProtocolBadge({ value, size = 'md' }: Props) {
  const supported = value === 1 || value === true
  const unsupported = value === 0 || value === false

  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  if (supported) return (
    <div className="flex justify-center">
      <div className={`${sizeClass} rounded-full bg-green-500/20 flex items-center justify-center`}>
        <Check className="h-3 w-3 text-green-400" />
      </div>
    </div>
  )
  if (unsupported) return (
    <div className="flex justify-center">
      <div className={`${sizeClass} rounded-full bg-red-500/20 flex items-center justify-center`}>
        <X className="h-3 w-3 text-red-400" />
      </div>
    </div>
  )
  return (
    <div className="flex justify-center">
      <div className={`${sizeClass} rounded-full bg-gray-500/20 flex items-center justify-center`}>
        <HelpCircle className="h-3 w-3 text-gray-500" />
      </div>
    </div>
  )
}
