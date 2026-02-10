"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { toast } from "sonner"
import { ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link')
      router.push('/forgot-password')
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' })
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters' })
      setIsLoading(false)
      return
    }

    if (!/[A-Z]/.test(password)) {
      setErrors({ password: 'Password must contain at least one uppercase letter' })
      setIsLoading(false)
      return
    }

    if (!/[0-9]/.test(password)) {
      setErrors({ password: 'Password must contain at least one number' })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to reset password')
        setIsLoading(false)
        return
      }

      setIsSuccess(true)
      toast.success('Password reset successfully!')
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '16px 24px',
    borderRadius: '50px',
    border: `1px solid ${hasError ? '#FF4B2B' : '#eee'}`,
    backgroundColor: '#f9f9f9',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
    marginBottom: hasError ? '0px' : '24px'
  })

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 800,
    color: '#1a1a1a',
    marginBottom: '8px',
    display: 'block'
  }

  if (!token) return null

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
          {isSuccess ? (
            <div>
              <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', color: '#22c55e' }}>
                <CheckCircle2 size={40} strokeWidth={2.5} />
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#1a1a1a' }}>Password Reset!</h1>
              <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                Your password has been successfully updated. You can now use your new password to log in.
              </p>
              <Link href="/login" style={{
                backgroundColor: '#FF7A33',
                color: 'white',
                padding: '18px 48px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block',
                boxShadow: '0 8px 25px rgba(255, 122, 51, 0.3)'
              }}>
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#1a1a1a' }}>Set New Password</h1>
              <p style={{ color: '#666', fontSize: '15px', marginBottom: '40px', lineHeight: '1.6' }}>
                Please choose a strong password that you haven't used before.
              </p>

              <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={inputStyle(!!errors.password)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '20px', top: '22px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p style={{ fontSize: '11px', color: '#FF4B2B', marginBottom: '16px', fontWeight: 700, marginLeft: '12px' }}>{errors.password}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Confirm New Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={inputStyle(!!errors.confirmPassword)}
                  />
                  {errors.confirmPassword && <p style={{ fontSize: '11px', color: '#FF4B2B', marginBottom: '16px', fontWeight: 700, marginLeft: '12px' }}>{errors.confirmPassword}</p>}
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
                    gap: '10px',
                    marginTop: '8px'
                  }}>
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <Loader2 size={40} className="animate-spin" style={{ color: '#FF7A33' }} />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
