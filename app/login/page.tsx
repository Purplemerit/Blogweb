"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setOauthLoading(true)
      const response = await fetch('/api/oauth/google')
      const data = await response.json()

      if (data.success && data.data.authUrl) {
        window.location.href = data.data.authUrl
      } else {
        toast.error('Failed to initiate Google login')
        setOauthLoading(false)
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      setOauthLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    try {
      setOauthLoading(true)
      const response = await fetch('/api/oauth/github')
      const data = await response.json()

      if (data.success && data.data.authUrl) {
        window.location.href = data.data.authUrl
      } else {
        toast.error('Failed to initiate GitHub login')
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

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to login')
        setIsLoading(false)
        return
      }

      localStorage.setItem('accessToken', data.data.accessToken)
      toast.success('Logged in successfully!')
      window.location.href = '/dashboard'
    } catch (error) {
      toast.error('An error occurred. Please try again.')
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
    transition: 'all 0.2s'
  }

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 800,
    color: '#1a1a1a',
    marginBottom: '8px',
    display: 'block'
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
          Don't have an account? <Link href="/signup" style={{ color: '#FF7A33', fontWeight: 700, textDecoration: 'none' }}>Signup</Link>
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
          maxWidth: '540px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', color: '#1a1a1a' }}>Welcome Back</h1>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '40px' }}>Log in to your Account</p>

          <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="hello@chainex.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#FF7A33'}
                onBlur={(e) => e.target.style.borderColor = '#eee'}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: '12px', color: '#999', textDecoration: 'none', fontWeight: 700 }}>Forget Password</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#FF7A33'}
                  onBlur={(e) => e.target.style.borderColor = '#eee'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" id="remember" style={{ width: '18px', height: '18px', accentColor: '#FF7A33' }} />
              <label htmlFor="remember" style={{ fontSize: '14px', color: '#666', fontWeight: 600 }}>Remember me</label>
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
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
            </button>
          </form>

          <div style={{ position: 'relative', margin: '40px 0', textAlign: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '1px solid #eee' }}></div>
            <span style={{ position: 'relative', backgroundColor: 'white', padding: '0 16px', fontSize: '13px', color: '#999', fontWeight: 700 }}>or continue with</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={handleGoogleLogin}
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
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google" />
              Signup with Google
            </button>
            <button
              onClick={handleGitHubLogin}
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
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 4.802 3.116 8.872 7.423 10.3c.6.11.819-.26.819-.578v-2.132c-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              Signup with GitHub
            </button>
          </div>

          <p style={{ marginTop: '40px', fontSize: '14px', color: '#666', fontWeight: 600 }}>
            Don't have an account yet ? <Link href="/signup" style={{ color: '#1a1a1a', fontWeight: 800, textDecoration: 'none' }}>Create Account</Link>
          </p>
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
