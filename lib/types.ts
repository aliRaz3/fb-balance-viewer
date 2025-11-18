export interface AdAccount {
  id: string
  name: string
  currency: string
  balance: number
  account_status: number
  timezone_name: string
  amount_spent: number
  spend_cap?: number
}

export interface MetaApiResponse {
  data: AdAccount[]
  paging?: {
    cursors?: {
      before: string
      after: string
    }
    next?: string
    previous?: string
  }
}

export interface TokenValidationResponse {
  valid: boolean
  user?: {
    id: string
    name: string
  }
  business?: {
    id: string
    name: string
  }
  message?: string
}