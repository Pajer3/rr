'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Instagram, Twitter } from 'lucide-react'

export default function OverOns() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100 p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-pink-600 transition duration-300 mb-8">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="font-semibold">Terug naar Home</span>
          </Link>
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Over Ons
        </motion.h1>

        {/* Content */}
        <motion.div 
          className="bg-white p-8 rounded-3xl shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-lg mb-6 text-gray-700 leading-relaxed">
            Frisspits is een toonaangevend schoonmaakbedrijf dat zich richt op het leveren van hoogwaardige schoonmaakdiensten voor zowel particulieren als bedrijven. Onze missie is om een schone, gezonde en aangename omgeving te creëren voor al onze klanten.
          </p>
          <p className="text-lg mb-6 text-gray-700 leading-relaxed">
            Met jarenlange ervaring in de branche, een team van getrainde professionals en de nieuwste schoonmaaktechnieken, streven we ernaar om altijd de beste resultaten te leveren. We zijn trots op onze reputatie voor betrouwbaarheid, kwaliteit en klanttevredenheid.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Bij Frisspits geloven we in duurzaamheid en gebruiken we waar mogelijk milieuvriendelijke producten en methoden. We investeren continu in de ontwikkeling van onze medewerkers en in innovatieve schoonmaakoplossingen om aan de veranderende behoeften van onze klanten te voldoen.
          </p>
        </motion.div>

        {/* Socials Introduction */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-2xl font-semibold text-gray-800 mb-6">
            Volg ons op social media
          </p>

          {/* Social Links */}
          <div className="flex justify-center space-x-8">
            <SocialLink href="https://wa.me/+31651891004" icon={<WhatsAppIcon />} label="WhatsApp" bg="bg-green-500" hoverBg="hover:bg-green-600" />
            <SocialLink href="https://x.com/frisspits" icon={<Twitter className="h-6 w-6" />} label="Twitter" bg="bg-blue-500" hoverBg="hover:bg-blue-600" />
            <SocialLink href="https://www.instagram.com/frisspits_schoonmaakdiensten" icon={<Instagram className="h-6 w-6" />} label="Instagram" bg="bg-pink-500" hoverBg="hover:bg-pink-600" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function SocialLink({ href, icon, label, bg, hoverBg }: { href: string; icon: React.ReactNode; label: string; bg: string; hoverBg: string }) {
  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`p-4 rounded-full shadow-md text-white transition duration-300 flex items-center justify-center w-12 h-12 ${bg} ${hoverBg}`}
      aria-label={label}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.a>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  )
}
