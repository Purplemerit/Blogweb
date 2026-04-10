"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export function Footer() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter your email")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        setEmail("")
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error("Failed to subscribe")
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="relative overflow-hidden rounded-t-[40px] md:rounded-t-[60px] max-w-[1400px] mx-auto px-6 py-12 md:px-12 md:pb-10 md:pt-32" style={{
      backgroundColor: '#faeae1d2'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto'
      }}>
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'clamp(60px, 13vw, 200px)',
          fontWeight: 900,
          background: 'linear-gradient(180deg, #febf8fff 0%, rgba(255, 220, 194, 0) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.8
        }}>

          PublishType
        </div>

        {/* Top Content Row */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          marginBottom: '64px',
          marginTop: '150px',
          flexWrap: 'wrap',
          gap: '40px'
        }}>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#333' }}>
              All Assistant That Captures Every Details.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {[
              { name: 'Home', href: '/' },
              { name: 'About', href: '/about' },
              { name: 'Features', href: '/features' },
              { name: 'Pricing', href: '/pricing' },
              { name: 'Documentation', href: '/docs' }
            ].map((link) => (
              <Link key={link.name} href={link.href} style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', textDecoration: 'none' }}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Social & Newsletter Row */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '48px',
          flexWrap: 'wrap',
          gap: '40px'
        }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: '#1a1a1a' }}>Our Social Media Accounts</h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </div>
          </div>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: '#1a1a1a' }}>Stay Connected</h4>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '50px',
              padding: '6px 6px 6px 24px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#666', background: 'transparent' }}
              />
              <button
                onClick={handleSubscribe}
                disabled={loading}
                style={{
                  backgroundColor: 'white',
                  color: '#1a1a1a',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {loading ? '...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: '32px',
          borderTop: '1px solid #FFE8DF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/privacy" style={{ fontSize: '14px', color: '#444', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: '14px', color: '#444', textDecoration: 'none', fontWeight: 600 }}>Term & Condition</Link>
          </div>
          <p style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>
            © {new Date().getFullYear()} PublishType. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer >
  )
}
