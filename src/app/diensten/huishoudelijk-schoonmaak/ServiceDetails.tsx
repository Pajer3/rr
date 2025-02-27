import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function ServiceDetails() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const sections = [
    // {
    //   title: 'Onze Huishoudelijke Schoonmaakdiensten',
    //   id: 'services',
    //   content: (
    //     <ul className="list-disc pl-5 space-y-2">
    //       <li>Stofzuigen en dweilen van alle vloeren</li>
    //       <li>Afstoffen en reinigen van alle oppervlakken</li>
    //       <li>Schoonmaken van badkamer en toilet</li>
    //       <li>Keukenreiniging, inclusief apparatuur</li>
    //       <li>Opmaken van bedden (op verzoek)</li>
    //       <li>Ramen wassen (binnenzijde)</li>
    //       <li>Verwijderen van spinnenwebben</li>
    //       <li>Legen van prullenbakken</li>
    //     </ul>
    //   )
    // },
    // {
    //   title: 'Voordelen van Professionele Huishoudelijke Schoonmaak',
    //   id: 'benefits',
    //   content: (
    //     <ul className="space-y-2">
    //       {[
    //         "Meer vrije tijd voor uzelf en uw gezin",
    //         "Consistente en grondige reiniging",
    //         "Gebruik van professionele schoonmaakmiddelen en -technieken",
    //         "Verbeterde hygiëne en een gezondere leefomgeving",
    //         "Minder stress en een opgeruimd huis",
    //         "Flexibele schema's aangepast aan uw behoeften",
    //       ].map((benefit, index) => (
    //         <li key={index} className="flex items-start">
    //           <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-1" size={20} />
    //           <span>{benefit}</span>
    //         </li>
    //       ))}
    //     </ul>
    //   )
    // },
    // {
    //   title: 'Ons Schoonmaakproces',
    //   id: 'process',
    //   content: (
    //     <ol className="list-decimal pl-5 space-y-2">
    //       <li>Eerste consultatie en behoefteanalyse</li>
    //       <li>Op maat gemaakt schoonmaakplan</li>
    //       <li>Toewijzing van een vast schoonmaakteam</li>
    //       <li>Uitvoering van de schoonmaakdiensten</li>
    //       <li>Kwaliteitscontrole na elke schoonmaakbeurt</li>
    //       <li>Regelmatige evaluatie en aanpassing van de dienstverlening</li>
    //     </ol>
    //   )
    // },
    {
      title: 'Waarom kiezen voor onze opleveringsschoonmaak?',
      id: 'oplevering',
      content: (
        <div className="space-y-6">
          <ul className="space-y-2">
            {[
              "Grondige reiniging van alle ruimtes",
              "Verwijdering van bouwresten en stof",
              "Aandacht voor details en moeilijk bereikbare plekken",
              "Flexibele planning volgens uw opleveringsdatum",
            ].map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-1" size={20} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-700 italic">
            Neem vandaag nog contact met ons op voor meer informatie of om een afspraak te maken. 
            Wij staan klaar om uw nieuwe of gerenoveerde woning perfect schoon op te leveren!
          </p>
        </div>
      )
    },
  ]

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300">
          <button
            className="w-full px-8 py-6 text-left font-semibold flex justify-between items-center focus:outline-none bg-gradient-to-r from-blue-50 to-green-50 hover:from-blue-100 hover:to-green-100 transition-colors duration-300"
            onClick={() => toggleSection(section.id)}
          >
            <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
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
