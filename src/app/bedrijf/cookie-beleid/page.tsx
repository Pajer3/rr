'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'

interface CookieSection {
  title: string
  content: string
}

const cookieSections: CookieSection[] = [
  {
    title: "1. Wat zijn cookies?",
    content: "Cookies zijn kleine tekstbestanden die op uw apparaat worden opgeslagen wanneer u onze website bezoekt. Ze helpen ons om uw voorkeuren te onthouden, uw ervaring te verbeteren en ons inzicht te geven in hoe u onze website gebruikt."
  },
  {
    title: "2. Welke cookies gebruiken we?",
    content: "2.1 Noodzakelijke cookies: Deze cookies zijn essentieel voor het functioneren van onze website en kunnen niet worden uitgeschakeld.\n\n2.2 Analytische cookies: We gebruiken deze om te begrijpen hoe bezoekers onze website gebruiken, zodat we de gebruikerservaring kunnen verbeteren.\n\n2.3 Functionele cookies: Deze cookies onthouden uw voorkeuren en helpen ons gepersonaliseerde functies aan te bieden.\n\n2.4 Marketing cookies: Deze cookies worden gebruikt om advertenties relevanter te maken voor u en uw interesses."
  },
  {
    title: "3. Hoe lang blijven cookies bewaard?",
    content: "De bewaartermijn van cookies varieert:\n\n- Sessie cookies: Deze worden verwijderd zodra u uw browser sluit.\n- Permanente cookies: Deze blijven op uw apparaat staan tot ze verlopen of tot u ze handmatig verwijdert."
  },
  {
    title: "4. Hoe kunt u cookies beheren?",
    content: "U kunt uw cookievoorkeuren beheren door uw browserinstellingen aan te passen. Let op: het uitschakelen van bepaalde cookies kan de functionaliteit van onze website beïnvloeden.\n\nInstructies voor het beheren van cookies in populaire browsers:\n- Chrome: Instellingen > Geavanceerd > Privacy en beveiliging > Site-instellingen > Cookies\n- Firefox: Opties > Privacy & Beveiliging > Cookies en websitegegevens\n- Safari: Voorkeuren > Privacy > Cookies en websitegegevens"
  },
  {
    title: "5. Cookies van derden",
    content: "Onze website kan ook cookies van derden gebruiken, zoals van sociale media platforms of analytische diensten. Deze partijen hebben hun eigen privacybeleid en cookiebeleid."
  },
  {
    title: "6. Updates van ons cookiebeleid",
    content: "We kunnen dit cookiebeleid van tijd tot tijd bijwerken. Controleer deze pagina regelmatig om op de hoogte te blijven van eventuele wijzigingen."
  },
  {
    title: "7. Contactgegevens",
    content: "Als u vragen heeft over ons gebruik van cookies, neem dan contact met ons op via privacy@frisspits.nl of via het contactformulier op onze website."
  }
]

export default function CookieBeleidPage() {
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

        <h1 className="text-4xl font-bold text-center mb-12">Cookiebeleid</h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Frisspits gebruikt cookies om uw ervaring op onze website te verbeteren en u de best mogelijke service te bieden. In dit cookiebeleid leggen we uit wat cookies zijn, hoe we ze gebruiken en hoe u ze kunt beheren.
            </p>

            {cookieSections.map((section, index) => (
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
            Door onze website te blijven gebruiken, gaat u akkoord met ons cookiebeleid. Als u vragen heeft, neem dan contact met ons op via{' '}
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
