/**
 * AI Content Detection Utilities
 * Analyzes text to estimate likelihood of AI generation
 */

interface AIDetectionScore {
  score: number // 0-100 (higher = more likely AI-generated)
  confidence: 'low' | 'medium' | 'high'
  indicators: string[]
  humanLikelihood: number // 0-100 (higher = more likely human-written)
  perplexity: number // Lower perplexity suggests AI
  burstiness: number // Lower burstiness suggests AI
}

interface SentenceAnalysis {
  length: number
  complexity: number
  uniqueWords: number
}

/**
 * Calculate perplexity score (simplified version)
 * Lower perplexity indicates more predictable text (AI-like)
 */
function calculatePerplexity(sentences: string[]): number {
  if (sentences.length === 0) return 0

  let totalVariation = 0
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length)

  // Calculate coefficient of variation in sentence length
  const mean = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / sentenceLengths.length
  const stdDev = Math.sqrt(variance)
  const coefficientOfVariation = (stdDev / mean) * 100

  return Math.min(100, coefficientOfVariation)
}

/**
 * Calculate burstiness (variation in sentence structure)
 * AI text tends to have lower burstiness
 */
function calculateBurstiness(sentences: string[]): number {
  if (sentences.length < 3) return 50

  const analyses: SentenceAnalysis[] = sentences.map(sentence => {
    const words = sentence.split(/\s+/).filter(w => w.length > 0)
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size

    return {
      length: words.length,
      complexity: uniqueWords / Math.max(words.length, 1),
      uniqueWords,
    }
  })

  // Calculate variation in sentence complexity
  const complexities = analyses.map(a => a.complexity)
  const mean = complexities.reduce((a, b) => a + b, 0) / complexities.length
  const variance = complexities.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / complexities.length
  const stdDev = Math.sqrt(variance)

  // Higher standard deviation = higher burstiness = more human-like
  return Math.min(100, stdDev * 200)
}

/**
 * Detect common AI writing patterns
 */
