'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'

interface PrivacySection {
  title: string
  content: string
}

const privacySections: PrivacySection[] = [
  {
    title: "1. Gegevensverzameling",
    content: "1.1 Frisspits verzamelt persoonsgegevens die u vrijwillig verstrekt, zoals naam, adres, telefoonnummer en e-mailadres, wanneer u gebruik maakt van onze diensten of contact met ons opneemt.\n\n1.2 We kunnen ook automatisch bepaalde informatie verzamelen wanneer u onze website bezoekt, zoals uw IP-adres, browsertype, en informatie over uw gebruik van de website."
  },
  {
    title: "2. Gebruik van Gegevens",
    content: "2.1 Frisspits gebruikt uw persoonsgegevens voor de volgende doeleinden:\n- Het leveren en verbeteren van onze diensten\n- Het verwerken van betalingen\n- Het verzenden van servicemededelingen en promotionele aanbiedingen\n- Het reageren op uw vragen en verzoeken\n- Het naleven van wettelijke verplichtingen\n\n2.2 We zullen uw gegevens niet voor andere doeleinden gebruiken zonder uw toestemming."
  },
  {
    title: "3. Gegevensbescherming",
    content: "3.1 Frisspits neemt passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen ongeautoriseerde toegang, verlies of diefstal.\n\n3.2 We beperken de toegang tot uw gegevens tot medewerkers die deze nodig hebben voor hun werkzaamheden."
  },
  {
    title: "4. Gegevensopslag",
    content: "4.1 Frisspits bewaart uw persoonsgegevens niet langer dan noodzakelijk voor de doeleinden waarvoor ze zijn verzameld, tenzij we wettelijk verplicht zijn ze langer te bewaren.\n\n4.2 Na het verstrijken van de bewaartermijn zullen we uw gegevens veilig verwijderen of anonimiseren."
  },
  {
    title: "5. Gegevensdeling",
    content: "5.1 Frisspits deelt uw persoonsgegevens niet met derden, tenzij dit noodzakelijk is voor het leveren van onze diensten of om te voldoen aan wettelijke verplichtingen.\n\n5.2 Als we uw gegevens delen met dienstverleners, zorgen we ervoor dat zij zich houden aan vergelijkbare privacynormen."
  },
  {
    title: "6. Uw Rechten",
    content: "6.1 U heeft het recht om:\n- Inzage te krijgen in uw persoonsgegevens\n- Uw gegevens te laten corrigeren of verwijderen\n- Bezwaar te maken tegen de verwerking van uw gegevens\n- Uw toestemming voor gegevensverwerking in te trekken\n\n6.2 Om gebruik te maken van deze rechten, kunt u contact met ons opnemen via de contactgegevens onderaan deze pagina."
  },
  {
    title: "7. Cookies",
    content: "7.1 Onze website maakt gebruik van cookies om uw gebruikerservaring te verbeteren en voor analytische doeleinden.\n\n7.2 U kunt uw browserinstellingen aanpassen om cookies te weigeren of om u te waarschuwen wanneer cookies worden geplaatst."
  },
  {
    title: "8. Wijzigingen in het Privacybeleid",
    content: "8.1 Frisspits behoudt zich het recht voor om dit privacybeleid van tijd tot tijd te wijzigen.\n\n8.2 We zullen u op de hoogte stellen van belangrijke wijzigingen via onze website of per e-mail."
  }
]

export default function PrivacyPage() {
  const [openSection, setOpenSection] = useState<number | null>(null)

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-300 mb-8">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="font-semibold">Terug naar Home</span>
        </Link>

        <h1 className="text-4xl font-bold text-center mb-12">Privacybeleid</h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Bij Frisspits hechten we groot belang aan de bescherming van uw privacy en persoonsgegevens. In dit privacybeleid leggen we uit hoe we omgaan met uw gegevens en welke rechten u heeft. Lees dit beleid zorgvuldig door om te begrijpen hoe we uw persoonlijke informatie verzamelen, gebruiken en beschermen.
            </p>

            {privacySections.map((section, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 last:border-b-0">
                <button
                  className="w-full text-left py-4 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleSection(index)}
                >
                  <span className="text-lg font-semibold text-gray-800">{section.title}</span>
                  {openSection === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openSection === index && (
                  <div className="pb-4 text-gray-600 whitespace-pre-line">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Heeft u vragen over ons privacybeleid of wilt u gebruik maken van uw rechten? Neem dan contact met ons op via{' '}
            <a href="mailto:privacy@frisspits.nl" className="text-blue-600 hover:underline">
              privacy@frisspits.nl
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
