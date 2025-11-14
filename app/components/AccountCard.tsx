'use client'
import { AdAccount } from '../../lib/types'
import { MetaApiClient } from '../../lib/metaApi'

interface AccountCardProps {
  account: AdAccount
}

export default function AccountCard({ account }: AccountCardProps) {
  const formatBalance = (amount: number, currency: string): string => {
    return MetaApiClient.formatBalance(amount, currency)
  }

  const getAccountStatusInfo = (status: number): { text: string; color: string; bgColor: string } => {
    return MetaApiClient.getAccountStatusText(status)
  }

  const statusInfo = getAccountStatusInfo(account.account_status)

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{account.name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
          {statusInfo.text}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Account ID</span>
          <span className="text-sm font-mono text-gray-800">{account.id}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Currency</span>
          <span className="text-sm font-medium text-gray-800">{account.currency}</span>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">Balance</span>
          <span className="text-xl font-bold text-green-600">
            {formatBalance(account.balance, account.currency)}
          </span>
        </div>
        
        {account.timezone_name && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Timezone</span>
            <span className="text-sm text-gray-800">{account.timezone_name}</span>
          </div>
        )}
      </div>
    </div>
  )
}