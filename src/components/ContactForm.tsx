'use client'

import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import emailjs, { init } from '@emailjs/browser'
import { Calendar, MapPin, FileText, Briefcase } from 'lucide-react'

// Initialize EmailJS with your User ID
init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID!);

interface FormData {
  title: string;
  description: string;
  location: string;
  date: string;
  serviceType: string;
}

interface ContactFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function ContactForm({ formData, setFormData }: ContactFormProps) {
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = React.useState('')

  useEffect(() => {
    if (window.location.hash === '#NieuwKlant' && formData.title !== '#NieuwKlant') {
      setFormData(prevData => ({ ...prevData, title: '#NieuwKlant' }))
    }
  }, [formData.title, setFormData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const result = await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form.current!,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      )
      console.log(result.text)
      setStatus('success')
      setMessage('Uw aanvraag is succesvol verzonden. We nemen zo snel mogelijk contact met u op.')
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        serviceType: '',
      })
    } catch (error) {
      console.error('EmailJS error:', error)
      setStatus('error')
      setMessage('Er is een fout opgetreden bij het versturen van het formulier. Probeer het later opnieuw.')
    }
  }

  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-[linear-gradient(to_bottom,#97cdd0,#ADD8E6)]">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-black">Contact Frisspits</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto"
        >
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Schoonmaak Aanvraagformulier</h3>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded"
              role="alert"
            >
              <p className="font-bold">Succes!</p>
              <p>{message}</p>
            </motion.div>
          ) : (
            <form ref={form} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Titel</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Titel van uw aanvraag"
                    className={`w-full bg-gray-50 rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out ${
                      formData.title === '#NieuwKlant' ? 'text-green-600 font-semibold' : 'text-gray-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">Beschrijving</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Beschrijf uw schoonmaakbehoeften"
                  className="w-full bg-gray-50 rounded-md border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  rows={4}
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">Locatie</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Waar moet er schoongemaakt worden?"
                    className="w-full bg-gray-50 rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">Datum</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-gray-50 rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="serviceType">Type Dienst</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="serviceType"
                    name="serviceType"
                    type="text"
                    value={formData.serviceType}
                    onChange={handleChange}
                    placeholder="Bijv. dieptereiniging, onderhoud"
                    className="w-full bg-gray-50 rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    required
                  />
                </div>
              </div>

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
                  role="alert"
                >
                  <p className="font-bold">Fout!</p>
                  <p>{message}</p>
                </motion.div>
              )}

              <div className="mt-6">
                <motion.button
                  type="submit"
                  className="w-full bg-black text-white rounded-md px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                  disabled={status === 'submitting'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {status === 'submitting' ? 'Versturen...' : 'Verstuur Aanvraag'}
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
