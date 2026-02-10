"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import {
    ArrowLeft,
    Search,
    ChevronRight,
    BookOpen,
    PlayCircle,
    Clock,
    ThumbsUp,
    MessageSquare
} from "lucide-react"
import { useState } from "react"

export default function DocDetail() {
    const params = useParams()
    const slug = params.slug as string[] | undefined
    const [search, setSearch] = useState("")

    // Mock data for documentation
    const pageTitle = slug ? slug[slug.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Documentation"

    const breadcrumbs = slug || []

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#1a1a1a' }}>

            {/* Search Header */}
            <header style={{
                borderBottom: '1px solid #f0f0f0',
                padding: '20px 24px',
                position: 'sticky',
                top: '80px', // Below the main navbar
                backgroundColor: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 40
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link href="/docs" style={{ color: '#FF7A33', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Docs
                        </Link>
                        {breadcrumbs.map((b, i) => (
                            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ChevronRight size={14} style={{ color: '#ccc' }} />
                                <span style={{ color: i === breadcrumbs.length - 1 ? '#1a1a1a' : '#666', fontWeight: i === breadcrumbs.length - 1 ? 800 : 500 }}>
                                    {b.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div style={{ position: 'relative', width: '300px' }} className="hide-mobile">
                        <input
                            type="text"
                            placeholder="Search docs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 16px 10px 40px',
                                borderRadius: '50px',
                                border: '1px solid #ddd',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                        <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex' }}>

                {/* Sidebar */}
                <aside style={{
                    width: '280px',
                    borderRight: '1px solid #f0f0f0',
                    padding: '40px 24px',
                    height: 'calc(100vh - 140px)',
                    position: 'sticky',
                    top: '140px'
                }} className="hide-mobile">
                    <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.1em' }}>Navigation</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link href="/docs/getting-started" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}>Introduction</Link>
                        <Link href="/docs/getting-started/quick-start" style={{ color: '#666', textDecoration: 'none', fontSize: '15px' }}>Quick Start Guide</Link>
                        <Link href="/docs/writing-editing" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '15px', fontWeight: 600, marginTop: '12px' }}>Core Concepts</Link>
                        <Link href="/docs/writing-editing/editor" style={{ color: '#666', textDecoration: 'none', fontSize: '15px' }}>The Editor</Link>
                        <Link href="/docs/writing-editing/ai-commands" style={{ color: '#666', textDecoration: 'none', fontSize: '15px' }}>AI Commands</Link>
                        <Link href="/docs/publishing" style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: '15px', fontWeight: 600, marginTop: '12px' }}>Distribution</Link>
                        <Link href="/docs/publishing/ghost" style={{ color: '#666', textDecoration: 'none', fontSize: '15px' }}>Ghost Integration</Link>
                        <Link href="/docs/publishing/medium" style={{ color: '#666', textDecoration: 'none', fontSize: '15px' }}>Medium Integration</Link>
                    </div>
                </aside>

                {/* Content */}
                <main style={{ flex: 1, padding: '60px 80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <span style={{ backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 800 }}>GUIDE</span>
                        <span style={{ color: '#999', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} /> 5 min read
                        </span>
                    </div>

                    <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '32px' }}>{pageTitle}</h1>

                    <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#444' }}>
                        <p style={{ marginBottom: '24px' }}>
                            Welcome to the {pageTitle} section. This guide will walk you through everything you need to know about setting up and mastering your PublishType workspace.
                        </p>

                        <div style={{ backgroundColor: '#FFF5F2', padding: '32px', borderRadius: '24px', margin: '40px 0', borderLeft: '4px solid #FF7A33' }}>
                            <h4 style={{ color: '#FF7A33', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <PlayCircle size={20} /> Pro Tip
                            </h4>
                            <p style={{ margin: 0, fontSize: '16px' }}>
                                You can use the keyboard shortcut <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #eee' }}>CMD + K</code> to quickly open the command palette and find any doc across our entire library.
                            </p>
                        </div>

                        <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '48px 0 24px' }}>Getting Started</h2>
                        <p style={{ marginBottom: '24px' }}>
                            PublishType is designed to be intuitive but powerful. To get the most out of your experience, we recommend starting with a clear understanding of our cross-platform architecture.
                        </p>

                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none', padding: 0 }}>
                            <li style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FF7A33', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>1</div>
                                <div>Connect your primary social accounts in the integrations tab.</div>
                            </li>
                            <li style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FF7A33', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>2</div>
                                <div>Set up your writing preferences and tone of voice.</div>
                            </li>
                            <li style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FF7A33', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>3</div>
                                <div>Start your first draft and let the AI assist your creativity.</div>
                            </li>
                        </ul>
                    </div>

                    {/* Feedback */}
                    <section style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#666', fontWeight: 700, cursor: 'pointer' }}>
                                <ThumbsUp size={18} /> Helpful
                            </button>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#666', fontWeight: 700, cursor: 'pointer' }}>
                                <MessageSquare size={18} /> Feedback
                            </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '14px', color: '#999' }}>Last updated 2 days ago</span>
                        </div>
                    </section>

                    {/* Next Section Navigation */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '40px' }}>
                        <div style={{ padding: '24px', borderRadius: '24px', border: '1px solid #eee', cursor: 'pointer' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#999', fontWeight: 800 }}>PREVIOUS</p>
                            <h4 style={{ margin: '4px 0 0', fontWeight: 800 }}>Integration basics</h4>
                        </div>
                        <div style={{ padding: '24px', borderRadius: '24px', border: '1px solid #eee', cursor: 'pointer', textAlign: 'right', borderColor: '#FF7A33' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#999', fontWeight: 800 }}>NEXT</p>
                            <h4 style={{ margin: '4px 0 0', fontWeight: 800, color: '#FF7A33' }}>Advanced Publishing</h4>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
