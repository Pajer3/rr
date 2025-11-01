'use client'

import { useEffect } from 'react'

export function useVisitorTracking(pageName: string, required = false) {
  useEffect(() => {
    // For diensten pages and quote requests, tracking is REQUIRED for spam prevention
    // regardless of cookie consent
    if (required) {
      trackVisitor()
      return
    }

    // For other pages, respect cookie consent
    const hasConsent = localStorage.getItem('cookieConsent') === 'accepted'

    if (!hasConsent) {
      // Still track but wait for consent
      const checkConsent = setInterval(() => {
        if (localStorage.getItem('cookieConsent') === 'accepted') {
          trackVisitor()
          clearInterval(checkConsent)
        }
      }, 1000)

      // Clear interval after 30 seconds to prevent infinite checking
      setTimeout(() => clearInterval(checkConsent), 30000)
      return
    }

    trackVisitor()

    async function trackVisitor() {
      try {
        await fetch('/api/track-visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: pageName,
            required: required // Flag to indicate this is required tracking
          }),
        })
      } catch (error) {
        console.error('Failed to track visitor:', error)
      }
    }
  }, [pageName, required])
}
