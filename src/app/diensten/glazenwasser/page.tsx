"use client"
import GenericServiceForm from '@/components/GenericServiceForm'
import ServiceDetails from './ServiceDetails'
import Link from 'next/link'
import { Suspense } from 'react'

const glazenOptions = [
  { id: 'ramen', label: 'Ramen' },
  { id: 'deuren', label: 'Glazen deuren' },
  { id: 'dakramen', label: 'Dakramen' },
  { id: 'serres', label: 'Serres' },
  { id: 'spiegels', label: 'Spiegels' },
  { id: 'kozijnen', label: 'Kozijnen' },
]

const frequencyOptions = [
  { id: 'monthly', label: 'Maandelijks' },
  { id: 'quarterly', label: 'Driemaandelijks' },
  { id: 'biannual', label: 'Halfjaarlijks' },
  { id: 'annual', label: 'Jaarlijks' },
]

export default function GlazenwasserPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/diensten" passHref>
            <button className="bg-white text-sky-600 rounded-full px-6 py-2 font-semibold hover:bg-sky-50 transition duration-300 shadow-md hover:shadow-lg">
              ← Terug naar Diensten
            </button>
          </Link>
        </div>

        <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
          Glazenwasser
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<div className="text-center">Formulier laden...</div>}>
            <GenericServiceForm 
              serviceName="Glazenwasser"
              options={glazenOptions}
              frequencyOptions={frequencyOptions}
              quantityLabel="Aantal ramen"
            />
          </Suspense>
        </div>

        <div className="max-w-4xl mx-auto mt-16">
          <Suspense fallback={<div className="text-center">Details laden...</div>}>
            <ServiceDetails />
          </Suspense>
        </div>

        <div className="max-w-4xl mx-auto mt-16 text-center bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-3xl font-bold mb-4">Kristalheldere Ramen</h2>
          <p className="text-xl mb-6">
            Geniet van een helder uitzicht en laat uw ramen stralen. Neem vandaag nog contact met ons op voor een vrijblijvende offerte.
          </p>
          <Link href="/#contact" passHref>
            <button className="bg-white text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 rounded-full px-8 py-3 font-semibold hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl">
              Contact Opnemen
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