function detectAIPatterns(text: string): { score: number; indicators: string[] } {
  const indicators: string[] = []
  let aiScore = 0

  // Convert to lowercase for pattern matching
  const lowerText = text.toLowerCase()

  // Common AI phrases
  const aiPhrases = [
    'it is important to note',
    'it is worth noting',
    'in conclusion',
    'in summary',
    'furthermore',
    'moreover',
    'additionally',
    'consequently',
    'therefore',
    'it should be noted',
    'as mentioned earlier',
    'as previously stated',
    'delve into',
    'dive into',
    'in today\'s world',
    'in the modern era',
    'landscape of',
    'tapestry of',
    'realm of',
  ]

  let phraseCount = 0
  aiPhrases.forEach(phrase => {
    const regex = new RegExp(phrase, 'gi')
    const matches = lowerText.match(regex)
    if (matches) {
      phraseCount += matches.length
    }
  })

  if (phraseCount > 3) {
    aiScore += 20
    indicators.push(`Overuse of transitional phrases (${phraseCount} instances)`)
  }

  // Check for overly balanced structure
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  if (sentences.length > 5) {
    const lengths = sentences.map(s => s.split(/\s+/).length)
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length
    const deviation = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length
    const stdDev = Math.sqrt(deviation)

    // Very low standard deviation suggests AI
    if (stdDev < 5 && avgLength > 10) {
      aiScore += 15
      indicators.push('Sentences have unnaturally uniform length')
    }
  }

  // Check for repetitive sentence starters
  const sentenceStarters = sentences.map(s => s.trim().split(/\s+/)[0]?.toLowerCase() || '')
  const starterFrequency = sentenceStarters.reduce((acc, starter) => {
    acc[starter] = (acc[starter] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const maxRepetition = Math.max(...Object.values(starterFrequency))
  if (maxRepetition > sentences.length * 0.3) {
    aiScore += 15
    indicators.push('Repetitive sentence starters')
  }

  // Check for overly formal or generic language
  const formalWords = ['utilize', 'leverage', 'facilitate', 'optimize', 'enhance', 'implement']
  let formalCount = 0
  formalWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    const matches = lowerText.match(regex)
    if (matches) formalCount += matches.length
  })

  if (formalCount > 5) {
    aiScore += 10
    indicators.push('High use of formal business jargon')
  }

  // Check for lack of personal pronouns (AI tends to avoid first person)
  const personalPronouns = lowerText.match(/\b(i|me|my|mine|we|us|our|ours)\b/g) || []
  const wordCount = text.split(/\s+/).length
  const pronounRatio = personalPronouns.length / wordCount

  if (pronounRatio < 0.01 && wordCount > 200) {
    aiScore += 10
    indicators.push('Lacks personal voice and pronouns')
  }

  // Check for perfect grammar (AI rarely makes mistakes)
  const commonMistakes = [
    /\bthere\s+is\s+many\b/i,
    /\bhe\s+don't\b/i,
    /\bshould\s+of\b/i,
  ]

  const hasHumanErrors = commonMistakes.some(pattern => pattern.test(text))
  if (!hasHumanErrors && wordCount > 300) {
    aiScore += 10
    indicators.push('No common grammatical errors (unusually perfect)')
  }

  return { score: Math.min(aiScore, 100), indicators }
}

/**
 * Calculate comprehensive AI detection score
 */
export function detectAIContent(htmlContent: string): AIDetectionScore {
  // Strip HTML
  const plainText = htmlContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .trim()

  if (plainText.length < 50) {
    return {
      score: 0,
      confidence: 'low',
      indicators: ['Content too short to analyze'],
      humanLikelihood: 100,
      perplexity: 0,
      burstiness: 0,
    }
  }

  const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 10)

  // Calculate metrics
  const perplexity = calculatePerplexity(sentences)
  const burstiness = calculateBurstiness(sentences)
  const patternAnalysis = detectAIPatterns(plainText)

  // Combine scores
  // Low perplexity and low burstiness suggest AI
  let aiScore = patternAnalysis.score

  if (perplexity < 30) {
    aiScore += 15
    patternAnalysis.indicators.push('Low text perplexity (predictable word patterns)')
  }

  if (burstiness < 30) {
    aiScore += 15
    patternAnalysis.indicators.push('Low burstiness (uniform sentence structure)')
  }

  // Normalize score
  aiScore = Math.min(100, aiScore)
  const humanLikelihood = 100 - aiScore

  // Determine confidence
  let confidence: 'low' | 'medium' | 'high'
  if (aiScore > 70 || aiScore < 30) {
    confidence = 'high'
  } else if (aiScore > 50 || aiScore < 50) {
    confidence = 'medium'
  } else {
    confidence = 'low'
  }

  return {
    score: Math.round(aiScore),
    confidence,
    indicators: patternAnalysis.indicators,
    humanLikelihood: Math.round(humanLikelihood),
    perplexity: Math.round(perplexity),
    burstiness: Math.round(burstiness),
  }
}

/**
 * Get color for AI detection score
 */
export function getAIDetectionColor(score: number): string {
  if (score < 30) return 'green' // Likely human
  if (score < 50) return 'yellow' // Uncertain
  if (score < 70) return 'orange' // Possibly AI
  return 'red' // Likely AI
}

/**
 * Get recommendations based on AI detection
 */
export function getAIDetectionRecommendations(detection: AIDetectionScore): string[] {
  const recommendations: string[] = []

  if (detection.score > 60) {
    recommendations.push('Content may appear AI-generated. Consider:')

    if (detection.indicators.includes('Overuse of transitional phrases')) {
      recommendations.push('• Reduce formal transition words')
    }

    if (detection.indicators.includes('Sentences have unnaturally uniform length')) {
      recommendations.push('• Vary sentence length more naturally')
    }

    if (detection.indicators.includes('Lacks personal voice and pronouns')) {
      recommendations.push('• Add personal anecdotes and first-person perspective')
    }

    recommendations.push('• Include specific examples and real experiences')
    recommendations.push('• Add conversational elements and contractions')
    recommendations.push('• Make occasional minor imperfections (natural to humans)')
  } else if (detection.score > 40) {
    recommendations.push('Content shows some AI-like patterns')
    recommendations.push('• Add more personality and unique voice')
    recommendations.push('• Include specific, concrete examples')
  } else {
    recommendations.push('Content appears human-written ✓')
  }

  return recommendations
}
