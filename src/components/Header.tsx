'use client'

import { useState } from 'react'
import { Sparkles, Menu, X } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-white shadow-sm">
      <Link href="/" className="flex items-center justify-center">
        <Sparkles className="h-6 w-6 mr-2" />
        <span className="font-bold text-lg">Frisspits</span>
      </Link>
      <nav className="hidden md:flex gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/diensten">
          Diensten
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/#testimonials">
          Getuigenissen
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/#contact">
          Contact
        </Link>
      </nav>
      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X /> : <Menu />}
      </button>
      {isMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white shadow-md z-50">
          <nav className="flex flex-col p-4">
            <Link className="text-sm font-medium py-2" href="/diensten" onClick={() => setIsMenuOpen(false)}>
              Diensten
            </Link>
            <Link className="text-sm font-medium py-2" href="/#testimonials" onClick={() => setIsMenuOpen(false)}>
              Getuigenissen
            </Link>
            <Link className="text-sm font-medium py-2" href="/#contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
