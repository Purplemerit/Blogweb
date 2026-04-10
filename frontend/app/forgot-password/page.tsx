"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Loader2, MailCheck } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      await response.json()
      setIsSubmitted(true)
    } catch (error) {
      setIsSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '16px 24px',
    borderRadius: '50px',
    border: '1px solid #eee',
    backgroundColor: '#f9f9f9',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
    marginBottom: '24px'
  }

  return (
    <div style={{
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url("/design/BG%2023-01%202.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* Mini Header */}
      <header style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#FF7A33', borderRadius: '8px' }}></div>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a' }}>PublishType</span>
        </Link>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '48px',
          padding: '60px',
          width: '100%',
          maxWidth: '540px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          {isSubmitted ? (
            <div>
              <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(255, 122, 51, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', color: '#FF7A33' }}>
                <MailCheck size={40} strokeWidth={2} />
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#1a1a1a' }}>Check your email</h1>
              <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                We've sent reset instructions to <strong>{email}</strong>. If an account exists, you'll receive a link shortly.
              </p>
              <Link href="/login" style={{
                color: '#FF7A33',
                fontSize: '15px',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <ArrowLeft size={18} /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#1a1a1a' }}>Reset Password</h1>
              <p style={{ color: '#666', fontSize: '15px', marginBottom: '40px', lineHeight: '1.6' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a1a', marginBottom: '8px', display: 'block' }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    backgroundColor: '#FF7A33',
                    color: 'white',
                    padding: '18px',
                    borderRadius: '50px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(255, 122, 51, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
                </button>

                <Link href="/login" style={{
                  marginTop: '32px',
                  color: '#999',
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </form>
            </>
          )}
        </div>
      </div>

      <footer style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/privacy" style={{ fontSize: '13px', color: '#999', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
          <Link href="/terms" style={{ fontSize: '13px', color: '#999', textDecoration: 'none', fontWeight: 600 }}>Term & Condition</Link>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#999', fontWeight: 600 }}>
          © {new Date().getFullYear()} PublishType. All Rights Reserved.
        </p>
      </footer>
    </div>
  )
}
