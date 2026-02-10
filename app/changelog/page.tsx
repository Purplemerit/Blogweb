"use client"

import Link from "next/link"
import { ArrowLeft, Sparkles, Zap, Shield, Check, Calendar } from "lucide-react"

export default function ChangelogPage() {
  const entries = [
    {
      version: "2.0.0",
      date: "January 19, 2026",
      tag: "Latest",
      tagColor: "#22c55e",
      type: "major",
      changes: [
        { text: "Added multi-platform publishing support", type: "new" },
        { text: "Improved AI model selection", type: "improvement" },
        { text: "Enhanced editor with real-time collaboration", type: "new" },
        { text: "New analytics dashboard", type: "new" },
      ],
    },
    {
      version: "1.5.0",
      date: "January 1, 2026",
      type: "minor",
      changes: [
        { text: "Added newsletter integration", type: "new" },
        { text: "Improved SEO analysis tools", type: "improvement" },
        { text: "Better export options", type: "improvement" },
        { text: "Performance improvements", type: "fix" },
      ],
    },
    {
      version: "1.0.0",
      date: "December 15, 2025",
      tag: "Initial Release",
      tagColor: "#3b82f6",
      type: "major",
      changes: [
        { text: "Initial release", type: "new" },
        { text: "AI-powered blog generation", type: "new" },
        { text: "Basic publishing features", type: "new" },
        { text: "User authentication system", type: "new" },
      ],
    },
  ]

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "new": return <Sparkles size={16} style={{ color: '#22c55e' }} />
      case "improvement": return <Zap size={16} style={{ color: '#3b82f6' }} />
      case "fix": return <Shield size={16} style={{ color: '#FF7A33' }} />
      default: return <Check size={16} style={{ color: '#666' }} />
    }
  }

  const getChangeBadge = (type: string) => {
    switch (type) {
      case "new": return <span style={{ fontSize: '10px', fontWeight: 800, color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>NEW</span>
      case "improvement": return <span style={{ fontSize: '10px', fontWeight: 800, color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>IMPROVED</span>
      case "fix": return <span style={{ fontSize: '10px', fontWeight: 800, color: '#FF7A33', backgroundColor: 'rgba(255, 122, 51, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>FIXED</span>
      default: return null
    }
  }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#1a1a1a' }}>

      {/* Hero Section */}
      <section style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url("/design/BG%2023-01%202.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 24px 80px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#FF7A33',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginBottom: '16px'
          }}>Product Updates</p>
          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 64px)',
            fontWeight: 800,
            marginBottom: '16px',
            color: '#1a1a1a',
            lineHeight: '1.2'
          }}>
            Release <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#666', fontFamily: '"Playfair Display", serif' }}>Changelog</span>
          </h1>
          <p style={{ color: '#666', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
            Explore the latest features, improvements, and fixes we've built for you.
          </p>
        </div>
      </section>

      {/* Changelog Content */}
      <section style={{ padding: '0 24px 120px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          <div style={{ padding: '60px 0' }}>
            <Link href="/" style={{ color: '#FF7A33', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
              {entries.map((entry) => (
                <div key={entry.version} style={{
                  backgroundColor: '#fff',
                  borderRadius: '40px',
                  border: '1px solid #f0f0f0',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                }}>
                  {/* Entry Header */}
                  <div style={{ padding: '40px', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <h2 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>v{entry.version}</h2>
                      {entry.tag && (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: entry.tagColor,
                          backgroundColor: 'white',
                          padding: '4px 12px',
                          borderRadius: '50px',
                          border: `1px solid ${entry.tagColor}44`
                        }}>{entry.tag}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#999', fontSize: '14px', fontWeight: 700 }}>
                      <Calendar size={16} style={{ color: '#FF7A33' }} />
                      {entry.date}
                    </div>
                  </div>

                  {/* Entry Changes */}
                  <div style={{ padding: '40px' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {entry.changes.map((change, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '16px', color: '#444' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {getChangeIcon(change.type)}
                          </div>
                          <span style={{ flex: 1, fontWeight: 500 }}>{change.text}</span>
                          {getChangeBadge(change.type)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Section */}
            <div style={{
              marginTop: '100px',
              padding: '60px',
              borderRadius: '48px',
              backgroundColor: '#FF7A33',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(255, 122, 51, 0.3)'
            }}>
              <h3 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Stay in the loop</h3>
              <p style={{ fontSize: '17px', opacity: 0.9, marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                Never miss an update. Join our community and be the first to know about new features.
              </p>
              <Link href="/contact" style={{
                backgroundColor: 'white',
                color: '#FF7A33',
                padding: '18px 48px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '15px',
                display: 'inline-block'
              }}>
                Contact Us for Updates
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
