import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShieldCheck, Search, Upload, Database, Zap } from 'lucide-react'
import { getStats } from '../lib/api'

export default function Home() {
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: getStats })

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-600/20 rounded-2xl">
            <ShieldCheck className="h-16 w-16 text-blue-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">SSO Capability Checker</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Enterprise IAM Intelligence Tool. Instantly discover SSO protocol support,
          Identity Provider integrations, and license requirements for any software product.
        </p>
        <Link
          to="/checker"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Search className="h-4 w-4" />
          Start Checking
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Enterprise Apps', value: stats.total },
            { label: 'OIDC / OAuth2', value: stats.byProtocol.oidc },
            { label: 'SAML 2.0', value: stats.byProtocol.saml2 },
            { label: 'SCIM', value: stats.byProtocol.scim },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{value}</div>
              <div className="text-sm text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600/20 rounded-lg"><Search className="h-5 w-5 text-blue-400" /></div>
            <h2 className="text-lg font-semibold text-white">Discovery Mode</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Search by application name to instantly see which SSO protocols are supported,
            which Identity Providers integrate, and whether enterprise licensing is required.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Jira', 'ServiceNow', 'Salesforce', 'Workday'].map(app => (
              <span key={app} className="text-xs bg-[hsl(217,32%,17%)] text-gray-300 px-2 py-1 rounded">{app}</span>
            ))}
          </div>
        </div>

        <div className="bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-600/20 rounded-lg"><Upload className="h-5 w-5 text-purple-400" /></div>
            <h2 className="text-lg font-semibold text-white">Analyzer Mode</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Upload technical artifacts for deep analysis: SAML Metadata XML, OIDC Discovery documents,
            configuration files, or paste a login URL for protocol detection.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['SAML XML', 'OIDC JSON', '.env files', 'Login URLs'].map(t => (
              <span key={t} className="text-xs bg-[hsl(217,32%,17%)] text-gray-300 px-2 py-1 rounded">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-600/20 rounded-lg"><Database className="h-5 w-5 text-green-400" /></div>
          <h2 className="text-lg font-semibold text-white">Protocols Covered</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'OpenID Connect (OIDC)', 'OAuth 2.0', 'SAML 2.0', 'SCIM',
            'LDAP / Active Directory', 'Kerberos', 'WS-Federation', 'CAS'
          ].map(p => (
            <div key={p} className="flex items-center gap-2 text-sm text-gray-300">
              <Zap className="h-3 w-3 text-yellow-400 flex-shrink-0" />
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
