'use client'
import { useState, useEffect } from 'react'
import { AdAccount } from '../../lib/types'
import LoadingSpinner from './LoadingSpinner'
import AccountCard from './AccountCard'

interface DashboardProps {
  token: string
  businessAccountId: string
  onLogout: () => void
}

export default function Dashboard({ token, businessAccountId, onLogout }: DashboardProps) {
  const [accounts, setAccounts] = useState<AdAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [previousUrl, setPreviousUrl] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchAccounts = async (url?: string, pageDirection?: 'next' | 'previous' | 'initial') => {
    try {
      let apiUrl = '/api/accounts'
      
      const params = new URLSearchParams()
      if (url) {
        params.append('url', url)
      }
      if (businessAccountId) {
        params.append('businessAccountId', businessAccountId)
      }
      
      if (params.toString()) {
        apiUrl += `?${params.toString()}`
      }
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError('Token has expired. Please enter a new token.')
          return
        }
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      setAccounts(data.data || [])
      setNextUrl(data.paging?.next || null)
      setPreviousUrl(data.paging?.previous || null)
      
      // Update page number based on direction
      if (pageDirection === 'next') {
        setCurrentPage(prev => prev + 1)
      } else if (pageDirection === 'previous') {
        setCurrentPage(prev => Math.max(prev - 1, 1))
      } else if (pageDirection === 'initial') {
        setCurrentPage(1)
      }
      
      setError('')
    } catch (err) {
      setError('Failed to fetch ad accounts. Please check your connection and try again.')
      console.error('Error fetching accounts:', err)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAccounts(undefined, 'initial')
    setRefreshing(false)
  }

  const handleNextPage = async () => {
    if (nextUrl) {
      setLoading(true)
      await fetchAccounts(nextUrl, 'next')
      setLoading(false)
    }
  }

  const handlePreviousPage = async () => {
    if (previousUrl) {
      setLoading(true)
      await fetchAccounts(previousUrl, 'previous')
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true)
      await fetchAccounts(undefined, 'initial')
      setLoading(false)
    }
    loadAccounts()
  }, [token, businessAccountId])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Meta Ad Accounts Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">
                {accounts.length > 0 ? (
                  <>
                    {accounts.length} account{accounts.length > 1 ? 's' : ''} on page {currentPage}
                  </>
                ) : 'No accounts found'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-md border border-red-200 text-red-700 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-sm sm:text-base">{error}</p>
              {error.includes('expired') && (
                <button 
                  onClick={onLogout}
                  className="mt-2 text-xs sm:text-sm underline hover:no-underline"
                >
                  Enter new token
                </button>
              )}
            </div>
          </div>
        )}

        {/* Accounts Grid */}
        {accounts.length > 0 ? (
          <>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {accounts.map((account) => {
                return (
                  <AccountCard key={account.id} account={account} />
                )
              })}
            </div>

            {/* Pagination Controls */}
            {(nextUrl || previousUrl) && (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 mt-6 sm:mt-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                  <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                    Page {currentPage} • {accounts.length} accounts shown
                  </div>
                  <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-4">
                    <button
                      onClick={handlePreviousPage}
                      disabled={!previousUrl || loading}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700 px-2">
                        {currentPage}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleNextPage}
                      disabled={!nextUrl || loading}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm"
                    >
                      <span>Next</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : !error && (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 sm:p-12 text-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">No Ad Accounts Found</h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              No ad accounts are associated with this access token, or you may not have the required permissions.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}