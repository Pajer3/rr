'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import React, { useCallback, useRef, useState } from 'react'

const pairs = [
  {
    before: '/images/before/first_upscayl_2x_upscayl-standard-4x.png',
    after:  '/images/after/firstpair_upscayl_2x_upscayl-standard-4x.png',
    label:  'Dakgoten',
    num:    '01',
  },
  {
    before: '/images/before/second_upscayl_2x_upscayl-standard-4x.png',
    after:  '/images/after/secondpair_upscayl_2x_upscayl-standard-4x.png',
    label:  'Terras',
    num:    '02',
  },
  {
    before: '/images/before/third_upscayl_2x_upscayl-standard-4x.png',
    after:  '/images/after/thirdpair_upscayl_2x_upscayl-standard-4x.png',
    label:  'Toilet',
    num:    '03',
  },
  {
    before: '/images/before/forth_upscayl_2x_upscayl-standard-4x.png',
    after:  '/images/after/forthpair_upscayl_2x_upscayl-standard-4x.png',
    label:  'Glazen Overkapping',
    num:    '04',
  },
]

/* ─── Individual drag-slider card ───────────────────────────── */
function SliderCard({
  before, after, label, num, index,
}: typeof pairs[0] & { index: number }) {
  const [pos, setPos]             = useState(50)
  const [dragging, setDragging]   = useState(false)
  const [touched, setTouched]     = useState(false)
  const wrapRef                   = useRef<HTMLDivElement>(null)

  const update = useCallback((clientX: number) => {
    const el = wrapRef.current
    if (!el) return
    const { left, width } = el.getBoundingClientRect()
    setPos(Math.min(100, Math.max(0, ((clientX - left) / width) * 100)))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl overflow-hidden"
    >
      {/* ── Drag zone ── */}
      <div
        ref={wrapRef}
        className="relative h-[420px] sm:h-[520px] md:h-[600px] w-full cursor-col-resize select-none"
        onMouseDown={e  => { setDragging(true); setTouched(true); update(e.clientX) }}
        onMouseMove={e  => { if (dragging) update(e.clientX) }}
        onMouseUp={()   => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={e => { setDragging(true); setTouched(true); update(e.touches[0].clientX) }}
        onTouchMove={e  => { if (dragging) update(e.touches[0].clientX) }}
        onTouchEnd={() => setDragging(false)}
      >
        {/* AFTER — base */}
        <div className="absolute inset-0">
          <Image
            src={after} alt={`${label} na`}
            fill className="object-cover" draggable={false}
            sizes="(max-width: 768px) 100vw, 50vw" priority={index < 2}
          />
        </div>

        {/* BEFORE — clipped */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image
            src={before} alt={`${label} voor`}
            fill className="object-cover" draggable={false}
            sizes="(max-width: 768px) 100vw, 50vw" priority={index < 2}
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute inset-y-0 w-px bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] pointer-events-none z-20"
          style={{ left: `${pos}%` }}
        />

        {/* Knob */}
        <div
          className="absolute top-1/2 z-30 pointer-events-none -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${pos}%` }}
        >
          <motion.div
            animate={{ scale: dragging ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="w-11 h-11 rounded-full bg-white border-[2.5px] border-[#ADE6E6] shadow-xl flex items-center justify-center"
          >
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
              <path d="M6 4.5L2 9L6 13.5M12 4.5L16 9L12 13.5"
                stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>

        {/* Voor / Na badges */}
        <span className="absolute bottom-3 left-3 z-20 text-[10px] font-bold uppercase tracking-widest bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
          Voor
        </span>
        <span className="absolute bottom-3 right-3 z-20 text-[10px] font-bold uppercase tracking-widest bg-[#ADE6E6] text-black px-2.5 py-1 rounded-full pointer-events-none">
          Na
        </span>

        {/* Hint — top right, fades out after first interaction */}
        {!touched && (
          <div className="absolute top-3 right-3 z-20 pointer-events-none">
            <div className="bg-black/50 backdrop-blur-[3px] rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/10">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-white/80">
                <path d="M3 7h8M3 7l2.5-2.5M3 7l2.5 2.5M11 7l-2.5-2.5M11 7l-2.5 2.5"
                  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <span className="text-white/80 text-[10px] font-medium tracking-wide">Sleep om te vergelijken</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Card footer ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-[#ADE6E6] text-xs font-mono font-semibold">{num}</span>
          <span className="text-white text-sm font-semibold">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ADE6E6] animate-pulse" />
          <span className="text-white/40 text-xs">Frisspits resultaat</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Section ────────────────────────────────────────────────── */
export default function BeforeAfterGallery() {
  return (
    <section className="w-full py-16 md:py-28 bg-[#0a0a0a] relative overflow-hidden">

      {/* Bg glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#ADE6E6]/6 blur-[100px]" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div
          className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <p className="text-[#ADE6E6] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Voor &amp; Na
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Ons Werk in Beeld
            </h2>
            <div className="mt-3 h-[3px] w-12 rounded-full bg-[#ADE6E6]" />
          </div>
          <a
            href="/#contact"
            className="self-start md:self-auto inline-flex items-center gap-2 border border-white/15 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-all duration-200"
          >
            Gratis offerte aanvragen
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.div>

        {/* ── 2×2 grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pairs.map((pair, i) => (
            <SliderCard key={i} {...pair} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
