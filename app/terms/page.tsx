"use client"

import Link from "next/link"
import { ArrowLeft, Book, CheckSquare, ShieldCheck, Scale, FileText, HelpCircle, Mail } from "lucide-react"

export default function TermsPage() {
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
          }}>Legal Center</p>
          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 64px)',
            fontWeight: 800,
            marginBottom: '16px',
            color: '#1a1a1a',
            lineHeight: '1.2'
          }}>
            Terms of <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#666', fontFamily: '"Playfair Display", serif' }}>Service</span>
          </h1>
          <p style={{ color: '#666', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
            Our rules of engagement for using the PublishType platform.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ padding: '0 24px 120px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          <div style={{ padding: '60px 0' }}>
            <Link href="/" style={{ color: '#FF7A33', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>

              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckSquare size={20} />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800 }}>1. Acceptance of Terms</h2>
                </div>
                <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#444' }}>
                  By accessing and using PublishType, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our service. Our AI assistant and publishing tools are subject to regular updates which are covered under this agreement.
                </p>
              </section>

              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800 }}>2. Subscription & Billing</h2>
                </div>
                <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#444', marginBottom: '24px' }}>
                  Some features of PublishType require a paid subscription. By choosing a plan, you agree to:
                </p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    'Automatic billing via Razorpay at the start of each period.',
                    'Notification of any price changes with at least 30 days notice.',
                    'Responsibility for all activities occurring under your account.',
                    'Cancellation terms as specified in your account dashboard settings.'
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '17px', lineHeight: '1.6', color: '#444' }}>
                      <div style={{ color: '#FF7A33', marginTop: '4px' }}>•</div>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Book size={20} />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800 }}>3. Content Ownership</h2>
                </div>
                <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#444' }}>
                  You retain full ownership and intellectual property rights over the content you create and publish using our platform. PublishType does not claim ownership over any articles, blogs, or social media posts generated or published through our service.
                </p>
              </section>

              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Scale size={20} />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800 }}>4. Acceptable Use</h2>
                </div>
                <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#444' }}>
                  You agree to use the service only for lawful purposes. Prohibited activities include but are not limited to: distributing malware, generating illegal content, and attempting to circumvent platform security or API rate limits.
                </p>
              </section>

              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={20} />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800 }}>5. Limitation of Liability</h2>
                </div>
                <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#444' }}>
                  PublishType is provided "as is" without any warranties. We shall not be liable for any damages resulting from the use or inability to use our cross-platform publishing tools or AI generation features.
                </p>
              </section>

              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={20} />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800 }}>6. Contact Information</h2>
                </div>
                <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#444', marginBottom: '16px' }}>
                  For any legal inquiries or questions regarding these Terms, please contact:
                </p>
                <a href="mailto:legal@publishtype.com" style={{ fontSize: '18px', fontWeight: 800, color: '#FF7A33', textDecoration: 'none' }}>
                  legal@publishtype.com
                </a>
              </section>

            </div>

            <div style={{ marginTop: '100px', paddingTop: '40px', borderTop: '1px solid #eee', color: '#999', fontSize: '14px' }}>
              Last Updated: February 05, 2026
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
