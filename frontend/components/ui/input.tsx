"use client"

import * as React from "react"
import { mergeStyles } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ style, type, disabled, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    const baseStyle: React.CSSProperties = {
      display: 'flex',
      height: '40px',
      width: '100%',
      borderRadius: '8px',
      border: '1px solid #e5e5e5',
      backgroundColor: '#ffffff',
      padding: '8px 12px',
      fontSize: '14px',
      transition: 'all 0.2s',
      outline: 'none',
    }

    const focusStyle: React.CSSProperties = isFocused ? {
      borderColor: '#171717',
      boxShadow: '0 0 0 2px rgba(23, 23, 23, 0.1)',
    } : {}

    const disabledStyle: React.CSSProperties = disabled ? {
      cursor: 'not-allowed',
      opacity: 0.5,
    } : {}

    return (
      <input
        type={type}
        style={mergeStyles(baseStyle, focusStyle, disabledStyle, style)}
        ref={ref}
        disabled={disabled}
        onFocus={(e) => {
          setIsFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          onBlur?.(e)
        }}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
