"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/context/AuthContext"
import { PublishModal } from "@/components/PublishModal"
import RichTextEditor from "@/components/editor/RichTextEditor"
import { AIModelSelector } from "@/components/AIModelSelector"
import {
    Save,
    ArrowLeft,
    Sparkles,
    Loader2,
    ChevronRight,
    Send,
    Wand2,
    Image as ImageIcon,
    Target,
    Settings,
    FileText,
    X,
    Type,
    Layout,
    RefreshCw,
    Eye
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

const isMarkdown = (content: string): boolean => {
    const patterns = [/^#{1,6}\s/m, /\*\*.*\*\*/, /\*.*\*/, /^\s*[-*+]\s/m, /^\s*\d+\.\s/m, /\[.*\]\(.*\)/, /```[\s\S]*```/, /^\>/m]
    return patterns.some(pattern => pattern.test(content))
}

const convertMarkdownToHtml = async (markdown: string): Promise<string> => {
    try { return await marked.parse(markdown) } catch (e) { return markdown }
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
    const [userRole, setUserRole] = useState<string | null>(null)
    const [aiLoading, setAiLoading] = useState(false)
    const [generateContentLoading, setGenerateContentLoading] = useState(false)
    const [generateOutlineLoading, setGenerateOutlineLoading] = useState(false)
    const [generateMetaLoading, setGenerateMetaLoading] = useState(false)
    const [showPublishModal, setShowPublishModal] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [activeAITab, setActiveAITab] = useState<'content' | 'images' | 'seo'>('content')

    const [metaTitle, setMetaTitle] = useState("")
    const [metaDescription, setMetaDescription] = useState("")
    const [focusKeyword, setFocusKeyword] = useState("")
    const [toneOfVoice, setToneOfVoice] = useState("professional")
    const [contentFramework, setContentFramework] = useState("standard")
    const [selectedAIModel, setSelectedAIModel] = useState("")
    const [imagePrompt, setImagePrompt] = useState("")
    const [imageGenerating, setImageGenerating] = useState(false)
    const [generatedImages, setGeneratedImages] = useState<any[]>([])
    const [selectedImageModel, setSelectedImageModel] = useState("")
    const [selectedSEOModel, setSelectedSEOModel] = useState("")
    const [seoAnalyzing, setSeoAnalyzing] = useState(false)
    const [seoAnalysis, setSeoAnalysis] = useState<any>(null)

    useEffect(() => {
        if (!authLoading && !user) router.push("/login")
    }, [user, authLoading])

    useEffect(() => {
        if (user && articleId !== "new") fetchArticle()
        else if (articleId === "new") setLoading(false)
    }, [user, articleId])

    useEffect(() => {
        if (hasUnsavedChanges && articleId !== "new") {
            const interval = setInterval(() => handleSave(), 120000)
            return () => clearInterval(interval)
        }
    }, [hasUnsavedChanges, articleId])

    useEffect(() => {
        if (article) setHasUnsavedChanges(true)
    }, [title, content, excerpt])

    const fetchArticle = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("accessToken")
            const res = await fetch(`/api/articles/${articleId}`, { headers: { Authorization: `Bearer ${token}` } })
            const data = await res.json()
            if (data.success) {
                const art = data.data.article
                setArticle(art)
                setTitle(art.title)
                setContent(art.content || "")
                setExcerpt(art.excerpt || "")
                setMetaTitle(art.metaTitle || "")
                setMetaDescription(art.metaDescription || "")
                setFocusKeyword(art.focusKeyword || "")
                setToneOfVoice(art.toneOfVoice || "professional")
                setContentFramework(art.contentFramework || "standard")
                setHasUnsavedChanges(false)

                if (art.userId === user?.id) setUserRole('OWNER')
                else {
                    const col = art.collaborators?.find((c: any) => c.userId === user?.id && c.status === 'ACCEPTED')
                    if (col) setUserRole(col.role)
                }
            } else router.push("/dashboard/articles")
        } catch (e) { router.push("/dashboard/articles") }
        finally { setLoading(false) }
    }

    const handleSave = useCallback(async (status?: string) => {
        if (userRole && !['OWNER', 'EDITOR'].includes(userRole)) {
            toast.error("No permission to edit")
            return
        }
        if (!title.trim()) return

        try {
            setSaving(true)
            const token = localStorage.getItem("accessToken")
            const payload = { title, content, excerpt, metaTitle, metaDescription, focusKeyword, toneOfVoice, contentFramework, ...(status && { status }) }

            const method = articleId === "new" ? "POST" : "PUT"
            const url = articleId === "new" ? "/api/articles" : `/api/articles/${articleId}`

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (data.success) {
                if (articleId === "new") router.push(`/dashboard/articles/${data.data.article.id}`)
                else setArticle(data.data.article)
                setLastSaved(new Date())
                setHasUnsavedChanges(false)
                toast.success("Saved")
            }
        } catch (e) { toast.error("Save failed") }
        finally { setSaving(false) }
    }, [title, content, excerpt, metaTitle, metaDescription, focusKeyword, toneOfVoice, contentFramework, articleId])

    const handleGenerateContent = async () => {
        if (!title.trim()) return
        try {
            setGenerateContentLoading(true)
            const token = localStorage.getItem("accessToken")
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ type: "blog-content", title, keywords: focusKeyword ? [focusKeyword] : [], toneOfVoice, contentFramework, wordCount: 1000, model: selectedAIModel || undefined })
            })
            const data = await res.json()
            if (data.success) {
                let result = data.data.result
                if (isMarkdown(result)) result = await convertMarkdownToHtml(result)
                setContent(result)
                toast.success("Generated")
            }
        } catch (e) { toast.error("Error") }
        finally { setGenerateContentLoading(false) }
    }

    const handleGenerateOutline = async () => {
        if (!title.trim()) return
        try {
            setGenerateOutlineLoading(true)
            const token = localStorage.getItem("accessToken")
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ type: "outline", topic: title, sections: 5, model: selectedAIModel || undefined })
            })
            const data = await res.json()
            if (data.success) {
                let out = Array.isArray(data.data.result) ? data.data.result.join("\n\n") : data.data.result
                if (isMarkdown(out)) out = await convertMarkdownToHtml(out)
                setContent(out)
                toast.success("Outline ready")
            }
        } catch (e) { toast.error("Error") }
        finally { setGenerateOutlineLoading(false) }
    }

    const handleGenerateImage = async () => {
        if (!imagePrompt.trim()) return
        try {
            setImageGenerating(true)
            const token = localStorage.getItem("accessToken")
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ type: "image", prompt: imagePrompt, model: selectedImageModel || "gemini-1.5-flash" })
            })
            const data = await res.json()
            if (data.success) {
                setGeneratedImages(prev => [data.data.result || data.data, ...prev])
                setImagePrompt("")
                toast.success("Image generated")
            }
        } catch (e) { toast.error("Error") }
        finally { setImageGenerating(false) }
    }

    const handleAnalyzeSEO = async () => {
        const plain = content.replace(/<[^>]*>/g, '').trim()
        if (!plain) return
        try {
            setSeoAnalyzing(true)
            const token = localStorage.getItem("accessToken")
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ type: "seo-analysis", content: plain, title, model: selectedSEOModel || "gemini-1.5-flash" })
            })
            const data = await res.json()
            if (data.success) { setSeoAnalysis(data.data.result); toast.success("Analysis complete") }
        } catch (e) { toast.error("Error") }
        finally { setSeoAnalyzing(false) }
    }

    const getWordCount = () => content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length

    if (authLoading || loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><Loader2 className="animate-spin" size={40} color="#FF7A33" /></div>

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#fff' }}>

            {/* Editor Side */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', transition: 'all 0.3s', marginRight: showAISidebar ? '400px' : '0' }}>

                {/* Top Header Bar */}
                <div style={{ height: '80px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', padding: '0 40px', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button onClick={() => router.push("/dashboard/articles")} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#fff' }}>
                            <ArrowLeft size={18} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>{article?.status || 'DRAFT'}</span>
                            <div style={{ height: '4px', width: '4px', borderRadius: '50%', backgroundColor: '#eee' }}></div>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a1a' }}>{getWordCount()} WORDS</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {lastSaved && <span style={{ fontSize: '11px', fontWeight: 700, color: '#999' }}>SAVED {lastSaved.toLocaleTimeString()}</span>}
                        <button onClick={() => setShowAISidebar(!showAISidebar)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: showAISidebar ? '#1a1a1a' : '#fff', color: showAISidebar ? '#fff' : '#1a1a1a' }}>
                            <Wand2 size={18} />
                        </button>
                        <button onClick={() => handleSave()} disabled={saving} style={{ padding: '12px 24px', borderRadius: '50px', border: '1px solid #eee', backgroundColor: '#fff', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                            {saving ? 'SAVING...' : 'SAVE DRAFT'}
                        </button>
                        <button onClick={() => setShowPublishModal(true)} disabled={articleId === "new"} style={{ padding: '12px 24px', borderRadius: '50px', border: 'none', backgroundColor: '#FF7A33', color: '#fff', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                            PUBLISH STORY
                        </button>
                    </div>
                </div>

                {/* Writing Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '60px' }}>
                    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Story Title..."
                            style={{ width: '100%', fontSize: '48px', fontWeight: 900, border: 'none', outline: 'none', marginBottom: '40px', color: '#1a1a1a', letterSpacing: '-0.04em' }}
                        />
                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                            onSave={() => handleSave()}
                            editable={!userRole || ['OWNER', 'EDITOR'].includes(userRole)}
                        />
                    </div>
                </div>
            </div>

            {/* AI Assistant Sidebar */}
            {showAISidebar && (
                <div style={{ width: '400px', backgroundColor: '#fcfcfc', borderLeft: '1px solid #eee', position: 'fixed', right: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '80px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                        <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Sparkles size={16} color="#FF7A33" /> AI ASSISTANT
                        </h2>
                        <button onClick={() => setShowAISidebar(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={18} /></button>
                    </div>

                    <div style={{ display: 'flex', padding: '20px 32px', gap: '12px', borderBottom: '1px solid #f9f9f9' }}>
                        {['content', 'images', 'seo'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveAITab(tab as any)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    backgroundColor: activeAITab === tab ? '#1a1a1a' : 'transparent',
                                    color: activeAITab === tab ? '#fff' : '#666',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    textTransform: 'capitalize',
                                    cursor: 'pointer'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                        {activeAITab === 'content' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div>
                                    <p style={{ fontSize: '11px', fontWeight: 800, color: '#999', marginBottom: '12px', textTransform: 'uppercase' }}>AI MODEL</p>
                                    <AIModelSelector value={selectedAIModel} onChange={setSelectedAIModel} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #eee' }}>
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: 800, color: '#999', marginBottom: '8px', display: 'block' }}>TONE OF VOICE</label>
                                        <select value={toneOfVoice} onChange={(e) => setToneOfVoice(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#fcfcfc', fontSize: '14px', fontWeight: 700 }}>
                                            <option value="professional">Professional</option>
                                            <option value="casual">Casual</option>
                                            <option value="authoritative">Authoritative</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: 800, color: '#999', marginBottom: '8px', display: 'block' }}>FRAMEWORK</label>
                                        <select value={contentFramework} onChange={(e) => setContentFramework(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#fcfcfc', fontSize: '14px', fontWeight: 700 }}>
                                            <option value="standard">Standard</option>
                                            <option value="listicle">Listicle</option>
                                            <option value="how-to">How-to</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <button onClick={handleGenerateContent} disabled={generateContentLoading} style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        {generateContentLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} GENERATE FULL STORY
                                    </button>
                                    <button onClick={handleGenerateOutline} disabled={generateOutlineLoading} style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: '#fff', color: '#1a1a1a', border: '1px solid #eee', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        {generateOutlineLoading ? <Loader2 size={16} className="animate-spin" /> : <Layout size={16} />} CREATE OUTLINE
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeAITab === 'images' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div>
                                    <p style={{ fontSize: '11px', fontWeight: 800, color: '#999', marginBottom: '12px', textTransform: 'uppercase' }}>DESCRIBE IMAGE</p>
                                    <textarea
                                        value={imagePrompt}
                                        onChange={(e) => setImagePrompt(e.target.value)}
                                        placeholder="e.g. A futuristic workspace with a laptop..."
                                        style={{ width: '100%', height: '120px', padding: '20px', borderRadius: '24px', border: '1px solid #eee', backgroundColor: '#fff', fontSize: '14px', outline: 'none', resize: 'none', fontWeight: 600 }}
                                    />
                                </div>
                                <button onClick={handleGenerateImage} disabled={imageGenerating} style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: '#FF7A33', color: '#fff', border: 'none', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    {imageGenerating ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} GENERATE ARTWORK
                                </button>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    {generatedImages.map((img, i) => (
                                        <div key={i} style={{ aspectRatio: '1', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee' }}>
                                            <img src={img.url || img} alt="Generated" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeAITab === 'seo' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '32px', border: '1px solid #eee', textAlign: 'center' }}>
                                    <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 800, color: '#999' }}>READABILITY SCORE</p>
                                    <p style={{ margin: 0, fontSize: '42px', fontWeight: 900, color: '#1a1a1a' }}>{seoAnalysis?.score || '0'}</p>
                                </div>
                                <button onClick={handleAnalyzeSEO} disabled={seoAnalyzing} style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>
                                    {seoAnalyzing ? 'ANALYZING...' : 'ANALYZE CONTENT'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {article && (
                <PublishModal
                    open={showPublishModal}
                    onClose={() => setShowPublishModal(false)}
                    articleId={article.id}
                    articleTitle={title}
                />
            )}
        </div>
    )
}
