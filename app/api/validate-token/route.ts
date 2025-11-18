import { NextRequest, NextResponse } from 'next/server'
import { MetaApiClient } from '../../../lib/metaApi'

export async function POST(request: NextRequest) {
  try {
    const { token, businessAccountId } = await request.json()

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      )
    }

    if (!businessAccountId) {
      return NextResponse.json(
        { message: 'Business Account ID is required' },
        { status: 400 }
      )
    }

    // Use MetaApiClient for token validation
    const metaClient = new MetaApiClient(token, businessAccountId)
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

    const response: any = { 
      valid: true
    }

    // Add user info if available
    if (result.user) {
      response.user = {
        id: result.user.user_id || result.user.id,
        name: result.user.name || 'System User'
      }
    }

    // Add business info if available
    if (result.business) {
      response.business = {
        id: result.business.id,
        name: result.business.name
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { message: 'Failed to validate token', valid: false },
      { status: 500 }
    )
  }
}