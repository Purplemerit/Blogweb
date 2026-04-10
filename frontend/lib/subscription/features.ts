// Subscription Feature Access Control System
import { SubscriptionPlan } from '@prisma/client'

// Re-export for convenience
export { SubscriptionPlan }

export interface PlanLimits {
  // Content Creation
  maxArticlesPerMonth: number
  maxDrafts: number
  maxFolders: number
  maxCollaborators: number
  maxPlatformConnections: number

  // AI Features
  aiWritingAccess: boolean
  advancedAIEditor: boolean
  customPromptTemplates: boolean
  contentFrameworks: boolean

  // SEO & Analytics
  seoAnalysis: boolean
  advancedSEO: boolean
  competitorAnalysis: boolean
  contentGapAnalysis: boolean
  readabilityScore: boolean

  // Images
  stockImageAccess: boolean

  // Publishing
  scheduledPosts: number
  autoPublish: boolean
  multiPlatformPublish: boolean

  // Collaboration
  teamCollaboration: boolean
  liveChat: boolean

  // Checks & Quality
  grammarCheck: boolean
  factChecking: boolean
  biasDetection: boolean

  // Integrations
  apiAccess: boolean
  webhooks: boolean
  analyticsIntegration: boolean

  // Support
  prioritySupport: boolean
  dedicatedAccountManager: boolean

  // Other
  customBranding: boolean
  whiteLabel: boolean
  abTesting: boolean
  multiLanguageSupport: number // number of languages
  versionHistory: number // number of versions to keep
}

export const PLAN_FEATURES: Record<SubscriptionPlan, PlanLimits> = {
  FREE: {
    // Content Creation
    maxArticlesPerMonth: 5,
    maxDrafts: 10,
    maxFolders: 3,
    maxCollaborators: 1, // One invite per blog
    maxPlatformConnections: 3,

    // AI Features
    aiWritingAccess: true,
    advancedAIEditor: false,
    customPromptTemplates: false,
    contentFrameworks: false,

    // SEO & Analytics
    seoAnalysis: true,
    advancedSEO: false,
    competitorAnalysis: false,
    contentGapAnalysis: false,
    readabilityScore: true,

    // Images
    stockImageAccess: true,

    // Publishing
    scheduledPosts: 5,
    autoPublish: false,
    multiPlatformPublish: false,

    // Collaboration
    teamCollaboration: false,
    liveChat: false,

    // Checks & Quality
    grammarCheck: true,
    factChecking: false,
    biasDetection: false,

    // Integrations
    apiAccess: false,
    webhooks: false,
    analyticsIntegration: false,

    // Support
    prioritySupport: false,
    dedicatedAccountManager: false,

    // Other
    customBranding: false,
    whiteLabel: false,
    abTesting: false,
    multiLanguageSupport: 1,
    versionHistory: 5,
  },

  STARTER: {
    // Content Creation
    maxArticlesPerMonth: 20,
    maxDrafts: 30,
    maxFolders: 10,
    maxCollaborators: -1, // Unlimited
    maxPlatformConnections: -1, // Unlimited

    // AI Features
    aiWritingAccess: true,
    advancedAIEditor: false,
    customPromptTemplates: true,
    contentFrameworks: true,

    // SEO & Analytics
    seoAnalysis: true,
    advancedSEO: false,
    competitorAnalysis: true,
    contentGapAnalysis: false,
    readabilityScore: true,

    // Images
    stockImageAccess: true,

    // Publishing
    scheduledPosts: 20,
    autoPublish: false,
    multiPlatformPublish: true,

    // Collaboration
    teamCollaboration: true,
    liveChat: false,

    // Checks & Quality
    grammarCheck: true,
    factChecking: true,
    biasDetection: false,

    // Integrations
    apiAccess: false,
    webhooks: false,
    analyticsIntegration: true,

    // Support
    prioritySupport: false,
    dedicatedAccountManager: false,

    // Other
    customBranding: false,
    whiteLabel: false,
    abTesting: false,
    multiLanguageSupport: 3,
    versionHistory: 10,
  },

  CREATOR: {
    // Content Creation
    maxArticlesPerMonth: 100,
    maxDrafts: -1,
    maxFolders: -1,
    maxCollaborators: -1,
    maxPlatformConnections: -1,

    // AI Features
    aiWritingAccess: true,
    advancedAIEditor: true,
    customPromptTemplates: true,
    contentFrameworks: true,

    // SEO & Analytics
    seoAnalysis: true,
    advancedSEO: true,
    competitorAnalysis: true,
    contentGapAnalysis: true,
    readabilityScore: true,

    // Images
    stockImageAccess: true,

    // Publishing
    scheduledPosts: -1,
    autoPublish: true,
    multiPlatformPublish: true,

    // Collaboration
    teamCollaboration: true,
    liveChat: true,

    // Checks & Quality
    grammarCheck: true,
    factChecking: true,
    biasDetection: true,

    // Integrations
    apiAccess: true,
    webhooks: true,
    analyticsIntegration: true,

    // Support
    prioritySupport: true,
    dedicatedAccountManager: false,

    // Other
    customBranding: true,
    whiteLabel: false,
    abTesting: true,
    multiLanguageSupport: 5,
    versionHistory: 30,
  },

  PROFESSIONAL: {
    // Content Creation
    maxArticlesPerMonth: -1,
    maxDrafts: -1,
    maxFolders: -1,
    maxCollaborators: -1,
    maxPlatformConnections: -1,

    // AI Features
    aiWritingAccess: true,
    advancedAIEditor: true,
    customPromptTemplates: true,
    contentFrameworks: true,

    // SEO & Analytics
    seoAnalysis: true,
    advancedSEO: true,
    competitorAnalysis: true,
    contentGapAnalysis: true,
    readabilityScore: true,

    // Images
    stockImageAccess: true,

    // Publishing
    scheduledPosts: -1,
    autoPublish: true,
    multiPlatformPublish: true,

    // Collaboration
    teamCollaboration: true,
    liveChat: true,

    // Checks & Quality
    grammarCheck: true,
    factChecking: true,
    biasDetection: true,

    // Integrations
    apiAccess: true,
    webhooks: true,
    analyticsIntegration: true,

    // Support
    prioritySupport: true,
    dedicatedAccountManager: true,

    // Other
    customBranding: true,
    whiteLabel: true,
    abTesting: true,
    multiLanguageSupport: -1,
    versionHistory: -1,
  },
}

export function getPlanLimits(plan: SubscriptionPlan): PlanLimits {
  return PLAN_FEATURES[plan]
}

export function canAccessFeature(
  userPlan: SubscriptionPlan,
  feature: keyof PlanLimits
): boolean {
  const limits = getPlanLimits(userPlan)
  const featureValue = limits[feature]

  if (typeof featureValue === 'boolean') {
    return featureValue
  }

  return true // For numeric limits, check is done separately
}

export function hasReachedLimit(
  userPlan: SubscriptionPlan,
  feature: keyof PlanLimits,
  currentUsage: number
): boolean {
  const limits = getPlanLimits(userPlan)
  const limit = limits[feature]

  if (typeof limit !== 'number') {
    return false
  }

  if (limit === -1) {
    return false // Unlimited
  }

  return currentUsage >= limit
}

export const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  FREE: 0,
  STARTER: 29,
  CREATOR: 79,
  PROFESSIONAL: 199,
}

export const PLAN_NAMES: Record<SubscriptionPlan, string> = {
  FREE: 'Free',
  STARTER: 'Starter',
  CREATOR: 'Creator',
  PROFESSIONAL: 'Professional',
}
