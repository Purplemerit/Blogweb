"use client"

import Link from "next/link"
import Image from "next/image"
import { PenTool, Check, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewsletterFooter } from "@/components/NewsletterFooter"
import { useAuth } from "@/lib/context/AuthContext"
import { useState } from "react"

export default function FeaturesPage() {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f1e8' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(245,241,232,0.95)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
            <PenTool style={{ height: '20px', width: '20px' }} strokeWidth={2} />
            <span style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '-0.025em' }}>PublishType</span>
          </Link>

          <nav className="header-nav hide-mobile" style={{ fontSize: '14px' }}>
            <Link href="/" style={{ color: '#374151', textDecoration: 'none' }}>Home</Link>
            <Link href="/features" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Features</Link>
            <Link href="/pricing" style={{ color: '#374151', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/blog" style={{ color: '#374151', textDecoration: 'none' }}>Blog</Link>
          </nav>

          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <Link href="/dashboard">
                <Button size="sm" style={{ backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '8px 20px' }}>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" style={{ fontSize: '14px', fontWeight: 400 }}>Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" style={{ backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '8px 20px' }}>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            {mobileMenuOpen ? <X style={{ height: '24px', width: '24px' }} /> : <Menu style={{ height: '24px', width: '24px' }} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div style={{
            borderTop: '1px solid rgba(0,0,0,0.1)',
            backgroundColor: 'white',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                Home
              </Link>
              <Link
                href="/features"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 600,
                  backgroundColor: '#f3f4f6'
                }}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                Blog
              </Link>
              <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {user ? (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" style={{ width: '100%', backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '12px 20px' }}>
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" style={{ width: '100%', fontSize: '14px', fontWeight: 400, padding: '12px 20px' }}>Sign In</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" style={{ width: '100%', backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '12px 20px' }}>
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="section-padding" style={{ maxWidth: '1152px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          fontSize: '11px',
          letterSpacing: '0.15em',
          color: '#6b7280',
          marginBottom: '16px',
          fontWeight: 500,
          textTransform: 'uppercase'
        }}>
          Features
        </p>
        <h1 className="text-section-title" style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          lineHeight: '1.2',
          marginBottom: '20px',
          letterSpacing: '-0.025em',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Everything you need to succeed
        </h1>
      </section>

      {/* Features List */}
      <div className="container-padding" style={{ maxWidth: '1152px', margin: '0 auto', paddingBottom: '80px' }}>
        {/* Feature 1 - Multi-Platform Publishing */}
        <div className="feature-grid" style={{ marginBottom: '80px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              position: 'relative',
              height: '300px'
            }}>
              <Image
                src="/imagea.png"
                alt="Multi-Platform Publishing Dashboard"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#1f3529',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '20px'
            }}>1</div>
            <h2 style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '32px',
              marginBottom: '16px',
              letterSpacing: '-0.025em'
            }}>Multi-Platform Publishing</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.7', marginBottom: '20px' }}>
              Publish your content simultaneously across Ghost, Substack, Medium, LinkedIn, and more. Reach your audience wherever they are with just one click.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>One-click multi-platform distribution</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Automatic format optimization</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Platform-specific customization</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature 2 - Customizable AI Editor */}
        <div className="feature-grid" style={{ marginBottom: '80px' }}>
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#1f3529',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '20px'
            }}>2</div>
            <h2 style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '32px',
              marginBottom: '16px',
              letterSpacing: '-0.025em'
            }}>Customizable AI Editor</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.7', marginBottom: '20px' }}>
              Write with confidence using our intelligent editor. Get real-time suggestions, grammar corrections, and style improvements powered by advanced AI.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Smart content suggestions</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Grammar and style enhancement</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Rich formatting options</span>
              </li>
            </ul>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              position: 'relative',
              height: '300px'
            }}>
              <Image
                src="/imageb.png"
                alt="AI Editor Interface"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Feature 3 - AI-Powered Analytics */}
        <div className="feature-grid" style={{ marginBottom: '80px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              position: 'relative',
              height: '400px'
            }}>
              <Image
                src="/imagec.png"
                alt="AI-Powered Analytics Dashboard"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#1f3529',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '20px'
            }}>3</div>
            <h2 style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '32px',
              marginBottom: '16px',
              letterSpacing: '-0.025em'
            }}>AI-Powered Analytics</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.7', marginBottom: '20px' }}>
              Understand your audience with deep insights. Track engagement, identify trends, and optimize your content strategy with AI-driven analytics.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Real-time performance tracking</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Audience behavior insights</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Predictive content recommendations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature 4 - SEO-Optimized */}
        <div className="feature-grid" style={{ marginBottom: '80px' }}>
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#1f3529',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '20px'
            }}>4</div>
            <h2 style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '32px',
              marginBottom: '16px',
              letterSpacing: '-0.025em'
            }}>SEO-Optimized</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.7', marginBottom: '20px' }}>
              Rank higher in search results with built-in SEO tools. Optimize meta tags, keywords, and content structure automatically for better visibility.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Automatic meta tag generation</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Keyword density analysis</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Readability score optimization</span>
              </li>
            </ul>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              position: 'relative',
              height: '300px'
            }}>
              <Image
                src="/imaged.png"
                alt="SEO Optimization Dashboard"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Feature 5 - Collaborative Workspace */}
        <div className="feature-grid" style={{ marginBottom: '80px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              height: '300px'
            }}>
              <Image
                src="/imagee.png"
                alt="Collaborative Workspace"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#1f3529',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '20px'
            }}>5</div>
            <h2 style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '32px',
              marginBottom: '16px',
              letterSpacing: '-0.025em'
            }}>Collaborative Workspace</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.7', marginBottom: '20px' }}>
              Work together seamlessly with your team. Share drafts, leave comments, and collaborate in real-time on your content projects.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Real-time collaboration</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Inline comments and feedback</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Version history tracking</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature 6 - Content Scheduling */}
        <div className="feature-grid" style={{ marginBottom: '80px' }}>
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#1f3529',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '20px'
            }}>6</div>
            <h2 style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '32px',
              marginBottom: '16px',
              letterSpacing: '-0.025em'
            }}>Content Scheduling</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.7', marginBottom: '20px' }}>
              Plan your content calendar with ease. Schedule posts in advance and maintain a consistent publishing rhythm across all platforms.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Visual content calendar</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Optimal timing suggestions</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Bulk scheduling options</span>
              </li>
            </ul>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              position: 'relative',
              height: '350px'
            }}>
              <Image
                src="/imagef.png"
                alt="Content Scheduling Calendar"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Feature 7 - Content Optimization */}
        <div className="feature-grid" style={{ marginBottom: '80px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              height: '350px'
            }}>
              <Image
                src="/imageg.png"
                alt="Content Optimization Tools"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#1f3529',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '20px'
            }}>7</div>
            <h2 style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '32px',
              marginBottom: '16px',
              letterSpacing: '-0.025em'
            }}>Content Optimization</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.7', marginBottom: '20px' }}>
              Maximize your content's impact with AI-powered optimization. Get suggestions for headlines, structure, and engagement based on proven best practices.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Headline scoring and suggestions</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Content structure analysis</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Engagement prediction</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature 8 - Content Curation Library */}
        <div className="feature-grid" style={{ marginBottom: '80px' }}>
          <div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#1f3529',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '20px'
            }}>8</div>
            <h2 style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '32px',
              marginBottom: '16px',
              letterSpacing: '-0.025em'
            }}>Content Curation Library</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.7', marginBottom: '20px' }}>
              Build your content library with ease. Organize, tag, and retrieve your best content for repurposing and reference across all your channels.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Smart content organization</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Advanced tagging system</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '16px', width: '16px', color: '#1f3529' }} strokeWidth={2.5} />
                <span>Quick search and retrieval</span>
              </li>
            </ul>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              height: '350px'
            }}>
              <Image
                src="/imageh.png"
                alt="Content Curation Library"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <section style={{ backgroundColor: 'white', padding: '80px 0' }}>
        <div className="container-padding" style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 className="text-section-title" style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            textAlign: 'center',
            marginBottom: '48px',
            letterSpacing: '-0.025em'
          }}>Compare Plans</h2>

          <div className="responsive-table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: 600 }}>Feature</th>
                  <th style={{ textAlign: 'center', padding: '16px', fontWeight: 600 }}>Free</th>
                  <th style={{ textAlign: 'center', padding: '16px', fontWeight: 600 }}>Creator</th>
                  <th style={{ textAlign: 'center', padding: '16px', fontWeight: 600 }}>Professional</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px' }}>Multi-Platform Publishing</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>2 platforms</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>✓</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>✓</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px' }}>AI-Powered Editor</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>Basic</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>✓</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>✓</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px' }}>Analytics Dashboard</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>Basic</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>✓</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>Advanced</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px' }}>SEO Optimization</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>—</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>✓</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>✓</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px' }}>Team Collaboration</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>—</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>5 members</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>Unlimited</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px' }}>Content Scheduling</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>—</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>✓</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>✓</td>
                </tr>
                <tr>
                  <td style={{ padding: '16px' }}>Priority Support</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>—</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>✓</td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Newsletter and Footer */}
      <NewsletterFooter />
    </div>
  )
}
