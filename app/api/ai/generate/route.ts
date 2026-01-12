import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { geminiService } from '@/lib/services/gemini.service';
import { getPlanLimits, hasReachedLimit, canAccessFeature } from '@/lib/subscription/features';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    // Check if user has AI access
    if (!canAccessFeature(currentUser.subscriptionPlan, 'aiWritingAccess')) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI writing features are not available in your plan. Please upgrade.',
        },
        { status: 403 }
      );
    }

    // Check AI generation limits
    const usageStats = await prisma.usageStats.findUnique({
      where: { userId: currentUser.id },
    });

    const planLimits = getPlanLimits(currentUser.subscriptionPlan);

    // For free tier, we can limit AI generations
    if (usageStats && planLimits.maxArticlesPerMonth !== -1) {
      if (hasReachedLimit(
        currentUser.subscriptionPlan,
        'maxArticlesPerMonth',
        usageStats.aiGenerationsThisMonth
      )) {
        return NextResponse.json(
          {
            success: false,
            error: 'You have reached your monthly AI generation limit. Please upgrade your plan.',
          },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { type, ...params } = body;

    let result: any;

    switch (type) {
      case 'blog-content':
        const { title, keywords, toneOfVoice, contentFramework, wordCount } = params;
        result = await geminiService.generateBlogContent({
          title,
          keywords,
          toneOfVoice,
          contentFramework,
          wordCount,
        });
        break;

      case 'improve-paragraph':
        const { paragraph, instruction } = params;
        result = await geminiService.improveParagraph(paragraph, instruction);
        break;

      case 'outline':
        const { topic, sections } = params;
        result = await geminiService.generateOutline(topic, sections);
        break;

      case 'meta-description':
        const { content, maxLength } = params;
        result = await geminiService.generateMetaDescription(content, maxLength);
        break;

      case 'title-suggestions':
        const { topic: titleTopic, count } = params;
        result = await geminiService.generateTitleSuggestions(titleTopic, count);
        break;

      case 'summarize':
        const { content: summaryContent, maxWords } = params;
        result = await geminiService.summarizeContent(summaryContent, maxWords);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid generation type' },
          { status: 400 }
        );
    }

    // Update AI generation count
    await prisma.usageStats.upsert({
      where: { userId: currentUser.id },
      update: { aiGenerationsThisMonth: { increment: 1 } },
      create: {
        userId: currentUser.id,
        aiGenerationsThisMonth: 1,
      },
    });

    return NextResponse.json({
      success: true,
      data: { result },
      message: 'Content generated successfully',
    });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate content',
      },
      { status: 500 }
    );
  }
}
