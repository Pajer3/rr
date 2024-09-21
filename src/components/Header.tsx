'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Home, FileText, User, Sparkles, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const menuItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/diensten', icon: FileText, label: 'Diensten' },
    { href: '/#testimonials', icon: User, label: 'Getuigenissen' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const toggleHeader = () => {
    setIsHeaderVisible(!isHeaderVisible)
  }

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isHeaderVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 px-4 lg:px-6 h-16 flex items-center justify-between bg-white shadow-md z-50"
      >
        <Link href="/" className="flex items-center justify-center hover:opacity-80 transition-opacity">
          <Sparkles className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-lg text-primary">Frisspits</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-2xl shadow-inner">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-black dark:text-gray-400 inline-flex items-center p-2.5 rounded-full transition-all duration-200 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <item.icon className="w-5 h-5" />
                <span className="ml-2 text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
        <button
          className="md:hidden text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Sluit menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 bg-white shadow-lg z-40 rounded-b-2xl overflow-hidden"
          >
            <nav className="flex flex-col p-4 mb-12">
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

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={toggleHeader}
        className="fixed bottom-4 right-4 bg-primary text-white rounded-full p-2 shadow-lg z-50 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={isHeaderVisible ? "Verberg header" : "Toon header"}
      >
        <ChevronUp className={`w-6 h-6 transition-transform duration-300 ${isHeaderVisible ? 'rotate-180' : ''}`} />
      </motion.button>
    </>
  )
}
