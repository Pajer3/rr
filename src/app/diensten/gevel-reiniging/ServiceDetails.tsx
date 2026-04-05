import { useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function ServiceDetails() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const sections = [
    {
      title: 'Gevelreiniging Diensten',
      id: 'services',
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Verwijderen van algen, mos en groene aanslag</li>
          <li>Reiniging met softwash of andere professionele technieken</li>
          <li>Verwijderen van graffiti en vervuiling</li>
          <li>Reiniging van metselwerk, beton en beplating</li>
          <li>Impregneren voor langdurige bescherming</li>
        </ul>
      )
    },
    {
      title: 'Voordelen van Gevel / houtwerk reinigen',
      id: 'benefits',
      content: (
        <ul className="space-y-2">
          {[
            <><strong key="1">Frisse uitstraling</strong> &ndash; Uw pand ziet er weer als nieuw uit</>,
            <><strong key="2">Voorkomt schade</strong> &ndash; Beschermt tegen slijtage</>,
            <><strong key="3">Waardeverhoging</strong> &ndash; Verhoogt de waarde van uw woning</>,
            <><strong key="4">Ademend vermogen</strong> &ndash; Behoud van de kwaliteit van de gevel</>,
            <><strong key="5">Veilige werkwijze</strong> &ndash; Veilige en verantwoorde methodes</>,
            <><strong key="6">Snelle verbetering</strong> &ndash; Direct zichtbaar resultaat</>,
            <><strong key="7">Extra bescherming</strong> &ndash; Mogelijkheid tot impregneren</>
          ].map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="text-blue-500 mr-2 flex-shrink-0 mt-1" size={20} />
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
          <li>Inspectie van de gevel en type vervuiling vaststellen</li>
          <li>Bepalen van de juiste reinigingstechniek (druk/temperatuur)</li>
          <li>Veiligheidsmaatregelen en steiger/hoogwerker opbouwen</li>
          <li>Zorgvuldig reinigen van het geveloppervlak</li>
          <li>Evt. nabehandeling of impregneren voor extra bescherming</li>
          <li>Schoon en netjes opleveren van de werkplek</li>
        </ol>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300">
          <button
            className="w-full px-8 py-6 text-left font-semibold flex justify-between items-center focus:outline-none bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors duration-300"
            onClick={() => toggleSection(section.id)}
          >
            <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
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
