import { useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function ServiceDetails() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const sections = [
    {
      title: 'Onze Dakgoten Diensten',
      id: 'services',
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Professioneel legen van dakgoten met dakgoot stofzuiger</li>
          <li>Verwijderen van bladeren, slib en vuil</li>
          <li>Controleren van afvoer en doorstroming</li>
          <li>Signaleren van eventuele verstoppingen</li>
          <li>Netjes en schoon achterlaten van de werkplek</li>
        </ul>
      )
    },
    {
      title: 'Voordelen van Professionele Dakgoten Reiniging',
      id: 'benefits',
      content: (
        <ul className="space-y-2">
          {[
            "Voorkomt waterschade aan uw woning",
            "Verlengt de levensduur van uw dakgoten",
            "Voorkomt verstopping en overstroming",
            "Beschermt de fundering van uw huis",
            "Voorkomt broedplaatsen voor ongedierte",
            "Verhoogt de efficiëntie van uw regenwaterafvoer",
            "Veilige uitvoering door professionals",
            "Tijdige detectie van potentiële problemen",
          ].map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-1" size={20} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      )
    },
    {
      title: 'Ons Werkproces',
      id: 'process',
      content: (
        <ol className="list-decimal pl-5 space-y-2">
          <li>Korte controle van de dakgoot en bereikbaarheid</li>
          <li>Opstellen van het dakgoot stofzuigsysteem</li>
          <li>Leegzuigen van de dakgoot vanaf de grond (veilig en zonder rommel)</li>
          <li>Controleren of de afvoer goed doorloopt</li>
          <li>Indien nodig verwijderen van laatste restvuil</li>
          <li>Opruimen en netjes achterlaten van de werkplek</li>
        </ol>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300">
          <button
            className="w-full px-8 py-6 text-left font-semibold flex justify-between items-center focus:outline-none bg-gradient-to-r from-green-50 to-yellow-50 hover:from-green-100 hover:to-yellow-100 transition-colors duration-300"
            onClick={() => toggleSection(section.id)}
          >
            <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-600">
              {section.title}
            </span>
            {openSection === section.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          {openSection === section.id && (
            <div className="px-8 py-6 bg-white">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
