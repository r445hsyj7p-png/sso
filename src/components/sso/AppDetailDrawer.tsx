import * as Dialog from '@radix-ui/react-dialog'
import { X, ExternalLink } from 'lucide-react'
import { ProtocolBadge } from './ProtocolBadge'
import { ConfidenceBadge } from './ConfidenceBadge'

interface App {
  app_name: string
  vendor: string
  description: string
  oidc: number
  oauth2: number
  saml2: number
  scim: number
  ldap: number
  kerberos: number
  ws_federation: number
  cas: number
  entra_id: number
  okta: number
  ping: number
  keycloak: number
  auth0: number
  onelogin: number
  forgerock: number
  license_requirement: string
  implementation_notes: string
  source_urls: string
  confidence: number
  import_source?: string
}

interface Props {
  app: App | null
  onClose: () => void
}

const PROTOCOLS = [
  { key: 'oidc', label: 'OpenID Connect (OIDC)' },
  { key: 'oauth2', label: 'OAuth 2.0' },
  { key: 'saml2', label: 'SAML 2.0' },
  { key: 'scim', label: 'SCIM' },
  { key: 'ldap', label: 'LDAP / Active Directory' },
  { key: 'kerberos', label: 'Kerberos' },
  { key: 'ws_federation', label: 'WS-Federation' },
  { key: 'cas', label: 'CAS' },
]

const IDPS = [
  { key: 'entra_id', label: 'Microsoft Entra ID' },
  { key: 'okta', label: 'Okta' },
  { key: 'ping', label: 'Ping Identity' },
  { key: 'keycloak', label: 'Keycloak' },
  { key: 'auth0', label: 'Auth0' },
  { key: 'onelogin', label: 'OneLogin' },
  { key: 'forgerock', label: 'ForgeRock' },
]

const LICENSE_LABELS: Record<string, { label: string; color: string }> = {
  standard: { label: 'Standard / All Plans', color: 'text-green-400 bg-green-400/10' },
  enterprise: { label: 'Enterprise Required', color: 'text-orange-400 bg-orange-400/10' },
  addon: { label: 'Add-on / Plugin Required', color: 'text-yellow-400 bg-yellow-400/10' },
  unclear: { label: 'Unclear', color: 'text-gray-400 bg-gray-400/10' },
}

export function AppDetailDrawer({ app, onClose }: Props) {
  if (!app) return null

  let sources: Array<{ title: string; url: string }> = []
  try { sources = JSON.parse(app.source_urls || '[]') } catch {}

  const licenseInfo = LICENSE_LABELS[app.license_requirement] || LICENSE_LABELS.unclear

  return (
    <Dialog.Root open={!!app} onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full max-w-xl bg-[hsl(222,84%,7%)] border-l border-[hsl(217,32%,17%)] z-50 overflow-y-auto p-6 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="text-xl font-bold text-white">{app.app_name}</Dialog.Title>
              {app.vendor && <p className="text-sm text-gray-400 mt-1">{app.vendor}</p>}
            </div>
            <Dialog.Close onClick={onClose} className="p-2 hover:bg-[hsl(217,32%,17%)] rounded-lg transition-colors">
              <X className="h-4 w-4 text-gray-400" />
            </Dialog.Close>
          </div>

          {app.description && (
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">{app.description}</p>
          )}

          <div className="flex items-center gap-3 mb-6">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${licenseInfo.color}`}>
              {licenseInfo.label}
            </span>
            <ConfidenceBadge value={app.confidence} importSource={app.import_source} />
          </div>

          {/* Protocols */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Authentication Protocols</h3>
            <div className="space-y-2">
              {PROTOCOLS.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-1.5 border-b border-[hsl(217,32%,17%)] last:border-0">
                  <span className="text-sm text-gray-300">{label}</span>
                  <ProtocolBadge value={(app as any)[key]} />
                </div>
              ))}
            </div>
          </div>

          {/* Identity Providers */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Identity Provider Integrations</h3>
            <div className="space-y-2">
              {IDPS.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-1.5 border-b border-[hsl(217,32%,17%)] last:border-0">
                  <span className="text-sm text-gray-300">{label}</span>
                  <ProtocolBadge value={(app as any)[key]} />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {app.implementation_notes && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Implementation Notes</h3>
              <p className="text-sm text-gray-300 leading-relaxed bg-[hsl(217,32%,10%)] rounded-lg p-4">
                {app.implementation_notes}
              </p>
            </div>
          )}

          {/* Sources */}
          {sources.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sources</h3>
              <div className="space-y-2">
                {sources.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    {s.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
