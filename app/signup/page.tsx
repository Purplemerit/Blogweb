"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSignupComplete, setIsSignupComplete] = useState(false)

  const handleGoogleSignup = async () => {
    try {
      setOauthLoading(true)
      const response = await fetch('/api/oauth/google')
      const data = await response.json()

      if (data.success && data.data.authUrl) {
        window.location.href = data.data.authUrl
      } else {
        toast.error('Failed to initiate Google signup')
        setOauthLoading(false)
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      setOauthLoading(false)
    }
  }

  const handleGitHubSignup = async () => {
    try {
      setOauthLoading(true)
      const response = await fetch('/api/oauth/github')
      const data = await response.json()

      if (data.success && data.data.authUrl) {
        window.location.href = data.data.authUrl
      } else {
        toast.error('Failed to initiate GitHub signup')
        setOauthLoading(false)
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      setOauthLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        setIsLoading(false)
        if (data.details) {
          const errorMap: Record<string, string> = {}
          data.details.forEach((error: any) => {
            errorMap[error.path[0]] = error.message
          })
          setErrors(errorMap)
          toast.error('Please fix the validation errors')
        } else {
          toast.error(data.error || 'Failed to create account')
        }
        return
      }

      setIsLoading(false)
      setIsSignupComplete(true)
      toast.success('Account created successfully! Please check your email to verify.')
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '14px 24px',
    borderRadius: '50px',
    border: `1px solid ${hasError ? '#FF4B2B' : '#eee'}`,
    backgroundColor: '#f9f9f9',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s'
  })

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 800,
    color: '#1a1a1a',
    marginBottom: '6px',
    display: 'block',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  }

  const errorTextStyle = {
    fontSize: '11px',
    color: '#FF4B2B',
    marginTop: '4px',
    fontWeight: 700,
    marginLeft: '12px'
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
        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
          Already have an account? <Link href="/login" style={{ color: '#FF7A33', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
        </p>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '48px',
          padding: '60px',
          width: '100%',
          maxWidth: '580px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          {isSignupComplete ? (
            <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', color: '#22c55e' }}>
                <CheckCircle2 size={40} strokeWidth={2.5} />
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#1a1a1a' }}>Check your email</h1>
              <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                We've sent a verification link to <strong>{email}</strong>. Please verify your email to activate your account.
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
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', color: '#1a1a1a' }}>Create Account</h1>
              <p style={{ color: '#666', fontSize: '15px', marginBottom: '40px' }}>Start your journey with PublishType</p>

              <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={inputStyle(!!errors.name)}
                    onFocus={(e) => e.target.style.borderColor = '#FF7A33'}
                    onBlur={(e) => e.target.style.borderColor = errors.name ? '#FF4B2B' : '#eee'}
                  />
                  {errors.name && <p style={errorTextStyle}>{errors.name}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle(!!errors.email)}
                    onFocus={(e) => e.target.style.borderColor = '#FF7A33'}
                    onBlur={(e) => e.target.style.borderColor = errors.email ? '#FF4B2B' : '#eee'}
                  />
                  {errors.email && <p style={errorTextStyle}>{errors.email}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputStyle(!!errors.password)}
                        onFocus={(e) => e.target.style.borderColor = '#FF7A33'}
                        onBlur={(e) => e.target.style.borderColor = errors.password ? '#FF4B2B' : '#eee'}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={inputStyle(!!errors.confirmPassword)}
                      onFocus={(e) => e.target.style.borderColor = '#FF7A33'}
                      onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? '#FF4B2B' : '#eee'}
                    />
                  </div>
                </div>
                {(errors.password || errors.confirmPassword) && (
                  <p style={errorTextStyle}>{errors.password || errors.confirmPassword}</p>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '12px', fontWeight: 700 }}>
                    {showPassword ? "Hide Passwords" : "Show Passwords"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
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
                    marginTop: '10px'
                  }}>
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                </button>
              </form>

              <div style={{ position: 'relative', margin: '40px 0', textAlign: 'center' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '1px solid #eee' }}></div>
                <span style={{ position: 'relative', backgroundColor: 'white', padding: '0 16px', fontSize: '13px', color: '#999', fontWeight: 700 }}>or signup with</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button
                  onClick={handleGoogleSignup}
                  disabled={oauthLoading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '50px',
                    border: '1px solid #eee',
                    backgroundColor: '#fff',
                    fontSize: '14px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    cursor: 'pointer'
                  }}>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google" />
                  Google
                </button>
                <button
                  onClick={handleGitHubSignup}
                  disabled={oauthLoading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '50px',
                    border: '1px solid #eee',
                    backgroundColor: '#fff',
                    fontSize: '14px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    cursor: 'pointer'
                  }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 4.802 3.116 8.872 7.423 10.3c.6.11.819-.26.819-.578v-2.132c-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  GitHub
                </button>
              </div>

              <p style={{ marginTop: '40px', fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
                By creating an account, you agree to our <br />
                <Link href="/terms" style={{ color: '#666', fontWeight: 800, textDecoration: 'none' }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: '#666', fontWeight: 800, textDecoration: 'none' }}>Privacy Policy</Link>
              </p>
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
