import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type React from "react"

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

// Merge inline styles
export function mergeStyles(
  ...styles: (React.CSSProperties | undefined)[]
): React.CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean))
}
