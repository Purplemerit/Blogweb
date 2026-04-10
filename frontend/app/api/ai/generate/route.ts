import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { geminiService } from '@/lib/services/gemini.service';
import { canAccessModel, getDefaultModel, getSystemPrompt } from '@/lib/ai/models';
import { getPlanLimits } from '@/lib/subscription/features';

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

    const body = await request.json();
    const { type, model, ...params } = body;

    // Check if user has access to AI features
    const planLimits = getPlanLimits(currentUser.subscriptionPlan);
    if (!planLimits.aiWritingAccess) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI features not available on your plan',
          upgradeRequired: true,
          upgradeUrl: '/dashboard/settings/billing',
        },
        { status: 403 }
      );
    }

    // Validate model access
    const requestedModel = model || getDefaultModel(currentUser.subscriptionPlan).id;
    if (!canAccessModel(currentUser.subscriptionPlan, requestedModel)) {
      const defaultModel = getDefaultModel(currentUser.subscriptionPlan);
      return NextResponse.json(
        {
          success: false,
          error: `Model '${requestedModel}' requires a higher subscription plan`,
          upgradeRequired: true,
          upgradeUrl: '/dashboard/settings/billing',
          fallbackModel: defaultModel.id,
        },
        { status: 403 }
      );
    }

    // Get optimized system prompt based on subscription tier
    const systemPrompt = getSystemPrompt(currentUser.subscriptionPlan, 'content');

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

      case 'image':
        const { prompt } = params;
        // Generate a more attractive placeholder using a better service
        // Using a gradient placeholder with better formatting
        const encodedPrompt = encodeURIComponent(prompt.substring(0, 100));
        result = {
          url: `https://placehold.co/800x600/8B5CF6/FFFFFF/png?text=${encodedPrompt}&font=roboto`,
          prompt: prompt,
          message: 'Placeholder image (upgrade to premium for AI-generated images)',
        };
        break;

      case 'seo-analysis':
        const { content: seoContent, title: seoTitle } = params;
        const seoPrompt = getSystemPrompt(currentUser.subscriptionPlan, 'seo');
        // Use different depth based on model/plan
        result = await geminiService.analyzeSEO({
          content: seoContent,
          title: seoTitle,
          plan: currentUser.subscriptionPlan,
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid generation type' },
          { status: 400 }
        );
    }

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
