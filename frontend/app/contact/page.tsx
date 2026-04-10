"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, MessageSquare, HelpCircle, ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to send message')
        setIsSubmitting(false)
        return
      }

      toast.success(data.message || "Message sent! We'll get back to you soon.")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      toast.error('An error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#1a1a1a' }}>

      {/* Hero Section */}
      <section style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url("/design/BG%2023-01%202.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 24px 80px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#FF7A33',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginBottom: '16px'
          }}>Contact Us</p>
          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 64px)',
            fontWeight: 800,
            marginBottom: '16px',
            color: '#1a1a1a',
            lineHeight: '1.2'
          }}>
            How Can We <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#666', fontFamily: '"Playfair Display", serif' }}>Help ?</span>
          </h1>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto' }}>
            Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '0 24px 120px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '80px' }}>

          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '40px' }}>Get in touch</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, marginBottom: '4px' }}>Email Us</h4>
                  <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>Support and general inquiries</p>
                  <a href="mailto:support@publishtype.com" style={{ color: '#FF7A33', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}>support@publishtype.com</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <HelpCircle size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, marginBottom: '4px' }}>Help Center</h4>
                  <p style={{ color: '#666', fontSize: '15px', marginBottom: '8px' }}>Find answers to common questions</p>
                  <Link href="/blog" style={{ color: '#1a1a1a', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                    Go to Docs <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, marginBottom: '4px' }}>Documentation</h4>
                  <p style={{ color: '#666', fontSize: '15px', marginBottom: '8px' }}>Learn how to use PublishType</p>
                  <Link href="/blog" style={{ color: '#1a1a1a', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                    Read the guide <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '64px', padding: '32px', borderRadius: '32px', backgroundColor: '#FFF5F2', border: '1px solid #FFE8DF' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#1a1a1a', fontWeight: 700 }}>
                Typical response time: <span style={{ color: '#FF7A33' }}>Under 24 hours</span>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            backgroundColor: '#fff',
            padding: '60px',
            borderRadius: '48px',
            border: '1px solid #f0f0f0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px' }}>Send us a message</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ padding: '16px 20px', borderRadius: '16px', border: '1px solid #eee', fontSize: '15px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{ padding: '16px 20px', borderRadius: '16px', border: '1px solid #eee', fontSize: '15px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Subject</label>
                <input
                  type="text"
                  placeholder="How can we help you?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  style={{ padding: '16px 20px', borderRadius: '16px', border: '1px solid #eee', fontSize: '15px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Message</label>
                <textarea
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  style={{ padding: '16px 20px', borderRadius: '16px', border: '1px solid #eee', fontSize: '15px', outline: 'none', resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#FF7A33',
                  color: '#fff',
                  padding: '20px',
                  borderRadius: '50px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(255, 122, 51, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}>
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'SEND MESSAGE'}
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}
