import { useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function ServiceDetails() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const sections = [
    {
      title: 'Onze VVE Schoonmaakdiensten',
      id: 'services',
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Reiniging van entree en trappenhuis</li>
          <li>Schoonmaken van liften</li>
          <li>Onderhoud van gemeenschappelijke ruimtes</li>
          <li>Reiniging van galerijen en balkons</li>
          <li>Glasbewassing van gemeenschappelijke ramen</li>
          {/* <li>Verwijderen van graffiti en kauwgom</li> */}
          <li>Schoonmaken van parkeergarages</li>
          <li>Onderhoud van groenvoorzieningen</li>
        </ul>
      )
    },
    {
      title: 'Voordelen van Professionele VVE Schoonmaak',
      id: 'benefits',
      content: (
        <ul className="space-y-2">
          {[
            "Verhoogde leefbaarheid voor bewoners",
            "Waardebehoud van het gebouw",
            "Professionele en consistente schoonmaak",
            "Flexibele schoonmaakschema's",
            "Gebruik van milieuvriendelijke schoonmaakmiddelen",
            "Getraind en betrouwbaar personeel",
            "Kosteneffectief door efficiënte werkwijze",
            "Voldoet aan alle veiligheids- en hygiënenormen",
          ].map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="text-purple-500 mr-2 flex-shrink-0 mt-1" size={20} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      )
    },
    {
      title: 'Ons VVE Schoonmaakproces',
      id: 'process',
      content: (
        <ol className="list-decimal pl-5 space-y-2">
          <li>Initiële inspectie en inventarisatie van het gebouw</li>
          <li>Op maat gemaakt schoonmaakplan voor de VVE</li>
          <li>Toewijzing van een vast, gespecialiseerd schoonmaakteam</li>
          <li>Uitvoering van schoonmaakwerkzaamheden volgens schema</li>
          <li>Regelmatige kwaliteitscontroles en rapportages</li>
          <li>Periodieke evaluatie en bijsturing van de dienstverlening</li>
          <li>24/7 bereikbaarheid voor calamiteiten of extra diensten</li>
        </ol>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300">
          <button
            className="w-full px-8 py-6 text-left font-semibold flex justify-between items-center focus:outline-none bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors duration-300"
            onClick={() => toggleSection(section.id)}
          >
            <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
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
