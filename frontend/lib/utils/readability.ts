/**
 * Readability Analysis Utilities
 * Implements multiple readability scoring algorithms
 */

interface ReadabilityScore {
  fleschKincaid: number // Grade level (lower is easier)
  fleschReadingEase: number // 0-100 (higher is easier)
  smogIndex: number // Grade level
  colemanLiauIndex: number // Grade level
  automatedReadabilityIndex: number // Grade level
  averageGradeLevel: number
  readingLevel: string // "Very Easy" to "Very Difficult"
  estimatedReadingTime: number // in minutes
}

interface TextStatistics {
  sentences: number
  words: number
  syllables: number
  characters: number
  complexWords: number // 3+ syllables
  paragraphs: number
}

/**
 * Count syllables in a word
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().trim()
  if (word.length <= 3) return 1

  // Remove non-alphabetic characters
  word = word.replace(/[^a-z]/g, '')

  // Special cases
  const specialCases: { [key: string]: number } = {
    'area': 3,
    'idea': 3,
    'rogue': 1,
  }

  if (specialCases[word]) {
    return specialCases[word]
  }

  // Count vowel groups
  let syllables = 0
  let previousWasVowel = false
  const vowels = 'aeiouy'

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i])

    if (isVowel && !previousWasVowel) {
      syllables++
    }

    previousWasVowel = isVowel
  }

  // Adjust for silent 'e'
  if (word.endsWith('e') && syllables > 1) {
    syllables--
  }

  // Ensure at least 1 syllable
  return Math.max(syllables, 1)
}

/**
 * Extract text statistics from content
 */
export function analyzeText(htmlContent: string): TextStatistics {
  // Strip HTML tags
  const plainText = htmlContent.replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .trim()

  // Count paragraphs
  const paragraphs = htmlContent.split(/<\/p>|<\/div>|<\/h[1-6]>|<br\s*\/?>/).length

  // Split into sentences (basic approach)
  const sentenceEnders = /[.!?]+/g
  const sentences = plainText.split(sentenceEnders).filter(s => s.trim().length > 0).length

  // Split into words
  const wordMatches = plainText.match(/\b[a-zA-Z]+\b/g) || []
  const words = wordMatches.length

  // Count syllables and complex words
  let syllables = 0
  let complexWords = 0

  wordMatches.forEach(word => {
    const syllableCount = countSyllables(word)
    syllables += syllableCount
    if (syllableCount >= 3) {
      complexWords++
    }
  })

  // Count characters (letters only)
  const characters = plainText.replace(/[^a-zA-Z]/g, '').length

  return {
    sentences: Math.max(sentences, 1),
    words: Math.max(words, 1),
    syllables: Math.max(syllables, 1),
    characters: Math.max(characters, 1),
    complexWords,
    paragraphs: Math.max(paragraphs, 1),
  }
}

/**
 * Calculate Flesch-Kincaid Grade Level
 * Formula: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
 */
function calculateFleschKincaid(stats: TextStatistics): number {
  const wordsPerSentence = stats.words / stats.sentences
  const syllablesPerWord = stats.syllables / stats.words

  const grade = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59

  return Math.max(0, Math.round(grade * 10) / 10)
}

/**
 * Calculate Flesch Reading Ease Score
 * Formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
 * Score: 0-100 (higher is easier)
 */
function calculateFleschReadingEase(stats: TextStatistics): number {
  const wordsPerSentence = stats.words / stats.sentences
  const syllablesPerWord = stats.syllables / stats.words

  const score = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord

  return Math.max(0, Math.min(100, Math.round(score * 10) / 10))
}

/**
 * Calculate SMOG Index (Simple Measure of Gobbledygook)
 * Formula: 1.0430 * sqrt(complexWords * (30/sentences)) + 3.1291
 */
function calculateSMOG(stats: TextStatistics): number {
  if (stats.sentences < 30) {
    // SMOG is most accurate with 30+ sentences, use approximation
    const polysyllableCount = stats.complexWords * (30 / Math.max(stats.sentences, 1))
    const grade = 1.0430 * Math.sqrt(polysyllableCount) + 3.1291
    return Math.max(0, Math.round(grade * 10) / 10)
  }

  const grade = 1.0430 * Math.sqrt(stats.complexWords * (30 / stats.sentences)) + 3.1291
  return Math.max(0, Math.round(grade * 10) / 10)
}

