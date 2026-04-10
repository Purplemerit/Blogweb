"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Search,
  BookOpen,
  MessageSquare,
  Zap,
  HelpCircle,
  Mail,
  ChevronRight,
  Shield,
  Clock,
  Layout,
  Globe,
  Sparkles,
  ExternalLink
} from "lucide-react"

export default function HelpPage() {
  const categories = [
    { title: "Getting Started", icon: <Zap size={24} />, desc: "Learn the basics and publish your first article." },
    { title: "Collaboration", icon: <Users size={24} />, desc: "Invite team members and manage role permissions." },
    { title: "Integrations", icon: <Globe size={24} />, desc: "Connect your Ghost, WordPress or Dev.to blogs." },
    { title: "AI Assistant", icon: <Sparkles size={24} />, desc: "Maximize your output with our AI writing tools." },
  ]

  const faqs = [
    {
      q: "How do I create my first article?",
      a: "After logging in, click the 'New Article' button in your dashboard. You can start writing manually or use our AI-powered editor to generate content based on your topic and requirements."
    },
    {
      q: "Can I publish to multiple platforms at once?",
      a: "Yes! PublishType supports multi-platform publishing to WordPress, Medium, Dev.to, Hashnode, Ghost, and LinkedIn. Connect your accounts in the Platforms section and publish with one click."
    },
    {
      q: "How does the AI content generation work?",
      a: "Our AI uses advanced language models to generate high-quality content based on your inputs. You provide the topic, tone, and key points, and the AI creates a complete article that you can edit and customize."
    },
    {
      q: "Is my content secure?",
      a: "Yes, we take security seriously. All data is encrypted in transit and at rest. Your content is private and only you have access to it. We never share or sell your data."
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fff',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url("/design/BG%2023-01%202.png")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#1a1a1a', fontWeight: 800 }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#FF7A33', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layout size={18} color="white" />
          </div>
          <span>PublishType</span>
        </Link>
        <Link href="/login" style={{ textDecoration: 'none', color: '#666', fontSize: '14px', fontWeight: 700 }}>
          Go to Dashboard
        </Link>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            How can we <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#666', fontFamily: 'serif' }}>help you?</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#666', fontWeight: 500, marginBottom: '40px' }}>
            Search our documentation or browse categories below to find answers.
          </p>

          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="Search for articles, guides..."
              style={{
                width: '100%',
                padding: '20px 24px 20px 60px',
                borderRadius: '50px',
                border: '1px solid #eee',
                backgroundColor: '#fff',
                fontSize: '16px',
                outline: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
              }}
            />
            <Search style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={22} />
          </div>
        </div>

        {/* Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '100px' }}>
          {categories.map((cat, i) => (
            <div key={i} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              padding: '40px 32px',
              borderRadius: '32px',
              border: '1px solid rgba(238, 238, 238, 0.5)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#FFF5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7A33', marginBottom: '24px' }}>
                {cat.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>{cat.title}</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div style={{ marginBottom: '100px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Frequently Asked Questions</h2>
              <p style={{ color: '#666', marginTop: '8px', fontWeight: 500 }}>Quick answers to the most common queries.</p>
            </div>
            <Link href="/docs" style={{ color: '#FF7A33', textDecoration: 'none', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all documentation <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255, 255, 255, 1)',
                padding: '32px',
                borderRadius: '24px',
                border: '1px solid #eee'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px', display: 'flex', gap: '12px' }}>
                  <HelpCircle size={20} color="#FF7A33" style={{ flexShrink: 0 }} />
                  {faq.q}
                </h4>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7', margin: 0, paddingLeft: '32px' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Still need help? */}
        <div style={{
          backgroundColor: '#1a1a1a',
          borderRadius: '40px',
          padding: '80px',
          textAlign: 'center',
          backgroundImage: 'url("/design/BG%2023-01%202.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', color: '#FF7A33' }}>
              <Mail size={32} />
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Still have questions?</h2>
            <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 500, marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
              Our support team is online and ready to help you with anything you need.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button style={{
                backgroundColor: '#FF7A33',
                color: 'white',
                padding: '16px 40px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(255, 122, 51, 0.3)'
              }}>Contact Support</button>
              <button style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '16px 40px',
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer'
              }}>Live Chat</button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '60px 40px', textAlign: 'center', borderTop: '1px solid #eee' }}>
        <p style={{ color: '#999', fontSize: '13px', fontWeight: 600 }}>
          &copy; 2026 PublishType. All rights reserved. <span style={{ margin: '0 8px' }}>•</span>
          <Link href="/privacy" style={{ color: '#999', textDecoration: 'none' }}>Privacy Policy</Link> <span style={{ margin: '0 8px' }}>•</span>
          <Link href="/terms" style={{ color: '#999', textDecoration: 'none' }}>Terms of Service</Link>
        </p>
      </footer>
    </div>
  )
}

function Users({ size, color }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
