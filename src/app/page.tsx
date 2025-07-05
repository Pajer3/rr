'use client'

import ContactForm from '@/components/ContactForm'
import SocialMedia from '@/components/SocialMedia'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, HelpCircle, Sparkles, X } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
// import CTASection from '@/components/CTASection'
// import ServicesSection from '@/components/ServicesSection'
import CallButton from '@/components/CallButton'
import HeroSection from '@/components/HeroSection'

interface ImageData {
  src: string;
  alt: string;
  caption: string;
}

interface ExampleWorkProps {
  title: string;
  images: ImageData[];
}

interface FormData {
  title: string;
  description: string;
  location: string;
  date: string;
  serviceType: string;
  phoneNumber: string;
  email: string;
}

const exampleImages = [
  {
    src: "https://images.unsplash.com/photo-1593136573819-c3b57b8caf29?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Schoonmaken van Keuken",
    caption: "Stralende woonkamers",
  },
  {
    src: "https://images.unsplash.com/photo-1517414628894-83d47b22f233?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Schoonmaken en Glanzende badkamer",
    caption: "Glanzende badkamers",
  },
  {
    src: "https://images.unsplash.com/photo-1576961453646-b4c376c7021b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Schoonmaken voor Bedrijven",
    caption: "Georganiseerde keukens",
  },
  {
    src: "https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Schoonmaken voor kantoor",
    caption: "Professionele kantoorruimtes",
  },
]

const faqs = [
  // {
  //   question: "Hoe vaak moet ik mijn huis laten schoonmaken?",
  //   answer: "De frequentie hangt af van uw levensstijl en voorkeuren. Wekelijks of tweewekelijks is gebruikelijk voor de meeste huishoudens, maar we kunnen een schema op maat maken dat bij uw behoeften past."
  // },
  {
    question: "Gebruiken jullie milieuvriendelijke schoonmaakmiddelen?",
    answer: "Ja, we gebruiken eco-vriendelijke en niet-toxische schoonmaakmiddelen die veilig zijn voor uw gezin en huisdieren, zonder in te boeten aan effectiviteit."
  },
  {
    question: "Kan ik een eenmalige schoonmaak boeken?",
    answer: "Zeker! We bieden zowel eenmalige als regelmatige schoonmaakdiensten aan. Of u nu een grote schoonmaak nodig heeft of regelmatig onderhoud, we staan voor u klaar."
  },
  {
    question: "Zijn jullie schoonmakers verzekerd?",
    answer: "Absoluut. Al onze medewerkers zijn volledig verzekerd en gescreend voor uw gemoedsrust."
  }
]

