import Link from 'next/link'

export default function PrivacybeleidPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/" passHref>
            <button className="bg-white text-blue-600 rounded-full px-6 py-2 font-semibold hover:bg-blue-50 transition duration-300 shadow-md hover:shadow-lg">
              ← Terug naar Home
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
            Privacybeleid
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Inleiding</h2>
              <p className="text-gray-700 leading-relaxed">
                Frisspits (&quot;wij&quot;, &quot;ons&quot;, &quot;onze&quot;) respecteert uw privacy en is toegewijd aan de bescherming van uw
                persoonsgegevens. Dit privacybeleid legt uit hoe wij uw persoonsgegevens verzamelen, gebruiken en
                beschermen wanneer u onze website bezoekt of gebruik maakt van onze diensten.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Welke gegevens verzamelen wij?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Wij verzamelen de volgende soorten gegevens:
              </p>
              <div className="bg-blue-50 rounded-lg p-6 mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Contactformulier gegevens:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Naam</li>
                  <li>E-mailadres</li>
                  <li>Telefoonnummer</li>
                  <li>Adres (indien verstrekt)</li>
                  <li>Bericht en service-aanvragen</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatisch verzamelde gegevens:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>IP-adres:</strong> Voor beveiligingsdoeleinden en analysedoeleinden</li>
                  <li><strong>Locatiegegevens:</strong> Land, stad, regio (afgeleid van IP-adres)</li>
                  <li><strong>Browser informatie:</strong> Browser type en versie</li>
                  <li><strong>Bezochte pagina&apos;s:</strong> Welke diensten pagina&apos;s u bezoekt</li>
                  <li><strong>Tijdstip van bezoek:</strong> Wanneer u onze website bezoekt</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Waarom verzamelen wij deze gegevens?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Wij gebruiken uw gegevens voor de volgende doeleinden:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Om uw aanvragen voor offertes en diensten te verwerken</li>
                <li>Om contact met u op te nemen over uw aanvraag</li>
                <li>Om onze website te verbeteren en de gebruikerservaring te optimaliseren</li>
                <li>Om te begrijpen welke diensten het meest populair zijn</li>
                <li>Om frauduleuze activiteiten te detecteren en te voorkomen</li>
                <li>Om te voldoen aan wettelijke verplichtingen</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Rechtsgrondslag voor gegevensverwerking (GDPR)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Wij verwerken uw persoonsgegevens op basis van:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Toestemming:</strong> U geeft toestemming door ons contactformulier in te vullen</li>
                <li><strong>Gerechtvaardigd belang:</strong> Voor het verbeteren van onze website en diensten</li>
                <li><strong>Contractuele verplichting:</strong> Om uw aanvraag voor diensten te kunnen verwerken</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookie- en trackingbeleid</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Onze website maakt gebruik van cookies en tracking technologie:
              </p>
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tracking van bezoekersgedrag:</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Wij volgen welke diensten pagina&apos;s u bezoekt en verzamelen uw IP-adres en locatiegegevens.
                  Deze informatie wordt gebruikt om:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Te begrijpen welke diensten het meest interessant zijn voor bezoekers</li>
                  <li>Onze marketingstrategieën te verbeteren</li>
                  <li>De gebruikerservaring te optimaliseren</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>U kunt deze tracking accepteren of weigeren via de cookie banner op onze website.</strong>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Hoe lang bewaren wij uw gegevens?</h2>
              <p className="text-gray-700 leading-relaxed">
                Wij bewaren uw gegevens niet langer dan noodzakelijk:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
                <li><strong>Contactformulier gegevens:</strong> Maximaal 2 jaar na uw laatste contact</li>
                <li><strong>Bezoekerslogboeken:</strong> Maximaal 1 jaar</li>
                <li><strong>IP-adressen:</strong> Worden na 12 maanden geanonimiseerd</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Met wie delen wij uw gegevens?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Wij delen uw gegevens alleen met:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>EmailJS:</strong> Voor het versturen van contactformulieren (zie hun privacybeleid)</li>
                <li><strong>IP-API.com:</strong> Voor het omzetten van IP-adressen naar locatiegegevens</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Wij verkopen uw gegevens <strong>nooit</strong> aan derden.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Uw rechten onder de AVG/GDPR</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                U heeft de volgende rechten met betrekking tot uw persoonsgegevens:
              </p>
              <div className="bg-green-50 rounded-lg p-6">
                <ul className="space-y-3 text-gray-700">
                  <li><strong>Recht op inzage:</strong> U kunt vragen welke gegevens wij van u hebben</li>
                  <li><strong>Recht op rectificatie:</strong> U kunt vragen om onjuiste gegevens te corrigeren</li>
                  <li><strong>Recht op verwijdering:</strong> U kunt vragen om uw gegevens te verwijderen (&quot;recht om vergeten te worden&quot;)</li>
                  <li><strong>Recht op beperking:</strong> U kunt vragen om de verwerking van uw gegevens te beperken</li>
                  <li><strong>Recht op dataportabiliteit:</strong> U kunt uw gegevens in een gestructureerd formaat opvragen</li>
                  <li><strong>Recht van bezwaar:</strong> U kunt bezwaar maken tegen de verwerking van uw gegevens</li>
                  <li><strong>Recht om toestemming in te trekken:</strong> U kunt uw toestemming op elk moment intrekken</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                Om een van deze rechten uit te oefenen, neem contact met ons op via de onderstaande contactgegevens.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Beveiliging</h2>
              <p className="text-gray-700 leading-relaxed">
                Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen
                tegen verlies, misbruik, ongeautoriseerde toegang, openbaarmaking, wijziging of vernietiging.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Wijzigingen in dit privacybeleid</h2>
              <p className="text-gray-700 leading-relaxed">
                Wij kunnen dit privacybeleid van tijd tot tijd bijwerken. Belangrijke wijzigingen zullen worden
                aangekondigd op onze website. De datum van de laatste wijziging staat bovenaan dit document.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Voor vragen over dit privacybeleid of om uw rechten uit te oefenen, kunt u contact met ons opnemen:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700"><strong>Frisspits</strong></p>
                <p className="text-gray-700">Amersfoort, Nederland</p>
                <p className="text-gray-700 mt-2">
                  Via ons <Link href="/#contact" className="text-blue-600 hover:underline">contactformulier</Link>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Klacht indienen</h2>
              <p className="text-gray-700 leading-relaxed">
                Als u niet tevreden bent met de manier waarop wij met uw persoonsgegevens omgaan, heeft u het recht
                om een klacht in te dienen bij de Autoriteit Persoonsgegevens (AP):
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mt-4">
                <p className="text-gray-700"><strong>Autoriteit Persoonsgegevens</strong></p>
                <p className="text-gray-700">Postbus 93374</p>
                <p className="text-gray-700">2509 AJ Den Haag</p>
                <p className="text-gray-700 mt-2">
                  Website: <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    www.autoriteitpersoonsgegevens.nl
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
