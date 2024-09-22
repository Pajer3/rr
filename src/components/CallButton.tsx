'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneCall } from 'lucide-react'

export default function CallButton() {
  const [showNumber, setShowNumber] = useState(false)
  const phoneNumber = '+31 6 51891004'
  const buttonRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    setShowNumber(prev => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowNumber(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <motion.div
      ref={buttonRef}
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className="bg-black text-white rounded-full p-3 md:p-4 shadow-lg transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
      >
        <PhoneCall className="h-5 w-5 md:h-6 md:w-6" />
      </motion.button>
      <AnimatePresence>
        {showNumber && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-2 bg-white text-black px-4 py-2 rounded-lg shadow-lg text-sm md:text-base whitespace-nowrap"
          >
            {phoneNumber}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