const ExampleWork: React.FC<ExampleWorkProps> = ({ title, images }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold mb-8 text-center relative inline-block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
          <motion.span
            className="absolute -top-4 -right-4"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-black" />
          </motion.span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative h-64 rounded-lg overflow-hidden cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300"
              />
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.span
                      className="text-white text-lg font-semibold text-center"
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {image.caption}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Component() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: '',
    date: '',
    serviceType: '',
    phoneNumber: '',
    email: '',
  })
  const [showPopup, setShowPopup] = useState(false)


  useEffect(() => {
    const checkAndSetPopup = () => {
      const lastPopupTime = localStorage.getItem('lastPopupTime')
      const currentTime = new Date().getTime()

      if (!lastPopupTime || currentTime - parseInt(lastPopupTime) > 3600000) { // 3600000 ms = 1 hour
        setShowPopup(true)
        localStorage.setItem('lastPopupTime', currentTime.toString())
      }
    }

    const timer = setTimeout(checkAndSetPopup, 20000) // Still wait 20 seconds before first check

    return () => clearTimeout(timer)
  }, [])

  const handlePopupOffer = () => {
    setShowPopup(false)
    setFormData(prevData => ({ ...prevData, title: '#NieuwKlant' }))
    const contactForm = document.getElementById('contact')
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-black from-50% via-[#ADE6E6] via-100% to-[#ADE6E6] to-100% text-white overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">Klaar voor een Stralend Schone Ruimte?</h2>
                <p className="hidden md:block text-base md:text-xl mb-8 max-w-md mx-auto lg:mx-0">
                  {/* Laat Frisspits u helpen met het creëren van een schone, gezonde en aangename omgeving. Vraag vandaag nog een gratis offerte aan! */}
                </p>
                <motion.button
                  className="inline-flex items-center justify-center rounded-full text-base md:text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-black text-white h-12 md:h-14 px-6 md:px-8 py-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const contactForm = document.getElementById('contact')
                    if (contactForm) {
                      contactForm.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                >
                  Vraag een Gratis Offerte Aan
                </motion.button>
              </div>
              <div className="relative h-[300px] md:h-[400px] lg:h-[600px] w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-300 blur-3xl opacity-30"></div>
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-300 opacity-20 z-10"></div>
                  <Image
                    src="/images/stofzuiger.jpg"
                    alt="Vrolijke schoonmakers"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                    className="shadow-md contrast-150"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <HeroSection />
        {/* <ServicesSection /> */}
        <ExampleWork
          title="Ons Werk in Beeld"
          images={exampleImages}
        />
        {/* <CTASection /> */}
<section id="why-choose-us" className="w-full py-12 md:py-24 lg:py-32 bg-background flex items-center justify-center min-h-screen">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Waarom Kiezen voor Frisspits?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center mt-20">
          {[
            {
              title: "Professioneel & Betrouwbaar",
              content: "Ons team bestaat uit ervaren en gescreende professionals die uw vertrouwen waardig zijn."
            },
            {
              title: "Milieuvriendelijk",
              content: "We gebruiken eco-vriendelijke producten die veilig zijn voor uw gezin en het milieu."
            },
            {
              title: "Flexibele Diensten",
              content: "Van eenmalige schoonmaak tot regelmatig onderhoud, we passen ons aan uw behoeften aan."
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-4 md:p-6 bg-gray-50 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CheckCircle className="h-10 w-10 md:h-12 md:w-12 mb-4 text-green-500" />
              <h3 className="text-lg md:text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Veelgestelde Vragen</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-4 md:p-6 rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-lg md:text-xl font-semibold mb-2 flex items-start">
                    <HelpCircle className="h-5 w-5 md:h-6 md:w-6 mr-2 text-blue-500 flex-shrink-0 mt-1" />
                    {faq.question}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-black text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                  Klaar om te beginnen?
                </h2>
                <p className="text-base md:text-xl mb-4">
                  Laat ons u helpen met het creëren van een schonere, gezondere leefomgeving.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-black text-background h-10 py-2 px-4"
                  onClick={() => {
                    const contactForm = document.getElementById('contact')
                    if (contactForm) {
                      contactForm.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Gratis Offerte Aanvragen
                </motion.button>
                <motion.a
                  href="/diensten"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-white text-white h-10 py-2 px-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Onze Diensten Bekijken
                </motion.a>
              </div>
            </div>
          </div>
        </section>

        <section id="social-media" className="w-full py-12 bg-[linear-gradient(to_bottom,#b2e4e1,#97cdd0)]">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 text-white">
              Volg Ons op Social Media
            </h2>
            <p className="text-base md:text-xl text-center mb-8 text-white">
              Blijf op de hoogte van onze laatste nieuwtjes, tips en aanbiedingen.
            </p>
            <SocialMedia />
          </div>
        </section>

        <ContactForm formData={formData} setFormData={setFormData} />

        <CallButton />

        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-lg max-w-md w-full shadow-2xl relative overflow-hidden"
              >
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-2 right-2 text-black transition-colors z-10"
                  aria-label="Sluit popup"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
                <div className="bg-background p-4 md:p-6 text-black">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center">
                    <Sparkles className="mr-2" /> Speciale Aanbieding!
                  </h3>
                </div>
                <div className="p-4 md:p-6">
                  <p className="text-sm md:text-base text-gray-600 mb-4">Boek nu en ontvang <span className="font-bold text-red-600">20% korting</span> op uw eerste periodieke schoonmaak beurt!</p>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <Image
                        src="/images/bubble.png"
                        alt="Cleaning icon"
                        width={40}
                        height={40}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-semibold text-sm md:text-base">Professionele service</p>
                        <p className="text-xs md:text-sm text-gray-500">Door ervaren schoonmakers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl md:text-2xl font-bold text-red-500">20% OFF</p>
                      <p className="text-xs md:text-sm text-gray-500">Geldig voor nieuwe klanten</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-black text-white rounded-md py-2 md:py-3 px-4 text-sm md:text-base font-medium transition-colors duration-300"
                    onClick={handlePopupOffer}
                  >
                    Profiteer Nu van Deze Aanbieding
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx>{`
        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          border: 0;
          position: relative;
          overflow: hidden;
          border-radius: 10rem;
          transition: all 0.02s;
          font-weight: bold;
          cursor: pointer;
          color: rgb(37, 37, 37);
          z-index: 0;
          box-shadow: 0 0px 7px -5px rgba(0, 0, 0, 0.5);
          font-size: 14px;
        }

        @media (min-width: 768px) {
          .button {
            padding: 15px 30px;
            font-size: 16px;
          }
        }

        .button:hover {
          background: rgb(193, 228, 248);
          color: rgb(33, 0, 85);
        }

        .button:active {
          transform: scale(0.97);
        }

        .hoverEffect {
          position: absolute;
          bottom: 0;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: -1;
        }

        .hoverEffect div {
          background: rgb(222, 0, 75);
          background: linear-gradient(
            90deg,
            rgba(222, 0, 75, 1) 0%,
            rgba(191, 70, 255, 1) 49%,
            rgba(0, 212, 255, 1) 100%
          );
          border-radius: 40rem;
          width: 8rem;
          height: 8rem;
          transition: 0.4s;
          filter: blur(20px);
          animation: effect infinite 3s linear;
          opacity: 0.5;
        }

        @media (min-width: 768px) {
          .hoverEffect div {
            width: 10rem;
            height: 10rem;
          }
        }

        .button:hover .hoverEffect div {
          width: 15rem;
          height: 15rem;
        }

        @media (min-width: 768px) {
          .button:hover .hoverEffect div {
            width: 20rem;
            height: 20rem;
          }
        }

        @keyframes effect {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
