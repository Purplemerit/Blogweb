"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PenTool, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewsletterFooter } from "@/components/NewsletterFooter"
import { useAuth } from "@/lib/context/AuthContext"
import { toast } from "sonner"
import { PricingCarousel } from "@/components/PricingCarousel"

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // INR pricing (matches Razorpay values - actual charges)
  const pricingINR = {
    starter: {
      monthly: 5000,      // ₹5,000 (500000 paise in Razorpay)
      annual: 40000       // ₹40,000 (4000000 paise in Razorpay)
    },
    creator: {
      monthly: 15000,     // ₹15,000 (1500000 paise in Razorpay)
      annual: 150000      // ₹1,50,000 (15000000 paise in Razorpay)
    },
    professional: {
      monthly: 20000,     // ₹20,000 (2000000 paise in Razorpay)
      annual: 180000      // ₹1,80,000 (18000000 paise in Razorpay)
    }
  }

  // USD pricing (converted from INR at ~83 INR = 1 USD)
  const pricing = {
    starter: {
      monthly: 60.24,    // ₹5,000 ≈ $60.24
      annual: 481.93     // ₹40,000 ≈ $481.93
    },
    creator: {
      monthly: 180.72,   // ₹15,000 ≈ $180.72
      annual: 1807.23    // ₹1,50,000 ≈ $1,807.23
    },
    professional: {
      monthly: 240.96,   // ₹20,000 ≈ $240.96
      annual: 2168.67    // ₹1,80,000 ≈ $2,168.67
    }
  }

  const getPrice = (plan: keyof typeof pricing) => {
    return billingPeriod === 'monthly' ? pricing[plan].monthly : pricing[plan].annual
  }

  const getPriceINR = (plan: keyof typeof pricingINR) => {
    return billingPeriod === 'monthly' ? pricingINR[plan].monthly : pricingINR[plan].annual
  }

  // Load Razorpay script
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

  // Handle payment
  const handlePayment = async (plan: 'STARTER' | 'CREATOR' | 'PROFESSIONAL') => {
    if (!user) {
      toast.error('Please login to subscribe')
      router.push('/login?redirect=/pricing')
      return
    }

    setLoading(plan)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway')
        setLoading(null)
        return
      }

      // Create order
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan,
          billingPeriod,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        toast.error(data.error || 'Failed to create order')
        setLoading(null)
        return
      }

      // Configure Razorpay options
      const options = {
        key: data.data.keyId,
        amount: data.data.amount,
        currency: data.data.currency,
        name: 'PublishType',
        description: `${plan} Plan - ${billingPeriod === 'annual' ? 'Annual' : 'Monthly'} Subscription`,
        order_id: data.data.orderId,
        handler: async function (response: any) {
          // Verify payment
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
              // Redirect to dashboard
              router.push('/dashboard')
              // Refresh auth context
              window.location.reload()
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
        theme: {
          color: '#1f3529',
        },
        modal: {
          ondismiss: function () {
            setLoading(null)
          },
        },
      }

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error('Failed to initiate payment')
      setLoading(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f1e8' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(245,241,232,0.95)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
            <PenTool style={{ height: '20px', width: '20px' }} strokeWidth={2} />
            <span style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '-0.025em' }}>PublishType</span>
          </Link>

          <nav className="header-nav hide-mobile" style={{ fontSize: '14px' }}>
            <Link href="/" style={{ color: '#374151', textDecoration: 'none' }}>Home</Link>
            <Link href="/features" style={{ color: '#374151', textDecoration: 'none' }}>Features</Link>
            <Link href="/pricing" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
            <Link href="/blog" style={{ color: '#374151', textDecoration: 'none' }}>Blog</Link>
          </nav>

          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <Link href="/dashboard">
                <Button size="sm" style={{ backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '8px 20px' }}>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" style={{ fontSize: '14px', fontWeight: 400 }}>Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" style={{ backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '8px 20px' }}>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            {mobileMenuOpen ? <X style={{ height: '24px', width: '24px' }} /> : <Menu style={{ height: '24px', width: '24px' }} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div style={{
            borderTop: '1px solid rgba(0,0,0,0.1)',
            backgroundColor: 'white',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                Home
              </Link>
              <Link
                href="/features"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 600,
                  backgroundColor: '#f3f4f6'
                }}
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                Blog
              </Link>
              <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {user ? (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" style={{ width: '100%', backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '12px 20px' }}>
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" style={{ width: '100%', fontSize: '14px', fontWeight: 400, padding: '12px 20px' }}>Sign In</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" style={{ width: '100%', backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '12px 20px' }}>
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="section-padding" style={{ maxWidth: '1152px', margin: '0 auto', textAlign: 'center', paddingBottom: '40px' }}>
        <h1 className="text-section-title" style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          lineHeight: '1.2',
          marginBottom: '16px',
          letterSpacing: '-0.025em'
        }}>
          Simple, Transparent Pricing
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '40px' }}>
          Choose the perfect plan for your content creation needs
        </p>

        {/* Billing Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'white',
            padding: '4px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              style={{
                padding: '8px 24px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: billingPeriod === 'monthly' ? '#1f3529' : 'transparent',
                color: billingPeriod === 'monthly' ? 'white' : '#374151',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              style={{
                padding: '8px 24px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: billingPeriod === 'annual' ? '#1f3529' : 'transparent',
                color: billingPeriod === 'annual' ? 'white' : '#374151',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Annual
            </button>
          </div>
          {billingPeriod === 'annual' && (
            <div style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 500
            }}>
              Save up to 17% with annual billing
            </div>
          )}
        </div>
      </section>

      {/* Pricing Cards Carousel */}
      <section className="container-padding" style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '80px' }}>
        <PricingCarousel
          billingPeriod={billingPeriod}
          plans={[
            {
              name: 'FREE',
              price: '$0',
              description: 'Perfect for trying out PublishType',
              button: 'GET STARTED FREE',
              onClick: () => {
                if (user) {
                  router.push('/dashboard')
                } else {
                  router.push('/signup')
                }
              },
              loading: false,
              featured: false,
              features: [
                'Up to 1 platform',
                'Basic editor',
                '5 scheduled posts',
                'Basic analytics',
                'Community support'
              ]
            },
            {
              name: 'STARTER',
              price: '₹' + getPriceINR('starter'),
              priceINR: `or $${getPrice('starter').toFixed(2)}${billingPeriod === 'annual' ? '/year' : '/month'}`,
              description: 'Perfect for individuals just getting started',
              button: 'GET STARTED',
              onClick: () => handlePayment('STARTER'),
              loading: loading === 'STARTER',
              featured: false,
              features: [
                'Up to 2 platforms',
                'Basic AI editor',
                '10 scheduled posts',
                'Basic analytics',
                'Email support'
              ]
            },
            {
              name: 'CREATOR',
              price: '₹' + getPriceINR('creator'),
              priceINR: `or $${getPrice('creator').toFixed(2)}${billingPeriod === 'annual' ? '/year' : '/month'}`,
              description: 'For growing creators and small teams',
              button: 'START FREE TRIAL',
              onClick: () => handlePayment('CREATOR'),
              loading: loading === 'CREATOR',
              featured: true,
              features: [
                'Unlimited platforms',
                'Advanced AI editor',
                'Unlimited scheduled posts',
                'Advanced analytics & SEO',
                'Team collaboration (5 members)',
                'Priority support'
              ]
            },
            {
              name: 'PROFESSIONAL',
              price: '₹' + getPriceINR('professional'),
              priceINR: `or $${getPrice('professional').toFixed(2)}${billingPeriod === 'annual' ? '/year' : '/month'}`,
              description: 'For established creators and larger teams',
              button: 'GET STARTED',
              onClick: () => handlePayment('PROFESSIONAL'),
              loading: loading === 'PROFESSIONAL',
              featured: false,
              features: [
                'Everything in Creator',
                'Unlimited team members',
                'White-label options',
                'Custom integrations',
                'Dedicated account manager',
                '24/7 premium support'
              ]
            }
          ]}
        />
      </section>

      {/* Custom Solution Banner */}
      
      {/* Detailed Comparison Table */}
      <section style={{ backgroundColor: 'white', padding: '80px 0' }}>
        <div className="container-padding" style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 className="text-section-title" style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            textAlign: 'center',
            marginBottom: '16px',
            letterSpacing: '-0.025em'
          }}>Detailed Comparison</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '48px', fontSize: '15px' }}>
            See exactly what's included in each plan
          </p>

          <div className="responsive-table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: 600, fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature</th>
                  <th style={{ textAlign: 'center', padding: '16px', fontWeight: 600, fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Free</th>
                  <th style={{ textAlign: 'center', padding: '16px', fontWeight: 600, fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starter</th>
                  <th style={{ textAlign: 'center', padding: '16px', fontWeight: 600, fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Creator</th>
                  <th style={{ textAlign: 'center', padding: '16px', fontWeight: 600, fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Professional</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{billingPeriod === 'monthly' ? 'Monthly Price' : 'Monthly Price (Billed Annually)'}</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>₹0</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>₹{getPriceINR('starter').toLocaleString('en-IN')}</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151', fontWeight: 600 }}>₹{getPriceINR('creator').toLocaleString('en-IN')}</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>₹{getPriceINR('professional').toLocaleString('en-IN')}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Platform Connections</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>1</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>2</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Scheduled Posts</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>5/month</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>10/month</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>AI Editor</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Basic</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Advanced</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Advanced</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Analytics & Insights</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Basic</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Advanced</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Advanced</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>SEO Optimization</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>Yes</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>Yes</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Team Members</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>1</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>1</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>5</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Content Library</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>10 items</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>100 items</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Collaboration Tools</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>Yes</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>Yes</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Priority Support</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>Yes</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>Yes</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>White-label Options</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>Yes</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Custom Integrations</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>Yes</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Dedicated Account Manager</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>Yes</td>
                </tr>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Support Response Time</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Email only</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>48 hours</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>24 hours</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Same day</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ backgroundColor: '#2c4a3a', color: 'white', padding: '80px 0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 32px' }}>
          <h2 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '40px',
            textAlign: 'center',
            marginBottom: '48px',
            letterSpacing: '-0.025em'
          }}>Frequently Asked Questions</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                Can I change plans later?
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                Is there a free trial?
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                We offer a 14-day free trial on all Creator and Professional plans. No credit card required to start.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                What payment methods do you accept?
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                We accept all major credit/debit cards, UPI, Net Banking, and wallets via Razorpay.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                Can I cancel anytime?
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                Do you offer refunds?
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                We offer a 30-day money-back guarantee on all plans if you're not satisfied with the service.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                What about data security?
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                All data is encrypted and stored securely. Payments are processed by Razorpay with PCI DSS compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter and Footer */}
      <NewsletterFooter />

      {/* Loader animation keyframes */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
