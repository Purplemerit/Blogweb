import { NextRequest, NextResponse } from 'next/server'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || ''
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/api/oauth/github/callback'

export async function GET(request: NextRequest) {
  try {
    // Generate GitHub OAuth URL
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: GITHUB_REDIRECT_URI,
      scope: 'read:user user:email',
    })

    const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`

    return NextResponse.json({
      success: true,
      data: { authUrl },
    })
  } catch (error: any) {
    console.error('GitHub OAuth initiation error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to initiate GitHub OAuth' },
      { status: 500 }
    )
  }
}
