import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Link, Loader2, AlertCircle } from 'lucide-react'
import { analyzeFile, analyzeURL, analyzeText } from '../../lib/api'
import type { AnalyzerResult } from './AnalyzerResults'

interface Props {
  onResult: (result: AnalyzerResult) => void
}

export function AnalyzerUploadZone({ onResult }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [mode, setMode] = useState<'file' | 'url' | 'text'>('file')

  const processFile = async (file: File) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await analyzeFile(file)
      onResult(result)
    } catch (e) {
      setError(String(e))
    } finally {
      setIsLoading(false)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) processFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'text/xml': ['.xml'],
      'application/json': ['.json'],
      'text/plain': ['.txt', '.env', '.ini'],
      'application/x-yaml': ['.yaml', '.yml'],
      'text/yaml': ['.yaml', '.yml'],
    },
  })

  const handleURLSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await analyzeURL(urlInput.trim())
      onResult(result)
    } catch (e) {
      setError(String(e))
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!textInput.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      const ext = textInput.trim().startsWith('<') ? 'metadata.xml' :
                   textInput.trim().startsWith('{') ? 'discovery.json' : 'config.txt'
      const result = await analyzeText(textInput.trim(), ext)
      onResult(result)
    } catch (e) {
      setError(String(e))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Mode tabs */}
      <div className="flex gap-1 bg-[hsl(222,84%,6%)] p-1 rounded-lg w-fit">
        {([['file', 'Upload File'], ['url', 'Login URL'], ['text', 'Paste Content']] as const).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === m ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'file' && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-[hsl(217,32%,25%)] hover:border-[hsl(217,32%,40%)] bg-[hsl(222,84%,8%)]'
          }`}
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <Loader2 className="h-10 w-10 text-blue-400 animate-spin mx-auto mb-3" />
          ) : (
            <Upload className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          )}
          <p className="text-white font-medium mb-1">
            {isDragActive ? 'Drop file here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-gray-500">SAML XML · OIDC JSON · .env · .yaml · .ini · .txt</p>
          <p className="text-xs text-gray-600 mt-2">Max 5MB</p>
        </div>
      )}

      {mode === 'url' && (
        <form onSubmit={handleURLSubmit} className="space-y-3">
          <div className="relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://app.example.com/sso/saml?SAMLRequest=..."
              className="w-full pl-9 pr-4 py-2.5 bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <p className="text-xs text-gray-500">Paste a login URL, OIDC discovery URL, or any SSO-related endpoint</p>
          <button
            type="submit"
            disabled={!urlInput.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link className="h-4 w-4" />}
            Analyze URL
          </button>
        </form>
      )}

      {mode === 'text' && (
        <form onSubmit={handleTextSubmit} className="space-y-3">
          <textarea
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder={`Paste content here:\n• SAML Metadata XML (<EntityDescriptor ...>)\n• OIDC Discovery JSON ({"issuer": "...", ...})\n• Configuration file content\n• .env file contents`}
            rows={10}
            className="w-full px-3 py-2.5 bg-[hsl(222,84%,8%)] border border-[hsl(217,32%,17%)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono resize-none"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Analyze Content
          </button>
        </form>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
