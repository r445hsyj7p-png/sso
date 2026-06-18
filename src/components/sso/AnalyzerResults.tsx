import { CheckCircle2, AlertTriangle, Info, Shield, Globe } from 'lucide-react'
import { ConfidenceBadge } from './ConfidenceBadge'

export interface AnalyzerResult {
  filename: string
  inputType: string
  detectedProtocols: Array<{ protocol: string; confidence: number; evidence: string }>
  oidcConfig?: Record<string, unknown>
  samlConfig?: Record<string, unknown>
  oauthFlows?: string[]
  scimConfig?: Record<string, unknown>
  detectedIdP?: string[]
  notes: string[]
}

interface Props {
  result: AnalyzerResult
}

const INPUT_TYPE_LABELS: Record<string, string> = {
  saml_xml: 'SAML Metadata XML',
  oidc_json: 'OIDC Discovery Document',
  config_file: 'Configuration File',
  url: 'Login URL',
  unknown: 'Unknown Format',
}

function ConfigTable({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data).filter(([, v]) => v !== undefined && v !== null)
  if (entries.length === 0) return null
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key} className="border-b border-[hsl(217,32%,17%)] last:border-0">
              <td className="py-2 pr-4 text-gray-500 font-mono text-xs whitespace-nowrap align-top">{key}</td>
              <td className="py-2 text-gray-200 break-all">
                {Array.isArray(value)
                  ? (value as any[]).map((v, i) => (
                      typeof v === 'object'
                        ? <div key={i} className="mb-1 pl-2 border-l border-[hsl(217,32%,25%)]">{JSON.stringify(v, null, 2)}</div>
                        : <span key={i} className="inline-block bg-[hsl(217,32%,17%)] text-xs px-1.5 py-0.5 rounded mr-1 mb-1">{String(v)}</span>
                    ))
                  : typeof value === 'boolean'
                    ? <span className={value ? 'text-green-400' : 'text-red-400'}>{String(value)}</span>
                    : <span className="font-mono text-xs">{String(value)}</span>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AnalyzerResults({ result }: Props) {
  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Analysis Complete</h3>
          <p className="text-xs text-gray-500">{INPUT_TYPE_LABELS[result.inputType] || result.inputType} · {result.filename}</p>
        </div>
      </div>

      {/* Notes */}
      {result.notes.length > 0 && (
        <div className="space-y-2">
          {result.notes.map((note, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-[hsl(222,84%,10%)] border border-[hsl(217,32%,20%)] rounded-lg">
              <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">{note}</p>
            </div>
          ))}
        </div>
      )}

      {/* Detected Protocols */}
      {result.detectedProtocols.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Shield className="h-3 w-3" />
            Detected Protocols
          </h3>
          <div className="space-y-2">
            {result.detectedProtocols.map((p, i) => (
              <div key={i} className="flex items-start justify-between gap-4 p-3 bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-lg">
                <div>
                  <div className="font-medium text-white text-sm">{p.protocol}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.evidence}</div>
                </div>
                <ConfidenceBadge value={p.confidence} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detected IdPs */}
      {result.detectedIdP && result.detectedIdP.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Globe className="h-3 w-3" />
            Detected Identity Provider
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.detectedIdP.map(idp => (
              <span key={idp} className="px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm rounded-lg">
                {idp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* OAuth Flows */}
      {result.oauthFlows && result.oauthFlows.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">OAuth 2.0 Flows</h3>
          <div className="flex flex-wrap gap-2">
            {result.oauthFlows.map(flow => (
              <span key={flow} className="px-2.5 py-1 bg-[hsl(217,32%,17%)] text-gray-300 text-xs rounded-md">{flow}</span>
            ))}
          </div>
        </div>
      )}

      {/* OIDC Config */}
      {result.oidcConfig && Object.keys(result.oidcConfig).length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {result.inputType === 'oidc_json' ? 'OIDC Configuration' : 'Extracted Configuration'}
          </h3>
          <div className="bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-lg p-4">
            <ConfigTable data={result.oidcConfig} />
          </div>
        </div>
      )}

      {/* SAML Config */}
      {result.samlConfig && Object.keys(result.samlConfig).length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">SAML Configuration</h3>
          <div className="bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-lg p-4">
            <ConfigTable data={result.samlConfig} />
          </div>
        </div>
      )}

      {result.detectedProtocols.length === 0 && result.notes.length === 0 && (
        <div className="flex items-start gap-2 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-300">No SSO protocols detected. Try uploading a SAML metadata XML, OIDC discovery document, or provide a login URL.</p>
        </div>
      )}
    </div>
  )
}
