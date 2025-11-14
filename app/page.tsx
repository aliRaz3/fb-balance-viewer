'use client'
import { useState, useEffect } from 'react'
import TokenInput from './components/TokenInput'
import Dashboard from './components/Dashboard'
import { tokenStorage } from '../lib/tokenStorage'

export default function Home() {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const existingToken = tokenStorage.get()
    setToken(existingToken)
    setIsLoading(false)
  }, [])

  const handleTokenSubmit = (newToken: string) => {
    tokenStorage.save(newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    tokenStorage.remove()
    setToken(null)
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
      {token ? (
        <Dashboard token={token} onLogout={handleLogout} />
      ) : (
        <TokenInput onTokenSubmit={handleTokenSubmit} />
      )}
    </main>
  )
}
