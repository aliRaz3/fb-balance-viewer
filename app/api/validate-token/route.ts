import { NextRequest, NextResponse } from 'next/server'
import { MetaApiClient } from '../../../lib/metaApi'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      )
    }

    // Use MetaApiClient for token validation
    const metaClient = new MetaApiClient(token)
    const result = await metaClient.validateToken()
    
    if (!result.valid) {
      return NextResponse.json(
        { 
          message: result.error || 'Invalid or expired token',
          valid: false 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      valid: true, 
      user: { 
        id: result.user.id, 
        name: result.user.name 
      }
    })

  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { message: 'Failed to validate token', valid: false },
      { status: 500 }
    )
  }
}