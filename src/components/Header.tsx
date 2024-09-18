'use client'

import { useState } from 'react'
import { Menu, X, Home, FileText, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/diensten', icon: FileText, label: 'Diensten' },
    { href: '/#testimonials', icon: User, label: 'Getuigenissen' },
  ]

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white shadow-sm">
      <Link href="/" className="flex items-center justify-center">
        <Image
          src="/images/frisspitslogo.png"
          alt="Frisspits Logo"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
      </Link>
      <nav className="hidden md:flex items-center gap-2">
        <div className="flex bg-gray-100 p-1 rounded-2xl shadow-inner">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-600 hover:text-black dark:text-gray-400 inline-flex items-center p-2.5 rounded-full transition-all duration-200 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <item.icon className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
      <button
        className="md:hidden text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Sluit menu" : "Open menu"}
      >
        {isMenuOpen ? <X /> : <Menu />}
      </button>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 bg-white shadow-lg z-50 rounded-b-2xl overflow-hidden"
          >
            <nav className="flex flex-col p-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-gray-600 hover:text-black py-3 px-4 rounded-xl transition-all duration-200 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
