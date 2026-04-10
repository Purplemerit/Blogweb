/**
 * Grammar and Spell Check Utilities
 * Uses LanguageTool API for comprehensive grammar checking
 */

import { LanguageToolApi } from 'languagetool-api'

export interface GrammarIssue {
  message: string
  shortMessage: string
  offset: number
  length: number
  replacements: string[]
  ruleId: string
  category: string
  severity: 'error' | 'warning' | 'info'
  context: string
}

export interface GrammarCheckResult {
  issues: GrammarIssue[]
  errorCount: number
  warningCount: number
  infoCount: number
  score: number // 0-100 (higher is better)
}

/**
 * Check grammar using LanguageTool
 */
export async function checkGrammar(text: string, language: string = 'en-US'): Promise<GrammarCheckResult> {
  try {
    // Strip HTML but preserve structure for context
    const plainText = text
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .trim()

    if (plainText.length < 10) {
      return {
        issues: [],
        errorCount: 0,
        warningCount: 0,
        infoCount: 0,
        score: 100,
      }
    }

    // Initialize LanguageTool API (using public API endpoint)
    const api = new LanguageToolApi({
      language,
      // Optional: add your own LanguageTool instance URL
      // apiUrl: process.env.LANGUAGETOOL_API_URL || 'https://api.languagetool.org',
    })

    // Check text
    const result = await api.check(plainText)

    // Process matches
    const issues: GrammarIssue[] = result.matches.map((match: any) => {
      // Determine severity
      let severity: 'error' | 'warning' | 'info' = 'info'
      if (match.rule.category.id === 'TYPOS') {
        severity = 'error'
      } else if (['GRAMMAR', 'CONFUSED_WORDS', 'PUNCTUATION'].includes(match.rule.category.id)) {
        severity = 'warning'
      }

      // Get context
      const contextStart = Math.max(0, match.offset - 20)
      const contextEnd = Math.min(plainText.length, match.offset + match.length + 20)
      const context = plainText.substring(contextStart, contextEnd)

      return {
        message: match.message,
        shortMessage: match.shortMessage || match.message.substring(0, 50),
        offset: match.offset,
        length: match.length,
        replacements: match.replacements.map((r: any) => r.value).slice(0, 5), // Top 5 suggestions
        ruleId: match.rule.id,
        category: match.rule.category.id,
        severity,
        context,
      }
    })

    // Count by severity
    const errorCount = issues.filter(i => i.severity === 'error').length
    const warningCount = issues.filter(i => i.severity === 'warning').length
    const infoCount = issues.filter(i => i.severity === 'info').length

    // Calculate score (100 = perfect, decrease based on issues)
    const wordCount = plainText.split(/\s+/).length
    const errorPenalty = (errorCount * 5)
    const warningPenalty = (warningCount * 2)
    const infoPenalty = (infoCount * 0.5)
    const totalPenalty = errorPenalty + warningPenalty + infoPenalty

    // Normalize by word count
    const penaltyPerWord = (totalPenalty / Math.max(wordCount, 1)) * 100
    const score = Math.max(0, Math.min(100, 100 - penaltyPerWord))

    return {
      issues,
      errorCount,
      warningCount,
      infoCount,
      score: Math.round(score),
    }
  } catch (error: any) {
    console.error('Grammar check error:', error)

    // Return fallback result if API fails
    return {
      issues: [],
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
      score: 0,
    }
  }
}

/**
 * Get color for grammar score
 */
export function getGrammarScoreColor(score: number): string {
  if (score >= 90) return 'green'
  if (score >= 75) return 'emerald'
  if (score >= 60) return 'yellow'
  if (score >= 40) return 'orange'
  return 'red'
}

/**
 * Get recommendations based on grammar check
 */
export function getGrammarRecommendations(result: GrammarCheckResult): string[] {
  const recommendations: string[] = []

  if (result.errorCount > 0) {
    recommendations.push(`Fix ${result.errorCount} spelling/grammar error${result.errorCount > 1 ? 's' : ''}`)
  }

  if (result.warningCount > 5) {
    recommendations.push('Review grammar and punctuation warnings')
  }

  if (result.score < 70) {
    recommendations.push('Consider proofreading before publishing')
  }

  if (result.score >= 90) {
    recommendations.push('Grammar looks excellent! ✓')
  }

  // Category-specific recommendations
  const categories = [...new Set(result.issues.map(i => i.category))]

  if (categories.includes('TYPOS')) {
    recommendations.push('Check for typos and misspellings')
  }

  if (categories.includes('CONFUSED_WORDS')) {
    recommendations.push('Review easily confused words (e.g., their/there/they\'re)')
  }

  if (categories.includes('PUNCTUATION')) {
    recommendations.push('Fix punctuation issues')
  }

  return recommendations
}

/**
 * Group issues by category
 */
export function groupIssuesByCategory(issues: GrammarIssue[]): Record<string, GrammarIssue[]> {
  return issues.reduce((acc, issue) => {
    if (!acc[issue.category]) {
      acc[issue.category] = []
    }
    acc[issue.category].push(issue)
    return acc
  }, {} as Record<string, GrammarIssue[]>)
}
