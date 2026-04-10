import { NextRequest, NextResponse } from "next/server"
import { calculateReadabilityScore, getReadabilityRecommendations } from "@/lib/utils/readability"
import { detectAIContent, getAIDetectionRecommendations } from "@/lib/utils/aiDetection"
import { checkGrammar, getGrammarRecommendations } from "@/lib/utils/grammarCheck"
import { checkPlagiarism } from "@/lib/utils/plagiarismCheck"

export async function POST(request: NextRequest) {
  try {
    const { content, analysisType, language = "en-US" } = await request.json()

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    // Strip HTML for word count
    const plainText = content.replace(/<[^>]*>/g, ' ').trim()
    if (plainText.length < 10) {
      return NextResponse.json(
        { error: "Content too short to analyze" },
        { status: 400 }
      )
    }

    const results: any = {
      wordCount: plainText.split(/\s+/).filter(Boolean).length,
    }

    // Perform requested analysis types
    if (!analysisType || analysisType === "all" || analysisType === "readability") {
      const readabilityScore = calculateReadabilityScore(content)
      const readabilityRecommendations = getReadabilityRecommendations(readabilityScore)

      results.readability = {
        ...readabilityScore,
        recommendations: readabilityRecommendations,
      }
    }

    if (!analysisType || analysisType === "all" || analysisType === "aiDetection") {
      const aiDetection = detectAIContent(content)
      const aiRecommendations = getAIDetectionRecommendations(aiDetection)

      results.aiDetection = {
        ...aiDetection,
        recommendations: aiRecommendations,
      }
    }

    if (!analysisType || analysisType === "all" || analysisType === "grammar") {
      const grammarCheck = await checkGrammar(content, language)
      const grammarRecommendations = getGrammarRecommendations(grammarCheck)

      results.grammar = {
        ...grammarCheck,
        recommendations: grammarRecommendations,
      }
    }

    if (!analysisType || analysisType === "all" || analysisType === "plagiarism") {
      const plagiarismCheck = await checkPlagiarism(content)

      results.plagiarism = plagiarismCheck
    }

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error: any) {
    console.error("Content analysis error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to analyze content" },
      { status: 500 }
    )
  }
}
