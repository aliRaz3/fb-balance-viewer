import { NextRequest, NextResponse } from 'next/server'
import { MetaApiClient } from '../../../lib/metaApi'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ message: 'Token required' }, { status: 401 })
    }

    // Use MetaApiClient to fetch ad accounts
    const metaClient = new MetaApiClient(token)
    const result = await metaClient.getAdAccounts()
    
    if (result.error) {
      if (result.error.includes('Token expired') || result.error.includes('invalid')) {
        return NextResponse.json({ message: result.error }, { status: 401 })
      }
      return NextResponse.json(
        { message: result.error },
        { status: 500 }
      )
    }

    console.log('Fetched ad accounts:', result.data)
    return NextResponse.json({ data: result.data })

  } catch (error) {
    console.error('Error fetching ad accounts:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}