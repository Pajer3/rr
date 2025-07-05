'use client'

import emailjs from '@emailjs/browser'
import { motion } from 'framer-motion'
import React, { useState } from 'react'

const panelOptions = [
  { id: 'residential', label: 'Residentieel' },
  { id: 'commercial', label: 'Commercieel' },
  { id: 'industrial', label: 'Industrieel' },
]

const frequencyOptions = [
  { id: 'onetime', label: 'Eenmalig' },
  { id: 'biannual', label: 'Halfjaarlijks' },
  { id: 'annual', label: 'Jaarlijks' },
]

export default function ZonnepanelenForm() {
  const [panelType, setPanelType] = useState<string>('')
  const [frequency, setFrequency] = useState<string>('')
  const [panelCount, setPanelCount] = useState<string>('')
  const [additionalInfo, setAdditionalInfo] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    if (!panelType || !frequency || !panelCount || !phoneNumber || !email) {
      setStatus('error')
      setErrorMessage('Vul alstublieft alle verplichte velden in, inclusief telefoonnummer en e-mailadres.')
      return
    }

    const templateParams = {
      panelType: panelOptions.find(option => option.id === panelType)?.label,
      frequency: frequencyOptions.find(option => option.id === frequency)?.label,
      panelCount: panelCount,
      phoneNumber: phoneNumber,
      email: email,
      additionalInfo: additionalInfo
    }

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_SECOND_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      )
      setStatus('success')
      setPanelType('')
      setFrequency('')
      setPanelCount('')
      setPhoneNumber('')
      setEmail('')
      setAdditionalInfo('')
    } catch (error) {
      console.error('EmailJS error:', error)
      setStatus('error')
      setErrorMessage('Er is een fout opgetreden bij het versturen van het formulier. Probeer het later opnieuw.')
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-2xl rounded-2xl overflow-hidden"
    >
      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-blue-600">
          Type Zonnepanelen
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {panelOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                panelType === option.id ? 'bg-yellow-100' : 'bg-gray-100'
              }`}
              onClick={() => setPanelType(option.id)}
            >
              <input
                type="radio"
                id={option.id}
                checked={panelType === option.id}
                onChange={() => {}}
                className="form-radio h-5 w-5 text-yellow-600"
              />
              <label htmlFor={option.id} className="text-gray-700 select-none">
                {option.label}
              </label>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-blue-600">
          Reinigingsfrequentie
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {frequencyOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                frequency === option.id ? 'bg-blue-100' : 'bg-gray-100'
              }`}
              onClick={() => setFrequency(option.id)}
            >
              <input
                type="radio"
                id={option.id}
                checked={frequency === option.id}
                onChange={() => {}}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <label htmlFor={option.id} className="text-gray-700 select-none">
                {option.label}
              </label>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-blue-600">
          Aantal Zonnepanelen
        </h2>
        <input
          type="number"
          value={panelCount}
          onChange={(e) => setPanelCount(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Voer het aantal zonnepanelen in"
          min="1"
          required
        />
      </div>

      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-blue-600">
          Aanvullende informatie
        </h2>
        <textarea
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          rows={4}
          placeholder="Bijv. specifieke aandachtspunten of toegankelijkheidsinformatie"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        ></textarea>
      </div>

      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-blue-600">
          Telefoonnummer
        </h2>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Voer uw telefoonnummer in"
          required
        />
      </div>
      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-blue-600">
          E-mailadres
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Voer uw e-mailadres in"
          required
        />
      </div>

      <div className="p-8 bg-gradient-to-r from-yellow-50 to-blue-50">
        {status === 'error' && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}
        {status === 'success' && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            Uw aanvraag is succesvol verzonden. We nemen zo snel mogelijk contact met u op.
          </div>
        )}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-yellow-600 to-blue-600 text-white rounded-full px-4 py-3 font-semibold transition duration-300 shadow-lg hover:shadow-xl"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Bezig met verzenden...' : 'Vraag een offerte aan'}
        </motion.button>
      </div>
    </motion.form>
  )
}
