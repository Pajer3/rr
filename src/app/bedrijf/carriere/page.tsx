'use client'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import emailjs, { init } from '@emailjs/browser'

// Initialize EmailJS with your User ID
init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID!);

const benefits = [
  "Flexibele werkuren",
  "Professionele training en ontwikkeling",
  "Competitief salaris",
  "Prettige werkomgeving",
  "Doorgroeimogelijkheden",
  "Werken met de nieuwste schoonmaaktechnologieën",
]

export default function CareerPage() {
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    console.log('Service ID:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID);
    console.log('Template ID:', process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID);
    console.log('User ID:', process.env.NEXT_PUBLIC_EMAILJS_USER_ID);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')
    setSuccessMessage('')

    emailjs.sendForm(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      form.current!,
      process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
    )
      .then((result) => {
        console.log(result.text)
        setStatus('success')
        setSuccessMessage('Uw sollicitatie is succesvol verzonden. We nemen zo snel mogelijk contact met u op.')
        if (form.current) {
          form.current.reset()
        }
      }, (error) => {
        console.error('EmailJS error:', error)
        setStatus('error')
        setErrorMessage('Er is een fout opgetreden bij het versturen van het formulier. Probeer het later opnieuw.')
      })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-300 mb-8">
        <ArrowLeft className="mr-2 h-5 w-5" />
        <span className="font-semibold">Terug naar Home</span>
      </Link>

      <h1 className="text-4xl font-bold text-center mb-12">Carrière bij Frisspits</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-1 rounded-lg">
          <div className="bg-white p-6 rounded-lg h-full flex flex-col justify-between">
            <div>
              <div className="text-5xl mb-4">👨‍💼</div>
              <h3 className="text-xl font-semibold mb-2">Word Deel van Ons Team</h3>
              <p className="text-gray-600">
                Bij Frisspits bieden we uitdagende carrièremogelijkheden in de schoonmaakbranche. Groei met ons mee en help anderen een schonere leefomgeving te creëren.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-green-600 p-1 rounded-lg">
          <div className="bg-white p-6 rounded-lg h-full flex flex-col justify-between">
            <div>
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Huidige Vacatures</h3>
              <p className="text-gray-600">
                We hebben momenteel <span className="font-bold text-green-600">0 open posities</span>. Houd deze pagina in de gaten voor toekomstige mogelijkheden of stuur ons uw open sollicitatie!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-green-200 transform -skew-y-3"></div>
        <div className="relative bg-white p-8 shadow-xl rounded-lg z-10">
          <h3 className="text-2xl font-bold mb-4 text-blue-600">Waarom Werken bij Frisspits?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-8 rounded-lg mb-16">
        <h2 className="text-2xl font-bold text-center mb-6">Sollicitatieformulier</h2>
        {status === 'success' ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Succes!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        ) : (
          <form ref={form} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Naam</label>
              <input 
                id="title"
                name="title"
                type="text"
                placeholder="Vul uw volledige naam in" 
                className="w-full bg-white rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">Leeftijd</label>
              <input 
                id="description"
                name="description"
                type="number"
                placeholder="Vul uw leeftijd in" 
                className="w-full bg-white rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">E-mail</label>
              <input 
                id="location"
                name="location"
                type="email"
                placeholder="Vul uw e-mailadres in" 
                className="w-full bg-white rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">Telefoonnummer</label>
              <input 
                id="date"
                name="date"
                type="tel"
                placeholder="Vul uw telefoonnummer in"
                className="w-full bg-white rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="serviceType">Motivatie</label>
              <textarea 
                id="serviceType"
                name="serviceType"
                placeholder="Beschrijf kort waarom u bij Frisspits wilt werken" 
                className="w-full bg-white rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                rows={4}
                required
              ></textarea>
            </div>

            {status === 'error' && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Fout!</strong>
                <span className="block sm:inline"> {errorMessage}</span>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button 
                type="submit" 
                className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Versturen...' : 'Solliciteer'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Klaar om uw carrière een boost te geven?</h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-6">
          Of u nu een ervaren professional bent of net begint in de schoonmaakbranche, bij Frisspits vindt u uitdagende mogelijkheden om te groeien en uit te blinken.
        </p>
        <Link href="/#contact" passHref>
          <button className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition duration-300">
            Neem Contact Op
          </button>
        </Link>
      </div>
    </div>
  )
}
