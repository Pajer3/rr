import { useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function ServiceDetails() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const sections = [
    {
      title: 'Stoomreiniging Diensten',
      id: 'services',
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Intensieve reiniging met hoge temperatuur stoom (tot 150°C)</li>
          <li>Verwijderen van kauwgom, olievlekken en stickerresten</li>
          <li>Dieptereiniging voor meubels, tapijt en textiel</li>
          <li>Desinfecteren van sanitaire en medische ruimtes</li>
          <li>Chemievrije schoonmaak in voedselverwerkingsruimtes</li>
        </ul>
      )
    },
    {
      title: 'Voordelen van Stoomreiniging',
      id: 'benefits',
      content: (
        <ul className="space-y-2">
          {[
            "Doodt tot 99,9% van de bacteriën, virussen en schimmels",
            "100% milieuvriendelijk: géén chemische schoonmaakmiddelen nodig",
            "Geschikt voor mensen met allergieën (verwijdering huisstofmijt)",
            "Dringt diep door in poriën, kieren en textielvezels",
            "Oppervlakken zijn sneller weer droog in vergelijking met normaal water",
            "Zacht voor materialen maar onverbiddelijk tegen vuil",
            "Perfect voor zowel particuliere woonruimtes als bedrijven"
          ].map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="text-indigo-500 mr-2 flex-shrink-0 mt-1" size={20} />
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
          <li>Inspecteren van de te behandelen vlekken of oppervlakken</li>
          <li>Materiaaltesten stoomcompatibiliteit uitvoeren ifv stoffering</li>
          <li>Grondig stomen met inzet van gespecialiseerde opzetstukken</li>
          <li>Losgemaakt vuil en verontreiniging direct afnemen/afzuigen</li>
          <li>Zorgen voor eventuele nabehandeling en nacontrole</li>
        </ol>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300">
          <button
            className="w-full px-8 py-6 text-left font-semibold flex justify-between items-center focus:outline-none bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors duration-300"
            onClick={() => toggleSection(section.id)}
          >
            <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
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
