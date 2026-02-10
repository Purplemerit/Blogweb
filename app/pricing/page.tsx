"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Check, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"
import { toast } from "sonner"

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  // Business logic from original pricing page
  const pricingINR = {
    basic: { monthly: 1565, annual: 15650 },
    business: { monthly: 1565, annual: 15650 },
    enterprise: { monthly: 1565, annual: 15650 }
  }

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async (planKey: 'BASIC' | 'BUSINESS' | 'ENTERPRISE') => {
    if (!user) {
      toast.error('Please login to subscribe')
      router.push(`/login?redirect=/pricing`)
      return
    }

    setLoading(planKey)
    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway')
        setLoading(null)
        return
      }

      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: planKey,
          billingPeriod,
        }),
      })

      const data = await response.json()
      if (!data.success) {
        toast.error(data.error || 'Failed to create order')
        setLoading(null)
        return
      }

      const options = {
        key: data.data.keyId,
        amount: data.data.amount,
        currency: data.data.currency,
        name: 'PublishType',
        description: `${planKey} Plan - ${billingPeriod === 'annual' ? 'Annual' : 'Monthly'} Subscription`,
        order_id: data.data.orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()
            if (verifyData.success) {
              toast.success('Payment successful! Your subscription is now active.')
              router.push('/dashboard')
              setTimeout(() => window.location.reload(), 1000)
            } else {
              toast.error(verifyData.error || 'Payment verification failed')
            }
          } catch (error) {
            toast.error('Payment verification failed')
          }
          setLoading(null)
        },
        prefill: {
          name: data.data.prefill.name,
          email: data.data.prefill.email,
        },
        theme: { color: '#FF7A33' },
        modal: { ondismiss: () => setLoading(null) },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error('Failed to initiate payment')
      setLoading(null)
    }
  }

  const handleStart = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/signup')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>

      {/* Hero & Pricing Section */}
      <section style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url("/design/BG%2023-01%202.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 24px 80px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 64px)',
            fontWeight: 800,
            marginBottom: '16px',
            color: '#1a1a1a',
            lineHeight: '1.2'
          }}>
            Simple, Transparent <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#666', fontFamily: '"Playfair Display", serif' }}>Pricing</span>
          </h1>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Choose the plan that fits your needs. No hidden fees, cancel anytime.
          </p>

          {/* Pricing Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '64px', fontSize: '14px', fontWeight: 600 }}>
            <span style={{ color: '#1a1a1a' }}>Monthly</span>
            <div
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              style={{
                width: '48px',
                height: '24px',
                backgroundColor: '#eee',
                borderRadius: '50px',
                padding: '2px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: billingPeriod === 'monthly' ? 'flex-start' : 'flex-end',
                transition: 'all 0.2s'
              }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
            </div>
            <span style={{ color: '#999' }}>Annual <span style={{ color: '#FF7A33', marginLeft: '4px' }}>-20%</span></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'STARTER', name: 'Starter Plan', monthlyPrice: '₹5,000', annualPrice: '₹40,000', featured: false, bgColor: '#FFF9F6', textColor: '#1a1a1a' },
              { id: 'CREATOR', name: 'Creator Plan', monthlyPrice: '₹15,000', annualPrice: '₹150,000', featured: true, bgColor: '#FF7A33', textColor: 'white' },
              { id: 'PROFESSIONAL', name: 'Professional Plan', monthlyPrice: '₹20,000', annualPrice: '₹180,000', featured: false, bgColor: '#FFF9F6', textColor: '#1a1a1a' }
            ].map((p, i) => (
              <div key={i} style={{
                backgroundColor: 'white',
                borderRadius: '32px',
                overflow: 'hidden',
                border: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  backgroundColor: p.bgColor,
                  padding: '40px 32px',
                  color: p.textColor,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: p.featured ? 'rgba(255,255,255,0.3)' : '#FF7A33',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div className="grid grid-cols-2 gap-0.5" style={{ width: '16px' }}>
                        {[1, 2, 3, 4].map(j => <div key={j} style={{ width: '6px', height: '6px', border: `1.5px solid white`, borderRadius: '1px' }}></div>)}
                      </div>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: 700 }}>{p.name}</span>
                  </div>

                  <div style={{ fontSize: '32px', fontWeight: 800 }}>
                    {billingPeriod === 'annual' ? p.annualPrice : p.monthlyPrice}<span style={{ fontSize: '15px', fontWeight: 500, opacity: 0.8 }}>/{billingPeriod === 'annual' ? 'Year' : 'Month'}</span>
                  </div>

                  <button
                    onClick={() => handlePayment(p.id as any)}
                    disabled={loading === p.id}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '50px',
                      border: p.featured ? 'none' : '1px solid #ddd',
                      backgroundColor: 'white',
                      color: '#1a1a1a',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                    {loading === p.id ? <Loader2 className="animate-spin" width={18} /> : 'Get Started'}
                  </button>
                </div>

                <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    '15,000 words/month',
                    '5 blog templates',
                    '15 images/month',
                    'Basic SEO tools',
                    'Email support'
                  ].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#1a1a1a', fontWeight: 500 }}>
                      <Check style={{ width: '18px', height: '18px', color: '#1a1a1a' }} strokeWidth={2.5} />
                      <span>{f}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f0f0f0', fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>
                    Perfect for Individuals.
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '80px',
            backgroundColor: 'white',
            borderRadius: '100px',
            padding: '16px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: '1px solid #f0f0f0',
            textAlign: 'left'
          }}>
            <div>
              <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', marginBottom: '4px' }}>Need a custom solution?</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>Contact us for enterprise-grade features, custom integrations, and dedicated support.</p>
            </div>
            <button style={{
              backgroundColor: '#FF7A33', color: 'white', padding: '12px 32px', borderRadius: '50px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px'
            }}>Contact Us</button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '100px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, textAlign: 'left', marginBottom: '60px', color: '#1a1a1a' }}>
            Frequently Asked <span style={{ fontStyle: 'italic', fontWeight: 300, color: '#666', fontFamily: '"Playfair Display", serif' }}>Questions</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              "What is AIMy Blogs?",
              "Do I need writing experience to use AIMy Blogs?",
              "Can I publish directly to WordPress or Medium?",
              "Does AIMy Blogs support SEO optimization?",
              "Can I generate blog images using AIMy Blogs?",
              "Can I rewrite or improve my existing blog content?"
            ].map((q, idx) => (
              <div key={idx} style={{ borderBottom: '1.5px solid #f0f0f0', padding: '24px 0' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none', backgroundColor: 'transparent', padding: '0', fontSize: '20px', fontWeight: 700, cursor: 'pointer', textAlign: 'left', color: '#1a1a1a' }}
                >
                  <span>{idx + 1}. {q}</span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                    <Plus style={{ width: '18px', height: '18px', transform: openFaq === idx ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                </button>
                {openFaq === idx && (
                  <div style={{ paddingTop: '20px', color: '#666', fontSize: '16px', lineHeight: '1.6', maxWidth: '80%' }}>
                    AIMy Blogs is designed to help you create high-quality content effortlessly. Our AI assistant guides you through the entire process.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 42px)', fontWeight: 800, color: '#1a1a1a', marginBottom: '20px' }}>
            Ready to elevate your content ?
          </h2>
          <p style={{ color: '#666', marginBottom: '40px', fontSize: '16px' }}>
            Join thousands of creators and brands automating their growth today.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => handleStart()}
              style={{
                backgroundColor: '#FF7A33', color: 'white', padding: '18px 56px', borderRadius: '50px', border: 'none', fontSize: '15px', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 8px 25px rgba(255, 122, 51, 0.3)'
              }}>
              GET STARTED NOW
            </button>
            <p style={{ fontSize: '13px', color: '#999' }}>No credit card required for free plan</p>
          </div>
        </div>
      </section>
    </div>
  )
}
