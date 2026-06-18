import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import SsoChecker from './pages/SsoChecker'
import Home from './pages/Home'

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[hsl(222,84%,5%)]">
      <nav className="border-b border-[hsl(217,32%,17%)] bg-[hsl(222,84%,7%)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              <span>SSO Capability Checker</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/checker"
                className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                  location.pathname === '/checker'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[hsl(217,32%,17%)]'
                }`}
              >
                Checker
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checker" element={<SsoChecker />} />
        </Routes>
      </main>
    </div>
  )
}
