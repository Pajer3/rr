import { useState } from 'react'

export default function ContactForm() {
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    serviceType: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formState)
    // Here you would typically send the form data to your backend
  }

  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Contact Frisspits</h2>
        <div className="mt-4 flex flex-col bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
          <h2 className="text-black font-bold text-2xl mb-6">Frisspits Schoonmaak Aanvraagformulier</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Titel</label>
              <input 
                id="title"
                type="text"
                placeholder="Voer een titel in voor uw schoonmaakverzoek" 
                className="w-full bg-gray-50 rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                value={formState.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">Beschrijving</label>
              <textarea 
                id="description"
                placeholder="Beschrijf uw schoonmaakbehoeften in detail" 
                className="w-full bg-gray-50 rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                rows={4}
                value={formState.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">Locatie</label>
                <input 
                  id="location"
                  type="text"
                  placeholder="Waar moet er schoongemaakt worden?" 
                  className="w-full bg-gray-50 rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  value={formState.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">Datum</label>
                <input 
                  id="date"
                  type="date"
                  className="w-full bg-gray-50 rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  value={formState.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="service-type">Type Dienst</label>
              <input 
                id="serviceType"
                type="text"
                placeholder="Bijv. dieptereiniging, onderhoud, etc." 
                className="w-full bg-gray-50 rounded-md border-gray-300 text-black px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                value={formState.serviceType}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                type="submit" 
                className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Verstuur
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
