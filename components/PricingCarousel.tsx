"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react"

interface PricingPlan {
  name: string
  price: string
  priceINR?: string
  description: string
  button: string
  onClick: () => void
  loading: boolean
  featured: boolean
  features: string[]
}

interface PricingCarouselProps {
  plans: PricingPlan[]
  billingPeriod: 'monthly' | 'annual'
}

export function PricingCarousel({ plans, billingPeriod }: PricingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [screenSize, setScreenSize] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Determine how many cards to show based on screen size
  const getCardsToShow = () => {
    if (screenSize < 640) return 1 // Mobile: 1 card
    if (screenSize < 900) return 2 // Tablet: 2 cards
    if (screenSize < 1200) return 3 // Small Desktop: 3 cards
    return plans.length // Large Desktop: Show all cards in grid
  }

  const cardsToShow = getCardsToShow()
  const maxIndex = Math.max(0, plans.length - cardsToShow)
  const showControls = plans.length > cardsToShow // Show controls only when carousel is needed

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const getBillingText = () => {
    return billingPeriod === 'monthly' ? '/month' : '/month, billed annually'
  }

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div className="flex items-center justify-center gap-4 md:gap-6">
        {/* Left Arrow - Only show on mobile/tablet */}
        {showControls && (
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center bg-white transition-all duration-300 hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderColor: currentIndex === 0 ? '#d1d5db' : '#1f3529',
            }}
            aria-label="Previous plans"
          >
            <ChevronLeft
              className="w-5 h-5 md:w-6 md:h-6"
              style={{ color: currentIndex === 0 ? '#d1d5db' : '#1f3529' }}
              strokeWidth={2.5}
            />
          </button>
        )}

        {/* Cards Container */}
        <div className="flex-1 overflow-hidden" style={{ maxWidth: showControls ? '1200px' : '100%' }}>
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
              gap: screenSize < 640 ? '16px' : '20px',
            }}
          >
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 transition-all duration-300"
                style={{
                  width: `calc(${100 / cardsToShow}% - ${
                    screenSize < 640 ? 12 : 16
                  }px)`,
                  minWidth: screenSize < 640 ? '280px' : '260px',
                  maxWidth: screenSize < 640 ? '360px' : '320px',
                }}
              >
                <div
                  className="h-full rounded-xl transition-all duration-300 flex flex-col group cursor-pointer"
                  style={{
                    backgroundColor: plan.featured ? '#1f3529' : 'white',
                    border: plan.featured ? '2px solid #1f3529' : '1px solid #e5e7eb',
                    boxShadow: plan.featured
                      ? '0 25px 50px -12px rgba(31, 53, 41, 0.25)'
                      : '0 4px 12px rgba(0,0,0,0.08)',
                    padding: screenSize < 640 ? '32px 24px' : '40px 32px',
                    position: 'relative',
                    transform: plan.featured ? 'scale(1.05)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!plan.featured) {
                      e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(0,0,0,0.15)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!plan.featured) {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {/* Popular Badge */}
                  {plan.featured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#1f3529',
                        color: 'white',
                        padding: '4px 16px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                      }}
                    >
                      MOST POPULAR
                    </div>
                  )}

                  {/* Plan Name */}
                  <h3
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      color: plan.featured ? 'white' : '#6b7280',
                      marginBottom: '12px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '13px',
                      color: plan.featured ? 'rgba(255,255,255,0.8)' : '#9ca3af',
                      marginBottom: '20px',
                      minHeight: '36px',
                      lineHeight: '1.4',
                    }}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div style={{ marginBottom: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontSize: screenSize < 640 ? '36px' : '40px',
                        fontWeight: 600,
                        letterSpacing: '-0.025em',
                        color: plan.featured ? 'white' : '#1f3529',
                      }}
                    >
                      {plan.price}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        color: plan.featured ? 'rgba(255,255,255,0.7)' : '#6b7280',
                      }}
                    >
                      {getBillingText()}
                    </span>
                  </div>

                  {/* INR Price */}
                  {plan.priceINR && (
                    <div
                      style={{
                        marginBottom: '20px',
                        fontSize: '12px',
                        color: plan.featured ? 'rgba(255,255,255,0.8)' : '#6b7280',
                      }}
                    >
                      {plan.priceINR}
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={plan.onClick}
                    disabled={plan.loading}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: plan.featured ? 'white' : 'white',
                      color: plan.featured ? '#1f3529' : '#1f3529',
                      border: plan.featured ? 'none' : '2px solid #1f3529',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: plan.loading ? 'not-allowed' : 'pointer',
                      marginBottom: '28px',
                      opacity: plan.loading ? 0.7 : 1,
                      transition: 'all 0.3s',
                    }}
                    className="hover:opacity-90 hover:transform hover:scale-105"
                  >
                    {plan.loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      plan.button
                    )}
                  </button>

                  {/* Features List */}
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, featureIdx) => (
                      <li
                        key={featureIdx}
                        className="flex items-start gap-2"
                        style={{
                          fontSize: '13px',
                          color: plan.featured ? 'rgba(255,255,255,0.9)' : '#374151',
                          lineHeight: '1.5',
                        }}
                      >
                        <Check
                          className="flex-shrink-0 mt-0.5"
                          style={{
                            height: '16px',
                            width: '16px',
                            color: plan.featured ? 'white' : '#1f3529',
                          }}
                          strokeWidth={2.5}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow - Only show on mobile/tablet */}
        {showControls && (
          <button
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center bg-white transition-all duration-300 hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderColor: currentIndex === maxIndex ? '#d1d5db' : '#1f3529',
            }}
            aria-label="Next plans"
          >
            <ChevronRight
              className="w-5 h-5 md:w-6 md:h-6"
              style={{ color: currentIndex === maxIndex ? '#d1d5db' : '#1f3529' }}
              strokeWidth={2.5}
            />
          </button>
        )}
      </div>

      {/* Carousel Indicators - Only show on mobile/tablet */}
      {showControls && maxIndex > 0 && (
        <div className="flex gap-2 justify-center mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="transition-all duration-300 rounded-full border-none cursor-pointer"
              style={{
                width: currentIndex === idx ? '32px' : '10px',
                height: '10px',
                backgroundColor: currentIndex === idx ? '#1f3529' : '#d1d5db',
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
