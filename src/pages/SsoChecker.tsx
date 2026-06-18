import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as Tabs from '@radix-ui/react-tabs'
import { Search, Upload, Info } from 'lucide-react'
import { AppSearchForm } from '../components/sso/AppSearchForm'
import { ResultsTable } from '../components/sso/ResultsTable'
import { AppDetailDrawer } from '../components/sso/AppDetailDrawer'
import { AnalyzerUploadZone } from '../components/sso/AnalyzerUploadZone'
import { AnalyzerResults } from '../components/sso/AnalyzerResults'
import type { AnalyzerResult } from '../components/sso/AnalyzerResults'
import { searchApps } from '../lib/api'

export default function SsoChecker() {
  const [query, setQuery] = useState('')
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [analyzerResult, setAnalyzerResult] = useState<AnalyzerResult | null>(null)

  const { data: apps = [], isLoading, error } = useQuery({
    queryKey: ['sso-apps', query],
    queryFn: () => searchApps(query),
    enabled: !!query,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">SSO Capability Checker</h1>
        <p className="text-gray-400 text-sm">Discover SSO protocol support and IdP integrations for enterprise applications</p>
      </div>

      <Tabs.Root defaultValue="discovery">
        <Tabs.List className="flex gap-1 bg-[hsl(222,84%,6%)] p-1 rounded-xl w-fit mb-6 border border-[hsl(217,32%,17%)]">
          <Tabs.Trigger
            value="discovery"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400 hover:text-white"
          >
            <Search className="h-4 w-4" />
            Discovery Mode
          </Tabs.Trigger>
          <Tabs.Trigger
            value="analyzer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 hover:text-white"
          >
            <Upload className="h-4 w-4" />
            Analyzer Mode
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="discovery" className="space-y-6">
          <div className="bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-xl p-6">
            <AppSearchForm onSearch={setQuery} isLoading={isLoading} />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              Search failed. Please try again.
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && apps.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-400">
                  Found <span className="text-white font-semibold">{apps.length}</span> application{apps.length !== 1 ? 's' : ''}
                </h2>
                <p className="text-xs text-gray-600">Click a row for details</p>
              </div>
              <ResultsTable apps={apps} onSelect={setSelectedApp} />
            </div>
          )}

          {!isLoading && query && apps.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-white font-medium mb-2">No results found</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                No applications matching "{query}" in the database.
                Try a different name or use Analyzer Mode to analyze technical artifacts.
              </p>
            </div>
          )}

          {!query && (
            <div className="flex items-start gap-3 p-4 bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-xl text-sm text-gray-400">
              <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium mb-1">How to use Discovery Mode</p>
                <p>Enter one or multiple application names separated by commas. The database contains 70+ major enterprise applications with verified SSO protocol support data.</p>
              </div>
            </div>
          )}
        </Tabs.Content>

        <Tabs.Content value="analyzer" className="space-y-6">
          <div className="bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-xl p-6">
            <div className="mb-4">
              <h2 className="text-white font-semibold mb-1">Technical Artifact Analyzer</h2>
              <p className="text-sm text-gray-400">Upload or paste SAML metadata, OIDC discovery documents, config files, or login URLs for rule-based protocol detection.</p>
            </div>
            <AnalyzerUploadZone onResult={setAnalyzerResult} />
          </div>

          {analyzerResult && (
            <div className="bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-xl p-6">
              <AnalyzerResults result={analyzerResult} />
            </div>
          )}

          {!analyzerResult && (
            <div className="flex items-start gap-3 p-4 bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-xl text-sm text-gray-400">
              <Info className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium mb-1">Supported Input Types</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li><span className="text-gray-300">SAML Metadata XML</span> — extracts EntityID, ACS URLs, certificates, SSO/SLO endpoints</li>
                  <li><span className="text-gray-300">OIDC Discovery Document</span> — extracts all endpoints, scopes, signing algorithms, PKCE support</li>
                  <li><span className="text-gray-300">Config files</span> — .env, .yaml, .json, .ini — detects SSO-related settings</li>
                  <li><span className="text-gray-300">Login URLs</span> — detects SAML, OAuth, OIDC, WS-Fed, CAS from URL patterns</li>
                </ul>
              </div>
            </div>
          )}
        </Tabs.Content>
      </Tabs.Root>

      <AppDetailDrawer app={selectedApp} onClose={() => setSelectedApp(null)} />
    </div>
  )
}
