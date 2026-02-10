"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Target, Users, Zap, Heart, Check, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"

export default function AboutPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleStart = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/signup')
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
          }}>Our Story</p>
          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 64px)',
            fontWeight: 800,
            marginBottom: '16px',
            color: '#1a1a1a',
            lineHeight: '1.2'
          }}>
            The Future of <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#666', fontFamily: '"Playfair Display", serif' }}>Publishing</span>
          </h1>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto' }}>
            We're on a mission to empower creators with the world's most intuitive cross-platform publishing engine.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '40px 24px 100px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '40px'
          }}>
            {/* Mission */}
            <div style={{
              backgroundColor: 'rgba(255,122,51,0.05)',
              padding: '60px',
              borderRadius: '48px',
              border: '1px solid #FFF5F2'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF7A33',
                marginBottom: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
              }}>
                <Target size={28} />
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '24px' }}>Our Mission</h2>
              <p style={{ fontSize: '17px', lineHeight: '1.7', color: '#444' }}>
                PublishType was created to empower content creators, bloggers, and businesses to produce high-quality content efficiently. We combine the power of AI with intuitive tools to make content creation accessible to everyone, regardless of their writing experience.
              </p>
            </div>

            {/* Values Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[
                { title: 'Innovation', desc: 'Continuous AI integration for the best experience.', icon: <Zap size={20} /> },
                { title: 'Simplicity', desc: 'Complex features made elegantly simple.', icon: <Heart size={20} /> },
                { title: 'Quality', desc: 'Crafting content that drives real results.', icon: <Check size={20} /> },
                { title: 'Community', desc: 'Scaling with the needs of every creator.', icon: <Users size={20} /> }
              ].map((v, i) => (
                <div key={i} style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '32px', border: '1px solid #f0f0f0' }}>
                  <div style={{ color: '#FF7A33', marginBottom: '16px' }}>{v.icon}</div>
                  <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>{v.title}</h4>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section style={{ padding: '80px 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '64px' }}>The Core of PublishType</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', color: '#FF7A33' }}>AI-Powered Writing</h3>
              <p style={{ color: '#666', fontSize: '15px' }}>Multiple AI models including GPT-4, Claude, and Gemini working in harmony.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', color: '#FF7A33' }}>Cross-Platform</h3>
              <p style={{ color: '#666', fontSize: '15px' }}>One-click publishing to WordPress, Medium, Substack, and Ghost.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', color: '#FF7A33' }}>Deep Analytics</h3>
              <p style={{ color: '#666', fontSize: '15px' }}>Unified performance tracking across all your distribution channels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '120px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(38px, 6vw, 48px)', fontWeight: 800, color: '#1a1a1a', marginBottom: '24px', lineHeight: '1.2' }}>
            Ready to join the revolution?
          </h2>
          <p style={{ color: '#666', marginBottom: '48px', fontSize: '18px' }}>
            Join thousands of creators and brands automating their growth today.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleStart}
              style={{
                backgroundColor: '#FF7A33',
                color: 'white',
                padding: '20px 64px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 800,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                boxShadow: '0 10px 30px rgba(255, 122, 51, 0.3)',
                transition: 'all 0.3s'
              }}>
              GET STARTED NOW
            </button>
            <p style={{ fontSize: '14px', color: '#999' }}>No credit card required for free plan</p>
          </div>
        </div>
      </section>

    </div>
  )
}
