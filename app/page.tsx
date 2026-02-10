"use client"

import Link from "next/link"
import { Check, Star, Users, FileText, TrendingUp, Plus, Minus, ArrowRight, Play, Sparkles, Send, LayoutGrid, BarChart3 } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/lib/context/AuthContext"
import { useRouter } from "next/navigation"

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
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
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Hero Section */}
      <section style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url("/design/BG%2023-01%202.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 24px 100px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 900,
            lineHeight: '1.2',
            marginBottom: '20px',
            color: '#1a1a1a',
            letterSpacing: '-0.02em'
          }}>
            Publish Smarter Blogs With AI<br />
            Across Every <span style={{ color: '#888', fontStyle: 'italic', fontWeight: 300, fontFamily: 'serif' }}>Platform</span>
          </h1>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#666',
            maxWidth: '650px',
            margin: '0 auto 40px',
            fontWeight: 500
          }}>
            AIMy Blogs helps creators and teams generate, optimize, and publish high-quality content in minutes.<br />
            From SEO + images to scheduling and analytics, everything stays in one workflow.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleStart}
              style={{
                padding: '16px 40px',
                backgroundColor: '#FF7A33',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 14px rgba(255, 122, 51, 0.3)'
              }}>
              Get Started Free
            </button>
            <button
              onClick={() => router.push('/pricing')}
              style={{
                padding: '16px 40px',
                backgroundColor: 'white',
                color: '#1a1a1a',
                border: '2px solid #e0e0e0',
                borderRadius: '50px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
              View Pricing
            </button>
          </div>

          {/* Feature Tags */}
          <div style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            fontSize: '14px',
            color: '#666',
            fontWeight: 500
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={18} color="#FF7A33" strokeWidth={3} />
              <span>No credit card required</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={18} color="#FF7A33" strokeWidth={3} />
              <span>Publish faster</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={18} color="#FF7A33" strokeWidth={3} />
              <span>Works with WordPress</span>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section with Image */}
      <section style={{
        padding: '0 24px 80px',
        marginTop: '-40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="bg-[#eee] rounded-[32px] p-6 md:p-10 lg:p-[60px] min-h-[300px] lg:min-h-[500px] flex flex-col lg:flex-row items-center justify-center gap-8 relative overflow-hidden lg:overflow-visible">
            {/* Top dots & decorations - visible on desktop only */}
            <div className="hidden lg:flex absolute top-6 left-10 gap-3">
              <div className="w-6 h-6 rounded-full bg-[#e0e0e0]"></div>
              <div className="w-6 h-6 rounded-full bg-[#e0e0e0]"></div>
              <div className="w-6 h-6 rounded-full bg-[#e0e0e0]"></div>
            </div>

            <div className="hidden lg:flex absolute top-6 left-1/2 -translate-x-1/2 gap-6">
              <div className="w-[120px] h-6 rounded-xl bg-[#e0e0e0] opacity-50"></div>
              <div className="w-[180px] h-6 rounded-xl bg-[#e0e0e0] opacity-50"></div>
            </div>

            <div className="hidden lg:block absolute top-6 right-10">
              <div className="w-[120px] h-6 rounded-xl bg-[#aaa] opacity-20"></div>
            </div>

            {/* Left Card Placeholder - Hidden on mobile/tablet */}
            <div className="hidden lg:flex flex-1 w-full max-w-[300px] h-[320px] bg-[#eee] rounded-3xl p-6 flex-col gap-4 justify-center relative">
              <div className="absolute top-5 left-4 md:-left-10 bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2 text-xs font-bold z-10 border border-[#eee]">
                <div className="w-2 h-2 rounded-full bg-[#FF7A33]"></div>
                SEO Optimized Draft
              </div>

              <div className="h-3 w-[90%] bg-[#ddd] rounded-md"></div>
              <div className="h-3 w-[70%] bg-[#ddd] rounded-md"></div>
              <div className="h-3 w-[80%] bg-[#ddd] rounded-md"></div>
              <div className="h-3 w-[60%] bg-[#ddd] rounded-md"></div>
              <div className="h-3 w-[85%] bg-[#ddd] rounded-md"></div>
              <div className="h-3 w-[75%] bg-[#ddd] rounded-md"></div>
              <div className="h-9 w-full bg-[#ddd] rounded-[20px] mt-auto"></div>

              <div className="absolute bottom-10 left-4 md:-left-8 bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2 text-xs font-bold z-10 border border-[#eee]">
                <div className="w-2 h-2 rounded-full bg-[#FF7A33]"></div>
                AI Blog Draft Ready
              </div>
            </div>

            {/* Center Image - Always visible */}
            <div className="w-full max-w-[480px] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-20">
              <Image
                src="/design/Frame 23.png"
                alt="Content Creation"
                width={500}
                height={312}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Card Placeholder - Hidden on mobile/tablet */}
            <div className="hidden lg:flex flex-1 w-full max-w-[300px] h-[320px] bg-[#eee] rounded-3xl p-6 flex-col gap-4 justify-center relative">
              <div className="absolute -top-4 right-0 md:-right-5 bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2 text-xs font-bold z-10 border border-[#eee]">
                <div className="w-2 h-2 rounded-full bg-[#FF7A33]"></div>
                Publish Anywhere
              </div>

              <div className="h-3 w-[90%] bg-[#ddd] rounded-md"></div>
              <div className="h-3 w-[70%] bg-[#ddd] rounded-md"></div>
              <div className="h-3 w-[80%] bg-[#ddd] rounded-md"></div>
              <div className="h-3 w-[60%] bg-[#ddd] rounded-md"></div>
              <div className="h-3 w-[85%] bg-[#ddd] rounded-md"></div>
              <div className="h-3 w-[75%] bg-[#ddd] rounded-md"></div>
              <div className="h-9 w-full bg-[#ddd] rounded-[20px] mt-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F0 100%)',
          borderRadius: '60px',
          padding: '80px 40px',
          boxShadow: '0 20px 80px rgba(0,0,0,0.03)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 42px)',
              fontWeight: 800,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              lineHeight: '1.2',
              color: '#1a1a1a'
            }}>
              AIMy Blogs Captures Every Content
              <span style={{ fontSize: 'clamp(32px, 5vw, 42px)', fontWeight: 300, fontStyle: 'italic', fontFamily: 'serif', color: '#555' }}>Detail Automatically</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '80px' }}>
            {[
              { num: '01', title: 'Connect Your Platforms', desc: 'Connect WordPress, Medium, Ghost, LinkedIn and more using simple setup.' },
              { num: '02', title: 'Generate AI Blogs', desc: 'Pick a topic, select tone & length, and let AI create a structured blog instantly.' },
              { num: '03', title: 'Optimize for SEO', desc: 'Improve keyword focus, structure, and writing clarity for better ranking.' },
              { num: '04', title: 'Publish + Track Results', desc: 'Schedule or publish instantly, then track performance from your dashboard.' }
            ].map((step, idx) => (
              <div key={idx} style={{
                backgroundColor: 'white',
                padding: '40px 32px',
                borderRadius: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 800,
                  color: '#1a1a1a',
                  marginBottom: '24px',
                  lineHeight: 1
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', color: '#1a1a1a' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', fontWeight: 500 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px', color: '#1a1a1a' }}>Start your free trial today</h3>
            <p style={{ color: '#666', fontSize: '15px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
              With AIMy Blogs, publish your blog posts on all major platforms in a few clicks. Reach your audience where they are, and track performance.
            </p>
            <button
              onClick={handleStart}
              style={{
                backgroundColor: '#FF7A33',
                color: 'white',
                padding: '18px 48px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(255, 122, 51, 0.3)'
              }}>
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Detailed Features Grid */}
      <section style={{ padding: '80px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 42px)', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px' }}>
              A Quick Overview of Essential <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#555', fontFamily: 'serif' }}>Features</span>
            </h2>
            <p style={{ color: '#666', fontSize: '16px', maxWidth: '700px', margin: '0 auto' }}>
              Everything you need to create content that ranks, converts, and scales without hiring a full team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left Column - Feature List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Item 1 - Active */}
              <div style={{
                backgroundColor: '#FFF9F5',
                padding: '32px',
                borderRadius: '24px',
                border: '1px solid #FFE8DF'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#FF7A33',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  color: 'white'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#1a1a1a' }}>Real-time Blog Generation</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>Generate complete blogs with a strong structure: intro, sections, CTA, and conclusion.</p>
              </div>

              {/* Item 2 */}
              <div style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '24px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}>
                <div style={{ marginBottom: '24px', color: '#8B4513' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#1a1a1a' }}>Smart SEO + Readability Score</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>Improve keyword focus, structure, and writing clarity for better ranking.</p>
              </div>

              {/* Item 3 */}
              <div style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '24px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}>
                <div style={{ marginBottom: '24px', color: '#8B4513' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#1a1a1a' }}>One-Click Highlights & Repurpose</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>Instantly convert your blog into Twitter threads, LinkedIn posts, and summaries.</p>
              </div>

              {/* Item 4 */}
              <div style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '24px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}>
                <div style={{ marginBottom: '24px', color: '#8B4513' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#1a1a1a' }}>Multi-Platform Publishing</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>Publish to multiple platforms in one go—with platform-specific formatting support.</p>
              </div>
            </div>

            {/* Right Column - Gallery */}
            <div style={{
              backgroundColor: '#f5f5f5',
              borderRadius: '32px',
              padding: '24px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* Main Image */}
              <div style={{
                flex: 1,
                minHeight: '400px',
                backgroundColor: '#1a1a1a',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <Image
                  src="/design/Frame 23.png"
                  alt="Workspace"
                  width={600}
                  height={400}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Thumbnails Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ aspectRatio: '1', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
                  <Image
                    src="/design/Frame 59.png"
                    alt="Workspace"
                    width={600}
                    height={400}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ aspectRatio: '1', backgroundColor: '#FFC0CB', borderRadius: '16px', overflow: 'hidden' }}>
                  <Image
                    src="/design/Frame 60.png"
                    alt="Workspace"
                    width={600}
                    height={400}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ aspectRatio: '1', backgroundColor: '#333', borderRadius: '16px', overflow: 'hidden' }}>
                  <Image
                    src="/design/Frame 61.png"
                    alt="Workspace"
                    width={600}
                    height={400}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ aspectRatio: '1', backgroundColor: '#ccc', borderRadius: '16px', overflow: 'hidden' }}>
                  <Image
                    src="/design/Frame 62.png"
                    alt="Workspace"
                    width={600}
                    height={400}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Trusted By Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 42px)', fontWeight: 800, maxWidth: '500px', lineHeight: '1.2', color: '#1a1a1a' }}>
              Trusted by High-<span style={{ fontFamily: 'serif', fontStyle: 'italic', fontWeight: 300, color: '#666' }}>Performing Teams</span>
            </h2>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFF5F0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} /></button>
              <button style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FF7A33', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}><ArrowRight size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ border: '1px solid #eee', borderRadius: '24px', padding: '32px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="#FF7A33" color="#FF7A33" />)}
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginBottom: '32px' }}>
                  &quot;This AI platform is a game changer. Used to take days to write blogs, now it takes minutes. A perfect tool for content creators!&quot;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee' }}></div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a' }}>Alex J.</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>Content Creator</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '60px', borderTop: '1px solid #f0f0f0', paddingTop: '40px', flexWrap: 'wrap', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>10,000+</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>Customers worldwide</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>50,000+</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>Content Published</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>3.2M+</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>Total Reads</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>1000+</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>Comments on month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 42px)', fontWeight: 800, color: '#1a1a1a', marginBottom: '16px' }}>
              Pricing That Grows as <span style={{ fontStyle: 'italic', fontWeight: 600, color: '#666', fontFamily: 'serif' }}>You Grow</span>
            </h2>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '32px' }}>
              Choose a plan that fits your workflow today upgrade anytime as you scale.
            </p>

            {/* Pricing Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', fontSize: '14px', fontWeight: 600 }}>
              <span style={{ color: '#1a1a1a' }}>Monthly</span>
              <div
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                style={{
                  width: '48px',
                  height: '24px',
                  backgroundColor: '#eee',
                  borderRadius: '50px',
                  padding: '2px',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: billingPeriod === 'monthly' ? 'flex-start' : 'flex-end',
                  transition: 'all 0.2s'
                }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
              </div>
              <span style={{ color: '#999' }}>Annual <span style={{ color: '#FF7A33', marginLeft: '4px' }}>-20%</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'STARTER', name: 'Starter Plan', monthlyPrice: '₹5,000', annualPrice: '₹40,000', featured: false, bgColor: '#FFF9F6', textColor: '#1a1a1a' },
              { id: 'CREATOR', name: 'Creator Plan', monthlyPrice: '₹15,000', annualPrice: '₹150,000', featured: true, bgColor: '#FF7A33', textColor: 'white' },
              { id: 'PROFESSIONAL', name: 'Professional Plan', monthlyPrice: '₹20,000', annualPrice: '₹180,000', featured: false, bgColor: '#FFF9F6', textColor: '#1a1a1a' }
            ].map((p, i) => (
              <div key={i} style={{
                backgroundColor: 'white',
                borderRadius: '32px',
                overflow: 'hidden',
                border: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  backgroundColor: p.bgColor,
                  padding: '40px 32px',
                  color: p.textColor,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: p.featured ? 'rgba(255,255,255,0.3)' : '#FF7A33',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div className="grid grid-cols-2 gap-0.5" style={{ width: '16px' }}>
                        {[1, 2, 3, 4].map(j => <div key={j} style={{ width: '6px', height: '6px', border: `1.5px solid white`, borderRadius: '1px' }}></div>)}
                      </div>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: 700 }}>{p.name}</span>
                  </div>

                  <div style={{ fontSize: '32px', fontWeight: 800 }}>
                    {billingPeriod === 'annual' ? p.annualPrice : p.monthlyPrice}<span style={{ fontSize: '15px', fontWeight: 500, opacity: 0.8 }}>/{billingPeriod === 'annual' ? 'Year' : 'Month'}</span>
                  </div>

                  <button
                    onClick={() => router.push('/pricing')}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '50px',
                      border: p.featured ? 'none' : '1px solid #ddd',
                      backgroundColor: 'white',
                      color: '#1a1a1a',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                    Get Started
                  </button>
                </div>

                <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    '15,000 words/month',
                    '5 blog templates',
                    '15 images/month',
                    'Basic SEO tools',
                    'Email support'
                  ].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#1a1a1a', fontWeight: 500 }}>
                      <Check style={{ width: '18px', height: '18px', color: '#1a1a1a' }} strokeWidth={2.5} />
                      <span>{f}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f0f0f0', fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>
                    Perfect for Individuals.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', color: '#1a1a1a' }}>Frequently Asked Questions</h2>
            <p style={{ color: '#666' }}>Everything you need to know before getting started with AIMy Blogs.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              {
                q: "What is AIMy Blogs?",
                a: "AIMy Blogs is an AI-powered content creation platform that helps you generate, optimize, and publish high-quality blogs across multiple platforms like WordPress, Medium, and LinkedIn."
              },
              {
                q: "Do I need writing experience to use AIMy Blogs?",
                a: "No, you don't need expert writing skills. Our AI helps you structure, write, and polish your content, making it perfect for beginners and pros alike."
              },
              {
                q: "Can I publish directly to WordPress or Medium?",
                a: "Yes! We support direct integration with WordPress, Medium, Ghost, and LinkedIn, allowing you to publish your content with a single click."
              },
              {
                q: "Does AIMy Blogs support SEO optimization?",
                a: "Absolutely. We provide real-time SEO scoring, keyword optimization suggestions, and readability improvements to help your content rank higher."
              },
              {
                q: "Can I generate blog images using AIMy Blogs?",
                a: "Yes, our platform includes AI image generation tools to create relevant, royalty-free images for your blog posts automatically."
              },
              {
                q: "Can I rewrite or improve my existing blog content?",
                a: "Yes, you can import existing content, and our AI will suggest improvements, rewrite sections, or repurpose it for different platforms."
              }
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: openFaq === idx ? '24px' : '16px',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a' }}>{idx + 1}. {item.q}</span>
                  {openFaq === idx ? <Minus size={16} color="#666" /> : <Plus size={16} color="#666" />}
                </div>

                {openFaq === idx && (
                  <div style={{
                    marginTop: '16px',
                    fontSize: '15px',
                    color: '#666',
                    lineHeight: '1.6',
                    paddingLeft: '0',
                    animation: 'fadeIn 0.3s ease-in'
                  }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
