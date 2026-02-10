"use client"

import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, Globe, Bell, UserCheck, Mail } from "lucide-react"

export default function PrivacyPage() {
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
            Privacy <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#666', fontFamily: '"Playfair Display", serif' }}>Policy</span>
          </h1>
          <p style={{ color: '#666', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
            Learn how we collect, use, and protect your personal information when you use PublishType.
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
                    <Eye size={20} />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800 }}>1. Information We Collect</h2>
                </div>
                <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#444' }}>
                  We collect information you provide directly to us, including your name, email address, and content you create using our platform. We also collect usage data to improve our services and provide a more personalized experience.
                </p>
              </section>

              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={20} />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800 }}>2. How We Use Information</h2>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    'To provide, maintain, and improve our services across all platforms.',
                    'To process your transactions and subscriptions via secure channels.',
                    'To send technical notices, updates, and security alerts.',
                    'To analyze usage patterns to enhance cross-platform performance.',
                    'To personalize your experience with AI-tailored content suggestions.'
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
                    <Lock size={20} />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800 }}>3. Data Security</h2>
                </div>
                <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#444' }}>
                  We implement industry-standard technical and organizational measures to protect your personal data. This includes end-to-end encryption for sensitive data and regular security audits to ensure your content remains private and protected.
                </p>
              </section>

              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe size={20} />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800 }}>4. Third-Party Services</h2>
                </div>
                <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#444' }}>
                  We utilize trusted third-party services like Razorpay for payments and Google for authentication. These services have their own independent privacy policies, and we encourage you to review them to understand how they handle your data.
                </p>
              </section>

              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCheck size={20} />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800 }}>5. Your Rights</h2>
                </div>
                <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#444' }}>
                  You have the right to access, update, or delete your personal information at any time. Our dashboard provides tools to manage your account settings, or you can contact our support team for specialized assistance regarding your data rights.
                </p>
              </section>

              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,122,51,0.1)', color: '#FF7A33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={20} />
                  </div>
                  <h2 style={{ fontSize: '28px', fontWeight: 800 }}>8. Contact Us</h2>
                </div>
                <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#444', marginBottom: '16px' }}>
                  If you have any questions about this Privacy Policy, please reach out to our legal team:
                </p>
                <a href="mailto:privacy@publishtype.com" style={{ fontSize: '18px', fontWeight: 800, color: '#FF7A33', textDecoration: 'none' }}>
                  privacy@publishtype.com
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
