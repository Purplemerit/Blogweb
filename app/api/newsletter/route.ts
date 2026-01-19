/**
 * Newsletter Subscription API
 * Subscribe/unsubscribe from newsletter
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Check if already subscribed using raw SQL
    const existing: any[] = await prisma.$queryRaw`
      SELECT id, email, "isActive" FROM newsletter_subscribers WHERE email = ${normalizedEmail}
    `;

    if (existing.length > 0) {
      if (existing[0].isActive) {
        return NextResponse.json(
          { success: false, error: 'This email is already subscribed' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await prisma.$executeRaw`
          UPDATE newsletter_subscribers
          SET "isActive" = true, "unsubscribedAt" = NULL, "subscribedAt" = NOW()
          WHERE email = ${normalizedEmail}
        `;

        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
        });
      }
    }

    // Create new subscriber
    await prisma.$executeRaw`
      INSERT INTO newsletter_subscribers (id, email, "isActive", "subscribedAt")
      VALUES (gen_random_uuid(), ${normalizedEmail}, true, NOW())
    `;

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to the newsletter!',
    });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to subscribe to newsletter',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/newsletter - Unsubscribe from newsletter
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Check if subscriber exists
    const existing: any[] = await prisma.$queryRaw`
      SELECT id FROM newsletter_subscribers WHERE email = ${normalizedEmail}
    `;

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Email not found in our newsletter list' },
        { status: 404 }
      );
    }

    await prisma.$executeRaw`
      UPDATE newsletter_subscribers
      SET "isActive" = false, "unsubscribedAt" = NOW()
      WHERE email = ${normalizedEmail}
    `;

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from the newsletter',
    });
  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to unsubscribe from newsletter',
      },
      { status: 500 }
    );
  }
}
