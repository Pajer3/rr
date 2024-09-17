'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const WaterDrop = ({ delay }: { delay: number }) => (
  <div
    className="absolute rounded-full bg-blue-300 opacity-70 animate-fall"
    style={{
      width: '10px',
      height: '10px',
      animationDelay: `${delay}s`,
      left: `${Math.random() * 100}%`,
    }}
  />
)

export default function NotFound() {
  const [isClient, setIsClient] = useState(false)
  const [mopPosition, setMopPosition] = useState(0)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setMopPosition(prev => (prev === 0 ? 20 : 0))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4 overflow-hidden">
      <div className="relative w-64 h-64 mb-8">
        {[...Array(20)].map((_, i) => (
          <WaterDrop key={i} delay={i * 0.2} />
        ))}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `translateX(${mopPosition}px)` }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="45" y="0" width="10" height="60" fill="#8B4513" />
            <rect x="20" y="60" width="60" height="10" fill="#8B4513" />
            <rect x="15" y="70" width="70" height="30" fill="#1E90FF" />
            {[...Array(7)].map((_, i) => (
              <rect key={i} x={15 + i * 10} y="70" width="5" height="30" fill="#4169E1" />
            ))}
          </svg>
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Oeps! Pagina niet gevonden</h1>
      <p className="text-xl mb-8 text-gray-600 text-center">
        We zijn druk bezig met schoonmaken, maar deze pagina kunnen we niet vinden!<br />
        Laten we je naar een plek brengen die wel bestaat.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          Terug naar Home
        </button>
        <button
          onClick={() => router.push('/diensten')}
          className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          Bekijk onze Diensten
        </button>
      </div>
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-2">Hulp nodig bij het vinden van iets?</p>
        <p className="text-gray-600">
          Neem contact met ons op via{' '}
          <a href="mailto:info@frisspits.nl" className="text-blue-500 hover:underline">
            info@frisspits.nl
          </a>
        </p>
      </div>
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(300px); }
        }
        .animate-fall {
          animation: fall 2s linear infinite;
        }
      `}</style>
    </div>
  )
}
