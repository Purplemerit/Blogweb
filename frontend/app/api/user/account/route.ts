import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth.service'
import prisma from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 })
    }

    const accessToken = authHeader.substring(7)
    const currentUser = await authService.getCurrentUser(accessToken)

    const userId = currentUser.id

    // Delete user's data in order (due to foreign key constraints)
    // Note: Many deletions will cascade automatically due to onDelete: Cascade in schema
    // But we explicitly delete some to ensure proper cleanup

    // 1. Delete articles (this will cascade delete: analytics, publish records, article versions, article tags, images, comments, collaborators)
    await prisma.article.deleteMany({
      where: { userId }
    })

    // 2. Delete blogs (this will cascade delete: team members)
    await prisma.blog.deleteMany({
      where: { userId }
    })

    // 3. Delete platform connections (this will cascade delete any remaining publish records)
    await prisma.platformConnection.deleteMany({
      where: { userId }
    })

    // 4. Delete folders
    await prisma.folder.deleteMany({
      where: { userId }
    })

    // 5. Delete activity logs
    await prisma.activityLog.deleteMany({
      where: { userId }
    })

    // 6. Delete images
    await prisma.image.deleteMany({
      where: { userId }
    })

    // Note: UserSettings, RefreshToken, VerificationToken will be cascade deleted when user is deleted
    // as they have onDelete: Cascade in the schema

    // 7. Finally delete the user (this will cascade delete: settings, refresh tokens, verification tokens)
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error deleting account:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete account',
    }, { status: 500 })
  }
}
