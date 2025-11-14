const TOKEN_KEY = 'meta_access_token'

// Simple encryption for browser storage
function encryptToken(token: string): string {
  // Base64 encoding with simple obfuscation
  return btoa(token + '::' + Date.now())
}

function decryptToken(encrypted: string): string | null {
  try {
    const decoded = atob(encrypted)
    const [token] = decoded.split('::')
    return token
  } catch {
    return null
  }
}

export const tokenStorage = {
  save: (token: string) => {
    const encrypted = encryptToken(token)
    localStorage.setItem(TOKEN_KEY, encrypted)
  },
  
  get: (): string | null => {
    if (typeof window === 'undefined') return null
    const encrypted = localStorage.getItem(TOKEN_KEY)
    return encrypted ? decryptToken(encrypted) : null
  },
  
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
    }
  },
  
  exists: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(TOKEN_KEY)
  }
}