import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        `${process.env.APP_URL}/dashboard/integrations?error=${encodeURIComponent(error)}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.APP_URL}/dashboard/integrations?error=no_code`
      );
    }

    // Verify state contains user ID (we'll store it in state parameter)
    if (!state) {
      return NextResponse.redirect(
        `${process.env.APP_URL}/dashboard/integrations?error=invalid_state`
      );
    }

    const userId = state;

    // Exchange code for access token
    const tokenResponse = await fetch('https://public-api.wordpress.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.WORDPRESS_CLIENT_ID || '',
        client_secret: process.env.WORDPRESS_CLIENT_SECRET || '',
        code: code,
        redirect_uri: process.env.WORDPRESS_REDIRECT_URI || '',
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('WordPress token exchange error:', errorData);
      return NextResponse.redirect(
        `${process.env.APP_URL}/dashboard/integrations?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, blog_id, blog_url } = tokenData;

    // Get WordPress.com user info
    const userInfoResponse = await fetch('https://public-api.wordpress.com/rest/v1.1/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const wpUserInfo = await userInfoResponse.json();

    // Store connection in database
    const credentials = {
      accessToken: access_token,
      blogId: blog_id,
      blogUrl: blog_url,
      username: wpUserInfo.username,
      displayName: wpUserInfo.display_name,
    };

    // Check if connection already exists
    const existingConnection = await prisma.platformConnection.findFirst({
      where: {
        userId: userId,
        platform: 'WORDPRESS',
      },
    });

    if (existingConnection) {
      // Update existing connection
      await prisma.platformConnection.update({
        where: { id: existingConnection.id },
        data: {
          status: 'CONNECTED',
          credentials: JSON.stringify(credentials),
          metadata: {
            blogId: blog_id,
            blogUrl: blog_url,
            username: wpUserInfo.username,
            displayName: wpUserInfo.display_name,
          },
          lastSyncAt: new Date(),
        },
      });
    } else {
      // Create new connection
      await prisma.platformConnection.create({
        data: {
          userId: userId,
          platform: 'WORDPRESS',
          status: 'CONNECTED',
          credentials: JSON.stringify(credentials),
          metadata: {
            blogId: blog_id,
            blogUrl: blog_url,
            username: wpUserInfo.username,
            displayName: wpUserInfo.display_name,
          },
          lastSyncAt: new Date(),
        },
      });
    }

    // Redirect back to integrations page with success
    return NextResponse.redirect(
      `${process.env.APP_URL}/dashboard/integrations?success=wordpress_connected`
    );
  } catch (error: any) {
    console.error('WordPress OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.APP_URL}/dashboard/integrations?error=connection_failed`
    );
  }
}
