"use client"

import { useState } from "react"
import Link from "next/link"
import { PenTool, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function NewsletterFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newsletterEmail.trim()) {
      toast.error("Please enter your email address")
      return
    }

    try {
      setSubscribing(true)
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        setNewsletterEmail("")
      } else {
        toast.error(data.error || "Failed to subscribe")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <>
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
          <form onSubmit={handleNewsletterSubscribe} style={{ display: 'flex', gap: '12px', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              disabled={subscribing}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '15px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={subscribing}
              style={{
                backgroundColor: subscribing ? 'rgba(255,255,255,0.7)' : 'white',
                color: '#1f3529',
                padding: '14px 32px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '15px',
                fontWeight: 500,
                cursor: subscribing ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
              {subscribing ? (
                <>
                  <Loader2 style={{ height: '16px', width: '16px', animation: 'spin 1s linear infinite' }} />
                  Subscribing...
                </>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
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
                <span style={{ fontWeight: 500, fontSize: '18px' }}>Publish Type</span>
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
                <li><Link href="/blog" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontWeight: 500, marginBottom: '16px', fontSize: '15px' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>About</Link></li>
                <li><Link href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontWeight: 500, marginBottom: '16px', fontSize: '15px' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Privacy Policy</Link></li>
                <li><Link href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Terms of Service</Link></li>
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
            <p>&copy; {new Date().getFullYear()} Publish Type. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Spin animation for loading */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
