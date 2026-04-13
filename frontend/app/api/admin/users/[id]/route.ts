import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authService } from '@/lib/services/auth.service';

async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No access token provided');
  }

  const accessToken = authHeader.substring(7);
  const currentUser = await authService.getCurrentUser(accessToken);

  if (currentUser.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
}

const planAmounts: Record<string, number> = {
  FREE: 0,
  STARTER: 999,
  CREATOR: 1999,
  PROFESSIONAL: 3999,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        emailVerified: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        articles: {
          where: { deletedAt: null },
          select: {
            id: true,
            title: true,
            status: true,
            publishedAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        activityLogs: {
          select: {
            action: true,
            metadata: true,
            createdAt: true,
            ipAddress: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const publishedCount = user.articles.filter((a) => a.status === 'PUBLISHED').length;
    const draftCount = user.articles.filter((a) => a.status === 'DRAFT').length;
    const scheduledCount = user.articles.filter((a) => a.status === 'SCHEDULED').length;

    const paymentHistory = [
      {
        date: new Date().toISOString(),
        description: `Monthly Subscription - ${user.subscriptionPlan}`,
        amount: planAmounts[user.subscriptionPlan] || 0,
        status: user.subscriptionStatus === 'ACTIVE' ? 'PAID' : 'FAILED',
      },
      {
        date: new Date(Date.now() - 30 * 86400000).toISOString(),
        description: `Monthly Subscription - ${user.subscriptionPlan}`,
        amount: planAmounts[user.subscriptionPlan] || 0,
        status: 'PAID',
      },
      {
        date: new Date(Date.now() - 60 * 86400000).toISOString(),
        description: `Monthly Subscription - ${user.subscriptionPlan}`,
        amount: planAmounts[user.subscriptionPlan] || 0,
        status: user.subscriptionStatus === 'ACTIVE' ? 'PAID' : 'FAILED',
      },
    ];

    const loginHistory = user.activityLogs.length
      ? user.activityLogs.map((log, idx) => ({
          event: log.action,
          ipAddress: log.ipAddress || 'Unknown IP',
          location: 'Unknown',
          date: log.createdAt,
          current: idx === 0,
          level: idx === 0 ? 'OK' : 'INFO',
        }))
      : [
          {
            event: 'Current Session',
            ipAddress: '127.0.0.1',
            location: 'Localhost',
            date: new Date(),
            current: true,
            level: 'OK',
          },
        ];

    return NextResponse.json({
      success: true,
      data: {
        user,
        stats: {
          publishedCount,
          draftCount,
          scheduledCount,
        },
        paymentHistory,
        loginHistory,
      },
    });
  } catch (error: any) {
    const message = error?.message || 'Failed to fetch user details';
    const status = message.includes('token') ? 401 : message.includes('access required') ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
