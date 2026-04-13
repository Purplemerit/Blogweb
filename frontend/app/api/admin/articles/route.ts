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

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);
    const status = (searchParams.get('status') || 'ALL').toUpperCase();
    const platform = (searchParams.get('platform') || 'ALL').toUpperCase();
    const search = (searchParams.get('search') || '').trim();
    const skip = (Math.max(page, 1) - 1) * Math.max(limit, 1);

    const where: any = {
      deletedAt: null,
    };

    if (status !== 'ALL') {
      where.status = status;
    }

    if (platform !== 'ALL') {
      where.publishRecords = {
        some: {
          platform,
          status: 'PUBLISHED',
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          views: true,
          excerpt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          publishRecords: {
            where: { status: 'PUBLISHED' },
            select: {
              platform: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        articles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      },
    });
  } catch (error: any) {
    const message = error?.message || 'Failed to fetch admin articles';
    const statusCode = message.includes('token') ? 401 : message.includes('access required') ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status: statusCode });
  }
}
