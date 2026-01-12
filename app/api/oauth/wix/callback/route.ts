import { NextRequest, NextResponse } from 'next/server';
import { WixService } from '@/lib/services/wix.service';
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

    // Verify state contains user ID
    if (!state) {
      return NextResponse.redirect(
        `${process.env.APP_URL}/dashboard/integrations?error=invalid_state`
      );
    }

    const userId = state;

    // Exchange code for access token
    const tokenResult = await WixService.exchangeCodeForToken(code);

    if (!tokenResult.success || !tokenResult.accessToken || !tokenResult.instanceId) {
      console.error('Wix token exchange error:', tokenResult.error);
      return NextResponse.redirect(
        `${process.env.APP_URL}/dashboard/integrations?error=token_exchange_failed`
      );
    }

    const { accessToken, refreshToken, instanceId } = tokenResult;

    // Get site information
    const siteInfo = await WixService.getSiteInfo(accessToken, instanceId);

    if (!siteInfo.success || !siteInfo.siteId) {
      console.error('Wix site info error:', siteInfo.error);
      return NextResponse.redirect(
        `${process.env.APP_URL}/dashboard/integrations?error=site_info_failed`
      );
    }

    // Store connection in database
    const credentials = {
      accessToken,
      refreshToken,
      instanceId,
      siteId: siteInfo.siteId,
    };

    // Check if connection already exists
    const existingConnection = await prisma.platformConnection.findFirst({
      where: {
        userId: userId,
        platform: 'WIX',
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
            siteId: siteInfo.siteId,
            siteName: siteInfo.siteName,
            siteUrl: siteInfo.siteUrl,
          },
          lastSyncAt: new Date(),
        },
      });
    } else {
      // Create new connection
      await prisma.platformConnection.create({
        data: {
          userId: userId,
          platform: 'WIX',
          status: 'CONNECTED',
          credentials: JSON.stringify(credentials),
          metadata: {
            siteId: siteInfo.siteId,
            siteName: siteInfo.siteName,
            siteUrl: siteInfo.siteUrl,
          },
          lastSyncAt: new Date(),
        },
      });
    }

    // Redirect back to integrations page with success
    return NextResponse.redirect(
      `${process.env.APP_URL}/dashboard/integrations?success=wix_connected`
    );
  } catch (error: any) {
    console.error('Wix OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.APP_URL}/dashboard/integrations?error=connection_failed`
    );
  }
}
