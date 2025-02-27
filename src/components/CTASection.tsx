// 'use client'

// import React from 'react'
// import { motion } from 'framer-motion'
// import { Sparkles } from 'lucide-react'
// import { Bar } from 'react-chartjs-2'
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// const CTASection: React.FC = () => {
//   const backgroundColor = '#ADD8E6'

//   const chartData = {
//     labels: ['Tijdsbesparing', 'Kwaliteit', 'Flexibiliteit', 'Gezondheid', 'Gemoedsrust'],
//     datasets: [
//       {
//         label: 'Voor inhuren',
//         data: [30, 40, 25, 35, 20],
//         backgroundColor: 'black',
//         borderColor: 'rgba(0, 0, 0, 1)',
//         borderWidth: 1,
//       },
//       {
//         label: 'Na inhuren',
//         data: [80, 90, 70, 80, 90],
//         backgroundColor: backgroundColor,
//         borderColor: 'rgba(0, 0, 0, 0.3)',
//         borderWidth: 1,
//       },
//     ],
//   }

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: { 
//         stacked: true,
//         title: {
//           display: true,
//           text: 'Aspecten',
//           font: { size: 14 },
//         },
//       },
//       y: { 
//         stacked: true,
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Waarde',
//           font: { size: 14 },
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         position: 'top' as const,
//       },
//       title: {
//         display: true,
//         text: 'Succes Voor en Na het Inhuren van Frisspits',
//         font: { size: 18, weight: 'bold' as const },
//         color: 'rgba(0, 0, 0, 0.8)',
//       },
//     },
//   }

//   return (
//     <section className="w-full mt-40" style={{ backgroundColor }}>
//       <div className="container mx-auto px-4 md:px-6">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="bg-white rounded-3xl shadow-2xl overflow-hidden"
//         >
//           <div className="p-8 md:p-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
//               Ervaar het Frisspits Verschil
//             </h2>
//             <div className="flex flex-col lg:flex-row gap-12 items-center">
//               <div className="w-full lg:w-1/2">
//                 <div className="bg-gray-100 rounded-xl p-6 h-80">
//                   <Bar data={chartData} options={chartOptions} />
//                 </div>
//               </div>
//               <div className="w-full lg:w-1/2 space-y-6">
//                 <p className="text-lg text-gray-700">
//                   Zie de dramatische verbetering in verschillende aspecten van uw leven wanneer u kiest voor Frisspits voor uw schoonmaakbehoeften. Onze professionele diensten verhogen aanzienlijk uw succes in:
//                 </p>
//                 <ul className="space-y-2 text-gray-700">
//                   <li className="flex items-center">
//                     <Sparkles className="text-black mr-2" size={20} />
//                     <span>Tijdsbesparing</span>
//                   </li>
//                   <li className="flex items-center">
//                     <Sparkles className="text-black mr-2" size={20} />
//                     <span>Schoonmaakkwaliteit</span>
//                   </li>
//                   <li className="flex items-center">
//                     <Sparkles className="text-black mr-2" size={20} />
//                     <span>Flexibiliteit in planning</span>
//                   </li>
//                   <li className="flex items-center">
//                     <Sparkles className="text-black mr-2" size={20} />
//                     <span>Gezondheid en hygiëne</span>
//                   </li>
//                   <li className="flex items-center">
//                     <Sparkles className="text-black mr-2" size={20} />
//                     <span>Algehele gemoedsrust</span>
//                   </li>
//                 </ul>
//                 <motion.a
//                   href="#contact"
//                   className="inline-block bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Verhoog Nu Uw Succes!
//                 </motion.a>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   )
// }

// export default CTASection
