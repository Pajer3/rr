import { useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function ServiceDetails() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const sections = [
    {
      title: 'Onze Kantoor Schoonmaakdiensten',
      id: 'services',
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Dagelijkse reiniging van werkplekken en bureaus</li>
          <li>Stofzuigen en dweilen van vloeren</li>
          <li>Schoonmaken van vergaderruimtes</li>
          <li>Reiniging en desinfectie van sanitaire voorzieningen</li>
          <li>Keuken en lunchruimte onderhoud</li>
          {/* <li>Afvalbeheer en recycling</li> */}
          <li>Periodieke dieptereiniging van tapijten en stoffering</li>
          <li>Glazenwassen (binnen en buiten)</li>
        </ul>
      )
    },
    {
      title: 'Voordelen van Professionele Kantoor Schoonmaak',
      id: 'benefits',
      content: (
        <ul className="space-y-2">
          {[
            "Verhoogde productiviteit door een schone werkomgeving",
            "Verbeterde gezondheid en welzijn van medewerkers",
            "Professionele uitstraling voor klanten en bezoekers",
            "Flexibele schoonmaakschema's buiten kantooruren",
            "Gebruik van eco-vriendelijke reinigingsmiddelen",
            "Gescreend en getraind schoonmaakpersoneel",
            "Kosteneffectief door efficiënte werkprocessen",
            "Voldoet aan alle ARBO-normen en hygiëne-eisen",
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
      title: 'Ons Kantoor Schoonmaakproces',
      id: 'process',
      content: (
        <ol className="list-decimal pl-5 space-y-2">
          <li>Initiële inspectie en inventarisatie van het kantoor</li>
          <li>Ontwikkeling van een op maat gemaakt schoonmaakplan</li>
          <li>Toewijzing van een vast, gespecialiseerd schoonmaakteam</li>
          <li>Implementatie van dagelijkse en periodieke schoonmaakroutines</li>
          <li>Gebruik van moderne schoonmaakapparatuur en -technieken</li>
          <li>Regelmatige kwaliteitscontroles en rapportages</li>
          <li>Periodieke evaluatie en optimalisatie van de dienstverlening</li>
          <li>24/7 bereikbaarheid voor speciale verzoeken of calamiteiten</li>
        </ol>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300">
          <button
            className="w-full px-8 py-6 text-left font-semibold flex justify-between items-center focus:outline-none bg-gradient-to-r from-blue-50 to-gray-50 hover:from-blue-100 hover:to-gray-100 transition-colors duration-300"
            onClick={() => toggleSection(section.id)}
          >
            <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-gray-600">
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
