import { ProtocolBadge } from './ProtocolBadge'
import { ConfidenceBadge } from './ConfidenceBadge'
import { ChevronRight } from 'lucide-react'

interface App {
  app_key: string
  app_name: string
  vendor: string
  oidc: number
  oauth2: number
  saml2: number
  scim: number
  ldap: number
  kerberos: number
  ws_federation: number
  entra_id: number
  okta: number
  ping: number
  keycloak: number
  auth0: number
  license_requirement: string
  confidence: number
  [key: string]: any
}

interface Props {
  apps: App[]
  onSelect: (app: App) => void
}

const LICENSE_BADGE: Record<string, string> = {
  standard: 'text-green-400',
  enterprise: 'text-orange-400',
  addon: 'text-yellow-400',
  unclear: 'text-gray-500',
}

const LICENSE_SHORT: Record<string, string> = {
  standard: 'Standard',
  enterprise: 'Enterprise',
  addon: 'Add-on',
  unclear: '?',
}

export function ResultsTable({ apps, onSelect }: Props) {
  if (apps.length === 0) return null

  return (
    <div className="overflow-x-auto scrollbar-thin rounded-xl border border-[hsl(217,32%,17%)]">
      <table className="w-full text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-[hsl(217,32%,17%)] bg-[hsl(222,84%,6%)]">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Application</th>
            <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">OIDC</th>
            <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">OAuth2</th>
            <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SAML</th>
            <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SCIM</th>
            <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">LDAP</th>
            <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entra</th>
            <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Okta</th>
            <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ping</th>
            <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Keycloak</th>
            <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">License</th>
            <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence</th>
            <th className="px-3 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app, i) => (
            <tr
              key={app.app_key}
              onClick={() => onSelect(app)}
              className={`border-b border-[hsl(217,32%,17%)] cursor-pointer hover:bg-[hsl(217,32%,15%)] transition-colors ${
                i % 2 === 0 ? 'bg-[hsl(222,84%,8%)]' : 'bg-[hsl(222,84%,7%)]'
              }`}
            >
              <td className="px-4 py-3">
                <div className="font-medium text-white">{app.app_name}</div>
                {app.vendor && <div className="text-xs text-gray-500">{app.vendor}</div>}
              </td>
              <td className="px-3 py-3"><ProtocolBadge value={app.oidc} size="sm" /></td>
              <td className="px-3 py-3"><ProtocolBadge value={app.oauth2} size="sm" /></td>
              <td className="px-3 py-3"><ProtocolBadge value={app.saml2} size="sm" /></td>
              <td className="px-3 py-3"><ProtocolBadge value={app.scim} size="sm" /></td>
              <td className="px-3 py-3"><ProtocolBadge value={app.ldap} size="sm" /></td>
              <td className="px-3 py-3"><ProtocolBadge value={app.entra_id} size="sm" /></td>
              <td className="px-3 py-3"><ProtocolBadge value={app.okta} size="sm" /></td>
              <td className="px-3 py-3"><ProtocolBadge value={app.ping} size="sm" /></td>
              <td className="px-3 py-3"><ProtocolBadge value={app.keycloak} size="sm" /></td>
              <td className="px-3 py-3">
                <span className={`text-xs font-medium ${LICENSE_BADGE[app.license_requirement] || LICENSE_BADGE.unclear}`}>
                  {LICENSE_SHORT[app.license_requirement] || '?'}
                </span>
              </td>
              <td className="px-3 py-3 text-center"><ConfidenceBadge value={app.confidence} /></td>
              <td className="px-3 py-3">
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
