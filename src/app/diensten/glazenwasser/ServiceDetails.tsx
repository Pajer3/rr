import { useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function ServiceDetails() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const sections = [
    {
      title: 'Onze Glazenwassersdiensten',
      id: 'services',
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Reinigen van ramen (binnen en buiten)</li>
          <li>Wassen van kozijnen en vensterbanken</li>
          <li>Schoonmaken van moeilijk bereikbare ramen</li>
          <li>Reiniging van glazen deuren en wanden</li>
          <li>Onderhoud van dakramen en lichtkoepels</li>
          <li>Reinigen van zonnepanelen</li>
          <li>Verwijderen van hardnekkige vlekken en aanslag</li>
          <li>Periodiek onderhoud van glaswerk</li>
        </ul>
      )
    },
    {
      title: 'Voordelen van Professionele Glazenwassers',
      id: 'benefits',
      content: (
        <ul className="space-y-2">
          {[
            "Kristalheldere ramen voor optimaal daglicht",
            "Professionele uitstraling van uw pand",
            "Veilige reiniging van moeilijk bereikbare ramen",
            "Verlengde levensduur van uw glaswerk",
            "Gebruik van milieuvriendelijke reinigingsmiddelen",
            "Flexibele planning en snelle service",
            "Gecertificeerde en verzekerde glazenwassers",
            "Consistent hoogwaardige resultaten",
          ].map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="text-sky-500 mr-2 flex-shrink-0 mt-1" size={20} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      )
    },
    {
      title: 'Ons Glazenwassersproces',
      id: 'process',
      content: (
        <ol className="list-decimal pl-5 space-y-2">
          <li>Initiële inspectie en inventarisatie van het glaswerk</li>
          <li>Ontwikkeling van een op maat gemaakt reinigingsplan</li>
          <li>Selectie van de juiste reinigingsmethode en -middelen</li>
          <li>Veilige uitvoering van de glazenwasserswerkzaamheden</li>
          <li>Reiniging van kozijnen en vensterbanken</li>
          <li>Controle op beschadigingen of gebreken aan het glaswerk</li>
          <li>Finale inspectie en eventuele nabehandeling</li>
          <li>Regelmatige evaluatie en optimalisatie van de dienstverlening</li>
        </ol>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300">
          <button
            className="w-full px-8 py-6 text-left font-semibold flex justify-between items-center focus:outline-none bg-gradient-to-r from-sky-50 to-indigo-50 hover:from-sky-100 hover:to-indigo-100 transition-colors duration-300"
            onClick={() => toggleSection(section.id)}
          >
            <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
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
