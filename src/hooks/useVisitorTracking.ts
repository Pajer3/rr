'use client'

import { useEffect } from 'react'

export function useVisitorTracking(pageName: string) {
  useEffect(() => {
    // Check if user has given consent (we'll implement consent banner later)
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
          }),
        })
      } catch (error) {
        console.error('Failed to track visitor:', error)
      }
    }
  }, [pageName])
}
