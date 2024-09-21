'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Trash2, Repeat, Home } from 'lucide-react'

const cleaningIcons = [
  { src: '/images/toys.png', alt: 'Toys', icon: Home },
  { src: '/images/wcrol.png', alt: 'Toilet paper', icon: Repeat },
  { src: '/images/bottles.png', alt: 'Cleaning bottles', icon: Trash2 },
  { src: '/images/car.png', alt: 'Car', icon: Sparkles },
]

export default function HeroSection() {
  const [activeIcon, setActiveIcon] = useState<number | null>(null)

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 mt-16 bg-gradient-to-r from-blue-100 to-green-100 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          <motion.h1 
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Frisspits: Uitstekende Schoonmaak
          </motion.h1>
          <motion.p 
            className="mx-auto max-w-[700px] text-gray-600 text-sm sm:text-base md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Professionele schoonmaakdiensten voor huizen en bedrijven. Laat Frisspits de rommel opruimen terwijl u zich concentreert op wat belangrijk is.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/#contact" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-600 text-white hover:bg-blue-700 h-12 px-6"
              >
                Nu Boeken
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.a>
            </Link>
            <Link href="/diensten" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-blue-600 text-blue-600 hover:bg-blue-50 h-12 px-6"
              >
                Onze Diensten
              </motion.a>
            </Link>
          </div>
        </div>
        <div className="mt-12 flex justify-center relative">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {cleaningIcons.map((item, index) => (
              <motion.div
                key={index}
                className="relative cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveIcon(activeIcon === index ? null : index)}
              >
                <div className="bg-white rounded-full p-4 shadow-lg">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {activeIcon !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: -100 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-4 z-20"
              >
                <Image
                  src={cleaningIcons[activeIcon].src}
                  alt={cleaningIcons[activeIcon].alt}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <motion.button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  onClick={() => setActiveIcon(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 pointer-events-none" />
    </section>
  )
}   
