'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      // Show banner after 2 seconds
      setTimeout(() => setShowBanner(true), 2000)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setShowBanner(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border-2 border-gray-200">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                🍪 Wij gebruiken cookies en tracking
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Wij verzamelen gegevens over uw bezoek aan onze website, inclusief uw <strong>IP-adres</strong> en{' '}
                <strong>locatiegegevens</strong> (land, stad). Deze informatie helpt ons onze diensten te verbeteren
                en te begrijpen welke pagina&apos;s het meest interessant zijn.
              </p>
              <p className="text-sm text-gray-600">
                Lees meer in ons{' '}
                <Link href="/privacybeleid" className="text-blue-600 hover:underline font-semibold">
                  Privacybeleid
                </Link>
                . Door &quot;Accepteren&quot; te klikken, gaat u akkoord met het verzamelen van deze gegevens.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={handleReject}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition duration-300 whitespace-nowrap"
              >
                Weigeren
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Accepteren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
