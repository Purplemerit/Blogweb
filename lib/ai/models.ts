import { SubscriptionPlan } from '@prisma/client';

/**
 * AI Model Configuration with Subscription Tier Access
 * Shows all models to all users, but locks higher-tier models behind subscriptions
 */

export interface AIModel {
  id: string;
  name: string;
  provider: 'google' | 'openai' | 'anthropic';
  description: string;
  requiredPlan: SubscriptionPlan;
  badge?: string; // Badge text like "FREE", "STARTER+", "CREATOR+"
  capabilities: {
    contentGeneration: boolean;
    seoAnalysis: boolean;
    grammarCheck: boolean;
    toneAdjustment: boolean;
    factChecking: boolean;
  };
  pricing: {
    costPer1kTokens: number; // For transparency
    currency: 'USD';
  };
}

export const AI_MODELS: AIModel[] = [
  // FREE TIER
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google',
    description: 'Fast and efficient AI for basic content generation',
    requiredPlan: 'FREE',
    badge: 'FREE',
    capabilities: {
      contentGeneration: true,
      seoAnalysis: true,
      grammarCheck: true,
      toneAdjustment: true,
      factChecking: false,
    },
    pricing: {
      costPer1kTokens: 0.00,
      currency: 'USD',
    },
  },

  // STARTER TIER
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: 'OpenAI\'s efficient model with improved reasoning',
    requiredPlan: 'STARTER',
    badge: 'STARTER+',
    capabilities: {
      contentGeneration: true,
      seoAnalysis: true,
      grammarCheck: true,
      toneAdjustment: true,
      factChecking: true,
    },
    pricing: {
      costPer1kTokens: 0.15,
      currency: 'USD',
    },
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    description: 'Advanced Google AI with better context understanding',
    requiredPlan: 'STARTER',
    badge: 'STARTER+',
    capabilities: {
      contentGeneration: true,
      seoAnalysis: true,
      grammarCheck: true,
      toneAdjustment: true,
      factChecking: true,
    },
    pricing: {
      costPer1kTokens: 0.125,
      currency: 'USD',
    },
  },

  // CREATOR TIER
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'OpenAI\'s most capable model for premium content',
    requiredPlan: 'CREATOR',
    badge: 'CREATOR+',
    capabilities: {
      contentGeneration: true,
      seoAnalysis: true,
      grammarCheck: true,
      toneAdjustment: true,
      factChecking: true,
    },
    pricing: {
      costPer1kTokens: 2.50,
      currency: 'USD',
    },
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    description: 'Anthropic\'s advanced model with excellent writing quality',
    requiredPlan: 'CREATOR',
    badge: 'CREATOR+',
    capabilities: {
      contentGeneration: true,
      seoAnalysis: true,
      grammarCheck: true,
      toneAdjustment: true,
      factChecking: true,
    },
    pricing: {
      costPer1kTokens: 3.00,
      currency: 'USD',
    },
  },

  // PROFESSIONAL TIER
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'Most powerful OpenAI model with 128k context',
    requiredPlan: 'PROFESSIONAL',
    badge: 'PRO',
    capabilities: {
      contentGeneration: true,
      seoAnalysis: true,
      grammarCheck: true,
      toneAdjustment: true,
      factChecking: true,
    },
    pricing: {
      costPer1kTokens: 10.00,
      currency: 'USD',
    },
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    description: 'Anthropic\'s most intelligent model for complex tasks',
    requiredPlan: 'PROFESSIONAL',
    badge: 'PRO',
    capabilities: {
      contentGeneration: true,
      seoAnalysis: true,
      grammarCheck: true,
      toneAdjustment: true,
      factChecking: true,
    },
    pricing: {
      costPer1kTokens: 15.00,
      currency: 'USD',
    },
  },
];

/**
 * Get models available for a subscription plan
 * Returns ALL models but marks which ones are locked
 */
export function getModelsForPlan(userPlan: SubscriptionPlan): AIModel[] {
  const planHierarchy: SubscriptionPlan[] = ['FREE', 'STARTER', 'CREATOR', 'PROFESSIONAL'];
  const userPlanIndex = planHierarchy.indexOf(userPlan);

  return AI_MODELS.map(model => ({
    ...model,
    isLocked: planHierarchy.indexOf(model.requiredPlan) > userPlanIndex,
  })) as any;
}

/**
 * Get only unlocked models for a plan
 */
export function getAvailableModels(userPlan: SubscriptionPlan): AIModel[] {
  const planHierarchy: SubscriptionPlan[] = ['FREE', 'STARTER', 'CREATOR', 'PROFESSIONAL'];
  const userPlanIndex = planHierarchy.indexOf(userPlan);

  return AI_MODELS.filter(model => {
    const modelPlanIndex = planHierarchy.indexOf(model.requiredPlan);
    return modelPlanIndex <= userPlanIndex;
  });
}

/**
 * Check if user can access a specific model
 */
