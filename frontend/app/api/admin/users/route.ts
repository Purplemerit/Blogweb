import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authService } from '@/lib/services/auth.service';
import { hashPassword } from '@/lib/utils/password';

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

  return currentUser;
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim();
    const role = (searchParams.get('role') || 'ALL').toUpperCase();
    const status = (searchParams.get('status') || 'ALL').toUpperCase();

    const where: any = {
      deletedAt: null,
    };

    if (role !== 'ALL' && (role === 'ADMIN' || role === 'USER')) {
      where.role = role;
    }

    if (status !== 'ALL') {
      where.subscriptionStatus = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            articles: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
        articles: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            title: true,
            status: true,
            publishedAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        users: users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          avatar: u.avatar,
          role: u.role,
          subscriptionPlan: u.subscriptionPlan,
          subscriptionStatus: u.subscriptionStatus,
          emailVerified: u.emailVerified,
          createdAt: u.createdAt,
          publicationsCount: u._count.articles,
          publications: u.articles,
        })),
      },
    });
  } catch (error: any) {
    const message = error?.message || 'Failed to fetch users';
    const status = message.includes('token') ? 401 : message.includes('access required') ? 403 : 500;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!password || password.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 10 characters' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { admin },
        message: 'Admin created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    const message = error?.message || 'Failed to create admin';
    const status = message.includes('token') ? 401 : message.includes('access required') ? 403 : 500;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}
