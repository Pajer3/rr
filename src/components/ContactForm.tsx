import React, { useState, useRef, useEffect } from 'react'
import emailjs, { init } from '@emailjs/browser'

// Initialize EmailJS with your User ID
init(process.env.NEXT_PUBLIC_EMAILJS_USER_ID!);

export default function ContactForm() {
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    // Log environment variables to check if they're properly set
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
        setSuccessMessage('Uw aanvraag is succesvol verzonden. We nemen zo snel mogelijk contact met u op.')
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
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Contact Frisspits</h2>
        <div className="mt-4 flex flex-col bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
          <h2 className="text-black font-bold text-2xl mb-6">Frisspits Schoonmaak Aanvraagformulier</h2>

          {status === 'success' ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Succes!</strong>
              <span className="block sm:inline"> {successMessage}</span>
            </div>
          ) : (
            <form ref={form} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Titel</label>
                <input 
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Voer een titel in voor uw schoonmaakverzoek" 
                  className="w-full bg-gray-50 rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">Beschrijving</label>
                <textarea 
                  id="description"
                  name="description"
                  placeholder="Beschrijf uw schoonmaakbehoeften in detail" 
                  className="w-full bg-gray-50 rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  rows={4}
                  required
                ></textarea>
              </div>

              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">Locatie</label>
                  <input 
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Waar moet er schoongemaakt worden?" 
                    className="w-full bg-gray-50 rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    required
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">Datum</label>
                  <input 
                    id="date"
                    name="date"
                    type="date"
                    className="w-full bg-gray-50 rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="serviceType">Type Dienst</label>
                <input 
                  id="serviceType"
                  name="serviceType"
                  type="text"
                  placeholder="Bijv. dieptereiniging, onderhoud, etc." 
                  className="w-full bg-gray-50 rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  required
                />
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
                  {status === 'submitting' ? 'Versturen...' : 'Verstuur'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
