import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/oauth/google/callback'

export async function GET(request: NextRequest) {
  try {
    // Generate Google OAuth URL
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

    return NextResponse.json({
      success: true,
      data: { authUrl },
    })
  } catch (error: any) {
    console.error('Google OAuth initiation error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to initiate Google OAuth' },
      { status: 500 }
    )
  }
}
