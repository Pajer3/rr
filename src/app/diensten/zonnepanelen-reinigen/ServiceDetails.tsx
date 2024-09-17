import { useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function ServiceDetails() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const sections = [
    {
      title: 'Onze Zonnepanelen Reinigingsdiensten',
      id: 'services',
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Grondige reiniging van zonnepanelen</li>
          <li>Verwijdering van vuil, stof, en vogeluitwerpselen</li>
          <li>Inspectie op schade of defecten</li>
          <li>Gebruik van gespecialiseerde, niet-schurende reinigingsmiddelen</li>
          <li>Optionele coating voor langdurige bescherming</li>
          <li>Reiniging van omliggende dakgoten</li>
        </ul>
      )
    },
    {
      title: 'Voordelen van Professionele Zonnepanelen Reiniging',
      id: 'benefits',
      content: (
        <ul className="space-y-2">
          {[
            "Verhoogde energieopbrengst tot wel 25%",
            "Verlengde levensduur van uw zonnepanelen",
            "Vroegtijdige detectie van mogelijke problemen",
            "Behoud van fabrieksgarantie",
            "Verbeterde esthetiek van uw dak",
            "Milieuvriendelijke reinigingsmethoden",
          ].map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="text-yellow-500 mr-2 flex-shrink-0 mt-1" size={20} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      )
    },
    {
      title: 'Ons Reinigingsproces',
      id: 'process',
      content: (
        <ol className="list-decimal pl-5 space-y-2">
          <li>Initiële inspectie en beoordeling</li>
          <li>Voorbereiding van het werkgebied</li>
          <li>Zachte reiniging met gedemineraliseerd water</li>
          <li>Grondige spoeling</li>
          <li>Optionele toepassing van beschermende coating</li>
          <li>Finale inspectie en efficiëntietest</li>
        </ol>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300">
          <button
            className="w-full px-8 py-6 text-left font-semibold flex justify-between items-center focus:outline-none bg-gradient-to-r from-yellow-50 to-blue-50 hover:from-yellow-100 hover:to-blue-100 transition-colors duration-300"
            onClick={() => toggleSection(section.id)}
          >
            <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-blue-600">
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
