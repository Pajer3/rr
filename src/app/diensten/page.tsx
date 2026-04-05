import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

const services = [
  {
    title: "Grondige opleveringsschoonmaak voor nieuwbouw, renovatie en verhuizing",
    description: "Bij Frisspits verzorgen wij opleveringsschoonmaak voor nieuwbouw, renovaties, verhuizingen én zwaar vervuilde woningen. Of het nu gaat om een nette oplevering of een woning die lange tijd niet is schoongemaakt, wij pakken het grondig aan. Wij verwijderen bouwresten, stof, vet, aanslag en hardnekkig vuil, zodat de woning weer fris, schoon en direct klaar voor gebruik is. Geen klus is ons te groot of te vies. Wij zorgen ervoor dat elke woning weer in topconditie wordt opgeleverd.",
    img: "/icons/huis.png",
    color: "from-black to-blue-300",
    slug: "huishoudelijk-schoonmaak"
  },
  {
    title: "Professionele Glazenwasser",
    description: "Voor streeploos schone ramen en een representatieve uitstraling van uw woning of bedrijfspand. Wij werken snel, professioneel en met oog voor detail.",
    img: "/icons/raam.png",
    color: "from-black to-blue-300",
    slug: "glazenwasser"
  },
  {
    title: "Professioneel Dakgoten Legen",
    description: "Voorkom verstoppingen en waterschade door uw dakgoten tijdig te laten legen. Wij werken met een professioneel dakgoot stofzuigsysteem. Veilig, snel en zonder rommel.",
    img: "/icons/dakgoten.png",
    color: "from-black to-blue-300",
    slug: "dakgoten-reinigen"
  },
  {
    title: "Professionele zonnepanelen reiniging",
    description: "Behaal maximaal rendement uit uw zonnepanelen met onze professionele en veilige reinigingsmethode.",
    img: "/icons/zonnepanelen.png",
    color: "from-black to-blue-300",
    slug: "zonnepanelen-reinigen"
  },
  {
    title: "Kantoor Schoonmaak",
    description: "Creëer een hygiënische en productieve werkomgeving voor uw medewerkers.",
    img: "/icons/kantoor.png",
    color: "from-black to-blue-300",
    slug: "kantoor-schoonmaak"
  },
  {
    title: "VVE schoonmaken",
    description: "Professionele schoonmaakdiensten voor gemeenschappelijke ruimtes in appartementencomplexen.",
    img: "/icons/vve.png",
    color: "from-black to-blue-300",
    slug: "vve-schoonmaken"
  },
  {
    title: "Professionele Gevel Reiniging",
    description: "Herstel de uitstraling van uw pand met onze veilige en grondige gevelreiniging.",
    img: "/icons/Gevelhoutwerkreinigen.png",
    color: "from-black to-blue-300",
    slug: "gevel-reiniging"
  },
  {
    title: "Professionele Stoomreiniging",
    description: "Dieptereiniging voor diverse oppervlakken, milieuvriendelijk en uiterst effectief.",
    img: "/icons/Professionele stoomreiniging.png",
    color: "from-black to-blue-300",
    slug: "stoomreiniging"
  },
  {
    title: "Professionele Terras Reiniging",
    description: "Uw terras weer als nieuw door het professioneel verwijderen van aanslag en vuil.",
    img: "/icons/Professionele terras reiniging..png",
    color: "from-black to-blue-300",
    slug: "terras-reiniging"
  },
]

export default function DienstenPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Onze Diensten</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {services.map((service, index) => (
          <Link key={index} href={`/diensten/${service.slug}`} className={`block relative overflow-hidden rounded-lg bg-gradient-to-r ${service.color} p-1 transition-all duration-300 hover:scale-105 group`}>
            <div className="bg-white p-6 rounded-lg h-full flex flex-col justify-between group-hover:bg-opacity-90 transition-all duration-300">
              <div>
                <div className="mb-4 relative h-40 w-full">
                  <Image
                    src={service.img}
                    alt={service.title}
                    width={100}
                    height={100}
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
              <div className="mt-4">
                <span className="inline-block bg-black bg-opacity-10 text-black rounded-full px-3 py-1 text-sm font-semibold group-hover:bg-opacity-20 transition-colors">
                  Meer info
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* <h2 className="text-3xl font-bold text-center mb-8">Onze Specialiteiten</h2>
      <div className="space-y-12 mb-16">
        {specialties.map((specialty, index) => (
          <div key={index} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-black to-blue-300 transform -skew-y-3"></div>
            <div className="relative bg-white p-8 shadow-xl rounded-lg z-10">
              <h3 className="text-2xl font-bold mb-4 text-black">{specialty.title}</h3>
              <p className="text-gray-600 mb-6">{specialty.description}</p>
              <div className="space-y-4">
                {specialty.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-300 text-black flex items-center justify-center font-bold mr-3">
                      {stepIndex + 1}
                    </span>
                    <p className="text-black">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div> */}
      <div className="bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Waarom Kiezen voor Frisspits?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Professioneel en betrouwbaar team",
            "Milieuvriendelijke schoonmaakmiddelen",
            "Flexibele dienstverlening",
            "100% tevredenheidsgarantie",
            "Concurrerende prijzen",
            "Snelle responstijd",
          ].map((feature, index) => (
            <div key={index} className="flex items-center">
              <CheckCircle className="text-green-500 mr-2" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold mb-4">Klaar om uw ruimte te laten stralen?</h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-6">
          Of u nu een eenmalige dieptereiniging nodig heeft of regelmatige schoonmaakdiensten, wij staan voor u klaar met op maat gemaakte oplossingen.
        </p>
        <Link href="/#contact">
          <button className="bg-black text-white rounded-md px-6 py-2 hover:scale-105 transition duration-300">
            Vraag een Offerte Aan
          </button>
        </Link>
      </div>
    </div>
  );
}
