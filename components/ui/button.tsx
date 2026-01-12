"use client"

import * as React from "react"
import { mergeStyles } from "@/lib/utils"

const baseButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  whiteSpace: 'nowrap',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'all 0.2s',
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
}

const variantStyles = {
  default: {
    backgroundColor: '#171717',
    color: '#ffffff',
  },
  destructive: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
  },
  outline: {
    border: '1px solid #e5e5e5',
    backgroundColor: '#ffffff',
    color: '#0a0a0a',
  },
  secondary: {
    backgroundColor: '#f5f5f5',
    color: '#171717',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#0a0a0a',
  },
  link: {
    color: '#171717',
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
    backgroundColor: 'transparent',
  },
}

const sizeStyles = {
  default: {
    height: '40px',
    padding: '8px 16px',
  },
  sm: {
    height: '36px',
    padding: '8px 12px',
    fontSize: '12px',
  },
  lg: {
    height: '44px',
    padding: '8px 32px',
    fontSize: '16px',
  },
  icon: {
    height: '40px',
    width: '40px',
    padding: 0,
  },
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ style, variant = 'default', size = 'default', disabled, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)

    const hoverStyles: Record<string, React.CSSProperties> = {
      default: { backgroundColor: '#262626' },
      destructive: { backgroundColor: '#b91c1c' },
      outline: { backgroundColor: '#fafafa' },
      secondary: { backgroundColor: '#e5e5e5' },
      ghost: { backgroundColor: '#f5f5f5' },
      link: {},
    }

    const disabledStyle: React.CSSProperties = disabled ? {
      pointerEvents: 'none',
      opacity: 0.5,
    } : {}

    const finalStyle = mergeStyles(
      baseButtonStyle,
      variantStyles[variant],
      sizeStyles[size],
      isHovered && !disabled ? hoverStyles[variant] : {},
      disabledStyle,
      style
    )

    return (
      <button
        ref={ref}
        style={finalStyle}
        disabled={disabled}
        onMouseEnter={(e) => {
          setIsHovered(true)
          onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          setIsHovered(false)
          onMouseLeave?.(e)
        }}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
