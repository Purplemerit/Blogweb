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
  Plus,
  ArrowRight,
  Zap,
  Users,
  Globe,
  Twitter,
  Linkedin,
  Github,
  Mail,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/AuthContext"
import { Header } from "@/components/layout/header"
import { PricingCarousel } from "@/components/PricingCarousel"

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
  const { user } = useAuth()
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isChartVisible, setIsChartVisible] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [pricingVisible, setPricingVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null)
  const [activeFeature, setActiveFeature] = useState<number | null>(null)
  const [counters, setCounters] = useState({ users: 0, content: 0, reach: 0 })
  const [email, setEmail] = useState("")
  const [screenSize, setScreenSize] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  const chartRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hero animation on mount
    setTimeout(() => setHeroVisible(true), 100)

    // Handle window resize for responsive pricing cards
    const handleResize = () => {
      setScreenSize(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    // Testimonial carousel auto-rotate
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3)
    }, 5000)

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
        if (entry.isIntersecting) {
          setStatsVisible(true)
          // Animate counters
          const duration = 2000
          const steps = 60
          const usersTarget = 10000
          const contentTarget = 500000
          const reachTarget = 5000000

          let currentStep = 0
          const counterInterval = setInterval(() => {
            currentStep++
            const progress = currentStep / steps
            setCounters({
              users: Math.floor(usersTarget * progress),
              content: Math.floor(contentTarget * progress),
              reach: Math.floor(reachTarget * progress)
            })
            if (currentStep >= steps) clearInterval(counterInterval)
          }, duration / steps)
        }
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
      window.removeEventListener('resize', handleResize)
      clearInterval(testimonialInterval)
      if (chartRef.current) chartObserver.unobserve(chartRef.current)
      if (featuresRef.current) featuresObserver.unobserve(featuresRef.current)
      if (statsRef.current) statsObserver.unobserve(statsRef.current)
      if (pricingRef.current) pricingObserver.unobserve(pricingRef.current)
    }
  }, [])

  // Helper function to format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

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

        .pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .gradient-bg {
          background: linear-gradient(135deg, #f5f1e8 0%, #ebe4d5 50%, #f5f1e8 100%);
          background-size: 200% 200%;
          animation: gradientShift 15s ease infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .slide-in {
          animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-10px);
          background: #1f3529;
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s;
        }

        .tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: #1f3529;
        }

        .platform-item:hover .tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(-5px);
        }
      `}</style>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="gradient-bg" style={{ maxWidth: '1152px', margin: '0 auto', padding: '104px 32px 72px', position: 'relative', overflow: 'hidden' }} ref={heroRef}>
        {/* Animated decorative elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(31, 53, 41, 0.08) 0%, transparent 70%)',
          opacity: heroVisible ? 0.6 : 0,
          transition: 'opacity 1.5s ease-out 0.5s'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '8%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(31, 53, 41, 0.06) 0%, transparent 70%)',
          opacity: heroVisible ? 0.5 : 0,
          transition: 'opacity 1.5s ease-out 0.8s'
        }} />

        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 56px', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'white',
            padding: '8px 18px',
            borderRadius: '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.05s'
          }}>
            <Zap style={{ height: '14px', width: '14px', color: '#1f3529' }} strokeWidth={2.5} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1f3529', letterSpacing: '0.3px' }}>
              Join 10,000+ creators
            </span>
          </div>

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
            Publish Once,<br />
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
            <Link href="/signup">
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
            </Link>
            <Link href="#features">
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
            </Link>
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
                        <stop offset="5%" stopColor="#1f3529" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#1f3529" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPlatform2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b9485" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#8b9485" stopOpacity={0} />
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
            { icon: '👻', name: 'Ghost Blog', desc: '500+ integrations' },
            { icon: '📮', name: 'Substack', desc: 'Newsletter platform' },
            { icon: '💼', name: 'LinkedIn', desc: 'Professional network' },
            { icon: '🐝', name: 'Beehiiv', desc: 'Modern newsletters' },
            { icon: '✉️', name: 'ConvertKit', desc: 'Email marketing' },
          ].map((platform, i) => (
            <div
              key={platform.name}
              className="platform-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#6b7280',
                cursor: 'pointer',
                position: 'relative',
                padding: '12px 20px',
                borderRadius: '12px',
                backgroundColor: hoveredPlatform === platform.name ? 'white' : 'transparent',
                boxShadow: hoveredPlatform === platform.name ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={() => setHoveredPlatform(platform.name)}
              onMouseLeave={() => setHoveredPlatform(null)}
            >
              <span style={{ fontSize: '24px', transition: 'transform 0.3s', transform: hoveredPlatform === platform.name ? 'scale(1.2)' : 'scale(1)' }}>{platform.icon}</span>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600 }}>{platform.name}</div>
                {hoveredPlatform === platform.name && (
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }} className="slide-in">
                    {platform.desc}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section ref={statsRef} style={{ maxWidth: '1152px', margin: '0 auto', padding: '88px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '56px' }}>
          {[
            { icon: BarChart3, key: 'users' as const, label: 'Active Users', delay: '0s', suffix: '+' },
            { icon: PenTool, key: 'content' as const, label: 'Content Published', delay: '0.1s', suffix: '+' },
            { icon: Sparkles, key: 'reach' as const, label: 'Total Reach', delay: '0.2s', suffix: '+' }
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
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#1f3529',
                marginBottom: '28px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(31, 53, 41, 0.25)'
              }}>
                <stat.icon style={{ height: '34px', width: '34px', color: 'white' }} strokeWidth={1.5} />
              </div>
              <div style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '64px',
                fontWeight: 700,
                marginBottom: '14px',
                letterSpacing: '-0.03em',
                color: '#1f3529'
              }}>
                {statsVisible ? formatNumber(counters[stat.key]) : '0'}{stat.suffix}
              </div>
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

        <div className="responsive-grid-3">
          {[
            {
              icon: Globe,
              title: 'Multi-Platform Publishing',
              desc: 'Publish your content to Ghost, Substack, LinkedIn, and more with one click. Save time and reach your audience wherever they are.',
              delay: '0s',
              color: '#1f3529',
              benefits: ['Save 5+ hours/week', '10+ platforms', 'One-click sync']
            },
            {
              icon: Sparkles,
              title: 'AI-Powered Generation',
              desc: 'Create engaging, platform-optimized content with our AI writing assistant. Generate ideas, titles, and outlines in seconds.',
              delay: '0.1s',
              color: '#8b9485',
              benefits: ['Smart suggestions', 'Auto-formatting', 'SEO optimized']
            },
            {
              icon: BarChart3,
              title: 'Real-Time Analytics',
              desc: 'Track engagement metrics across all platforms in one unified dashboard. Make data-driven decisions to grow your audience.',
              delay: '0.2s',
              color: '#6b7280',
              benefits: ['Unified dashboard', 'Real-time data', 'Growth insights']
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
                transition: `all 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${feature.delay}`,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={() => setActiveFeature(i)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              {/* Animated background on hover */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: feature.color,
                transform: activeFeature === i ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />

              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: activeFeature === i ? feature.color : '#ebe4d5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeFeature === i ? `0 8px 20px ${feature.color}40` : 'none'
              }}>
                <feature.icon style={{ height: '28px', width: '28px', color: activeFeature === i ? 'white' : '#1f3529' }} strokeWidth={2} />
              </div>
              <h3 style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '26px',
                marginBottom: '18px',
                letterSpacing: '-0.025em',
                color: '#1f3529',
                transition: 'color 0.3s'
              }}>{feature.title}</h3>
              <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.7', marginBottom: '24px' }}>
                {feature.desc}
              </p>

              {/* Benefits list on hover */}
              {activeFeature === i && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '10px',
                      animation: `slideInLeft 0.4s ease-out ${idx * 0.1}s both`
                    }}>
                      <Check style={{ height: '16px', width: '16px', color: feature.color }} strokeWidth={2.5} />
                      <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{benefit}</span>
                    </div>
                  ))}
                </div>
              )}
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

          <div className="workflow-grid">
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
            color: '#1f3529',
            marginBottom: '12px'
          }}>Creators love PublishType</h2>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>Join thousands of happy creators</p>
        </div>

        <div style={{ position: 'relative' }}>
          <div className="responsive-grid-3">
            {[
              {
                stars: 5,
                text: "PublishType has AMAZING content that I used for my latest blog posts. I got 200K+ views across all platforms in just one week!",
                name: "Sarah Khan",
                role: "Content Creator",
                avatar: 'S',
                highlight: true
              },
              {
                stars: 5,
                text: "I spent 3-4 hours a day manually posting to different platforms. Now it takes me 10 minutes with PublishType. Game changer!",
                name: "Marcus Lee",
                role: "Tech Blogger",
                avatar: 'M',
                highlight: false
              },
              {
                stars: 5,
                text: "The analytics dashboard is pure magic! I can actually see what works and optimize my strategy accordingly.",
                name: "Emma Rodriguez",
                role: "Newsletter Writer",
                avatar: 'E',
                highlight: false
              }
            ].map((testimonial, i) => (
              <div key={i} className="hover-lift" style={{
                padding: '40px',
                backgroundColor: 'white',
                border: testimonial.highlight ? '2px solid #1f3529' : '1px solid rgba(0,0,0,0.06)',
                borderRadius: '20px',
                position: 'relative',
                opacity: i === currentTestimonial ? 1 : 0.7,
                transform: i === currentTestimonial ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                {testimonial.highlight && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    backgroundColor: '#1f3529',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.5px'
                  }}>
                    FEATURED
                  </div>
                )}
                <div style={{ display: 'flex', gap: '3px', marginBottom: '24px' }}>
                  {[...Array(testimonial.stars)].map((_, idx) => (
                    <span key={idx} style={{ color: '#1f3529', fontSize: '22px' }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: '16px', color: '#374151', marginBottom: '36px', lineHeight: '1.7', fontStyle: 'italic' }}>
                  "{testimonial.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    backgroundColor: '#ebe4d5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1f3529'
                  }}>{testimonial.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>{testimonial.name}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '48px' }}>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? 2 : prev - 1))}
              className="hover-scale"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '2px solid #1f3529',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <ChevronLeft style={{ height: '20px', width: '20px', color: '#1f3529' }} strokeWidth={2.5} />
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  style={{
                    width: currentTestimonial === idx ? '32px' : '10px',
                    height: '10px',
                    borderRadius: '5px',
                    backgroundColor: currentTestimonial === idx ? '#1f3529' : '#d1d5db',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % 3)}
              className="hover-scale"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '2px solid #1f3529',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <ChevronRight style={{ height: '20px', width: '20px', color: '#1f3529' }} strokeWidth={2.5} />
            </button>
          </div>
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
          <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: '1.7', marginBottom: '40px' }}>Choose the plan that works for you. Cancel anytime.</p>

          {/* Billing Toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'white',
              padding: '4px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <button
                onClick={() => setBillingPeriod('monthly')}
                style={{
                  padding: '8px 24px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: billingPeriod === 'monthly' ? '#1f3529' : 'transparent',
                  color: billingPeriod === 'monthly' ? 'white' : '#374151',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                style={{
                  padding: '8px 24px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: billingPeriod === 'annual' ? '#1f3529' : 'transparent',
                  color: billingPeriod === 'annual' ? 'white' : '#374151',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Annual
              </button>
            </div>
            {billingPeriod === 'annual' && (
              <div style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 500
              }}>
                Save up to 17% with annual billing
              </div>
            )}
          </div>
        </div>

        <PricingCarousel
          billingPeriod={billingPeriod}
          plans={[
            {
              name: 'Free',
              price: '₹0',
              description: 'Perfect for trying out',
              button: 'Get Started Free',
              onClick: () => router.push(user ? '/dashboard' : '/signup'),
              loading: false,
              featured: false,
              features: [
                '1 blog post/month',
                '2 platform integrations',
                'Basic analytics',
                'Email support',
                'Community access'
              ]
            },
            {
              name: 'Starter',
              price: billingPeriod === 'monthly' ? '₹5,000' : '₹40,000',
              priceINR: billingPeriod === 'monthly' ? 'or $60/month' : 'or $482/year',
              description: 'For individuals',
              button: 'Get Started',
              onClick: () => router.push('/pricing'),
              loading: false,
              featured: false,
              features: [
                'Up to 2 platforms',
                'Basic AI editor',
                '10 scheduled posts',
                'Basic analytics',
                'Email support'
              ]
            },
            {
              name: 'Creator',
              price: billingPeriod === 'monthly' ? '₹15,000' : '₹1,50,000',
              priceINR: billingPeriod === 'monthly' ? 'or $181/month' : 'or $1,807/year',
              description: 'Most popular',
              button: 'Start Free Trial',
              onClick: () => router.push('/pricing'),
              loading: false,
              featured: true,
              features: [
                'Unlimited platforms',
                'Advanced AI editor',
                'Unlimited scheduled posts',
                'Advanced analytics & SEO',
                'Team collaboration (5 members)',
                'Priority support'
              ]
            },
            {
              name: 'Professional',
              price: billingPeriod === 'monthly' ? '₹20,000' : '₹1,80,000',
              priceINR: billingPeriod === 'monthly' ? 'or $241/month' : 'or $2,169/year',
              description: 'For enterprises',
              button: 'Get Started',
              onClick: () => router.push('/pricing'),
              loading: false,
              featured: false,
              features: [
                'Everything in Creator',
                'Unlimited team members',
                'White-label options',
                'Custom integrations',
                'Dedicated account manager',
                '24/7 premium support'
              ]
            }
          ]}
        />

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
            <div style={{ maxWidth: '580px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <h4 style={{ fontWeight: 600, fontSize: '18px', margin: 0 }}>Stay in the loop</h4>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}>
                  WEEKLY
                </div>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', marginBottom: '20px', lineHeight: '1.6' }}>
                Get weekly tips, feature updates, and exclusive content strategies from top creators.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontSize: '15px',
                    color: 'white',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.18)'
                    e.target.style.borderColor = 'rgba(255,255,255,0.4)'
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.12)'
                    e.target.style.borderColor = 'rgba(255,255,255,0.2)'
                  }}
                />
                <button className="btn-primary" style={{
                  backgroundColor: 'white',
                  color: '#1f3529',
                  padding: '14px 32px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  Subscribe
                  <ArrowRight style={{ height: '16px', width: '16px' }} strokeWidth={2.5} />
                </button>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '12px' }}>
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)'
          }}>
            {/* Social Media Links */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              {[
                { icon: Twitter, label: 'Twitter', href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
                { icon: Github, label: 'GitHub', href: '#' },
                { icon: Mail, label: 'Email', href: 'mailto:contact@publishtype.com' }
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="hover-scale"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  }}
                >
                  <social.icon style={{ height: '18px', width: '18px', color: 'rgba(255,255,255,0.8)' }} strokeWidth={2} />
                </Link>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <p style={{ margin: 0 }}>© 2024 PublishType. All rights reserved.</p>
              <div style={{ display: 'flex', gap: '28px' }}>
                <Link href="#" className="hover-scale" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Privacy Policy</Link>
                <Link href="#" className="hover-scale" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Terms of Service</Link>
                <Link href="#" className="hover-scale" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
