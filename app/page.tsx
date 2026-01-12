"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  PenTool,
  Calendar,
  BarChart3,
  Sparkles,
  Check,
  Plus
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { useState, useEffect, useRef } from "react"

const chartData = [
  { month: 'Jan', platform1: 1200, platform2: 800 },
  { month: 'Feb', platform1: 1500, platform2: 1000 },
  { month: 'Mar', platform1: 1400, platform2: 1100 },
  { month: 'Apr', platform1: 1800, platform2: 1300 },
  { month: 'May', platform1: 2200, platform2: 1600 },
  { month: 'Jun', platform1: 2100, platform2: 1700 },
  { month: 'Jul', platform1: 2600, platform2: 1900 },
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isChartVisible, setIsChartVisible] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [pricingVisible, setPricingVisible] = useState(false)

  const chartRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hero animation on mount
    setTimeout(() => setHeroVisible(true), 100)

    const observerOptions = { threshold: 0.15 }

    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setIsChartVisible(true)
      })
    }, observerOptions)

    const featuresObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setFeaturesVisible(true)
      })
    }, observerOptions)

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setStatsVisible(true)
      })
    }, observerOptions)

    const pricingObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setPricingVisible(true)
      })
    }, observerOptions)

    if (chartRef.current) chartObserver.observe(chartRef.current)
    if (featuresRef.current) featuresObserver.observe(featuresRef.current)
    if (statsRef.current) statsObserver.observe(statsRef.current)
    if (pricingRef.current) pricingObserver.observe(pricingRef.current)

    return () => {
      if (chartRef.current) chartObserver.unobserve(chartRef.current)
      if (featuresRef.current) featuresObserver.unobserve(featuresRef.current)
      if (statsRef.current) statsObserver.unobserve(statsRef.current)
      if (pricingRef.current) pricingObserver.unobserve(pricingRef.current)
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f1e8' }}>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .hover-lift {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -12px rgba(31, 53, 41, 0.2);
        }

        .hover-scale {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-scale:hover {
          transform: scale(1.05);
        }

        .btn-primary {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(31, 53, 41, 0.3);
        }

        .feature-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          padding: 2px;
          background: linear-gradient(135deg, transparent, rgba(31, 53, 41, 0.1));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s;
        }

        .feature-card:hover::before {
          opacity: 1;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
          border-color: #1f3529;
        }

        .pricing-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pricing-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
        }

        .platform-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.7;
        }

        .platform-item:hover {
          opacity: 1;
          transform: translateY(-3px);
        }
      `}</style>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(245,241,232,0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'transform 0.2s ease'
          }}
          className="hover-scale">
            <PenTool style={{ height: '22px', width: '22px', color: '#1f3529' }} strokeWidth={2} />
            <span style={{ fontSize: '19px', fontWeight: 600, letterSpacing: '-0.025em', color: '#1f3529' }}>PublishType</span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '36px', fontSize: '14px' }} className="hidden md:flex">
            {['Home', 'Features', 'Pricing', 'Blog'].map((item) => (
              <Link
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontWeight: 500,
                  position: 'relative',
                  padding: '4px 0',
                  transition: 'color 0.2s'
                }}
              >
                {item}
              </Link>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/login">
              <Button variant="ghost" size="sm" style={{
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}>
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="btn-primary"
                style={{
                  backgroundColor: '#1f3529',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: '10px 24px'
                }}
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: '1152px', margin: '0 auto', padding: '104px 32px 72px' }} ref={heroRef}>
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 56px' }}>
          <p style={{
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: '#6b7280',
            marginBottom: '28px',
            fontWeight: 600,
            textTransform: 'uppercase',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s'
          }}>
            Your content, amplified across platforms
          </p>
          <h1 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '72px',
            lineHeight: '1.1',
            marginBottom: '36px',
            letterSpacing: '-0.03em',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
          }}>
            Publish Once,<br/>
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Reach Everywhere</span>
          </h1>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.7',
            color: '#4b5563',
            maxWidth: '700px',
            margin: '0 auto 48px',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
          }}>
            With PublishType, publish your blog posts on all major platforms in a few clicks.
            Reach your audience where they are, and track performance from one simple dashboard.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '88px',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.4s'
          }}>
            <button className="btn-primary" style={{
              backgroundColor: '#1f3529',
              color: 'white',
              padding: '16px 36px',
              fontSize: '16px',
              fontWeight: 500,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}>
              Start For Free
            </button>
            <button className="hover-lift" style={{
              border: '2px solid #1f3529',
              color: '#1f3529',
              backgroundColor: 'transparent',
              padding: '14px 36px',
              fontSize: '16px',
              fontWeight: 500,
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Learn More
            </button>
          </div>

          {/* Analytics Chart */}
          <div
            ref={chartRef}
            style={{
              position: 'relative',
              margin: '0 auto',
              maxWidth: '860px',
              opacity: isChartVisible ? 1 : 0,
              transform: isChartVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 0.9s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div
              className="hover-lift"
              style={{
                position: 'relative',
                backgroundColor: '#fafaf9',
                border: '1px solid #ebe4d5',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div style={{
                padding: '32px 40px 24px',
                borderBottom: '1px solid #ebe4d5',
                background: 'linear-gradient(to bottom, #fafaf9, #ffffff)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  opacity: isChartVisible ? 1 : 0,
                  transform: isChartVisible ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#1f3529',
                    margin: 0
                  }}>
                    Publication Performance
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    fontWeight: 600,
                    backgroundColor: '#ebe4d5',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    letterSpacing: '0.5px'
                  }}>
                    LAST 7 MONTHS
                  </span>
                </div>
                <p style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  margin: 0,
                  marginTop: '6px',
                  opacity: isChartVisible ? 1 : 0,
                  transition: 'opacity 0.7s ease-out 0.4s'
                }}>
                  Track your content reach across platforms
                </p>
              </div>

              <div style={{
                padding: '28px 40px 32px',
                backgroundColor: 'white',
                opacity: isChartVisible ? 1 : 0,
                transition: 'opacity 0.9s ease-out 0.5s'
              }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPlatform1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1f3529" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#1f3529" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPlatform2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b9485" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#8b9485" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke="#ebe4d5"
                      vertical={false}
                      opacity={0.6}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
                      stroke="#ebe4d5"
                      tickLine={false}
                      axisLine={{ stroke: '#ebe4d5', strokeWidth: 1 }}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
                      stroke="#ebe4d5"
                      tickLine={false}
                      axisLine={{ stroke: '#ebe4d5', strokeWidth: 1 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                      dx={-8}
                    />
                    <Tooltip
                      cursor={{ stroke: '#ebe4d5', strokeWidth: 1, strokeDasharray: '4 4' }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '10px',
                        fontSize: '13px',
                        padding: '12px 16px',
                        boxShadow: '0 12px 24px -6px rgba(0, 0, 0, 0.12)'
                      }}
                      labelStyle={{
                        fontWeight: 600,
                        color: '#1f3529',
                        marginBottom: '6px'
                      }}
                      animationDuration={300}
                    />
                    <Line
                      type="monotone"
                      dataKey="platform1"
                      stroke="#1f3529"
                      strokeWidth={3}
                      dot={{
                        fill: '#1f3529',
                        r: 5,
                        strokeWidth: 0,
                        style: {
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }
                      }}
                      activeDot={{
                        r: 7,
                        fill: '#1f3529',
                        strokeWidth: 3,
                        stroke: 'white',
                        style: { filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))' }
                      }}
                      name="Medium"
                      animationBegin={isChartVisible ? 600 : 0}
                      animationDuration={1800}
                      animationEasing="ease-in-out"
                    />
                    <Line
                      type="monotone"
                      dataKey="platform2"
                      stroke="#8b9485"
                      strokeWidth={3}
                      dot={{
                        fill: '#8b9485',
                        r: 5,
                        strokeWidth: 0,
                        style: {
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }
                      }}
                      activeDot={{
                        r: 7,
                        fill: '#8b9485',
                        strokeWidth: 3,
                        stroke: 'white',
                        style: { filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))' }
                      }}
                      name="Substack"
                      animationBegin={isChartVisible ? 800 : 0}
                      animationDuration={1800}
                      animationEasing="ease-in-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{
                padding: '18px 40px',
                backgroundColor: '#fafaf9',
                borderTop: '1px solid #ebe4d5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: isChartVisible ? 1 : 0,
                transform: isChartVisible ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.7s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                  <div className="hover-scale" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '3px',
                      backgroundColor: '#1f3529'
                    }}></div>
                    <span style={{ fontSize: '14px', color: '#4b5563', fontWeight: 600 }}>
                      Medium
                    </span>
                  </div>
                  <div className="hover-scale" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '3px',
                      backgroundColor: '#8b9485'
                    }}></div>
                    <span style={{ fontSize: '14px', color: '#4b5563', fontWeight: 600 }}>
                      Substack
                    </span>
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}>
                  MONTHLY VIEWS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Integrations */}
      <section style={{
        maxWidth: '1152px',
        margin: '0 auto',
        padding: '72px 32px',
        textAlign: 'center',
        borderTop: '1px solid rgba(0,0,0,0.06)'
      }}>
        <p style={{
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: '#9ca3af',
          marginBottom: '40px',
          fontWeight: 600,
          textTransform: 'uppercase'
        }}>
          Integrates with all your favorite platforms
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '72px 56px' }}>
          {[
            { icon: '👻', name: 'Ghost Blog' },
            { icon: '📮', name: 'Substack' },
            { icon: '💼', name: 'LinkedIn' },
            { icon: '🐝', name: 'Beehiiv' },
            { icon: '✉️', name: 'ConvertKit' },
          ].map((platform, i) => (
            <div
              key={platform.name}
              className="platform-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#6b7280',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '24px' }}>{platform.icon}</span>
              <span style={{ fontSize: '15px', fontWeight: 600 }}>{platform.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section ref={statsRef} style={{ maxWidth: '1152px', margin: '0 auto', padding: '88px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '56px' }}>
          {[
            { icon: BarChart3, number: '10,000+', label: 'Active Users', delay: '0s' },
            { icon: PenTool, number: '500K+', label: 'Content Published', delay: '0.1s' },
            { icon: Sparkles, number: '5M+', label: 'Total Reach', delay: '0.2s' }
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${stat.delay}`
              }}
            >
              <div className="hover-scale" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#1f3529',
                marginBottom: '24px',
                cursor: 'pointer'
              }}>
                <stat.icon style={{ height: '32px', width: '32px', color: 'white' }} strokeWidth={1.5} />
              </div>
              <div style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '64px',
                fontWeight: 700,
                marginBottom: '14px',
                letterSpacing: '-0.03em',
                color: '#1f3529'
              }}>{stat.number}</div>
              <p style={{
                fontSize: '12px',
                letterSpacing: '0.15em',
                color: '#6b7280',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} id="features" style={{ maxWidth: '1152px', margin: '0 auto', padding: '88px 32px' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '72px',
          opacity: featuresVisible ? 1 : 0,
          transform: featuresVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <h2 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '56px',
            marginBottom: '20px',
            letterSpacing: '-0.03em',
            color: '#1f3529'
          }}>Everything you need to scale</h2>
          <p style={{
            fontSize: '17px',
            color: '#4b5563',
            maxWidth: '720px',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            Stop switching between platforms. Manage everything from one central hub and save hours every week.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {[
            {
              icon: Sparkles,
              title: 'Multi-Platform Publishing',
              desc: 'Publish your content to Ghost, Substack, LinkedIn, and more with one click. Save time and reach your audience wherever they are.',
              delay: '0s'
            },
            {
              icon: Sparkles,
              title: 'AI-Powered Generation',
              desc: 'Create engaging, platform-optimized content with our AI writing assistant. Generate ideas, titles, and outlines in seconds.',
              delay: '0.1s'
            },
            {
              icon: BarChart3,
              title: 'Real-Time Analytics',
              desc: 'Track engagement metrics across all platforms in one unified dashboard. Make data-driven decisions to grow your audience.',
              delay: '0.2s'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="feature-card"
              style={{
                padding: '44px',
                backgroundColor: 'white',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '20px',
                opacity: featuresVisible ? 1 : 0,
                transform: featuresVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${feature.delay}`
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ebe4d5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px'
              }}>
                <feature.icon style={{ height: '24px', width: '24px', color: '#1f3529' }} strokeWidth={2} />
              </div>
              <h3 style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '26px',
                marginBottom: '18px',
                letterSpacing: '-0.025em',
                color: '#1f3529'
              }}>{feature.title}</h3>
              <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.7' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="how-it-works" style={{ backgroundColor: 'rgba(235, 228, 213, 0.4)', padding: '104px 0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '88px' }}>
            <h2 style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '56px',
              marginBottom: '20px',
              letterSpacing: '-0.03em',
              color: '#1f3529'
            }}>From Draft to Distribution</h2>
            <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: '1.7' }}>Your content journey, simplified in four steps</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px' }}>
            {[
              { icon: PenTool, num: '1', title: 'Create', desc: 'Write your content in our intuitive editor', bg: '#1f3529' },
              { icon: Sparkles, num: '2', title: 'Craft', desc: 'Optimize with AI suggestions and formatting', bg: 'white' },
              { icon: Calendar, num: '3', title: 'Schedule', desc: 'Set it and forget it with our scheduling', bg: 'white' },
              { icon: BarChart3, num: '4', title: 'Analyze', desc: 'Monitor performance and optimize', bg: 'white' }
            ].map((step, i) => (
              <div key={i} className="hover-lift" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  backgroundColor: step.bg,
                  color: step.bg === 'white' ? '#1f3529' : 'white',
                  border: step.bg === 'white' ? '2px solid #e5e7eb' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 28px',
                  boxShadow: step.bg === '#1f3529' ? '0 12px 24px -6px rgba(31, 53, 41, 0.3)' : 'none',
                  transition: 'all 0.3s'
                }}>
                  <step.icon style={{ height: '36px', width: '36px' }} strokeWidth={1.5} />
                </div>
                <h3 style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '22px',
                  marginBottom: '14px',
                  letterSpacing: '-0.025em',
                  color: '#1f3529'
                }}>{step.num}. {step.title}</h3>
                <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.7' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: '1152px', margin: '0 auto', padding: '104px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <h2 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '56px',
            letterSpacing: '-0.03em',
            color: '#1f3529'
          }}>Creators love PublishType</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {[
            {
              stars: 5,
              text: "PublishType has AMAZING content that I used for my latest blog posts. I got 200K+ views across all platforms in just one week!",
              name: "Sarah Khan",
              role: "Content Creator"
            },
            {
              stars: 5,
              text: "I spent 3-4 hours a day manually posting to different platforms. Now it takes me 10 minutes with PublishType. Game changer!",
              name: "Marcus Lee",
              role: "Tech Blogger"
            },
            {
              stars: 5,
              text: "The analytics dashboard is pure magic! I can actually see what works and optimize my strategy accordingly.",
              name: "Emma Rodriguez",
              role: "Newsletter Writer"
            }
          ].map((testimonial, i) => (
            <div key={i} className="hover-lift" style={{
              padding: '36px',
              backgroundColor: 'white',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: '20px'
            }}>
              <div style={{ display: 'flex', gap: '3px', marginBottom: '24px' }}>
                {[...Array(testimonial.stars)].map((_, i) => (
                  <span key={i} style={{ color: '#1f3529', fontSize: '20px' }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: '16px', color: '#374151', marginBottom: '36px', lineHeight: '1.7', fontStyle: 'italic' }}>
                "{testimonial.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ebe4d5' }}></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>{testimonial.name}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section ref={pricingRef} id="pricing" style={{ maxWidth: '1152px', margin: '0 auto', padding: '104px 32px' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '72px',
          opacity: pricingVisible ? 1 : 0,
          transform: pricingVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <h2 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '56px',
            marginBottom: '20px',
            letterSpacing: '-0.03em',
            color: '#1f3529'
          }}>Simple, Transparent Pricing</h2>
          <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: '1.7' }}>Choose the plan that works for you. Cancel anytime.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '28px',
          maxWidth: '1080px',
          margin: '0 auto',
          alignItems: 'center'
        }}>
          {/* Free Plan */}
          <div className="pricing-card" style={{
            padding: '36px',
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '20px',
            height: '100%',
            opacity: pricingVisible ? 1 : 0,
            transform: pricingVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0s'
          }}>
            <div style={{ marginBottom: '36px' }}>
              <h3 style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '26px',
                marginBottom: '18px',
                letterSpacing: '-0.025em',
                color: '#1f3529'
              }}>Free</h3>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '56px', fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 700, color: '#1f3529' }}>$0</span>
                <span style={{ color: '#6b7280', fontSize: '17px', fontWeight: 500 }}>/month</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '36px' }}>
              {[
                '1 blog post/month',
                '2 platform integrations',
                'Basic analytics',
                'Email support'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: '#374151', marginBottom: '14px' }}>
                  <Check style={{ height: '18px', width: '18px', color: '#9ca3af', marginTop: '3px', flexShrink: 0 }} strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="hover-lift" style={{
              width: '100%',
              border: '2px solid #d1d5db',
              color: '#374151',
              backgroundColor: 'white',
              borderRadius: '10px',
              height: '48px',
              fontWeight: 500,
              fontSize: '15px',
              cursor: 'pointer'
            }}>
              Get Started
            </button>
          </div>

          {/* Creator Plan - Featured */}
          <div className="pricing-card" style={{
            padding: '36px',
            backgroundColor: '#1f3529',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 28px 56px -14px rgba(0, 0, 0, 0.28)',
            transform: pricingVisible ? 'scale(1.05)' : 'scale(0.95)',
            position: 'relative',
            zIndex: 10,
            height: '100%',
            opacity: pricingVisible ? 1 : 0,
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.1s'
          }}>
            <div style={{
              position: 'absolute',
              top: '-14px',
              right: '20px',
              backgroundColor: '#ebe4d5',
              color: '#1f3529',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}>
              POPULAR
            </div>
            <div style={{ marginBottom: '36px' }}>
              <h3 style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '26px',
                marginBottom: '18px',
                letterSpacing: '-0.025em'
              }}>Creator</h3>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '56px', fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 700 }}>$29</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '17px', fontWeight: 500 }}>/month</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '36px' }}>
              {[
                'AI-Powered Generation',
                'Unlimited Posts',
                'All Platforms',
                'Priority Support',
                'Team Collaboration'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', marginBottom: '14px' }}>
                  <Check style={{ height: '18px', width: '18px', marginTop: '3px', flexShrink: 0 }} strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="btn-primary" style={{
              width: '100%',
              backgroundColor: 'white',
              color: '#1f3529',
              border: 'none',
              borderRadius: '10px',
              height: '48px',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)'
            }}>
              Start Free Trial
            </button>
          </div>

          {/* Professional Plan */}
          <div className="pricing-card" style={{
            padding: '36px',
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '20px',
            height: '100%',
            opacity: pricingVisible ? 1 : 0,
            transform: pricingVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
          }}>
            <div style={{ marginBottom: '36px' }}>
              <h3 style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '26px',
                marginBottom: '18px',
                letterSpacing: '-0.025em',
                color: '#1f3529'
              }}>Professional</h3>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '56px', fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 700, color: '#1f3529' }}>$59</span>
                <span style={{ color: '#6b7280', fontSize: '17px', fontWeight: 500 }}>/month</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '36px' }}>
              {[
                'Everything in Creator',
                'Advanced Analytics',
                'Custom Branding',
                'API Access',
                'Dedicated Support'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: '#374151', marginBottom: '14px' }}>
                  <Check style={{ height: '18px', width: '18px', color: '#1f3529', marginTop: '3px', flexShrink: 0 }} strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="hover-lift" style={{
              width: '100%',
              border: '2px solid #d1d5db',
              color: '#374151',
              backgroundColor: 'white',
              borderRadius: '10px',
              height: '48px',
              fontWeight: 500,
              fontSize: '15px',
              cursor: 'pointer'
            }}>
              Contact Sales
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '44px', fontSize: '15px', color: '#6b7280', fontWeight: 500 }}>
          Start with Medium/Substack/Beehiiv
        </p>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: '840px', margin: '0 auto', padding: '104px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <h2 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '56px',
            letterSpacing: '-0.03em',
            color: '#1f3529'
          }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            {
              q: "Which platforms are currently supported?",
              a: "We currently support Ghost, Substack, LinkedIn, Medium, Dev.to, Hashnode, Beehiiv, and ConvertKit. We're constantly adding new platforms based on user demand."
            },
            {
              q: "Can I cancel or switch subscriptions at any time?",
              a: "Yes! You can upgrade, downgrade, or cancel your subscription at any time from your account settings. Changes take effect at the start of your next billing cycle."
            },
            {
              q: "How does the content creation process work?",
              a: "Simply write your content in our editor, customize it for each platform if needed, and publish with one click. Our AI helps optimize for each platform's best practices."
            },
            {
              q: "What's your refund policy?",
              a: "We offer a 30-day money-back guarantee. If you're not satisfied with PublishType, contact our support team for a full refund within 30 days of purchase."
            }
          ].map((faq, i) => (
            <div
              key={i}
              className="hover-lift"
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '16px',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.3s'
              }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div style={{
                padding: '28px 36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>{faq.q}</h3>
                <Plus
                  style={{
                    height: '22px',
                    width: '22px',
                    color: '#9ca3af',
                    transition: 'transform 0.3s',
                    transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    flexShrink: 0,
                    marginLeft: '18px'
                  }}
                  strokeWidth={2}
                />
              </div>
              {openFaq === i && (
                <div style={{
                  padding: '0 36px 28px',
                  fontSize: '15px',
                  color: '#4b5563',
                  lineHeight: '1.7',
                  animation: 'fadeInUp 0.3s ease-out'
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1a3428', color: 'white', padding: '72px 0', marginTop: '56px' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '56px',
            marginBottom: '56px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <PenTool style={{ height: '22px', width: '22px' }} strokeWidth={2} />
                <span style={{ fontWeight: 600, fontSize: '19px' }}>PublishType</span>
              </div>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.7', marginBottom: '28px' }}>
                Publish once, reach everywhere. The modern content distribution platform for creators.
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Integrations', 'Changelog']
              },
              {
                title: 'Resources',
                links: ['Blog', 'Documentation', 'Help Center', 'Community']
              },
              {
                title: 'Company',
                links: ['About', 'Careers', 'Contact', 'Legal']
              }
            ].map((section, i) => (
              <div key={i}>
                <h4 style={{ fontWeight: 600, marginBottom: '18px', fontSize: '16px' }}>{section.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link href="#" className="hover-scale" style={{
                        fontSize: '15px',
                        color: 'rgba(255,255,255,0.65)',
                        textDecoration: 'none',
                        display: 'inline-block'
                      }}>
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '56px', paddingBottom: '36px' }}>
            <div style={{ maxWidth: '480px' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '14px', fontSize: '16px' }}>Subscribe to our newsletter</h4>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', marginBottom: '18px', lineHeight: '1.6' }}>
                Get the latest updates on new features and platform integrations.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontSize: '15px',
                    color: 'white'
                  }}
                />
                <button className="btn-primary" style={{
                  backgroundColor: 'white',
                  color: '#1f3529',
                  padding: '12px 28px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '36px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '18px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)'
          }}>
            <p>© 2024 PublishType. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '28px' }}>
              <Link href="#" className="hover-scale" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="#" className="hover-scale" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
