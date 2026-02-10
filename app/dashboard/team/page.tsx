"use client"

import { useEffect, useState } from 'react'
import {
  Users,
  UserPlus,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit3,
  MessageSquare,
  Trash2,
  Send,
  Loader2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface Invitation {
  id: string
  role: string
  status: string
  invitedAt: string
  joinedAt?: string
  article: {
    id: string
    title: string
    excerpt?: string
    status: string
    createdAt: string
    user: User
  }
}

export default function TeamPage() {
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted'>('all')

  useEffect(() => { fetchInvitations() }, [])

  const fetchInvitations = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/collaboration/my-invitations', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setInvitations(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching invitations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (invitationId: string) => {
    try {
      const response = await fetch('/api/collaboration/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ collaboratorId: invitationId }),
      })
      if (response.ok) fetchInvitations()
    } catch (error) { console.error(error) }
  }

  const filteredInvitations = invitations.filter((inv) => {
    if (filter === 'all') return true
    if (filter === 'pending') return inv.status === 'PENDING'
    if (filter === 'accepted') return inv.status === 'ACCEPTED'
    return true
  })

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><Loader2 className="animate-spin" size={40} color="#FF7A33" /></div>

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Hero Header */}
      <section style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url("/design/BG%2023-01%202.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '60px 40px',
      }}>
        <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 10px 0' }}>
          Team <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#666', fontFamily: 'serif' }}>Collaboration</span>
        </h1>
        <p style={{ color: '#666', fontSize: '15px', fontWeight: 500 }}>Manage access and collaborate on shared articles.</p>
      </section>

      <section style={{ padding: '40px' }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginBottom: '48px' }}>
          {[
            { label: 'Total Invitations', val: invitations.length, icon: <Mail color="#FF7A33" /> },
            { label: 'Pending Access', val: invitations.filter(i => i.status === 'PENDING').length, icon: <Clock color="#faad14" /> },
            { label: 'Joined Articles', val: invitations.filter(i => i.status === 'ACCEPTED').length, icon: <CheckCircle color="#22c55e" /> },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: '32px', border: '1px solid #eee', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#fcfcfc', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                {s.icon}
              </div>
              <p style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: 800, color: '#1a1a1a' }}>{s.val}</p>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#999', textTransform: 'uppercase' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
          {['all', 'pending', 'accepted'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              style={{
                padding: '10px 24px',
                borderRadius: '50px',
                border: filter === f ? 'none' : '1px solid #eee',
                backgroundColor: filter === f ? '#1a1a1a' : '#fff',
                color: filter === f ? '#fff' : '#666',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Invitation List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filteredInvitations.map((inv) => (
            <div key={inv.id} style={{
              backgroundColor: '#fff',
              borderRadius: '32px',
              border: '1px solid #eee',
              padding: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#fcfcfc', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: '#FF7A33' }}>
                  {inv.article.user.name[0]}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1a1a1a' }}>{inv.article.title}</h3>
                    <span style={{ backgroundColor: '#f5f5f5', color: '#1a1a1a', padding: '4px 12px', borderRadius: '50px', fontSize: '10px', fontWeight: 800 }}>{inv.role}</span>
                    {inv.status === 'PENDING' && <span style={{ backgroundColor: '#fff5eb', color: '#FF7A33', padding: '4px 12px', borderRadius: '50px', fontSize: '10px', fontWeight: 800 }}>PENDING</span>}
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666', fontWeight: 500 }}>Shared by <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{inv.article.user.name}</span></p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#999', fontWeight: 600 }}>Invited on {new Date(inv.invitedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                {inv.status === 'PENDING' ? (
                  <button
                    onClick={() => handleAccept(inv.id)}
                    style={{ padding: '14px 32px', borderRadius: '50px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={16} /> ACCEPT ACCESS
                  </button>
                ) : (
                  <Link href={`/dashboard/articles/${inv.article.id}`} style={{ padding: '14px 32px', borderRadius: '50px', border: '1px solid #eee', color: '#1a1a1a', textDecoration: 'none', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    OPEN ARTICLE <ChevronRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          ))}

          {filteredInvitations.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
              <Users size={60} color="#eee" style={{ marginBottom: '24px' }} />
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#999' }}>No collaboration invitations found.</p>
            </div>
          )}
        </div>

        {/* Feature Hub Card */}
        <div style={{ marginTop: '80px', backgroundColor: '#1a1a1a', borderRadius: '40px', padding: '60px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <ShieldCheck size={32} color="#FF7A33" />
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Scale with Premium Management</h2>
            </div>
            <p style={{ fontSize: '16px', opacity: 0.7, lineHeight: '1.7', marginBottom: '32px' }}>
              Invite multiple editors, manage content approval workflows, and see real-time updates from your team members as you scale your publication reach.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700 }}><CheckCircle size={14} color="#FF7A33" /> Role Based Access Control</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700 }}><CheckCircle size={14} color="#FF7A33" /> Real-time Collaborative Editing</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700 }}><CheckCircle size={14} color="#FF7A33" /> Content Audit Logs</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700 }}><CheckCircle size={14} color="#FF7A33" /> Central Billing Management</div>
            </div>
          </div>
          <button style={{ padding: '20px 48px', borderRadius: '50px', backgroundColor: '#FF7A33', color: '#fff', border: 'none', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>CONTACT FOR ENTERPRISE</button>
        </div>
      </section>
    </div>
  )
}
