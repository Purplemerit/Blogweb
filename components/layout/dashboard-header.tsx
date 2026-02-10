"use client"

import { Search, Bell, LogOut, Menu, X, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <style jsx>{`
        @media (max-width: 768px) {
          header {
            height: 64px !important;
            padding: 0 16px !important;
          }
        }
        @media (max-width: 480px) {
          header {
            height: 60px !important;
            padding: 0 12px !important;
          }
        }
      `}</style>
      <header style={{
        display: 'flex',
        height: '80px',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #eee',
        backgroundColor: '#fff',
        padding: '0 40px',
        position: 'relative'
      }}>
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden"
          style={{
            background: 'none',
            border: 'none',
            color: '#1a1a1a',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '400px' }} className="hidden lg:block">
          <input
            type="text"
            placeholder="Search articles, analytics..."
            style={{
              width: '100%',
              padding: '12px 20px 12px 48px',
              borderRadius: '50px',
              border: '1px solid #eee',
              backgroundColor: '#fff',
              fontSize: '14px',
              outline: 'none',
              color: '#1a1a1a',
              fontWeight: 500
            }}
          />
          <Search style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
        </div>

        {/* Right Side Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderRight: '1px solid #eee', paddingRight: '24px' }} className="hidden sm:flex">
            <button style={{ background: 'none', border: 'none', color: '#1a1a1a', cursor: 'pointer', position: 'relative' }}>
              <Bell size={20} />
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: '#FF7A33', borderRadius: '50%', border: '2px solid #fff' }}></div>
            </button>
          </div>

          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ textAlign: 'right' }} className="hidden lg:block">
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#1a1a1a' }}>{user?.name || 'User'}</p>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#999' }}>{user?.subscriptionPlan || 'Free Plan'}</p>
            </div>
            <div style={{ position: 'relative' }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FF7A33', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>
                  {user ? getInitials(user.name) : 'U'}
                </div>
              )}
            </div>
            <ChevronDown size={14} color="#999" strokeWidth={3} className="hidden sm:block" />
          </div>

          {/* Logout - Keep functionality */}
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Mobile Links Overlay (Optional but good for UX) */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '80px',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            padding: '24px 20px',
            borderBottom: '1px solid #eee',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto'
          }} className="md:hidden">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: pathname === '/dashboard' ? '#FF7A33' : '#1a1a1a',
                fontWeight: 700,
                fontSize: '15px',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: pathname === '/dashboard' ? '#FFF5F0' : 'transparent',
                transition: 'all 0.2s'
              }}
            >Dashboard</Link>
            <Link
              href="/dashboard/articles"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: pathname?.startsWith('/dashboard/articles') ? '#FF7A33' : '#1a1a1a',
                fontWeight: 700,
                fontSize: '15px',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: pathname?.startsWith('/dashboard/articles') ? '#FFF5F0' : 'transparent',
                transition: 'all 0.2s'
              }}
            >Articles</Link>
            <Link
              href="/dashboard/integrations"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: pathname?.startsWith('/dashboard/integrations') ? '#FF7A33' : '#1a1a1a',
                fontWeight: 700,
                fontSize: '15px',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: pathname?.startsWith('/dashboard/integrations') ? '#FFF5F0' : 'transparent',
                transition: 'all 0.2s'
              }}
            >Publishing</Link>
            <Link
              href="/dashboard/analytics"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: pathname?.startsWith('/dashboard/analytics') ? '#FF7A33' : '#1a1a1a',
                fontWeight: 700,
                fontSize: '15px',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: pathname?.startsWith('/dashboard/analytics') ? '#FFF5F0' : 'transparent',
                transition: 'all 0.2s'
              }}
            >Analytics</Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: pathname?.startsWith('/dashboard/settings') ? '#FF7A33' : '#1a1a1a',
                fontWeight: 700,
                fontSize: '15px',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: pathname?.startsWith('/dashboard/settings') ? '#FFF5F0' : 'transparent',
                transition: 'all 0.2s'
              }}
            >Settings</Link>
          </div>
        )}
      </header>
    </>
  )
}