export function canAccessModel(userPlan: SubscriptionPlan, modelId: string): boolean {
  const model = AI_MODELS.find(m => m.id === modelId);
  if (!model) return false;

  const planHierarchy: SubscriptionPlan[] = ['FREE', 'STARTER', 'CREATOR', 'PROFESSIONAL'];
  const userPlanIndex = planHierarchy.indexOf(userPlan);
  const modelPlanIndex = planHierarchy.indexOf(model.requiredPlan);

  return modelPlanIndex <= userPlanIndex;
}

/**
 * Get default model for a plan
 */
export function getDefaultModel(userPlan: SubscriptionPlan): AIModel {
  const available = getAvailableModels(userPlan);
  // Return the best available model
  return available[available.length - 1] || AI_MODELS[0];
}

/**
 * SEO Analysis Configuration by Plan
 */
export interface SEOAnalysisConfig {
  model: string;
  features: {
    basicKeywordAnalysis: boolean;
    readabilityScore: boolean;
    metaTagSuggestions: boolean;
    competitorAnalysis: boolean;
    contentGapAnalysis: boolean;
    advancedSEORecommendations: boolean;
    backlinkSuggestions: boolean;
  };
  analysisDepth: 'basic' | 'standard' | 'advanced' | 'comprehensive';
  maxKeywords: number;
}

export const SEO_ANALYSIS_BY_PLAN: Record<SubscriptionPlan, SEOAnalysisConfig> = {
  FREE: {
    model: 'gemini-1.5-flash',
    features: {
      basicKeywordAnalysis: true,
      readabilityScore: true,
      metaTagSuggestions: true,
      competitorAnalysis: false,
      contentGapAnalysis: false,
      advancedSEORecommendations: false,
      backlinkSuggestions: false,
    },
    analysisDepth: 'basic',
    maxKeywords: 5,
  },
  STARTER: {
    model: 'gemini-1.5-pro',
    features: {
      basicKeywordAnalysis: true,
      readabilityScore: true,
      metaTagSuggestions: true,
      competitorAnalysis: true,
      contentGapAnalysis: false,
      advancedSEORecommendations: false,
      backlinkSuggestions: false,
    },
    analysisDepth: 'standard',
    maxKeywords: 10,
  },
  CREATOR: {
    model: 'gpt-4o',
    features: {
      basicKeywordAnalysis: true,
      readabilityScore: true,
      metaTagSuggestions: true,
      competitorAnalysis: true,
      contentGapAnalysis: true,
      advancedSEORecommendations: true,
      backlinkSuggestions: false,
    },
    analysisDepth: 'advanced',
    maxKeywords: 20,
  },
  PROFESSIONAL: {
    model: 'gpt-4-turbo',
    features: {
      basicKeywordAnalysis: true,
      readabilityScore: true,
      metaTagSuggestions: true,
      competitorAnalysis: true,
      contentGapAnalysis: true,
      advancedSEORecommendations: true,
      backlinkSuggestions: true,
    },
    analysisDepth: 'comprehensive',
    maxKeywords: 50,
  },
};

/**
 * Get SEO analysis config for plan
 */
export function getSEOConfig(userPlan: SubscriptionPlan): SEOAnalysisConfig {
  return SEO_ANALYSIS_BY_PLAN[userPlan];
}

/**
 * Get system prompts optimized per plan
 * Even FREE users get good results, but higher tiers get better prompts
 */
export function getSystemPrompt(userPlan: SubscriptionPlan, task: 'content' | 'seo' | 'grammar'): string {
  const prompts = {
    content: {
      FREE: 'You are a helpful content writing assistant. Generate clear, engaging content.',
      STARTER: 'You are an expert content writer. Create engaging, well-structured content with proper formatting and flow.',
      CREATOR: 'You are a professional content strategist and writer. Create compelling, SEO-optimized content with deep research, engaging hooks, and persuasive narratives. Include data-driven insights.',
      PROFESSIONAL: 'You are a world-class content creator and strategist. Produce exceptional, highly-researched content with sophisticated narrative structures, data-backed insights, advanced SEO optimization, and compelling storytelling. Consider audience psychology and conversion optimization.',
    },
    seo: {
      FREE: 'Analyze this content for basic SEO: keywords, readability, and meta tags.',
      STARTER: 'Perform SEO analysis including keyword density, readability, meta optimization, and competitor keywords.',
      CREATOR: 'Conduct comprehensive SEO analysis: keyword strategy, content gaps, semantic SEO, SERP analysis, internal linking opportunities, and advanced recommendations.',
      PROFESSIONAL: 'Execute expert-level SEO audit: complete keyword ecosystem analysis, SERP feature opportunities, content gap analysis, topical authority mapping, E-E-A-T optimization, schema markup suggestions, and strategic backlink opportunities.',
    },
    grammar: {
      FREE: 'Check for grammar, spelling, and basic punctuation errors.',
      STARTER: 'Review grammar, spelling, punctuation, and style consistency. Suggest improvements.',
      CREATOR: 'Perform detailed grammar and style analysis including tone consistency, advanced punctuation, sentence variety, and readability enhancements.',
      PROFESSIONAL: 'Conduct expert editorial review covering grammar, style, tone, voice consistency, rhetorical devices, persuasive techniques, and publication-ready polish.',
    },
  };

  return prompts[task][userPlan];
}
