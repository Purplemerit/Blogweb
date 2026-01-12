import * as React from "react"
import { mergeStyles } from "@/lib/utils"

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '9999px',
  border: '1px solid transparent',
  padding: '2px 10px',
  fontSize: '12px',
  fontWeight: 600,
  transition: 'colors 0.2s',
}

const variantStyles = {
  default: {
    borderColor: 'transparent',
    backgroundColor: '#171717',
    color: '#ffffff',
  },
  secondary: {
    borderColor: 'transparent',
    backgroundColor: '#f5f5f5',
    color: '#171717',
  },
  destructive: {
    borderColor: 'transparent',
    backgroundColor: '#dc2626',
    color: '#ffffff',
  },
  outline: {
    borderColor: '#e5e5e5',
    backgroundColor: 'transparent',
    color: '#171717',
  },
  success: {
    borderColor: 'transparent',
    backgroundColor: '#16a34a',
    color: '#ffffff',
  },
  warning: {
    borderColor: 'transparent',
    backgroundColor: '#ca8a04',
    color: '#ffffff',
  },
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
}

function Badge({ style, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      style={mergeStyles(baseStyle, variantStyles[variant], style)}
      {...props}
    />
  )
}

export { Badge }
