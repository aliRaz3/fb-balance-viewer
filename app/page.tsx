'use client'
import { useState, useEffect } from 'react'
import TokenInput from './components/TokenInput'
import Dashboard from './components/Dashboard'
import { tokenStorage } from '../lib/tokenStorage'

export default function Home() {
  const [token, setToken] = useState<string | null>(null)
  const [businessAccountId, setBusinessAccountId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing credentials on mount
    const existingCredentials = tokenStorage.get()
    if (existingCredentials) {
      setToken(existingCredentials.token)
      setBusinessAccountId(existingCredentials.businessAccountId)
    }
    setIsLoading(false)
  }, [])

  const handleTokenSubmit = (newToken: string, newBusinessAccountId: string) => {
    tokenStorage.save(newToken, newBusinessAccountId)
    setToken(newToken)
    setBusinessAccountId(newBusinessAccountId)
  }

  const handleLogout = () => {
    tokenStorage.remove()
    setToken(null)
    setBusinessAccountId(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-xl text-gray-600 animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {token && businessAccountId ? (
        <Dashboard token={token} businessAccountId={businessAccountId} onLogout={handleLogout} />
      ) : (
        <TokenInput onTokenSubmit={handleTokenSubmit} />
      )}
    </main>
  )
}
