import { useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function ServiceDetails() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const sections = [
    {
      title: 'Terrasreiniging Diensten',
      id: 'services',
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Volledige reiniging van bestrating, vlonders of tegels</li>
          <li>Onder hoge druk verwijderen van mos, alg en hardnekkig vuil</li>
          <li>Aanpakken van onkruid tussen de voegen</li>
          <li>Mogelijkheid tot opnieuw inzanden na de reinigingsbeurt</li>
          <li>Impregneren of anti-alg behandeling</li>
        </ul>
      )
    },
    {
      title: 'Voordelen van Terras Reiniging',
      id: 'benefits',
      content: (
        <ul className="space-y-2">
          {[
            "Een schoon en representatief terras voor de lange zomeravonden",
            "Voorkomt gevaarlijk gladde tegels en vlonders door mos",
            "Behoudt en verbetert de originele kleur van de stenen",
            "Geen rugklachten of urenlang zwoegen met de hand",
            "Dieptereiniging voorkomt snelle terugkeer van onkruid",
            "Duurzame apparatuur die u niet zelf in huis hoeft te halen",
            "Professioneel advies voor langdurig terrasbehoud"
          ].map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="text-teal-500 mr-2 flex-shrink-0 mt-1" size={20} />
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
          <li>Evaluatie van de steensoort, het hout of het terrasoppervlak</li>
          <li>Eventueel weghalen of verplaatsen van losse attributen of potten</li>
          <li>Hogedruk reiniging met speciaal opzetstuk voor egale werking</li>
          <li>Uitgebreid naspoelen zodat alle losse vuildelen worden weggewerkt</li>
          <li>Optioneel inzanden van de schone voegen of aanvoeren van anti-alg</li>
          <li>Terrasmeubilair (indien gewenst) weer netjes terugzetten</li>
        </ol>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300">
          <button
            className="w-full px-8 py-6 text-left font-semibold flex justify-between items-center focus:outline-none bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 transition-colors duration-300"
            onClick={() => toggleSection(section.id)}
          >
            <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
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
