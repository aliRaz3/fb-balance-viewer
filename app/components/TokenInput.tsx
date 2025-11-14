'use client'
import { useState } from 'react'

interface TokenInputProps {
  onTokenSubmit: (token: string) => void
}

export default function TokenInput({ onTokenSubmit }: TokenInputProps) {
  const [token, setToken] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)
    setError('')

    try {
      const response = await fetch('/api/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() })
      })

      const result = await response.json()

      if (response.ok && result.valid) {
        onTokenSubmit(token.trim())
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Meta Ad Account Viewer</h1>
          <p className="text-gray-600">Enter your Meta access token to view your ad accounts</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Token
            </label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your Meta access token here..."
              className="w-full p-4 border border-gray-200 rounded-xl resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
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
            disabled={!token.trim() || isValidating}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isValidating ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
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

        <div className="mt-8 p-6 bg-gray-50/80 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to get your token:
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Create a Meta App (skip if already have)</h4>
            </div>
          </div>
          
          <ol className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
              Go to <a href="https://developers.facebook.com/apps/creation/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Meta for Developers</a>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
              Create a new app → select "Business" type
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
              Add the "Marketing API" product to your app
            </li>
          </ol>
          
          <div className="mt-6">
            <h4 className="font-medium text-gray-700 mb-2">Generate Access Token</h4>
          </div>
          
          <ol className="text-sm text-gray-600 space-y-2 mt-4">
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
              Go to <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Graph API Explorer</a>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
              Select your app from the "Meta App" dropdown
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
              Select user token from "User or Page" dropdown
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
              Add permissions: ads_read, ads_management
            </li>
            <li className="flex items-start">
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">5</span>
              Click "Generate Access Token" and copy the token
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}