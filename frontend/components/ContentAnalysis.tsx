"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Brain,
  FileCheck,
  Copy,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
} from "lucide-react"
import { toast } from "sonner"

interface ContentAnalysisProps {
  content: string
  onAnalysisComplete?: (results: any) => void
}

export default function ContentAnalysis({ content, onAnalysisComplete }: ContentAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'readability' | 'grammar' | 'aiDetection' | 'plagiarism'>('overview')

  const analyzeContent = async () => {
    const plainText = content.replace(/<[^>]*>/g, ' ').trim()

    if (plainText.length < 50) {
      toast.error('Please write at least 50 characters to analyze')
      return
    }

    setAnalyzing(true)

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          analysisType: 'all',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.data)
        setActiveTab('overview')
        toast.success('Analysis complete!')
        if (onAnalysisComplete) {
          onAnalysisComplete(data.data)
        }
      } else {
        toast.error(data.error || 'Failed to analyze content')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze content')
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-emerald-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number): string => {
    if (score >= 80) return 'bg-green-100 border-green-300'
    if (score >= 60) return 'bg-emerald-100 border-emerald-300'
    if (score >= 40) return 'bg-yellow-100 border-yellow-300'
    return 'bg-red-100 border-red-300'
  }

  const getGradientBg = (score: number): string => {
    if (score >= 80) return 'from-green-50 to-emerald-50 border-green-200'
    if (score >= 60) return 'from-emerald-50 to-teal-50 border-emerald-200'
    if (score >= 40) return 'from-yellow-50 to-orange-50 border-yellow-200'
    return 'from-red-50 to-orange-50 border-red-200'
  }

  return (
    <div className="space-y-4">
      {/* Analyze Button */}
      <Button
        onClick={analyzeContent}
        disabled={analyzing || !content}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        size="lg"
      >
        {analyzing ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Analyze Content Quality
          </>
        )}
      </Button>

      {/* Results */}
      {results && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Tab Navigation */}
          <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('readability')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                activeTab === 'readability'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Read
            </button>
            <button
              onClick={() => setActiveTab('grammar')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                activeTab === 'grammar'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grammar
            </button>
            <button
              onClick={() => setActiveTab('aiDetection')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                activeTab === 'aiDetection'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              AI
            </button>
            <button
              onClick={() => setActiveTab('plagiarism')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                activeTab === 'plagiarism'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Unique
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Score Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Readability */}
                <Card className={`p-4 border-2 bg-gradient-to-br ${getGradientBg(results.readability?.fleschReadingEase || 0)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <BookOpen className={`h-5 w-5 ${getScoreColor(results.readability?.fleschReadingEase || 0)}`} />
                    <div className={`text-2xl font-bold ${getScoreColor(results.readability?.fleschReadingEase || 0)}`}>
                      {results.readability?.fleschReadingEase || 0}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-gray-700">Readability</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {results.readability?.readingLevel?.split('(')[0].trim()}
                  </div>
                </Card>

                {/* Grammar */}
                <Card className={`p-4 border-2 bg-gradient-to-br ${getGradientBg(results.grammar?.score || 0)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <FileCheck className={`h-5 w-5 ${getScoreColor(results.grammar?.score || 0)}`} />
                    <div className={`text-2xl font-bold ${getScoreColor(results.grammar?.score || 0)}`}>
                      {results.grammar?.score || 0}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-gray-700">Grammar</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {results.grammar?.errorCount || 0} errors
                  </div>
                </Card>

                {/* AI Detection */}
                <Card className={`p-4 border-2 bg-gradient-to-br ${getGradientBg(results.aiDetection?.humanLikelihood || 0)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <Brain className={`h-5 w-5 ${getScoreColor(results.aiDetection?.humanLikelihood || 0)}`} />
                    <div className={`text-2xl font-bold ${getScoreColor(results.aiDetection?.humanLikelihood || 0)}`}>
                      {results.aiDetection?.humanLikelihood || 0}%
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-gray-700">Human-Like</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {results.aiDetection?.confidence} confidence
                  </div>
                </Card>

                {/* Plagiarism */}
                <Card className={`p-4 border-2 bg-gradient-to-br ${getGradientBg(results.plagiarism?.uniquenessScore || 0)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <Copy className={`h-5 w-5 ${getScoreColor(results.plagiarism?.uniquenessScore || 0)}`} />
                    <div className={`text-2xl font-bold ${getScoreColor(results.plagiarism?.uniquenessScore || 0)}`}>
                      {results.plagiarism?.uniquenessScore || 0}%
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-gray-700">Unique</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {results.plagiarism?.matches?.length || 0} matches
                  </div>
                </Card>
              </div>

              {/* Quick Stats */}
              <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="text-xs text-gray-600">Reading Time</div>
                      <div className="text-sm font-bold text-gray-900">
                        {results.readability?.estimatedReadingTime || 0} min
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="text-xs text-gray-600">Grade Level</div>
                      <div className="text-sm font-bold text-gray-900">
                        {results.readability?.averageGradeLevel || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Overall Status */}
              <Card className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                <div className="flex items-start gap-3">
                  {getOverallScore() >= 70 ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : getOverallScore() >= 50 ? (
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {getOverallScore() >= 70
                        ? 'Excellent Content Quality! 🎉'
                        : getOverallScore() >= 50
                        ? 'Good Content - Some Improvements Needed'
                        : 'Content Needs Significant Improvement'}
                    </div>
                    <div className="text-xs text-gray-600">
                      Overall Score: <span className="font-bold">{getOverallScore()}/100</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Readability Tab */}
          {activeTab === 'readability' && results.readability && (
            <div className="space-y-3 animate-in fade-in duration-300 w-full overflow-hidden">
              <Card className={`p-3 border-2 bg-gradient-to-br ${getGradientBg(results.readability.fleschReadingEase)} w-full`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <h3 className="text-xs font-bold text-gray-900 truncate">Readability</h3>
                  </div>
                  <div className={`text-2xl font-black ${getScoreColor(results.readability.fleschReadingEase)} flex-shrink-0`}>
                    {results.readability.fleschReadingEase}
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-700 mb-2 truncate">
                  {results.readability.readingLevel}
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      results.readability.fleschReadingEase >= 80
                        ? 'bg-green-500'
                        : results.readability.fleschReadingEase >= 60
                        ? 'bg-emerald-500'
                        : results.readability.fleschReadingEase >= 40
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    } transition-all duration-500`}
                    style={{ width: `${results.readability.fleschReadingEase}%` }}
                  />
                </div>
              </Card>

              <Card className="p-3 bg-white border border-gray-200 w-full">
                <h4 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Metrics</h4>
                <div className="space-y-1.5">
                  {[
                    { label: 'Grade Level', value: results.readability.averageGradeLevel },
                    { label: 'Flesch-Kincaid', value: results.readability.fleschKincaid },
                    { label: 'SMOG Index', value: results.readability.smogIndex },
                    { label: 'Reading Time', value: `${results.readability.estimatedReadingTime} min` },
                  ].map((metric, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                      <span className="text-xs text-gray-600 truncate">{metric.label}</span>
                      <span className="text-xs font-bold text-gray-900 flex-shrink-0 ml-2">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-3 bg-blue-50 border border-blue-200 w-full">
                <div className="flex items-start gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">Tips</h4>
                </div>
                <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {results.readability.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-xs text-blue-800 flex items-start gap-1.5">
                      <span className="text-blue-500 flex-shrink-0">•</span>
                      <span className="break-words">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}

          {/* Grammar Tab */}
          {activeTab === 'grammar' && results.grammar && (
            <div className="space-y-3 animate-in fade-in duration-300 w-full overflow-hidden">
              <Card className={`p-3 border-2 bg-gradient-to-br ${getGradientBg(results.grammar.score)} w-full`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCheck className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <h3 className="text-xs font-bold text-gray-900 truncate">Grammar</h3>
                  </div>
                  <div className={`text-2xl font-black ${getScoreColor(results.grammar.score)} flex-shrink-0`}>
                    {results.grammar.score}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center p-1.5 bg-white/50 rounded-lg">
                    <div className={`text-base font-bold ${results.grammar.errorCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {results.grammar.errorCount}
                    </div>
                    <div className="text-xs text-gray-600 truncate">Errors</div>
                  </div>
                  <div className="text-center p-1.5 bg-white/50 rounded-lg">
                    <div className={`text-base font-bold ${results.grammar.warningCount > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {results.grammar.warningCount}
                    </div>
                    <div className="text-xs text-gray-600 truncate">Warns</div>
                  </div>
                  <div className="text-center p-1.5 bg-white/50 rounded-lg">
                    <div className="text-base font-bold text-blue-600">
                      {results.grammar.infoCount}
                    </div>
                    <div className="text-xs text-gray-600 truncate">Tips</div>
                  </div>
                </div>
              </Card>

              {results.grammar.issues && results.grammar.issues.length > 0 && (
                <Card className="p-3 bg-white border border-gray-200 w-full">
                  <h4 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Issues ({results.grammar.issues.length})
                  </h4>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {results.grammar.issues.slice(0, 10).map((issue: any, i: number) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${
                          issue.severity === 'error'
                            ? 'bg-red-50 border-red-200'
                            : issue.severity === 'warning'
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-1">
                          {issue.severity === 'error' && <XCircle className="h-3 w-3 text-red-600 flex-shrink-0 mt-0.5" />}
                          {issue.severity === 'warning' && <AlertTriangle className="h-3 w-3 text-yellow-600 flex-shrink-0 mt-0.5" />}
                          {issue.severity === 'info' && <Info className="h-3 w-3 text-blue-600 flex-shrink-0 mt-0.5" />}
                          <span className="text-xs font-semibold text-gray-900 break-words">{issue.shortMessage}</span>
                        </div>
                        {issue.replacements && issue.replacements.length > 0 && (
                          <div className="ml-5 text-xs text-gray-700 break-words">
                            <span className="font-medium">Try:</span> {issue.replacements.slice(0, 3).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <Card className="p-3 bg-green-50 border border-green-200 w-full">
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <h4 className="text-xs font-bold text-green-900 uppercase tracking-wide">Tips</h4>
                </div>
                <ul className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {results.grammar.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-xs text-green-800 flex items-start gap-1.5">
                      <span className="text-green-500 flex-shrink-0">•</span>
                      <span className="break-words">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}

          {/* AI Detection Tab */}
          {activeTab === 'aiDetection' && results.aiDetection && (
            <div className="space-y-3 animate-in fade-in duration-300 w-full overflow-hidden">
              <Card className={`p-3 border-2 bg-gradient-to-br ${getGradientBg(results.aiDetection.humanLikelihood)} w-full`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Brain className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <h3 className="text-xs font-bold text-gray-900 truncate">Human-Like</h3>
                  </div>
                  <div className={`text-2xl font-black ${getScoreColor(results.aiDetection.humanLikelihood)} flex-shrink-0`}>
                    {results.aiDetection.humanLikelihood}%
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-center p-1.5 bg-white/50 rounded-lg">
                    <div className="text-sm font-bold text-gray-900">{results.aiDetection.perplexity}</div>
                    <div className="text-xs text-gray-600 truncate">Perplexity</div>
                  </div>
                  <div className="text-center p-1.5 bg-white/50 rounded-lg">
                    <div className="text-sm font-bold text-gray-900">{results.aiDetection.burstiness}</div>
                    <div className="text-xs text-gray-600 truncate">Burstiness</div>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-white border border-gray-200 w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wide truncate">AI Likelihood</span>
                  <Badge variant={results.aiDetection.score > 60 ? 'destructive' : 'default'} className="flex-shrink-0">
                    {results.aiDetection.score}%
                  </Badge>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      results.aiDetection.score > 60 ? 'bg-red-500' : 'bg-green-500'
                    } transition-all duration-500`}
                    style={{ width: `${results.aiDetection.score}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-600 text-center">
                  Confidence: <span className="font-semibold capitalize">{results.aiDetection.confidence}</span>
                </div>
              </Card>

              {results.aiDetection.indicators && results.aiDetection.indicators.length > 0 && (
                <Card className="p-3 bg-orange-50 border border-orange-200 w-full">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <h4 className="text-xs font-bold text-orange-900 uppercase tracking-wide">AI Patterns</h4>
                  </div>
                  <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {results.aiDetection.indicators.map((indicator: string, i: number) => (
                      <li key={i} className="text-xs text-orange-800 flex items-start gap-1.5">
                        <span className="text-orange-500 flex-shrink-0">•</span>
                        <span className="break-words">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              <Card className="p-3 bg-purple-50 border border-purple-200 w-full">
                <div className="flex items-start gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wide">Tips</h4>
                </div>
                <ul className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {results.aiDetection.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-xs text-purple-800 flex items-start gap-1.5">
                      <span className="text-purple-500 flex-shrink-0">•</span>
                      <span className="break-words">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}

          {/* Plagiarism Tab */}
          {activeTab === 'plagiarism' && results.plagiarism && (
            <div className="space-y-3 animate-in fade-in duration-300 w-full overflow-hidden">
              <Card className={`p-3 border-2 bg-gradient-to-br ${getGradientBg(results.plagiarism.uniquenessScore)} w-full`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Copy className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <h3 className="text-xs font-bold text-gray-900 truncate">Uniqueness</h3>
                  </div>
                  <div className={`text-2xl font-black ${getScoreColor(results.plagiarism.uniquenessScore)} flex-shrink-0`}>
                    {results.plagiarism.uniquenessScore}%
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full ${
                      results.plagiarism.uniquenessScore >= 80
                        ? 'bg-green-500'
                        : results.plagiarism.uniquenessScore >= 60
                        ? 'bg-emerald-500'
                        : 'bg-red-500'
                    } transition-all duration-500`}
                    style={{ width: `${results.plagiarism.uniquenessScore}%` }}
                  />
                </div>
              </Card>

              <Card className="p-3 bg-white border border-gray-200 w-full">
                <div className="grid grid-cols-2 gap-2">
                  <div className="min-w-0">
                    <div className="text-xs text-gray-600 mb-1 truncate">Plagiarism</div>
                    <div className={`text-xl font-bold ${results.plagiarism.score > 30 ? 'text-red-600' : 'text-green-600'}`}>
                      {results.plagiarism.score}%
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-600 mb-1 truncate">Matches</div>
                    <div className="text-xl font-bold text-gray-900">
                      {results.plagiarism.matches.length}
                    </div>
                  </div>
                </div>
              </Card>

              {results.plagiarism.matches && results.plagiarism.matches.length > 0 && (
                <Card className="p-3 bg-red-50 border border-red-200 w-full">
                  <h4 className="text-xs font-bold text-red-900 mb-2 uppercase tracking-wide">
                    Flagged ({results.plagiarism.matches.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {results.plagiarism.matches.slice(0, 5).map((match: any, i: number) => (
                      <div key={i} className="p-2 bg-white rounded-lg border border-red-300">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-3 w-3 text-red-600 flex-shrink-0" />
                          <span className="text-xs font-bold text-red-700">{match.similarity}% similar</span>
                        </div>
                        <div className="text-xs text-gray-700 italic line-clamp-2 break-words">
                          "{match.text}"
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <Card className="p-3 bg-cyan-50 border border-cyan-200 w-full">
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <h4 className="text-xs font-bold text-cyan-900 uppercase tracking-wide">Tips</h4>
                </div>
                <ul className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {results.plagiarism.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-xs text-cyan-800 flex items-start gap-1.5">
                      <span className="text-cyan-500 flex-shrink-0">•</span>
                      <span className="break-words">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )

  function getOverallScore(): number {
    if (!results) return 0
    const readability = results.readability?.fleschReadingEase || 0
    const grammar = results.grammar?.score || 0
    const human = results.aiDetection?.humanLikelihood || 0
    const unique = results.plagiarism?.uniquenessScore || 0
    return Math.round((readability + grammar + human + unique) / 4)
  }
}
