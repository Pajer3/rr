'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const CTASection: React.FC = () => {
  const chartData = {
    labels: ['Keuken', 'Badkamer', 'Woonkamer', 'Slaapkamer', 'Kantoor'],
    datasets: [
      {
        label: 'Minuten per week',
        data: [120, 90, 60, 45, 30],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Schoonmaaktijd per ruimte',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-100 to-green-100 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="px-6 py-8 sm:p-10 relative">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-full lg:w-1/2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 leading-tight mb-4">
                  Laat Frisspits uw tijd besparen!
                </h2>
                <p className="text-base lg:text-lg text-gray-600 mb-6">
                  Onze professionele schoonmakers nemen het zware werk over, zodat u kunt genieten van een schoon huis zonder de moeite.
                </p>
                <Link href="/#contact" passHref legacyBehavior>
                  <motion.a
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 px-6 rounded-lg text-base lg:text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Bespaar uw tijd, boek nu!
                  </motion.a>
                </Link>
              </div>
              <div className="w-full lg:w-1/2 bg-white border border-slate-200 rounded-xl p-4">
                <h3 className="text-center text-slate-600 text-lg font-bold mb-4">Schoonmaaktijd per ruimte</h3>
                <div className="h-64 sm:h-80">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-blue-50 sm:px-10 relative">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-600 mb-2 sm:mb-0 flex items-center">
                <Sparkles className="text-yellow-400 mr-2" size={20} />
                Laat ons uw schoonmaaktijd overnemen!
              </p>
              <Link href="/diensten" passHref legacyBehavior>
                <motion.a
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center transition duration-300 ease-in-out"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ontdek onze efficiënte schoonmaakdiensten
                  <ArrowRight className="ml-1" size={16} />
                </motion.a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
