import { useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function ServiceDetails() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const sections = [
    {
      title: 'Onze Dakgoten Reinigingsdiensten',
      id: 'services',
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Verwijderen van bladeren, takjes en ander vuil uit dakgoten</li>
          <li>Reinigen van regenpijpen en afvoeren</li>
          <li>Controle op lekkages en beschadigingen</li>
          <li>Kleine reparaties aan dakgoten en bevestigingen</li>
          <li>Plaatsen van bladvangers of roosters</li>
          <li>Behandeling tegen mosgroei en algen</li>
          <li>Inspectie van dakbedekking rondom de goten</li>
          <li>Advies over preventief onderhoud</li>
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
      title: 'Ons Dakgoten Reinigingsproces',
      id: 'process',
      content: (
        <ol className="list-decimal pl-5 space-y-2">
          <li>Visuele inspectie van dakgoten en afvoersysteem</li>
          <li>Veilige opstelling van ladders of hoogwerkers</li>
          <li>Handmatig verwijderen van grof vuil uit de goten</li>
          <li>Spoelen van dakgoten met water onder lage druk</li>
          <li>Controle en reiniging van regenpijpen en afvoeren</li>
          <li>Kleine reparaties en aanpassingen indien nodig</li>
          <li>Finale controle op doorstroming en lekkages</li>
          <li>Opruimen en schoonmaken van de werkplek</li>
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
