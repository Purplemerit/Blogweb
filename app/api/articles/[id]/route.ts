import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import prisma from '@/lib/prisma';

// GET /api/articles/[id] - Get single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    // Check if user is the owner or a collaborator with ACCEPTED status
    const article = await prisma.article.findFirst({
      where: {
        id: id,
        deletedAt: null,
        OR: [
          { userId: currentUser.id }, // Owner
          {
            collaborators: {
              some: {
                userId: currentUser.id,
                status: { in: ['ACCEPTED', 'PENDING'] }
              }
            }
          }
        ]
      },
      include: {
        articleTags: {
          include: {
            tag: true,
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
        collaborators: {
          where: {
            status: { in: ['ACCEPTED', 'PENDING'] }
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              }
            }
          }
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found or you do not have access' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        article: {
          ...article,
          // Include collaborators in response for collaborative editing
          collaborators: article.collaborators || [],
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// PUT /api/articles/[id] - Update article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    // Check if article exists and user has edit access (owner or editor)
    const existingArticle = await prisma.article.findFirst({
      where: {
        id: id,
        deletedAt: null,
        OR: [
          { userId: currentUser.id }, // Owner
          {
            collaborators: {
              some: {
                userId: currentUser.id,
                status: 'ACCEPTED',
                role: { in: ['EDITOR', 'OWNER'] }
              }
            }
          }
        ]
      },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Article not found or you do not have edit permissions' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      status,
      featuredImage,
      metaTitle,
      metaDescription,
      focusKeyword,
      folderId,
      toneOfVoice,
      contentFramework,
    } = body;

    // Calculate word count and reading time if content is provided
    let wordCount = existingArticle.wordCount;
    let readingTime = existingArticle.readingTime;

    if (content !== undefined) {
      wordCount = content.split(/\s+/).length;
      readingTime = Math.ceil(wordCount / 200);
    }

    const updateData: any = {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content, wordCount, readingTime }),
      ...(excerpt !== undefined && { excerpt }),
      ...(status !== undefined && { status }),
      ...(featuredImage !== undefined && { featuredImage }),
      ...(metaTitle !== undefined && { metaTitle }),
      ...(metaDescription !== undefined && { metaDescription }),
      ...(focusKeyword !== undefined && { focusKeyword }),
      ...(folderId !== undefined && { folderId }),
      ...(toneOfVoice !== undefined && { toneOfVoice }),
      ...(contentFramework !== undefined && { contentFramework }),
    };

    // If status is being changed to PUBLISHED, set publishedAt
    if (status === 'PUBLISHED' && existingArticle.status !== 'PUBLISHED') {
      updateData.publishedAt = new Date();

      // Note: UsageStats tracking removed - not needed for core functionality
      // Stats are calculated dynamically from articles table
    }

    const article = await prisma.article.update({
      where: { id: id },
      data: updateData,
    });

    // Create version history entry
    await prisma.articleVersion.create({
      data: {
        articleId: article.id,
        version: await prisma.articleVersion.count({
          where: { articleId: article.id },
        }) + 1,
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        createdBy: currentUser.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: { article },
      message: 'Article updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update article' },
      { status: 500 }
    );
  }
}

// PATCH /api/articles/[id] - Partial update article (for status changes, scheduling, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    // Check if article exists and user has edit access (owner or editor)
    const existingArticle = await prisma.article.findFirst({
      where: {
        id: id,
        deletedAt: null,
        OR: [
          { userId: currentUser.id }, // Owner
          {
            collaborators: {
              some: {
                userId: currentUser.id,
                status: 'ACCEPTED',
                role: { in: ['EDITOR', 'OWNER'] }
              }
            }
          }
        ]
      },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Article not found or you do not have edit permissions' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, content, status, scheduledAt, publishedAt } = body;

    const updateData: any = {};

    // Handle title and content updates (for collaborative editing)
    if (title !== undefined) {
      updateData.title = title;
    }

    if (content !== undefined) {
      updateData.content = content;
      // Calculate word count and reading time
      const wordCount = content.split(/\s+/).length;
      updateData.wordCount = wordCount;
      updateData.readingTime = Math.ceil(wordCount / 200);
    }

    // Handle status updates
    if (status !== undefined) {
      updateData.status = status;

      // If status is being changed to PUBLISHED, set publishedAt
      if (status === 'PUBLISHED' && existingArticle.status !== 'PUBLISHED') {
        updateData.publishedAt = publishedAt || new Date();

        // Note: UsageStats tracking removed - not needed for core functionality
        // Stats are calculated dynamically from articles table
      }

      // If status is SCHEDULED, set scheduleAt (matching schema field name)
      if (status === 'SCHEDULED' && scheduledAt) {
        updateData.scheduleAt = new Date(scheduledAt);
      }
    }

    const article = await prisma.article.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: { article },
      message: 'Article updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[id] - Delete article (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    // Check if article exists and belongs to user
    const existingArticle = await prisma.article.findFirst({
      where: {
        id: id,
        userId: currentUser.id,
        deletedAt: null,
      },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Soft delete
    await prisma.article.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete article' },
      { status: 500 }
    );
  }
}
