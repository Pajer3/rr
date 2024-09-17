'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'

interface Option {
  id: string;
  label: string;
}

interface GenericServiceFormProps {
  serviceName: string;
  options: Option[];
  frequencyOptions: Option[];
  quantityLabel: string;
}

export default function GenericServiceForm({ serviceName, options, frequencyOptions, quantityLabel }: GenericServiceFormProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [frequency, setFrequency] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [additionalInfo, setAdditionalInfo] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleOptionToggle = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    if (selectedOptions.length === 0 || !frequency || !quantity) {
      setStatus('error')
      setErrorMessage('Vul alstublieft alle verplichte velden in.')
      return
    }

    const templateParams = {
      serviceName: serviceName,
      selectedOptions: selectedOptions.map(id => options.find(option => option.id === id)?.label).join(', '),
      frequency: frequencyOptions.find(option => option.id === frequency)?.label,
      quantity: quantity,
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
      setSelectedOptions([])
      setFrequency('')
      setQuantity('')
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
        <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
          Opties
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {options.map((option) => (
            <motion.div 
              key={option.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                selectedOptions.includes(option.id) ? 'bg-blue-100' : 'bg-gray-100'
              }`}
              onClick={() => handleOptionToggle(option.id)}
            >
              <input
                type="checkbox"
                id={option.id}
                checked={selectedOptions.includes(option.id)}
                onChange={() => {}}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <label htmlFor={option.id} className="text-gray-700 select-none">
                {option.label}
              </label>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
          Frequentie
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {frequencyOptions.map((option) => (
            <motion.div 
              key={option.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                frequency === option.id ? 'bg-green-100' : 'bg-gray-100'
              }`}
              onClick={() => setFrequency(option.id)}
            >
              <input
                type="radio"
                id={option.id}
                checked={frequency === option.id}
                onChange={() => {}}
                className="form-radio h-5 w-5 text-green-600"
              />
              <label htmlFor={option.id} className="text-gray-700 select-none">
                {option.label}
              </label>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
          {quantityLabel}
        </h2>
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Voer ${quantityLabel.toLowerCase()} in`}
          required
        />
      </div>

      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
          Aanvullende informatie
        </h2>
        <textarea
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Bijv. specifieke aandachtsgebieden, allergieën, of speciale verzoeken"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        ></textarea>
      </div>

      <div className="p-8 bg-gradient-to-r from-blue-50 to-green-50">
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
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full px-4 py-3 font-semibold transition duration-300 shadow-lg hover:shadow-xl"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Bezig met verzenden...' : 'Vraag een offerte aan'}
        </motion.button>
      </div>
    </motion.form>
  )
}
