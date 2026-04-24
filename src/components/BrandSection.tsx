'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface Brand {
  name: string
  src: string
}

const brands: Brand[] = [
  { name: 'ABC', src: '/images/samenwerkingen/abc.png' },
  { name: 'BTBX', src: '/images/samenwerkingen/btbx.png' },
  { name: 'Buijtenhuis', src: '/images/samenwerkingen/buijtenhuis.png' },
  { name: 'George', src: '/images/samenwerkingen/george.png' },
  { name: 'Go', src: '/images/samenwerkingen/go.png' },
  { name: 'Grando', src: '/images/samenwerkingen/grando.png' },
  { name: 'Greenbox', src: '/images/samenwerkingen/greenbox.png' },
  { name: 'Huveko', src: '/images/samenwerkingen/huveko.png' },
  { name: 'Keukensale', src: '/images/samenwerkingen/keukensale.png' },
  { name: 'Mondhygiënist Engelaer', src: '/images/samenwerkingen/mondhygienist-Engelaer.png' },
  { name: 'Sanisale', src: '/images/samenwerkingen/sanisale.png' },
  { name: 'Uniek Staal', src: '/images/samenwerkingen/uniekstaal.png' },
  { name: 'Xenos', src: '/images/samenwerkingen/xenos.png' },
]

export default function BrandSection() {
  const loop = [...brands, ...brands]

  return (
    <section
      id="samenwerkingen"
      className="relative w-full py-20 md:py-28 bg-background overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ADE6E6]/60 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(173,230,230,0.14),transparent_60%)] pointer-events-none" />

      <div className="container relative px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ADE6E6]/20 text-slate-700 text-xs md:text-sm font-semibold tracking-wider uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2aa39e] animate-pulse" />
            Onze klanten
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Vertrouwd door sterke{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2aa39e] to-slate-900">
              merken
            </span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Van winkels tot kantoren, klanten kiezen Frisspits voor kwaliteit, snelheid en duidelijke afspraken.
          </p>
        </motion.div>

      </div>

      {/* Marquee — breekt uit de container voor full-width scroll */}
      <div className="relative mt-2">
        <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-background via-background/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-background via-background/90 to-transparent z-10 pointer-events-none" />

        <div className="marquee flex gap-6 md:gap-10 py-4">
          {loop.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="group flex-shrink-0 flex items-center justify-center w-44 h-28 md:w-60 md:h-36 rounded-2xl bg-white border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_40px_rgba(42,163,158,0.18)] hover:border-[#ADE6E6] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative w-32 h-16 md:w-44 md:h-24">
                <Image
                  src={brand.src}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 768px) 180px, 240px"
                  className="object-contain transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee {
          width: max-content;
          animation: scroll 50s linear infinite;
        }
        .marquee:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee {
            animation: none;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
