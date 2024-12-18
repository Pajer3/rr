'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Home, FileText, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { go3Font } from '@/app/fonts'
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const menuItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/diensten', icon: FileText, label: 'Diensten' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollThreshold = 50

      if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        setIsHeaderVisible(false)
        setIsMenuOpen(false) // Close the menu when scrolling down
      } else if (currentScrollY < lastScrollY || currentScrollY <= scrollThreshold) {
        setIsHeaderVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    document.body.style.paddingTop = '64px'
    return () => {
      document.body.style.paddingTop = '0px'
    }
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isHeaderVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 px-4 lg:px-6 h-16 flex items-center justify-between bg-black shadow-md z-50 text-white"
      >
        <Link href="/" className="flex items-center justify-center hover:opacity-80 transition-opacity">
          <Sparkles className="h-6 w-6 mr-4 text-primary" />
          <div className="flex flex-col">
            <span className={`${go3Font.className} text-background font-bold text-lg text-primary`}>Frisspits</span>
            <span className={`${styles.schoonmaakdienstenText} text-gray-400 -mt-2`}>Schoonmaakdiensten</span>
        </div>
        </Link>
        <nav className="hidden md:flex items-center gap-2 bg-black">
          <div className="flex p-1 rounded-2xl shadow-inner bg-black">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-400 hover:text-white inline-flex items-center p-2.5 rounded-full transition-all duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <item.icon className="w-5 h-5" />
                <span className="ml-2 text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
        <button
          className="md:hidden bg-black text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Sluit menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && isHeaderVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 bg-black shadow-lg z-40 rounded-b-2xl overflow-hidden"
          >
            <nav className="flex flex-col p-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-gray-400 hover:text-white py-3 px-4 rounded-xl transition-all duration-200 hover:bg-gray-800"
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
    </>
  )
}
