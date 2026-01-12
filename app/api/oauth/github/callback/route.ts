import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authService } from '@/lib/services/auth.service'

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || ''
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || ''

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
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || tokenData.error) {
      console.error('GitHub token exchange error:', tokenData)
      return NextResponse.redirect(`${process.env.APP_URL || 'http://localhost:3000'}/login?error=token_exchange_failed`)
    }

    // Get user info from GitHub
    const userInfoResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    })

    const userInfo = await userInfoResponse.json()

    if (!userInfoResponse.ok) {
      console.error('GitHub user info error:', userInfo)
      return NextResponse.redirect(`${process.env.APP_URL || 'http://localhost:3000'}/login?error=user_info_failed`)
    }

    // Get user email if not public
    let email = userInfo.email
    if (!email) {
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: 'application/json',
        },
      })

      const emails = await emailsResponse.json()
      const primaryEmail = emails.find((e: any) => e.primary && e.verified)
      email = primaryEmail?.email || emails[0]?.email
    }

    if (!email) {
      return NextResponse.redirect(`${process.env.APP_URL || 'http://localhost:3000'}/login?error=no_email`)
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          password: '', // OAuth users don't need password
          name: userInfo.name || userInfo.login || email.split('@')[0],
          avatar: userInfo.avatar_url,
          emailVerified: true, // GitHub emails are verified
          provider: 'GITHUB',
          providerId: userInfo.id.toString(),
        },
      })

      // Create usage stats for new user
      await prisma.usageStats.create({
        data: {
          userId: user.id,
        },
      })
    } else if (!user.providerId && user.provider !== 'GITHUB') {
      // Update existing user to link GitHub account
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: 'GITHUB',
          providerId: userInfo.id.toString(),
          avatar: userInfo.avatar_url || user.avatar,
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
    console.error('GitHub OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.APP_URL || 'http://localhost:3000'}/login?error=oauth_failed`
    )
  }
}
