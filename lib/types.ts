export interface AdAccount {
  id: string
  name: string
  currency: string
  balance: number
  account_status: number
  timezone_name: string
}

export interface MetaApiResponse {
  data: AdAccount[]
  paging?: {
    cursors?: {
      before: string
      after: string
    }
    next?: string
  }
}

export interface TokenValidationResponse {
  valid: boolean
  user?: {
    id: string
    name: string
  }
  message?: string
}