/**
 * Calculate Coleman-Liau Index
 * Formula: 0.0588 * L - 0.296 * S - 15.8
 * L = average number of letters per 100 words
 * S = average number of sentences per 100 words
 */
function calculateColemanLiau(stats: TextStatistics): number {
  const L = (stats.characters / stats.words) * 100
  const S = (stats.sentences / stats.words) * 100

  const grade = 0.0588 * L - 0.296 * S - 15.8

  return Math.max(0, Math.round(grade * 10) / 10)
}

/**
 * Calculate Automated Readability Index (ARI)
 * Formula: 4.71 * (characters/words) + 0.5 * (words/sentences) - 21.43
 */
function calculateARI(stats: TextStatistics): number {
  const charactersPerWord = stats.characters / stats.words
  const wordsPerSentence = stats.words / stats.sentences

  const grade = 4.71 * charactersPerWord + 0.5 * wordsPerSentence - 21.43

  return Math.max(0, Math.round(grade * 10) / 10)
}

/**
 * Get reading level description from grade level
 */
function getReadingLevel(gradeLevel: number): string {
  if (gradeLevel <= 5) return 'Very Easy (Elementary)'
  if (gradeLevel <= 8) return 'Easy (Middle School)'
  if (gradeLevel <= 10) return 'Fairly Easy (High School)'
  if (gradeLevel <= 12) return 'Standard (High School Senior)'
  if (gradeLevel <= 14) return 'Fairly Difficult (College)'
  if (gradeLevel <= 16) return 'Difficult (College Graduate)'
  return 'Very Difficult (Professional)'
}

/**
 * Estimate reading time in minutes (average adult reading speed: 238 words/min)
 */
function estimateReadingTime(wordCount: number): number {
  const wordsPerMinute = 238
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

/**
 * Calculate comprehensive readability score
 */
export function calculateReadabilityScore(htmlContent: string): ReadabilityScore {
  const stats = analyzeText(htmlContent)

  const fleschKincaid = calculateFleschKincaid(stats)
  const fleschReadingEase = calculateFleschReadingEase(stats)
  const smogIndex = calculateSMOG(stats)
  const colemanLiauIndex = calculateColemanLiau(stats)
  const automatedReadabilityIndex = calculateARI(stats)

  // Average of grade-level scores
  const averageGradeLevel = Math.round(
    (fleschKincaid + smogIndex + colemanLiauIndex + automatedReadabilityIndex) / 4 * 10
  ) / 10

  return {
    fleschKincaid,
    fleschReadingEase,
    smogIndex,
    colemanLiauIndex,
    automatedReadabilityIndex,
    averageGradeLevel,
    readingLevel: getReadingLevel(averageGradeLevel),
    estimatedReadingTime: estimateReadingTime(stats.words),
  }
}

/**
 * Get color code for readability score (for UI display)
 */
export function getReadabilityColor(fleschReadingEase: number): string {
  if (fleschReadingEase >= 80) return 'green' // Very Easy
  if (fleschReadingEase >= 60) return 'emerald' // Easy
  if (fleschReadingEase >= 50) return 'yellow' // Fairly Easy
  if (fleschReadingEase >= 30) return 'orange' // Difficult
  return 'red' // Very Difficult
}

/**
 * Get recommendations based on readability score
 */
export function getReadabilityRecommendations(score: ReadabilityScore): string[] {
  const recommendations: string[] = []

  if (score.fleschReadingEase < 60) {
    recommendations.push('Consider using shorter sentences to improve readability')
  }

  if (score.fleschReadingEase < 50) {
    recommendations.push('Replace complex words with simpler alternatives where possible')
  }

  if (score.averageGradeLevel > 12) {
    recommendations.push('Content may be too advanced for general audience')
    recommendations.push('Try breaking down complex concepts into simpler explanations')
  }

  if (score.averageGradeLevel < 6) {
    recommendations.push('Content might be too simple for your target audience')
  }

  if (recommendations.length === 0) {
    recommendations.push('Readability is good! Content is accessible to your audience.')
  }

  return recommendations
}
