import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authService } from '@/lib/services/auth.service'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const APP_URL = process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${APP_URL}/api/oauth/google/callback`

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(`${process.env.APP_URL || 'http://localhost:3000'}/login?error=${error}`)
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.APP_URL || 'http://localhost:3000'}/login?error=no_code`)
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Google token exchange error:', tokenData)
      return NextResponse.redirect(`${process.env.APP_URL || 'http://localhost:3000'}/login?error=token_exchange_failed`)
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userInfo = await userInfoResponse.json()

    if (!userInfoResponse.ok) {
      console.error('Google user info error:', userInfo)
      return NextResponse.redirect(`${process.env.APP_URL || 'http://localhost:3000'}/login?error=user_info_failed`)
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    })

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: userInfo.email,
          password: '', // OAuth users don't need password
          name: userInfo.name || userInfo.email.split('@')[0],
          avatar: userInfo.picture,
          emailVerified: true, // Google emails are already verified
          provider: 'GOOGLE',
          providerId: userInfo.id,
        },
      })

      // Note: UsageStats model removed from schema
      // Usage stats are now tracked differently or not needed
    } else if (!user.providerId && user.provider !== 'GOOGLE') {
      // Update existing user to link Google account
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: 'GOOGLE',
          providerId: userInfo.id,
          avatar: userInfo.picture || user.avatar,
          emailVerified: true,
        },
      })
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = authService.generateTokens(user)

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })

    // Redirect to dashboard with tokens
    const redirectUrl = new URL('/dashboard', process.env.APP_URL || 'http://localhost:3000')
    redirectUrl.searchParams.set('accessToken', accessToken)
    redirectUrl.searchParams.set('refreshToken', refreshToken)

    return NextResponse.redirect(redirectUrl.toString())
  } catch (error: any) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.APP_URL || 'http://localhost:3000'}/login?error=oauth_failed`
    )
  }
}
