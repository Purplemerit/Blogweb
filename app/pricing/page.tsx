"use client"

import { useState } from "react"
import Link from "next/link"
import { PenTool, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

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

          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', fontSize: '14px' }} className="hidden md:flex">
            <Link href="/" style={{ color: '#374151', textDecoration: 'none' }}>Home</Link>
            <Link href="/features" style={{ color: '#374151', textDecoration: 'none' }}>Features</Link>
            <Link href="/pricing" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
            <Link href="/blog" style={{ color: '#374151', textDecoration: 'none' }}>Blog</Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/login">
              <Button variant="ghost" size="sm" style={{ fontSize: '14px', fontWeight: 400 }}>Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" style={{ backgroundColor: '#1f3529', color: 'white', fontSize: '14px', fontWeight: 400, padding: '8px 20px' }}>
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: '1152px', margin: '0 auto', padding: '80px 32px 40px', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: '48px',
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
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'white',
          padding: '4px',
          borderRadius: '8px',
          marginBottom: '60px',
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
      </section>

      {/* Pricing Cards */}
      <section style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
          {/* Starter Plan */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px 32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: '#6b7280',
              marginBottom: '12px',
              textTransform: 'uppercase'
            }}>STARTER</h3>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px', minHeight: '40px' }}>
              Perfect for individuals just getting started
            </p>
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '40px',
                fontWeight: 600,
                letterSpacing: '-0.025em'
              }}>$29</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>/month</span>
            </div>
            <button style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'white',
              color: '#1f3529',
              border: '2px solid #1f3529',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '32px'
            }}>
              GET STARTED
            </button>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Up to 2 platforms</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Basic AI editor</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>10 scheduled posts</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Basic analytics</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Email support</span>
              </li>
            </ul>
          </div>

          {/* Creator Plan - Featured */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px 32px',
            boxShadow: '0 8px 24px rgba(31, 53, 41, 0.15)',
            border: '2px solid #1f3529',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#1f3529',
              color: 'white',
              padding: '4px 16px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}>
              MOST POPULAR
            </div>
            <h3 style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: '#6b7280',
              marginBottom: '12px',
              textTransform: 'uppercase'
            }}>CREATOR</h3>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px', minHeight: '40px' }}>
              For growing creators and small teams
            </p>
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '40px',
                fontWeight: 600,
                letterSpacing: '-0.025em'
              }}>$79</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>/month</span>
            </div>
            <button style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#1f3529',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '32px'
            }}>
              START FREE TRIAL
            </button>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Unlimited platforms</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Advanced AI editor</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Unlimited scheduled posts</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Advanced analytics & SEO</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Team collaboration (5 members)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Priority support</span>
              </li>
            </ul>
          </div>

          {/* Professional Plan */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px 32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: '#6b7280',
              marginBottom: '12px',
              textTransform: 'uppercase'
            }}>PROFESSIONAL</h3>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px', minHeight: '40px' }}>
              For established creators and larger teams
            </p>
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '40px',
                fontWeight: 600,
                letterSpacing: '-0.025em'
              }}>$199</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>/month</span>
            </div>
            <button style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'white',
              color: '#1f3529',
              border: '2px solid #1f3529',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '32px'
            }}>
              GET STARTED
            </button>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Everything in Creator</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Unlimited team members</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>White-label options</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Custom integrations</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>Dedicated account manager</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#374151' }}>
                <Check style={{ height: '18px', width: '18px', color: '#1f3529', flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>24/7 premium support</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Custom Solution Banner */}
      <section style={{
        maxWidth: '1152px',
        margin: '0 auto 80px',
        padding: '0 32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h3 style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '24px',
              marginBottom: '8px',
              letterSpacing: '-0.025em'
            }}>Need a custom solution?</h3>
            <p style={{ fontSize: '15px', color: '#6b7280' }}>
              Contact us for enterprise pricing and custom feature development
            </p>
          </div>
          <button style={{
            padding: '12px 32px',
            backgroundColor: '#1f3529',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}>
            CONTACT SALES
          </button>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section style={{ backgroundColor: 'white', padding: '80px 0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 32px' }}>
          <h2 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '40px',
            textAlign: 'center',
            marginBottom: '16px',
            letterSpacing: '-0.025em'
          }}>Detailed Comparison</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '48px', fontSize: '15px' }}>
            See exactly what's included in each plan
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: 600, fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature</th>
                  <th style={{ textAlign: 'center', padding: '16px', fontWeight: 600, fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starter</th>
                  <th style={{ textAlign: 'center', padding: '16px', fontWeight: 600, fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Creator</th>
                  <th style={{ textAlign: 'center', padding: '16px', fontWeight: 600, fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Professional</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Monthly Price</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>$29</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151', fontWeight: 600 }}>$79</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>$199</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Platform Connections</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>2</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Scheduled Posts</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>10/month</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>AI Editor</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Basic</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Advanced</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Advanced</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Analytics & Insights</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Basic</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Advanced</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Advanced</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>SEO Optimization</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>—</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>✓</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>✓</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Team Members</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>1</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>5</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Content Library</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>100 items</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#374151' }}>Unlimited</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Collaboration Tools</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>—</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>✓</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>✓</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Priority Support</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>—</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>✓</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>✓</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>White-label Options</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>—</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>—</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>✓</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Custom Integrations</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>—</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>—</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>✓</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Dedicated Account Manager</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>—</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#9ca3af' }}>—</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: '#1f3529' }}>✓</td>
                </tr>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>Support Response Time</td>
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
                We accept all major credit cards, PayPal, and offer invoicing for annual plans.
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
                All data is encrypted and stored securely. We're SOC 2 Type II compliant and GDPR ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: '#f5f1e8', padding: '80px 0' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '40px',
            marginBottom: '16px',
            letterSpacing: '-0.025em'
          }}>Ready to elevate your content?</h2>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px' }}>
            Join thousands of creators who are already using PublishType
          </p>
          <button style={{
            backgroundColor: '#1f3529',
            color: 'white',
            padding: '14px 40px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '15px',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            GET STARTED TODAY
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1a3428', color: 'white', padding: '64px 0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            marginBottom: '48px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <PenTool style={{ height: '20px', width: '20px' }} strokeWidth={2} />
                <span style={{ fontWeight: 500, fontSize: '18px' }}>PublishType</span>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
                Publish once, reach everywhere.
              </p>
            </div>

            <div>
              <h4 style={{ fontWeight: 500, marginBottom: '16px', fontSize: '15px' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link href="/features" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Features</Link></li>
                <li><Link href="/pricing" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontWeight: 500, marginBottom: '16px', fontSize: '15px' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>About</Link></li>
                <li><Link href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Contact</Link></li>
              </ul>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '32px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)'
          }}>
            <p>© 2024 PublishType. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
