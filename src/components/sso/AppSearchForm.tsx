import { useState, useRef } from 'react'
import { Search, X } from 'lucide-react'

interface Props {
  onSearch: (query: string) => void
  isLoading: boolean
}

const EXAMPLE_QUERIES = [
  'Jira, Confluence, ServiceNow',
  'Salesforce, Workday, SAP SuccessFactors',
  'GitHub, GitLab, Datadog',
  'Slack, Zoom, Microsoft 365',
]

export function AppSearchForm({ onSearch, isLoading }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  const handleExample = (example: string) => {
    setQuery(example)
    onSearch(example)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter app names separated by commas (e.g. Jira, ServiceNow, Salesforce)"
            className="w-full pl-9 pr-8 py-2.5 bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Search
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-xs text-gray-600">Try:</span>
        {EXAMPLE_QUERIES.map(example => (
          <button
            key={example}
            onClick={() => handleExample(example)}
            className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  )
}
