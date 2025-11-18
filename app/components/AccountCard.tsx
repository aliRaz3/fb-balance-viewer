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

  const trimAccountId = (id: string): string => {
    return id.startsWith('act_') ? id.substring(4) : id
  }

  const getAccountStatusInfo = (status: number): { text: string; color: string; bgColor: string } => {
    return MetaApiClient.getAccountStatusText(status)
  }

  const statusInfo = getAccountStatusInfo(account.account_status)

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 hover:shadow-2xl transition-shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate pr-2">{account.name}</h3>
        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.bgColor} ${statusInfo.color}`}>
          {statusInfo.text}
        </span>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Account ID</span>
          <span className="text-xs sm:text-sm font-mono text-gray-800">{trimAccountId(account.id)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Currency</span>
          <span className="text-xs sm:text-sm font-medium text-gray-800">{account.currency}</span>
        </div>

        {/* <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Pending Billed</span>
          <span className="text-xs sm:text-sm text-green-600">
            {formatBalance(account.balance, account.currency)}
          </span>
        </div> */}

        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Amount Spent</span>
          <span className="text-xs sm:text-sm font-medium text-red-600 break-all">
            {formatBalance(account.amount_spent, account.currency)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Spending Limit</span>
          <span className="text-xs sm:text-sm font-medium text-blue-600 break-all">
            {(account.spend_cap !== undefined && account.spend_cap != 0) ?
              formatBalance(account.spend_cap, account.currency) :
              <span className='text-lg sm:text-xl font-bold'>∞</span>
            }
          </span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-xs sm:text-sm text-gray-600">Remaining Balance</span>
          <span className="text-lg sm:text-xl font-bold text-green-600 break-all">
            {(account.spend_cap !== undefined && account.spend_cap != 0) ? formatBalance((account.spend_cap || 0) - account.amount_spent, account.currency) : '∞'}
          </span>
        </div>

        {account.timezone_name && (
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-gray-600">Timezone</span>
            <span className="text-xs sm:text-sm text-gray-800 break-all">{account.timezone_name}</span>
          </div>
        )}
      </div>
    </div>
  )
}