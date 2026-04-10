"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { toast } from "sonner"
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react"

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Verification token is missing')
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        setMessage(data.error || 'Failed to verify email')
        toast.error(data.error || 'Failed to verify email')
        return
      }

      setStatus('success')
      setMessage('Your email has been verified successfully!')
      toast.success('Email verified successfully!')
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
      toast.error('An error occurred. Please try again.')
    }
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
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#1a1a1a' }}>Email Verification</h1>

          <div style={{ marginTop: '40px' }}>
            {status === 'loading' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <Loader2 size={60} className="animate-spin" style={{ color: '#FF7A33' }} />
                <p style={{ color: '#666', fontSize: '18px', fontWeight: 600 }}>Verifying your credentials...</p>
              </div>
            )}

            {status === 'success' && (
              <div>
                <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', color: '#22c55e' }}>
                  <CheckCircle2 size={40} strokeWidth={2.5} />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>Account Activated!</h3>
                <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px' }}>
                  {message} <br /> You can now log in and start using PublishType.
                </p>
                <Link href="/login" style={{
                  backgroundColor: '#FF7A33',
                  color: 'white',
                  padding: '18px 56px',
                  borderRadius: '50px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 8px 25px rgba(255, 122, 51, 0.3)'
                }}>
                  Go to Login
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div>
                <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', color: '#ef4444' }}>
                  <XCircle size={40} strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', marginBottom: '12px' }}>Verification Failed</h3>
                <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px' }}>
                  {message}. The link may have expired or is invalid.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Link href="/signup" style={{
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    padding: '16px 40px',
                    borderRadius: '50px',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}>
                    Sign up again
                  </Link>
                  <Link href="/login" style={{ color: '#999', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <ArrowLeft size={16} /> Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: '#FF7A33' }} />
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  )
}
