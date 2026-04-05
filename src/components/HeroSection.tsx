/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Spline from '@splinetool/react-spline';

const cleaningServices = [
  { src: '/icons/huis.png', alt: 'Huishoudelijk Schoonmaak', slug: 'huishoudelijk-schoonmaak' },
  { src: '/icons/raam.png', alt: 'Glazenwasser', slug: 'glazenwasser' },
  { src: '/icons/dakgoten.png', alt: 'Dakgoten Reinigen', slug: 'dakgoten-reinigen' },
  { src: '/icons/zonnepanelen.png', alt: 'Zonnepanelen Reinigen', slug: 'zonnepanelen-reinigen' },
  { src: '/icons/kantoor.png', alt: 'Kantoor Schoonmaak', slug: 'kantoor-schoonmaak' },
  { src: '/icons/vve.png', alt: 'VVE schoonmaken', slug: 'vve-schoonmaken' },
  { src: '/icons/Gevelhoutwerkreinigen.png', alt: 'Professionele Gevel Reiniging', slug: 'gevel-reiniging', large: true },
  { src: '/icons/Professionele stoomreiniging.png', alt: 'Professionele Stoomreiniging', slug: 'stoomreiniging', large: true },
  { src: '/icons/Professionele terras reiniging..png', alt: 'Professionele Terras Reiniging', slug: 'terras-reiniging', large: true },
]

export default function HeroSection() {

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 mt-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Spline
          scene="/images/scene-one.splinecode"
        />
      </div>
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
            className="mx-auto max-w-[700px] text-black text-sm sm:text-base md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Voor bedrijven, particulieren en opleveringen. Snel geregeld, duidelijke prijs en altijd strak schoon.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/#contact">
              {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
              }
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-black text-white hover:bg-primary/90 h-12 px-6"
              >
                Nu Boeken
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.a>
            </Link>
            <Link href="/diensten">
              {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
              }
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-6"
              >
                Onze Diensten
              </motion.a>
            </Link>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center">
          <p className="text-sm font-bold text-black/60 uppercase tracking-widest mb-5">
            Kies een dienst voor meer info
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6 lg:gap-8">
            {cleaningServices.map((service, index) => (
              <Link key={index} href={`/diensten/${service.slug}`} className="group flex flex-col items-center cursor-pointer">
                <motion.div
                  className="flex flex-col items-center"
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="bg-black rounded-full p-2 shadow-lg transition-shadow duration-300 group-hover:shadow-[0_0_25px_rgba(173,230,230,0.6)] group-hover:ring-2 ring-[#ADE6E6]/50 ring-offset-2">
                    <Image
                      src={service.src}
                      alt={service.alt}
                      width={service.large ? 80 : 64}
                      height={service.large ? 80 : 64}
                      className={service.large ? 'w-16 h-16 object-contain p-1' : 'w-16 h-16 object-contain p-3'}
                    />
                  </div>
                  <span className="mt-3 text-xs md:text-sm font-bold text-black/70 text-center max-w-[110px] leading-snug group-hover:text-black transition-colors">
                    {service.alt}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20 pointer-events-none" />
    </section>
  );
}
