"use client"

import Link from "next/link"
import { PenTool, Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const blogPosts = [
  {
    id: 1,
    title: "The Future of Content Creation: AI-Powered Publishing",
    excerpt: "Explore how artificial intelligence is revolutionizing the way we create, edit, and distribute content across multiple platforms.",
    author: "Sarah Mitchell",
    date: "December 15, 2024",
    category: "AI & Technology",
    readTime: "5 min read",
    image: "#d4e8d4"
  },
  {
    id: 2,
    title: "10 Tips for Growing Your Audience Across Multiple Platforms",
    excerpt: "Learn proven strategies to expand your reach and engage with readers on Ghost, Substack, Medium, and LinkedIn simultaneously.",
    author: "James Chen",
    date: "December 12, 2024",
    category: "Growth Strategy",
    readTime: "8 min read",
    image: "#f3e8d9"
  },
  {
    id: 3,
    title: "SEO Best Practices for Content Creators in 2024",
    excerpt: "Master the latest SEO techniques to ensure your content ranks higher and reaches the right audience organically.",
    author: "Emily Rodriguez",
    date: "December 8, 2024",
    category: "SEO",
    readTime: "6 min read",
    image: "#e8f4f8"
  },
  {
    id: 4,
    title: "How to Build a Consistent Publishing Schedule",
    excerpt: "Discover the secrets to maintaining a regular content calendar without burning out, using smart scheduling tools.",
    author: "Michael Thompson",
    date: "December 5, 2024",
    category: "Productivity",
    readTime: "7 min read",
    image: "#f5e6f3"
  },
  {
    id: 5,
    title: "The Power of Multi-Platform Content Distribution",
    excerpt: "Why publishing on multiple platforms simultaneously can 10x your content's reach and impact on your target audience.",
    author: "Sarah Mitchell",
    date: "December 1, 2024",
    category: "Strategy",
    readTime: "5 min read",
    image: "#fff5e6"
  },
  {
    id: 6,
    title: "Analytics That Matter: Tracking Your Content Performance",
    excerpt: "Learn which metrics actually matter and how to use data-driven insights to improve your content strategy.",
    author: "David Park",
    date: "November 28, 2024",
    category: "Analytics",
    readTime: "9 min read",
    image: "#e8f5e9"
  }
]

const categories = ["All", "AI & Technology", "Growth Strategy", "SEO", "Productivity", "Strategy", "Analytics"]

export default function BlogPage() {
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
            <Link href="/features" style={{ color: '#374151', textDecoration: 'none' }}>Features</Link>
            <Link href="/pricing" style={{ color: '#374151', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/blog" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Blog</Link>
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
      <section style={{ maxWidth: '1152px', margin: '0 auto', padding: '80px 32px 40px', textAlign: 'center' }}>
        <p style={{
          fontSize: '11px',
          letterSpacing: '0.15em',
          color: '#6b7280',
          marginBottom: '16px',
          fontWeight: 500,
          textTransform: 'uppercase'
        }}>
          INSIGHTS & RESOURCES
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: '56px',
          lineHeight: '1.2',
          marginBottom: '20px',
          letterSpacing: '-0.025em'
        }}>
          Our Blog
        </h1>
        <p style={{ fontSize: '17px', color: '#6b7280', maxWidth: '600px', margin: '0 auto 48px', lineHeight: '1.6' }}>
          Discover tips, strategies, and insights to help you create better content and grow your audience
        </p>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '60px'
        }}>
          {categories.map((category) => (
            <button
              key={category}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: category === 'All' ? '2px solid #1f3529' : '1px solid #d1d5db',
                backgroundColor: category === 'All' ? '#1f3529' : 'white',
                color: category === 'All' ? 'white' : '#374151',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
              }}
              >
                {/* Image Placeholder */}
                <div style={{
                  width: '100%',
                  height: '220px',
                  backgroundColor: post.image,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  <span style={{ opacity: 0.5 }}>Featured Image</span>
                </div>

                <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Category Badge */}
                  <div style={{
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                    padding: '4px 12px',
                    backgroundColor: '#f5f1e8',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#1f3529',
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {post.category}
                  </div>

                  <h2 style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontSize: '24px',
                    lineHeight: '1.3',
                    marginBottom: '12px',
                    letterSpacing: '-0.025em',
                    color: '#0a0a0a'
                  }}>
                    {post.title}
                  </h2>

                  <p style={{
                    fontSize: '15px',
                    color: '#6b7280',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    flex: 1
                  }}>
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '13px',
                    color: '#9ca3af',
                    paddingTop: '16px',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User style={{ height: '14px', width: '14px' }} />
                      <span>{post.author}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar style={{ height: '14px', width: '14px' }} />
                      <span>{post.date}</span>
                    </div>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <button style={{
            padding: '14px 32px',
            backgroundColor: 'white',
            color: '#1f3529',
            border: '2px solid #1f3529',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Load More Posts
            <ArrowRight style={{ height: '16px', width: '16px' }} />
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{ backgroundColor: '#1f3529', color: 'white', padding: '80px 0' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '40px',
            marginBottom: '16px',
            letterSpacing: '-0.025em'
          }}>Stay Updated</h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginBottom: '32px' }}>
            Subscribe to our newsletter for the latest content creation tips and platform updates
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
              Subscribe
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
                <li><Link href="/pricing" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontWeight: 500, marginBottom: '16px', fontSize: '15px' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>About</Link></li>
                <li><Link href="/blog" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Blog</Link></li>
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
