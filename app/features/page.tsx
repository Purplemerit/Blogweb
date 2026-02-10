"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Check,
  Share2,
  PenLine,
  Zap,
  Layout,
  Users2,
  Heart,
  TrendingUp,
  Album,
  Plus
} from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"

export default function FeaturesPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleStart = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/signup')
    }
  }

  const features = [
    {
      title: "Multi-Platform Publishing",
      desc: "Publish your content simultaneously across Ghost, Substack, Medium, LinkedIn, and more. Reach your audience wherever they are with just one click.",
      points: ["One-click multi-platform distribution", "Automatic format optimization", "Platform-specific customization"],
      img: "/imagea.png",
      icon: <Share2 size={20} />,
      color: "#FF7A33"
    },
    {
      title: "Customizable AI Editor",
      desc: "Write with confidence using our intelligent editor. Get real-time suggestions, grammar corrections, and style improvements powered by advanced AI.",
      points: ["Smart content suggestions", "Grammar and style enhancement", "Rich formatting options"],
      img: "/imageb.png",
      icon: <PenLine size={20} />,
      reverse: true,
      color: "#FF7A33"
    },
    {
      title: "AI-Powered Analytics",
      desc: "Understand your audience with deep insights. Track engagement, identify trends, and optimize your content strategy with AI-driven analytics.",
      points: ["Real-time performance tracking", "Audience behavior insights", "Predictive content recommendations"],
      img: "/imagec.png",
      icon: <Zap size={20} />,
      color: "#FF7A33"
    },
    {
      title: "SEO-Optimized",
      desc: "Rank higher in search results with built-in SEO tools. Optimize meta tags, keywords, and content structure automatically for better visibility.",
      points: ["Automatic meta tag generation", "Keyword density analysis", "Readability score optimization"],
      img: "/imaged.png",
      icon: <Layout size={20} />,
      reverse: true,
      color: "#FF7A33"
    },
    {
      title: "Collaborative Workspace",
      desc: "Work together seamlessly with your team. Share drafts, leave comments, and collaborate in real-time on your content projects.",
      points: ["Real-time collaboration", "Inline comments and feedback", "Version history tracking"],
      img: "/imagee.png",
      icon: <Users2 size={20} />,
      color: "#FF7A33"
    },
    {
      title: "Content Scheduling",
      desc: "Plan your content calendar with ease. Schedule posts in advance and maintain a consistent publishing rhythm across all platforms.",
      points: ["Visual content calendar", "Optimal timing suggestions", "Bulk scheduling options"],
      img: "/imagef.png",
      icon: <Heart size={20} />,
      reverse: true,
      color: "#FF7A33"
    },
    {
      title: "Content Optimization",
      desc: "Maximize your content's impact with AI-powered optimization. Get suggestions for headlines, structure, and engagement based on proven best practices.",
      points: ["Headline scoring and suggestions", "Content structure analysis", "Engagement prediction"],
      img: "/imageg.png",
      icon: <TrendingUp size={20} />,
      color: "#FF7A33"
    },
    {
      title: "Content Curation Library",
      desc: "Build your content library with ease. Organize, tag, and retrieve your best content for repurposing and reference across all your channels.",
      points: ["Smart content organization", "Advanced tagging system", "Quick search and retrieval"],
      img: "/imageh.png",
      icon: <Album size={20} />,
      reverse: true,
      color: "#FF7A33"
    }
  ]

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>

      {/* Hero Section */}
      <section style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url("/design/BG%2023-01%202.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 24px 80px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 64px)',
            fontWeight: 800,
            marginBottom: '16px',
            color: '#1a1a1a',
            lineHeight: '1.2'
          }}>
            Everything You Need To<br />
            <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#666', fontFamily: '"Playfair Display", serif' }}>Succeed</span>
          </h1>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto' }}>
            Every step, your journal should inspire others publish high quality alongside features.
          </p>
        </div>
      </section>

      {/* Features List */}
      <section style={{ padding: '40px 24px 100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {features.map((f, idx) => (
            <div key={idx} style={{
              backgroundColor: 'rgba(255, 122, 51, 0.05)',
              borderRadius: '48px',
              padding: '48px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}>
              {/* Image Side */}
              <div style={{
                order: f.reverse ? 2 : 1,
                backgroundColor: '#fff',
                borderRadius: '24px',
                padding: '24px',
                height: '400px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
              }}>
                <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
                  <Image
                    src={f.img}
                    alt={f.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized // Keeping as requested not to change image/ext
                  />
                </div>
              </div>

              {/* Text Side */}
              <div style={{ order: f.reverse ? 1 : 2 }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  border: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: f.color,
                  marginBottom: '24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                  {f.icon}
                </div>
                <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#1a1a1a' }}>{f.title}</h2>
                <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                  {f.desc}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {f.points.map(pt => (
                    <div key={pt} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1a1a1a', fontWeight: 600 }}>
                      <Check size={18} style={{ color: f.color }} strokeWidth={3} />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 42px)', fontWeight: 800, color: '#1a1a1a', marginBottom: '20px' }}>
            Ready to elevate your content ?
          </h2>
          <p style={{ color: '#666', marginBottom: '40px', fontSize: '16px' }}>
            Join thousands of creators and brands automating their growth today.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleStart}
              style={{
                backgroundColor: '#FF7A33',
                color: 'white',
                padding: '18px 56px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 8px 25px rgba(255, 122, 51, 0.3)'
              }}>
              GET STARTED NOW
            </button>
            <p style={{ fontSize: '13px', color: '#999' }}>No credit card required for free plan</p>
          </div>
        </div>
      </section>

    </div>
  )
}
