import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { getSEOConfig, getSystemPrompt } from '@/lib/ai/models';
import { getPlanLimits } from '@/lib/subscription/features';
import { geminiService } from '@/lib/services/gemini.service';

/**
 * POST /api/ai/seo-analysis
 * Analyzes content for SEO with features based on subscription tier
 */
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

    // Check SEO access
    const planLimits = getPlanLimits(currentUser.subscriptionPlan);
    if (!planLimits.seoAnalysis) {
      return NextResponse.json(
        {
          success: false,
          error: 'SEO analysis not available on your plan',
          upgradeRequired: true,
          upgradeUrl: '/dashboard/settings/billing',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content, title, targetKeywords } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Get SEO configuration for user's plan
    const seoConfig = getSEOConfig(currentUser.subscriptionPlan);
    const systemPrompt = getSystemPrompt(currentUser.subscriptionPlan, 'seo');

    // Build analysis prompt based on available features
    let analysisPrompt = `${systemPrompt}\n\nAnalyze the following content:\n\nTitle: ${title || 'N/A'}\nContent: ${content}\n\n`;

    if (targetKeywords && targetKeywords.length > 0) {
      const keywords = targetKeywords.slice(0, seoConfig.maxKeywords);
      analysisPrompt += `Target Keywords: ${keywords.join(', ')}\n\n`;
    }

    analysisPrompt += 'Provide analysis for:\n';

    // Always include basic features
    analysisPrompt += '1. Keyword density and usage\n';
    analysisPrompt += '2. Readability score (Flesch-Kincaid)\n';
    analysisPrompt += '3. Meta title and description suggestions\n';

    // Add advanced features based on plan
    if (seoConfig.features.competitorAnalysis) {
      analysisPrompt += '4. Competitor keyword opportunities\n';
    }

    if (seoConfig.features.contentGapAnalysis) {
      analysisPrompt += '5. Content gaps and topic suggestions\n';
    }

    if (seoConfig.features.advancedSEORecommendations) {
      analysisPrompt += '6. Advanced SEO recommendations (internal linking, schema markup, E-E-A-T)\n';
    }

    if (seoConfig.features.backlinkSuggestions) {
      analysisPrompt += '7. Strategic backlink opportunities\n';
    }

    analysisPrompt += '\nFormat the response as JSON with these fields:\n';
    analysisPrompt += '{\n';
    analysisPrompt += '  "score": <overall SEO score 0-100>,\n';
    analysisPrompt += '  "readabilityScore": <Flesch-Kincaid score>,\n';
    analysisPrompt += '  "keywordDensity": { "keyword": <percentage> },\n';
    analysisPrompt += '  "metaSuggestions": { "title": "...", "description": "..." },\n';
    analysisPrompt += '  "recommendations": ["..."],\n';

    if (seoConfig.features.competitorAnalysis) {
      analysisPrompt += '  "competitorKeywords": ["..."],\n';
    }

    if (seoConfig.features.contentGapAnalysis) {
      analysisPrompt += '  "contentGaps": ["..."],\n';
    }

    if (seoConfig.features.advancedSEORecommendations) {
      analysisPrompt += '  "advancedRecommendations": { "internalLinks": [...], "schema": "...", "eeat": [...] },\n';
    }

    if (seoConfig.features.backlinkSuggestions) {
      analysisPrompt += '  "backlinkOpportunities": ["..."],\n';
    }

    analysisPrompt += '  "planTier": "' + currentUser.subscriptionPlan + '"\n';
    analysisPrompt += '}';

    // Generate analysis using Gemini analyzeSEO method
    const analysisResult = await geminiService.analyzeSEO({
      content: content || '',
      title: title || '',
      plan: currentUser.subscriptionPlan,
    });

    // Build parsedAnalysis from the result
    const parsedAnalysis = {
      score: analysisResult.score || 75,
      readabilityScore: analysisResult.readabilityScore || 60,
      recommendations: analysisResult.recommendations || [],
      issues: analysisResult.issues || [],
      keywords: analysisResult.keywords || [],
      structure: analysisResult.structure || {},
      planTier: currentUser.subscriptionPlan,
    };

    // Add metadata about what features were used
    const response = {
      ...parsedAnalysis,
      analysisDepth: seoConfig.analysisDepth,
      featuresUsed: Object.entries(seoConfig.features)
        .filter(([_, enabled]) => enabled)
        .map(([feature]) => feature),
      availableUpgrades: Object.entries(seoConfig.features)
        .filter(([_, enabled]) => !enabled)
        .map(([feature]) => ({
          feature,
          availableIn: getFeatureAvailability(feature),
        })),
    };

    return NextResponse.json({
      success: true,
      data: response,
      message: 'SEO analysis completed',
    });
  } catch (error: any) {
    console.error('SEO Analysis Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to analyze content',
      },
      { status: 500 }
    );
  }
}

/**
 * Helper function to show which plan unlocks a feature
 */
function getFeatureAvailability(feature: string): string {
  const featureMap: Record<string, string> = {
    competitorAnalysis: 'STARTER',
    contentGapAnalysis: 'CREATOR',
    advancedSEORecommendations: 'CREATOR',
    backlinkSuggestions: 'PROFESSIONAL',
  };

  return featureMap[feature] || 'PROFESSIONAL';
}
