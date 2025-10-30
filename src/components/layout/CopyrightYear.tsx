/**
 * Client component for displaying the current year
 * Used in Footer to avoid Next.js 16 prerender restrictions
 */
'use client'

export default function CopyrightYear() {
  return <>{new Date().getFullYear()}</>
}
