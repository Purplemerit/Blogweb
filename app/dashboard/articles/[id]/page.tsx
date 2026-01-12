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
import {
  Save,
  ArrowLeft,
  Sparkles,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Send,
  List,
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

  // SEO fields
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [focusKeyword, setFocusKeyword] = useState("")

  // AI fields
  const [toneOfVoice, setToneOfVoice] = useState("professional")
  const [contentFramework, setContentFramework] = useState("standard")

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
      <div className={`flex-1 flex flex-col transition-all ${showAISidebar ? "mr-96" : "mr-0"}`}>
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

      {/* AI Sidebar */}
      {showAISidebar && (
        <div className="w-96 border-l border-neutral-200 bg-white overflow-y-auto fixed right-0 top-0 bottom-0 shadow-xl">
          <div className="p-8 space-y-8">
            <div className="border-b border-neutral-200 pb-6">
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Sparkles className="h-6 w-6 text-emerald-600" />
                </div>
                AI Writing Assistant
              </h2>
              <p className="text-sm text-neutral-600 mt-2">Generate content with AI</p>
            </div>

            {/* Tone and Framework */}
            <Card className="bg-neutral-50 border-neutral-200 p-5 space-y-5 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Settings</h3>
              <div>
                <label className="text-sm font-medium mb-2.5 block text-neutral-700">Tone of Voice</label>
                <select
                  value={toneOfVoice}
                  onChange={(e) => setToneOfVoice(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg bg-white text-neutral-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="authoritative">Authoritative</option>
                  <option value="conversational">Conversational</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2.5 block text-neutral-700">Content Framework</label>
                <select
                  value={contentFramework}
                  onChange={(e) => setContentFramework(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg bg-white text-neutral-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="standard">Standard</option>
                  <option value="problem-agitate-solve">Problem-Agitate-Solve</option>
                  <option value="how-to">How-To</option>
                  <option value="listicle">Listicle</option>
                </select>
              </div>
            </Card>

            {/* AI Actions */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 p-5 space-y-4 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-3">Quick Actions</h3>
              <Button
                variant="outline"
                className="w-full justify-start bg-white border-emerald-200 hover:bg-emerald-50 hover:border-emerald-600 text-emerald-700 px-4 py-5 h-auto rounded-lg font-medium shadow-sm"
                onClick={handleGenerateContent}
                disabled={generateContentLoading}
              >
                {generateContentLoading ? (
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5 mr-3" />
                )}
                Generate Full Article
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-white border-emerald-200 hover:bg-emerald-50 hover:border-emerald-600 text-emerald-700 px-4 py-5 h-auto rounded-lg font-medium shadow-sm"
                onClick={handleGenerateOutline}
                disabled={generateOutlineLoading}
              >
                {generateOutlineLoading ? (
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                ) : (
                  <List className="h-5 w-5 mr-3" />
                )}
                Generate Outline
              </Button>
            </Card>

            {/* SEO Settings */}
            <Card className="bg-neutral-50 border-neutral-200 p-5 space-y-5 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">SEO Settings</h3>

              <div>
                <label className="text-sm font-medium mb-2.5 block text-neutral-700">Focus Keyword</label>
                <Input
                  placeholder="e.g., content marketing"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  className="h-11 bg-white border-neutral-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2.5 block text-neutral-700">Meta Title</label>
                <Input
                  placeholder="Article meta title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="h-11 bg-white border-neutral-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <p className="text-xs text-neutral-500 mt-2 font-medium">
                  {metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2.5 block text-neutral-700">Meta Description</label>
                <textarea
                  placeholder="Article meta description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg bg-white min-h-[90px] text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <p className="text-xs text-neutral-500 mt-2 font-medium">
                  {metaDescription.length}/160 characters
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 bg-white border-neutral-200 hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-700 px-4 py-4 h-auto rounded-lg font-medium shadow-sm"
                  onClick={handleGenerateMetaDescription}
                  disabled={generateMetaLoading}
                >
                  {generateMetaLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate with AI
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2.5 block text-neutral-700">Excerpt</label>
                <textarea
                  placeholder="Brief summary of the article"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg bg-white min-h-[70px] text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </Card>

            {/* Content Analysis */}
            <Card className="bg-neutral-50 border-neutral-200 p-5 space-y-5 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Content Quality</h3>
              <ContentAnalysis content={content} />
            </Card>
          </div>
        </div>
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
