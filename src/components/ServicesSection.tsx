import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Repeat, Trash2, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Sparkles,
    title: "Dieptereiniging",
    description: "Grondige reiniging van elk hoekje en gaatje.",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    icon: Repeat,
    title: "Regelmatig Onderhoud",
    description: "Houd uw ruimte netjes met onze routinematige schoonmaakdiensten.",
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    icon: Trash2,
    title: "Afvalbeheer",
    description: "Efficiënte afvoer- en recyclingdiensten.",
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Frisspits Diensten
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={`p-4 rounded-full ${service.bgColor} mb-6`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <service.icon className={`h-12 w-12 ${service.color}`} />
              </motion.div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
              <motion.button
                className={`mt-6 px-4 py-2 rounded-full text-white ${service.color.replace('text', 'bg')} hover:opacity-90`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Meer Info
              </motion.button>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/diensten" passHref legacyBehavior>
            <motion.a
              className="inline-flex items-center justify-center rounded-full text-lg font-medium bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Bekijk Alle Diensten
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.a>
          </Link>
        </div>
      </div>
    </section>
  )
}
