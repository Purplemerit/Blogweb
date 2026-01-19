"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/context/AuthContext"
import { PublishModal } from "@/components/PublishModal"
import RichTextEditor from "@/components/editor/RichTextEditor"
import ContentAnalysis from "@/components/ContentAnalysis"
import { AIModelSelector } from "@/components/AIModelSelector"
import {
  Save,
  ArrowLeft,
  Sparkles,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Send,
  List,
  Wand2,
  Image as ImageIcon,
  Target,
  Settings,
  FileText,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { marked } from "marked"

interface Article {
  id: string
  title: string
  content: string
  excerpt: string | null
  status: string
  toneOfVoice: string | null
  contentFramework: string | null
  metaTitle: string | null
  metaDescription: string | null
  focusKeyword: string | null
  wordCount: number
  readingTime: number
}

// Helper function to detect if content is markdown
const isMarkdown = (content: string): boolean => {
  const markdownPatterns = [
    /^#{1,6}\s/m,           // Headers
    /\*\*.*\*\*/,           // Bold
    /\*.*\*/,               // Italic
    /^\s*[-*+]\s/m,         // Unordered lists
    /^\s*\d+\.\s/m,         // Ordered lists
    /\[.*\]\(.*\)/,         // Links
    /```[\s\S]*```/,        // Code blocks
    /^\>/m,                 // Blockquotes
  ]
  return markdownPatterns.some(pattern => pattern.test(content))
}

// Helper function to convert markdown to HTML
const convertMarkdownToHtml = async (markdown: string): Promise<string> => {
  try {
    const html = await marked.parse(markdown)
    return html
  } catch (error) {
    console.error('Error converting markdown to HTML:', error)
    return markdown
  }
}

export default function ArticleEditorPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [showAISidebar, setShowAISidebar] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [generateContentLoading, setGenerateContentLoading] = useState(false)
  const [generateOutlineLoading, setGenerateOutlineLoading] = useState(false)
  const [generateMetaLoading, setGenerateMetaLoading] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [activeAITab, setActiveAITab] = useState<'content' | 'images' | 'seo'>('content')

  // SEO fields
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [focusKeyword, setFocusKeyword] = useState("")

  // AI fields
  const [toneOfVoice, setToneOfVoice] = useState("professional")
  const [contentFramework, setContentFramework] = useState("standard")
  const [selectedAIModel, setSelectedAIModel] = useState("")

  // Image generation fields
  const [imagePrompt, setImagePrompt] = useState("")
  const [imageGenerating, setImageGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<any[]>([])
  const [selectedImageModel, setSelectedImageModel] = useState("")

  // SEO fields - separate model selection
  const [selectedSEOModel, setSelectedSEOModel] = useState("")
  const [seoAnalyzing, setSeoAnalyzing] = useState(false)
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && articleId !== "new") {
      fetchArticle()
    } else if (articleId === "new") {
      setLoading(false)
    }
  }, [user, articleId])

  // Auto-save every 2 minutes if there are unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges && articleId !== "new") {
      const autoSaveInterval = setInterval(() => {
        handleSave()
      }, 120000) // 2 minutes

      return () => clearInterval(autoSaveInterval)
    }
  }, [hasUnsavedChanges, articleId])

  // Track unsaved changes
  useEffect(() => {
    if (article) {
      setHasUnsavedChanges(true)
    }
  }, [title, content, excerpt])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("accessToken")

      const response = await fetch(`/api/articles/${articleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        const articleData = data.data.article
        setArticle(articleData)
        setTitle(articleData.title)
        setContent(articleData.content || "")
        setExcerpt(articleData.excerpt || "")
        setMetaTitle(articleData.metaTitle || "")
        setMetaDescription(articleData.metaDescription || "")
        setFocusKeyword(articleData.focusKeyword || "")
        setToneOfVoice(articleData.toneOfVoice || "professional")
        setContentFramework(articleData.contentFramework || "standard")
        setHasUnsavedChanges(false)
      } else {
        toast.error(data.error || "Failed to fetch article")
        router.push("/dashboard/articles")
      }
    } catch (error) {
      console.error("Error fetching article:", error)
      toast.error("Failed to load article")
      router.push("/dashboard/articles")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = useCallback(async (status?: string) => {
    if (!title.trim()) {
      toast.error("Please enter a title")
      return
    }

    try {
      setSaving(true)
      const token = localStorage.getItem("accessToken")

      const payload = {
        title,
        content,
        excerpt,
        metaTitle,
        metaDescription,
        focusKeyword,
        toneOfVoice,
        contentFramework,
        ...(status && { status }),
      }

      let response
      if (articleId === "new") {
        response = await fetch("/api/articles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch(`/api/articles/${articleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
      }

      const data = await response.json()

      if (data.success) {
        toast.success(
          status === "PUBLISHED"
            ? "Article published successfully"
            : "Article saved successfully"
        )

        if (articleId === "new") {
          router.push(`/dashboard/articles/${data.data.article.id}`)
        } else {
          setArticle(data.data.article)
        }
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
      } else {
        toast.error(data.error || "Failed to save article")
      }
    } catch (error) {
      console.error("Error saving article:", error)
      toast.error("Failed to save article")
    } finally {
      setSaving(false)
    }
  }, [title, content, excerpt, metaTitle, metaDescription, focusKeyword, toneOfVoice, contentFramework, articleId, router])

  const handlePublishClick = async () => {
    // First save the article if it's new or has changes
    if (!title.trim()) {
      toast.error("Please enter a title before publishing")
      return
    }

    // Auto-save before opening publish modal
    await handleSave()

    // Only open modal if we have a valid article ID
    if (articleId !== "new") {
      setShowPublishModal(true)
    }
  }

  const handleGenerateContent = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title first")
      return
    }

    try {
      setGenerateContentLoading(true)
      const token = localStorage.getItem("accessToken")

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "blog-content",
          title,
          keywords: focusKeyword ? [focusKeyword] : [],
          toneOfVoice,
          contentFramework,
          wordCount: 1000,
          model: selectedAIModel || undefined, // Include selected AI model
        }),
      })

      const data = await response.json()

      if (data.success) {
        let processedContent = data.data.result

        // Convert markdown to HTML if needed
        if (isMarkdown(processedContent)) {
          processedContent = await convertMarkdownToHtml(processedContent)
        }

        setContent(processedContent)
        toast.success("Content generated successfully")
      } else {
        toast.error(data.error || "Failed to generate content")
      }
    } catch (error) {
      console.error("Error generating content:", error)
      toast.error("Failed to generate content")
    } finally {
      setGenerateContentLoading(false)
    }
  }

  const handleGenerateOutline = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title first")
      return
    }

    try {
      setGenerateOutlineLoading(true)
      const token = localStorage.getItem("accessToken")

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "outline",
          topic: title,
          sections: 5,
          model: selectedAIModel || undefined, // Include selected AI model
        }),
      })

      const data = await response.json()

      if (data.success) {
        let outline = data.data.result

        // If result is an array, join it
        if (Array.isArray(outline)) {
          outline = outline.join("\n\n")
        }

        // Convert markdown to HTML if needed
        let processedOutline = outline
        if (isMarkdown(outline)) {
          processedOutline = await convertMarkdownToHtml(outline)
        }

        setContent(processedOutline)
        toast.success("Outline generated successfully")
      } else {
        toast.error(data.error || "Failed to generate outline")
      }
    } catch (error) {
      console.error("Error generating outline:", error)
      toast.error("Failed to generate outline")
    } finally {
      setGenerateOutlineLoading(false)
    }
  }

  const handleGenerateMetaDescription = async () => {
    // Strip HTML tags to get plain text
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    if (!plainText) {
      toast.error("Please write some content first")
      return
    }

    try {
      setGenerateMetaLoading(true)
      const token = localStorage.getItem("accessToken")

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "meta-description",
          content: plainText,
          maxLength: 160,
          model: selectedSEOModel || selectedAIModel || undefined, // Use SEO model first, then fallback
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMetaDescription(data.data.result)
        toast.success("Meta description generated")
      } else {
        toast.error(data.error || "Failed to generate meta description")
      }
    } catch (error) {
      console.error("Error generating meta description:", error)
      toast.error("Failed to generate meta description")
    } finally {
      setGenerateMetaLoading(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error("Please enter an image description")
      return
    }

    try {
      setImageGenerating(true)
      const token = localStorage.getItem("accessToken")

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "image",
          prompt: imagePrompt,
          model: selectedImageModel || "gemini-1.5-flash", // Use selected model or default to free
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add generated image to the list - handle both data.result and direct data
        const imageData = data.data.result || data.data
        console.log('Generated image data:', imageData)
        setGeneratedImages(prev => [imageData, ...prev])
        toast.success("Image generated successfully")

        // Clear the prompt for next generation
        setImagePrompt("")
      } else {
        toast.error(data.error || "Failed to generate image")
      }
    } catch (error) {
      console.error("Error generating image:", error)
      toast.error("Failed to generate image")
    } finally {
      setImageGenerating(false)
    }
  }

  const handleAnalyzeSEO = async () => {
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    if (!plainText) {
      toast.error("Please write some content first")
      return
    }

    try {
      setSeoAnalyzing(true)
      const token = localStorage.getItem("accessToken")

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "seo-analysis",
          content: plainText,
          title: title,
          model: selectedSEOModel || "gemini-1.5-flash",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSeoAnalysis(data.data.result)
        toast.success("SEO analysis complete")
      } else {
        toast.error(data.error || "Failed to analyze SEO")
      }
    } catch (error) {
      console.error("Error analyzing SEO:", error)
      toast.error("Failed to analyze SEO")
    } finally {
      setSeoAnalyzing(false)
    }
  }

  const getWordCount = () => {
    // Strip HTML tags and count words
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    return plainText.split(/\s+/).filter(Boolean).length
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f1e8]">
      {/* Main Editor */}
      <div className={`flex-1 flex flex-col transition-all ${showAISidebar ? "md:mr-96" : "mr-0"}`}>
        {/* Top Bar */}
        <div className="border-b border-neutral-200 bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard/articles")}
                className="hover:bg-neutral-100 rounded-lg p-2"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-700" />
              </Button>
              <div className="flex items-center gap-4">
                {article?.status && (
                  <Badge variant="outline" className="px-3 py-1.5 rounded-lg font-medium text-xs">
                    {article.status}
                  </Badge>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-lg">
                  <span className="text-sm font-semibold text-neutral-900">{getWordCount()}</span>
                  <span className="text-sm text-neutral-500">words</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {lastSaved && (
                <span className="text-xs text-gray-500">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              {hasUnsavedChanges && !saving && (
                <span className="text-xs text-orange-600 font-medium">
                  Unsaved changes
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAISidebar(!showAISidebar)}
                className="hover:bg-neutral-100 rounded-lg p-2"
                title={showAISidebar ? "Hide AI Assistant" : "Show AI Assistant"}
              >
                {showAISidebar ? <ChevronRight className="h-5 w-5 text-neutral-700" /> : <ChevronLeft className="h-5 w-5 text-neutral-700" />}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSave()}
                disabled={saving}
                className="bg-white border-neutral-200 hover:bg-neutral-50 px-5 py-5 h-auto rounded-lg font-medium shadow-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                onClick={handlePublishClick}
                disabled={saving || articleId === "new"}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-5 h-auto rounded-lg font-medium shadow-sm disabled:bg-neutral-400"
              >
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-6xl mx-auto py-8 px-8">
            <Input
              placeholder="Article Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-5xl font-bold border-none focus-visible:ring-0 px-0 mb-8 text-neutral-900 placeholder:text-neutral-300"
            />
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your article..."
              onSave={() => handleSave()}
            />
          </div>
        </div>
      </div>

      {/* AI Sidebar - Desktop: Fixed right sidebar, Mobile: Full screen overlay */}
      {showAISidebar && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowAISidebar(false)}
          />

          {/* Sidebar Content */}
          <div className="w-full md:w-96 border-l border-neutral-200 bg-white overflow-hidden fixed right-0 top-0 bottom-0 shadow-xl flex flex-col z-50 md:z-auto">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-neutral-200 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-emerald-600" />
                AI Assistant
              </h2>
              {/* Close button for mobile */}
              <button
                onClick={() => setShowAISidebar(false)}
                className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Close AI Assistant"
              >
                <X className="h-5 w-5 text-neutral-700" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveAITab('content')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeAITab === 'content'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                <FileText className="h-4 w-4" />
                Content
              </button>
              <button
                onClick={() => setActiveAITab('images')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeAITab === 'images'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                Images
              </button>
              <button
                onClick={() => setActiveAITab('seo')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeAITab === 'seo'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                <Target className="h-4 w-4" />
                SEO
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* CONTENT TAB */}
            {activeAITab === 'content' && (
              <div className="p-6 space-y-5">
                {/* AI Model Selector */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 p-4 rounded-xl">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    AI Model
                  </h3>
                  <AIModelSelector
                    value={selectedAIModel}
                    onChange={setSelectedAIModel}
                    className="w-full"
                  />
                </div>

                {/* Writing Settings */}
                <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                    <Settings className="h-4 w-4 text-neutral-600" />
                    Settings
                  </h3>
                  <div>
                    <label className="text-xs font-medium mb-2 block text-neutral-700">Tone of Voice</label>
                    <select
                      value={toneOfVoice}
                      onChange={(e) => setToneOfVoice(e.target.value)}
                      className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="authoritative">Authoritative</option>
                      <option value="conversational">Conversational</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-2 block text-neutral-700">Content Framework</label>
                    <select
                      value={contentFramework}
                      onChange={(e) => setContentFramework(e.target.value)}
                      className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="standard">Standard</option>
                      <option value="problem-agitate-solve">Problem-Agitate-Solve</option>
                      <option value="how-to">How-To</option>
                      <option value="listicle">Listicle</option>
                    </select>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-emerald-600" />
                    Generate
                  </h3>
                  <Button
                    variant="outline"
                    className="w-full justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 px-4 py-6 h-auto rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                    onClick={handleGenerateContent}
                    disabled={generateContentLoading}
                  >
                    {generateContentLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate Full Article
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-center bg-white border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-600 text-emerald-700 px-4 py-4 h-auto rounded-lg font-semibold"
                    onClick={handleGenerateOutline}
                    disabled={generateOutlineLoading}
                  >
                    {generateOutlineLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <List className="h-5 w-5 mr-2" />
                        Generate Outline
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* IMAGES TAB */}
            {activeAITab === 'images' && (
              <div className="p-6 space-y-5">
                {/* AI Model Selector for Images */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-xl">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    AI Model for Images
                  </h3>
                  <AIModelSelector
                    value={selectedImageModel}
                    onChange={setSelectedImageModel}
                    className="w-full"
                  />
                  <p className="text-xs text-neutral-600 mt-2">
                    💡 Free models generate placeholder images. Premium models create real AI images.
                  </p>
                </div>

                {/* Image Prompt */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide block">
                    Describe Your Image
                  </label>
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="e.g., A futuristic city with flying cars, sunset lighting, digital art style..."
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg bg-white min-h-[120px] text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <Button
                    onClick={handleGenerateImage}
                    disabled={imageGenerating || !imagePrompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-6 h-auto rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    {imageGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generating Image...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </div>

                {/* Generated Images */}
                {generatedImages.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                      Generated Images ({generatedImages.length})
                    </h3>
                    <div className="space-y-3">
                      {generatedImages.map((img, idx) => (
                        <div key={idx} className="bg-white border-2 border-purple-200 rounded-xl p-3 hover:shadow-lg transition-all">
                          {img && img.url ? (
                            <>
                              <img
                                src={img.url}
                                alt={img.prompt || `Generated image ${idx + 1}`}
                                className="w-full rounded-lg mb-3 border border-neutral-200"
                                onError={(e) => {
                                  console.error('Image failed to load:', img.url)
                                  toast.error("Failed to load image")
                                }}
                              />
                              <p className="text-xs text-neutral-600 mb-2 line-clamp-2" title={img.prompt}>
                                <strong>Prompt:</strong> {img.prompt}
                              </p>
                              {img.message && (
                                <p className="text-xs text-purple-600 mb-2 italic">
                                  {img.message}
                                </p>
                              )}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 text-xs border-purple-200 hover:bg-purple-50"
                                  onClick={() => {
                                    if (img.url) {
                                      setContent(prev => prev + `<p><img src="${img.url}" alt="${img.prompt || 'Generated image'}" style="max-width: 100%; height: auto;" /></p>`)
                                      toast.success("Image inserted into article")
                                    }
                                  }}
                                >
                                  Insert into Article
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs border-neutral-200 hover:bg-neutral-50"
                                  onClick={() => {
                                    setGeneratedImages(prev => prev.filter((_, i) => i !== idx))
                                    toast.success("Image removed")
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="text-xs text-red-500">
                              Invalid image data
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SEO TAB */}
            {activeAITab === 'seo' && (
              <div className="p-6 space-y-5">
                {/* AI Model Selector for SEO */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-4 rounded-xl">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    AI Model for SEO
                  </h3>
                  <AIModelSelector
                    value={selectedSEOModel}
                    onChange={setSelectedSEOModel}
                    className="w-full"
                  />
                  <div className="mt-3 space-y-1.5 text-xs">
                    <p className="font-semibold text-neutral-700">SEO Quality by Model:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                        <span className="text-neutral-600">Gemini Flash: Basic</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <span className="text-neutral-600">GPT-4o Mini: Good</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                        <span className="text-neutral-600">GPT-4o: Advanced</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-neutral-600">Claude/GPT-4: Expert</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO Fields */}
                <div className="space-y-4">

                  <div>
                    <label className="text-xs font-medium mb-2 block text-neutral-700">Focus Keyword</label>
                    <Input
                      placeholder="e.g., content marketing"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      className="h-10 bg-white border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-2 block text-neutral-700">Meta Title</label>
                    <Input
                      placeholder="Article meta title"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="h-10 bg-white border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <p className="text-xs text-neutral-500 mt-1.5 flex items-center justify-between">
                      <span>{metaTitle.length}/60 characters</span>
                      <span className={metaTitle.length > 60 ? 'text-red-500 font-semibold' : metaTitle.length > 50 ? 'text-orange-500' : 'text-emerald-500'}>
                        {metaTitle.length <= 60 ? '✓' : '⚠'}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-2 block text-neutral-700">Meta Description</label>
                    <textarea
                      placeholder="Article meta description"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg bg-white min-h-[90px] text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-neutral-500 mt-1.5 flex items-center justify-between">
                      <span>{metaDescription.length}/160 characters</span>
                      <span className={metaDescription.length > 160 ? 'text-red-500 font-semibold' : metaDescription.length > 150 ? 'text-orange-500' : 'text-emerald-500'}>
                        {metaDescription.length <= 160 ? '✓' : '⚠'}
                      </span>
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white border-0 px-4 py-4 h-auto rounded-lg font-semibold"
                      onClick={handleGenerateMetaDescription}
                      disabled={generateMetaLoading}
                    >
                      {generateMetaLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-2 block text-neutral-700">Excerpt</label>
                    <textarea
                      placeholder="Brief summary of the article"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg bg-white min-h-[70px] text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* SEO Analysis Button */}
                <div>
                  <Button
                    onClick={handleAnalyzeSEO}
                    disabled={seoAnalyzing || !content.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-6 h-auto rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    {seoAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing SEO...
                      </>
                    ) : (
                      <>
                        <Target className="h-5 w-5 mr-2" />
                        Run SEO Analysis
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-neutral-500 mt-2 text-center">
                    Analysis depth depends on selected AI model
                  </p>
                </div>

                {/* SEO Analysis Results */}
                {seoAnalysis && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-4 rounded-xl">
                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide mb-3">
                      📊 SEO Analysis Results
                    </h3>
                    <div className="prose prose-sm max-w-none text-xs">
                      {typeof seoAnalysis === 'string' ? (
                        <p className="text-neutral-700 whitespace-pre-wrap">{seoAnalysis}</p>
                      ) : (
                        <div className="space-y-2">
                          {seoAnalysis.score && (
                            <div className="flex items-center justify-between p-2 bg-white rounded">
                              <span className="font-medium">SEO Score:</span>
                              <span className="font-bold text-blue-600">{seoAnalysis.score}/100</span>
                            </div>
                          )}
                          {seoAnalysis.recommendations && (
                            <div className="mt-2">
                              <p className="font-medium mb-1">Recommendations:</p>
                              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                                {Array.isArray(seoAnalysis.recommendations)
                                  ? seoAnalysis.recommendations.map((rec: string, idx: number) => (
                                      <li key={idx}>{rec}</li>
                                    ))
                                  : <li>{seoAnalysis.recommendations}</li>
                                }
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Content Analysis */}
                <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide mb-3">
                    Content Quality
                  </h3>
                  <ContentAnalysis content={content} />
                </div>
              </div>
            )}
          </div>
        </div>
        </>
      )}

      {/* Publish Modal */}
      <PublishModal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        articleId={articleId}
        articleTitle={title}
      />
    </div>
  )
}
