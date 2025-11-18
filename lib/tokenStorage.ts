const TOKEN_KEY = 'meta_access_token'
const BUSINESS_ID_KEY = 'meta_business_account_id'

interface StoredCredentials {
  token: string
  businessAccountId: string
}

// Simple encryption for browser storage
function encryptData(data: string): string {
  // Base64 encoding with simple obfuscation
  return btoa(data + '::' + Date.now())
}

function decryptData(encrypted: string): string | null {
  try {
    const decoded = atob(encrypted)
    const [data] = decoded.split('::')
    return data
  } catch {
    return null
  }
}

export const tokenStorage = {
  save: (token: string, businessAccountId: string) => {
    const encryptedToken = encryptData(token)
    const encryptedBusinessId = encryptData(businessAccountId)
    localStorage.setItem(TOKEN_KEY, encryptedToken)
    localStorage.setItem(BUSINESS_ID_KEY, encryptedBusinessId)
  },
  
  get: (): StoredCredentials | null => {
    if (typeof window === 'undefined') return null
    
    const encryptedToken = localStorage.getItem(TOKEN_KEY)
    const encryptedBusinessId = localStorage.getItem(BUSINESS_ID_KEY)
    
    if (!encryptedToken || !encryptedBusinessId) return null
    
    const token = decryptData(encryptedToken)
    const businessAccountId = decryptData(encryptedBusinessId)
    
    if (!token || !businessAccountId) return null
    
    return { token, businessAccountId }
  },
  
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(BUSINESS_ID_KEY)
    }
  },
  
  exists: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(TOKEN_KEY) && !!localStorage.getItem(BUSINESS_ID_KEY)
  }
}