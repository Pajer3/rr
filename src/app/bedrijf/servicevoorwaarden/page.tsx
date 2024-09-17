'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'

interface TermSection {
  title: string
  content: string
}

const termSections: TermSection[] = [
  {
    title: "1. Algemene Bepalingen",
    content: "1.1 Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen Frisspits en de klant.\n\n1.2 Afwijkingen van deze voorwaarden zijn alleen geldig indien deze schriftelijk zijn overeengekomen.\n\n1.3 Frisspits behoudt zich het recht voor deze voorwaarden te wijzigen. Wijzigingen treden in werking 30 dagen na bekendmaking aan de klant."
  },
  {
    title: "2. Dienstverlening",
    content: "2.1 Frisspits zal de overeengekomen schoonmaakdiensten naar beste inzicht en vermogen uitvoeren.\n\n2.2 De klant dient ervoor te zorgen dat Frisspits tijdig kan beschikken over de voor de dienstverlening benodigde gegevens en toegang tot de te reinigen ruimtes.\n\n2.3 Indien de dienstverlening wordt vertraagd door factoren waarvoor de klant verantwoordelijk is, kunnen de daaruit voortvloeiende kosten in rekening worden gebracht."
  },
  {
    title: "3. Prijzen en Betaling",
    content: "3.1 Alle prijzen zijn exclusief BTW, tenzij anders vermeld.\n\n3.2 Betaling dient te geschieden binnen 14 dagen na factuurdatum.\n\n3.3 Bij niet-tijdige betaling is de klant, zonder ingebrekestelling, in verzuim en is Frisspits gerechtigd de wettelijke rente in rekening te brengen."
  },
  {
    title: "4. Aansprakelijkheid",
    content: "4.1 Frisspits is aansprakelijk voor schade die het directe gevolg is van een toerekenbare tekortkoming in de uitvoering van de overeenkomst.\n\n4.2 De aansprakelijkheid van Frisspits is beperkt tot het bedrag dat in het desbetreffende geval onder de aansprakelijkheidsverzekering wordt uitbetaald.\n\n4.3 Frisspits is niet aansprakelijk voor indirecte schade, waaronder gevolgschade en gederfde winst."
  },
  {
    title: "5. Duur en Beëindiging",
    content: "5.1 De overeenkomst wordt aangegaan voor de duur zoals vermeld in de offerte of overeenkomst.\n\n5.2 Bij regelmatig terugkerende werkzaamheden wordt de overeenkomst aangegaan voor onbepaalde tijd, tenzij anders overeengekomen.\n\n5.3 Opzegging dient schriftelijk te geschieden met inachtneming van een opzegtermijn van ten minste één maand."
  },
  {
    title: "6. Geheimhouding",
    content: "6.1 Beide partijen zijn verplicht tot geheimhouding van alle vertrouwelijke informatie die zij in het kader van hun overeenkomst van elkaar of uit andere bron hebben verkregen.\n\n6.2 Informatie geldt als vertrouwelijk als dit door de andere partij is medegedeeld of als dit voortvloeit uit de aard van de informatie."
  },
  {
    title: "7. Toepasselijk Recht en Geschillen",
    content: "7.1 Op alle overeenkomsten tussen Frisspits en de klant is Nederlands recht van toepassing.\n\n7.2 Geschillen zullen in eerste instantie worden voorgelegd aan de bevoegde rechter in de vestigingsplaats van Frisspits, tenzij de wet dwingend anders voorschrijft."
  }
]

export default function ServicevoorwaardenPage() {
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

        <h1 className="text-4xl font-bold text-center mb-12">Servicevoorwaarden</h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Welkom bij de servicevoorwaarden van Frisspits. Deze voorwaarden zijn van toepassing op alle diensten die wij leveren. Lees ze zorgvuldig door om volledig op de hoogte te zijn van onze wederzijdse rechten en plichten.
            </p>

            {termSections.map((section, index) => (
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
            Heeft u vragen over onze servicevoorwaarden? Neem dan contact met ons op via{' '}
            <a href="mailto:info@frisspits.nl" className="text-blue-600 hover:underline">
              info@frisspits.nl
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
