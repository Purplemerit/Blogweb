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

  return currentUser;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);

    const user = await prisma.user.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        website: true,
        twitterHandle: true,
        linkedinUrl: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Admin user not found' }, { status: 404 });
    }

    const [firstName, ...rest] = user.name.trim().split(' ');

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          ...user,
          firstName: firstName || '',
          lastName: rest.join(' '),
        },
      },
    });
  } catch (error: any) {
    const message = error?.message || 'Failed to fetch admin profile';
    const status = message.includes('token') ? 401 : message.includes('access required') ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    const body = await request.json();

    const firstName = typeof body?.firstName === 'string' ? body.firstName.trim() : '';
    const lastName = typeof body?.lastName === 'string' ? body.lastName.trim() : '';
    const bio = typeof body?.bio === 'string' ? body.bio.trim() : '';
    const website = typeof body?.website === 'string' ? body.website.trim() : '';
    const twitterHandle = typeof body?.twitterHandle === 'string' ? body.twitterHandle.trim().replace(/^@/, '') : '';
    const linkedinUrl = typeof body?.linkedinUrl === 'string' ? body.linkedinUrl.trim() : '';
    const avatar = typeof body?.avatar === 'string' ? body.avatar.trim() : '';

    if (!firstName) {
      return NextResponse.json({ success: false, error: 'First name is required' }, { status: 400 });
    }

    if (bio.length > 200) {
      return NextResponse.json({ success: false, error: 'Bio must be 200 characters or less' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: admin.id },
      data: {
        name: [firstName, lastName].filter(Boolean).join(' '),
        bio: bio || null,
        website: website || null,
        twitterHandle: twitterHandle || null,
        linkedinUrl: linkedinUrl || null,
        avatar: avatar || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        website: true,
        twitterHandle: true,
        linkedinUrl: true,
        emailVerified: true,
      },
    });

    const [updatedFirstName, ...rest] = updated.name.trim().split(' ');

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          ...updated,
          firstName: updatedFirstName || '',
          lastName: rest.join(' '),
        },
      },
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    const message = error?.message || 'Failed to update admin profile';
    const status = message.includes('token') ? 401 : message.includes('access required') ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
