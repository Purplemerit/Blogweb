/**
 * Plagiarism Detection Utilities
 * Basic implementation - can be enhanced with Copyscape API or similar
 */

export interface PlagiarismResult {
  score: number // 0-100 (0 = unique, 100 = heavily plagiarized)
  confidence: 'low' | 'medium' | 'high'
  matches: PlagiarismMatch[]
  uniquenessScore: number // 0-100 (higher = more unique)
  recommendations: string[]
}

export interface PlagiarismMatch {
  text: string
  source?: string
  similarity: number // 0-100
}

/**
 * Basic plagiarism check using text fingerprinting
 * NOTE: This is a simplified version. For production, integrate with:
 * - Copyscape API (https://www.copyscape.com/apidoc.php)
 * - Turnitin API
 * - Plagiarism Checker API
 */
export async function checkPlagiarism(content: string): Promise<PlagiarismResult> {
  // Strip HTML
  const plainText = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .trim()

  if (plainText.length < 50) {
    return {
      score: 0,
      confidence: 'low',
      matches: [],
      uniquenessScore: 100,
      recommendations: ['Content too short to analyze for plagiarism'],
    }
  }

  // Split into sentences for analysis
  const sentences = plainText
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20)

  // Basic uniqueness checks
  const matches: PlagiarismMatch[] = []
  let suspiciousPatterns = 0

  // Check for overly common phrases (simplified approach)
  const commonPhrases = [
    'according to wikipedia',
    'it has been said that',
    'studies have shown',
    'research indicates',
    'as previously mentioned',
  ]

  commonPhrases.forEach(phrase => {
    const regex = new RegExp(phrase, 'gi')
    if (regex.test(plainText.toLowerCase())) {
      suspiciousPatterns++
      matches.push({
        text: phrase,
        similarity: 70,
      })
    }
  })

  // Check for repetitive sentences (self-plagiarism indicator)
  const sentenceFingerprints = new Map<string, number>()
  sentences.forEach(sentence => {
    const normalized = sentence.toLowerCase().replace(/\s+/g, ' ')
    sentenceFingerprints.set(normalized, (sentenceFingerprints.get(normalized) || 0) + 1)
  })

  const duplicates = Array.from(sentenceFingerprints.entries()).filter(([_, count]) => count > 1)
  duplicates.forEach(([sentence, count]) => {
    if (count > 1) {
      suspiciousPatterns++
      matches.push({
        text: sentence.substring(0, 100),
        similarity: 100,
      })
    }
  })

  // Calculate plagiarism score
  const wordCount = plainText.split(/\s+/).length
  const baseScore = Math.min(100, (suspiciousPatterns / Math.max(sentences.length, 1)) * 100)
  const score = Math.round(baseScore)

  // Calculate uniqueness (inverse of plagiarism)
  const uniquenessScore = 100 - score

  // Determine confidence
  let confidence: 'low' | 'medium' | 'high'
  if (wordCount < 200) {
    confidence = 'low'
  } else if (wordCount < 500) {
    confidence = 'medium'
  } else {
    confidence = 'high'
  }

  // Generate recommendations
  const recommendations = getPlagiarismRecommendations(score, matches.length)

  return {
    score,
    confidence,
    matches,
    uniquenessScore,
    recommendations,
  }
}

/**
 * Get recommendations based on plagiarism check
 */
function getPlagiarismRecommendations(score: number, matchCount: number): string[] {
  const recommendations: string[] = []

  if (score === 0) {
    recommendations.push('✓ No plagiarism detected - content appears unique')
    recommendations.push('Note: This is a basic check. For thorough verification, use Copyscape or similar tools')
  } else if (score < 10) {
    recommendations.push('Content appears mostly original')
    recommendations.push('Minor similarities detected - review flagged sections')
  } else if (score < 30) {
    recommendations.push('Some similarities detected')
    recommendations.push('Review and rephrase flagged sections')
    recommendations.push('Consider adding more original insights and examples')
  } else if (score < 50) {
    recommendations.push('⚠️ Significant similarities detected')
    recommendations.push('Rewrite flagged sections in your own words')
    recommendations.push('Add proper citations if referencing other sources')
    recommendations.push('Include more original analysis and perspectives')
  } else {
    recommendations.push('❌ High plagiarism risk detected')
    recommendations.push('Major rewrite required')
    recommendations.push('Ensure all ideas are properly attributed')
    recommendations.push('Add substantial original content')
  }

  if (matchCount > 0) {
    recommendations.push(`Review ${matchCount} flagged section${matchCount > 1 ? 's' : ''}`)
  }

  recommendations.push('Pro tip: Use Copyscape API for comprehensive plagiarism checking')

  return recommendations
}

/**
 * Get color for plagiarism score
 */
export function getPlagiarismColor(score: number): string {
  if (score < 10) return 'green' // Unique
  if (score < 30) return 'yellow' // Minor similarities
  if (score < 50) return 'orange' // Some plagiarism
  return 'red' // High plagiarism
}

/**
 * Check plagiarism using Copyscape API (optional - requires API key)
 * Uncomment and configure when you have a Copyscape subscription
 */
/*
export async function checkPlagiarismWithCopyscape(content: string): Promise<PlagiarismResult> {
  const apiKey = process.env.COPYSCAPE_API_KEY
  const apiUsername = process.env.COPYSCAPE_USERNAME

  if (!apiKey || !apiUsername) {
    throw new Error('Copyscape API credentials not configured')
  }

  try {
    const response = await fetch('https://www.copyscape.com/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        u: apiUsername,
        k: apiKey,
        o: 'csearch',
        t: content,
        e: 'UTF-8',
      }),
    })

    const result = await response.text()
    // Parse XML response and return PlagiarismResult
    // Implementation depends on Copyscape API response format

    return {
      score: 0,
      confidence: 'high',
      matches: [],
      uniquenessScore: 100,
      recommendations: [],
    }
  } catch (error) {
    console.error('Copyscape API error:', error)
    throw error
  }
}
*/
