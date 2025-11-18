'use client'
import { useState } from 'react'

interface TokenInputProps {
  onTokenSubmit: (token: string, businessAccountId: string) => void
}

export default function TokenInput({ onTokenSubmit }: TokenInputProps) {
  const [token, setToken] = useState('')
  const [businessAccountId, setBusinessAccountId] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)
    setError('')

    try {
      if (!businessAccountId.trim()) {
        setError('Business Portfolio ID is required')
        setIsValidating(false)
        return
      }

      const response = await fetch('/api/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: token.trim(),
          businessAccountId: businessAccountId.trim()
        })
      })

      const result = await response.json()

      if (response.ok && result.valid) {
        onTokenSubmit(token.trim(), businessAccountId.trim())
      } else {
        setError(result.message || 'Invalid token')
      }
    } catch (err) {
      setError('Failed to validate token. Please check your connection.')
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Meta Ad Account Viewer</h1>
          <p className="text-gray-600 text-sm sm:text-base">Enter your Meta system access token to view your business ad accounts</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Access Token *
            </label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your Meta system access token here..."
              className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl resize-none h-24 sm:h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Portfolio ID *
            </label>
            <input
              type="text"
              value={businessAccountId}
              onChange={(e) => setBusinessAccountId(e.target.value)}
              placeholder="e.g., 123456789012345"
              className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              required
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Required: Your Business Portfolio ID from Business Settings → Business Info.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!token.trim() || !businessAccountId.trim() || isValidating}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            {isValidating ? (
              <>
                <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Validating...</span>
              </>
            ) : (
              <span>Connect Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-50/80 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center text-sm sm:text-base">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to get your system token:
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base border-b border-gray-200 pb-2">
                Step 1: Get Your Business Portfolio ID
              </h4>
              <ol className="space-y-3">
                <li className="flex items-start group">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-green-600 transition-colors">1</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Go to <a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">Meta Business Manager</a>
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-green-600 transition-colors">2</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Navigate to <span className="font-semibold text-gray-700">Business Settings</span> in the left sidebar
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-green-600 transition-colors">3</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Click on <span className="font-semibold text-gray-700">Business Info</span> in the sidebar
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-green-600 transition-colors">4</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Copy the <span className="font-semibold text-gray-700">Business Portfolio ID</span> (15-digit number) displayed at the top
                  </span>
                </li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base border-b border-gray-200 pb-2">
                Step 2: Create a Meta App & Business Integration
              </h4>
              <ol className="space-y-3">
                <li className="flex items-start group">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-blue-600 transition-colors">1</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Go to <a href="https://developers.facebook.com/apps/creation/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">Meta for Developers</a>
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-blue-600 transition-colors">2</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Create a new app → select <span className="font-semibold text-gray-700">"Business"</span> type
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-blue-600 transition-colors">3</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Add the <span className="font-semibold text-gray-700">"Marketing API"</span> product to your app
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-blue-600 transition-colors">4</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Go to <a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">Meta Business Manager</a>
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-blue-600 transition-colors">5</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Navigate to <span className="font-semibold text-gray-700">Business Settings → Apps → Add your created app</span>
                  </span>
                </li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base border-b border-gray-200 pb-2">
                Step 3: Generate System User Token
              </h4>
              <ol className="space-y-3">
                <li className="flex items-start group">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-purple-600 transition-colors">1</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    In <span className="font-semibold text-gray-700">Business Settings → Users → System Users → Add</span>
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-purple-600 transition-colors">2</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Create system user with <span className="font-semibold text-gray-700">"Admin"</span> role
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-purple-600 transition-colors">3</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Assign ad accounts to the system user
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-purple-600 transition-colors">4</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Generate token → Select your app → Add permissions: <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">ads_read</span>, <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">ads_management</span>, <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">business_management</span>
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0 group-hover:bg-purple-600 transition-colors">5</span>
                  <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Set token to <span className="font-semibold text-gray-700">"Never Expire"</span> and copy the generated token
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}