"use client"
import GenericServiceForm from '@/components/GenericServiceForm'
import ServiceDetails from './ServiceDetails'
import Link from 'next/link'
import { Suspense } from 'react'
import { useVisitorTracking } from '@/hooks/useVisitorTracking'

const frequencyOptions = [
  { id: 'biannual', label: 'Halfjaarlijks' },
  { id: 'annual', label: 'Jaarlijks' },
  { id: 'onetime', label: 'Eenmalig' },
]

export default function DakgotenReinigenPage() {
  useVisitorTracking('Dakgoten Reinigen')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-yellow-100">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/diensten" passHref>
            <button className="bg-white text-green-600 rounded-full px-6 py-2 font-semibold hover:bg-green-50 transition duration-300 shadow-md hover:shadow-lg">
              ← Terug naar Diensten
            </button>
          </Link>
        </div>

        <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-600">
          Dakgoten Reinigen
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<div className="text-center">Formulier laden...</div>}>
            <GenericServiceForm 
              serviceName="Dakgoten Reinigen"
              frequencyOptions={frequencyOptions}
              quantityLabel="Lengte dakgoot in meters"
            />
          </Suspense>
        </div>

        <div className="max-w-4xl mx-auto mt-16">
          <Suspense fallback={<div className="text-center">Details laden...</div>}>
            <ServiceDetails />
          </Suspense>
        </div>

        <div className="max-w-4xl mx-auto mt-16 text-center bg-gradient-to-r from-green-600 to-yellow-600 text-white p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-3xl font-bold mb-4">Voorkom Waterschade</h2>
          <p className="text-xl mb-6">
            Houd uw dakgoten vrij en bescherm uw huis tegen waterschade. Neem vandaag nog contact met ons op voor een vrijblijvende offerte.
          </p>
          <Link href="/#contact" passHref>
            <button className="bg-white text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-600 rounded-full px-8 py-3 font-semibold hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl">
              Contact Opnemen
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
