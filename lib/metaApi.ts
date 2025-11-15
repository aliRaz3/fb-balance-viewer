import { AdAccount, MetaApiResponse } from './types'

const META_API_VERSION = 'v24.0'
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`

export class MetaApiClient {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async validateToken(): Promise<{ valid: boolean; user?: any; error?: string }> {
    try {
      const response = await fetch(`${META_BASE_URL}/me?access_token=${this.accessToken}`)
      
      if (!response.ok) {
        return { valid: false, error: 'Invalid or expired token' }
      }

      const user = await response.json()
      return { valid: true, user }
    } catch (error) {
      return { valid: false, error: 'Failed to validate token' }
    }
  }

  async getAdAccounts(customUrl?: string): Promise<{ data: MetaApiResponse; error?: string }> {
    try {
      let url: string
      
      if (customUrl) {
        // Use the provided pagination URL directly
        url = customUrl
      } else {
        // Build the initial URL
        const fields = 'name,currency,balance,account_status,timezone_name,amount_spent,spend_cap'
        url = `${META_BASE_URL}/me/adaccounts?fields=${fields}&access_token=${this.accessToken}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        if (response.status === 401) {
          return { data: { data: [] }, error: 'Token expired or invalid' }
        }
        return { data: { data: [] }, error: `API Error: ${response.status}` }
      }

      const result = await response.json()
      return { data: result }
    } catch (error) {
      return { data: { data: [] }, error: 'Failed to fetch ad accounts' }
    }
  }

  static formatBalance(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount / 100) // Meta returns balance in cents
  }

// 1 = ACTIVE
// 2 = DISABLED
// 3 = UNSETTLED
// 7 = PENDING_RISK_REVIEW
// 8 = PENDING_SETTLEMENT
// 9 = IN_GRACE_PERIOD
// 100 = PENDING_CLOSURE
// 101 = CLOSED
// 201 = ANY_ACTIVE
// 202 = ANY_CLOSED
  static getAccountStatusText(status: number): { text: string; color: string, bgColor: string } {
    switch (status) {
      case 1:
        return { text: 'Active', color: 'text-green-600', bgColor: 'bg-green-100' }
      case 2:
        return { text: 'Disabled', color: 'text-red-600', bgColor: 'bg-red-100' }
      case 3:
        return { text: 'Unsettled', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
      case 7:
        return { text: 'Pending Risk Review', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
      case 8:
        return { text: 'Pending Settlement', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
      case 9:
        return { text: 'In Grace Period', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
      case 100:
        return { text: 'Pending Closure', color: 'text-red-600', bgColor: 'bg-red-100' }
      case 101:
        return { text: 'Closed', color: 'text-red-600', bgColor: 'bg-red-100' }
      case 201:
        return { text: 'Any Active', color: 'text-blue-600', bgColor: 'bg-blue-100' }
      case 202:
        return { text: 'Any Closed', color: 'text-blue-600', bgColor: 'bg-blue-100' }
      default:
        return { text: 'Other', color: 'text-gray-600', bgColor: 'bg-gray-100' }
    }
  }
}