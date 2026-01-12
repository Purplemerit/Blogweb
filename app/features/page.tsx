"use client"

import Link from "next/link"
import { PenTool, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FeaturesPage() {
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

          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', fontSize: '14px' }} className="hidden md:flex">
            <Link href="/" style={{ color: '#374151', textDecoration: 'none' }}>Home</Link>
            <Link href="/features" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Features</Link>
            <Link href="/pricing" style={{ color: '#374151', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/blog" style={{ color: '#374151', textDecoration: 'none' }}>Blog</Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/login">
              <Button variant="ghost" size="sm" style={{ fontSize: '14px', fontWeight: 400 }}>Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" style={{ backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '8px 20px' }}>
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: '1152px', margin: '0 auto', padding: '80px 32px 60px', textAlign: 'center' }}>
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
        <h1 style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: '48px',
          lineHeight: '1.2',
          marginBottom: '20px',
          letterSpacing: '-0.025em',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Everything you need to<br/>succeed
        </h1>
      </section>

      {/* Features List */}
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 32px 80px' }}>
        {/* Feature 1 - Multi-Platform Publishing */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '64px', alignItems: 'center', marginBottom: '100px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: '-20px',
              background: 'linear-gradient(to bottom right, rgba(251, 207, 232, 0.4), rgba(254, 205, 211, 0.3))',
              borderRadius: '16px',
              transform: 'rotate(-2deg)'
            }}></div>
            <div style={{
              position: 'relative',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '100%',
                height: '250px',
                backgroundColor: '#e5e7eb',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Laptop Dashboard Preview
              </div>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '64px', alignItems: 'center', marginBottom: '100px' }}>
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
              backgroundColor: '#f3e8d9',
              borderRadius: '12px',
              padding: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '100%',
                height: '300px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '12px solid white'
              }}></div>
            </div>
          </div>
        </div>

        {/* Feature 3 - AI-Powered Analytics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '64px', alignItems: 'center', marginBottom: '100px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                width: '100%',
                height: '400px',
                background: 'linear-gradient(180deg, #4a5568 0%, #2d3748 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px'
              }}>
                Portrait Image Placeholder
              </div>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '64px', alignItems: 'center', marginBottom: '100px' }}>
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
              position: 'absolute',
              inset: '-20px',
              background: 'linear-gradient(to bottom right, rgba(191, 219, 254, 0.4), rgba(219, 234, 254, 0.3))',
              borderRadius: '16px',
              transform: 'rotate(2deg)'
            }}></div>
            <div style={{
              position: 'relative',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '100%',
                height: '250px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                SEO Dashboard Preview
              </div>
            </div>
          </div>
        </div>

        {/* Feature 5 - Collaborative Workspace */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '64px', alignItems: 'center', marginBottom: '100px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}>
              <div style={{
                width: '100%',
                height: '300px',
                backgroundColor: '#1a202c',
                padding: '20px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#22c55e',
                lineHeight: '1.6'
              }}>
                <div>{'{'}</div>
                <div style={{ paddingLeft: '20px' }}>"workspace": "collaborative",</div>
                <div style={{ paddingLeft: '20px' }}>"features": ["real-time", "comments"]</div>
                <div>{'}'}</div>
              </div>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '64px', alignItems: 'center', marginBottom: '100px' }}>
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
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '100%',
                height: '350px',
                background: 'linear-gradient(135deg, #f5f3f0 0%, #e8e4dc 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Team Collaboration Image
              </div>
            </div>
          </div>
        </div>

        {/* Feature 7 - Content Optimization */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '64px', alignItems: 'center', marginBottom: '100px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              backgroundColor: '#1f3529',
              borderRadius: '12px',
              padding: '60px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                top: '20%',
                left: '20%'
              }}></div>
              <div style={{
                position: 'absolute',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.08)',
                bottom: '30%',
                right: '25%'
              }}></div>
              <div style={{
                fontSize: '48px',
                color: 'rgba(255,255,255,0.2)',
                fontFamily: 'Playfair Display, Georgia, serif'
              }}>☁</div>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '64px', alignItems: 'center', marginBottom: '100px' }}>
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
              backgroundColor: '#d4e8d4',
              borderRadius: '12px',
              padding: '80px 60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '40px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '24px',
                  color: '#1f3529',
                  marginBottom: '8px',
                  letterSpacing: '-0.025em'
                }}>CONTENT</h3>
                <h3 style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '24px',
                  color: '#1f3529',
                  letterSpacing: '-0.025em'
                }}>CURATED</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <section style={{ backgroundColor: 'white', padding: '80px 0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 32px' }}>
          <h2 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '40px',
            textAlign: 'center',
            marginBottom: '48px',
            letterSpacing: '-0.025em'
          }}>Compare Plans</h2>

          <div style={{ overflowX: 'auto' }}>
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

      {/* CTA Section */}
      <section style={{ backgroundColor: '#1f3529', color: 'white', padding: '80px 0' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '40px',
            marginBottom: '24px',
            letterSpacing: '-0.025em'
          }}>Ready to publish smarter?</h2>
          <p style={{ fontSize: '16px', marginBottom: '32px', color: 'rgba(255,255,255,0.9)' }}>
            Join thousands of creators who are already using PublishType to streamline their content workflow.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '15px'
              }}
            />
            <button style={{
              backgroundColor: 'white',
              color: '#1f3529',
              padding: '14px 32px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1a3428', color: 'white', padding: '64px 0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            marginBottom: '48px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <PenTool style={{ height: '20px', width: '20px' }} strokeWidth={2} />
                <span style={{ fontWeight: 500, fontSize: '18px' }}>PublishType</span>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
                Publish once, reach everywhere.
              </p>
            </div>

            <div>
              <h4 style={{ fontWeight: 500, marginBottom: '16px', fontSize: '15px' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link href="/features" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Features</Link></li>
                <li><Link href="/#pricing" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontWeight: 500, marginBottom: '16px', fontSize: '15px' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>About</Link></li>
                <li><Link href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Contact</Link></li>
              </ul>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '32px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)'
          }}>
            <p>© 2024 PublishType. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
