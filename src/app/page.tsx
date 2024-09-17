'use client'

import Link from 'next/link'
import Image from 'next/image'
import ContactForm from '@/components/ContactForm'
import { Sparkles, Repeat, Trash2, Star, ArrowRight, CheckCircle, HelpCircle} from 'lucide-react'
import SocialMedia from '@/components/SocialMedia'
import ExampleWork from '@/components/WorkImages'
//testimonials
const testimonials = [
  {
    name: "Sarah J.",
    role: "Trotse Huiseigenaar",
    content: "Ik ben sprakeloos! Frisspits heeft mijn huis getransformeerd. Het voelt als een compleet nieuwe woning - fris, schoon en vol positieve energie. Hun toewijding is ongeëvenaard!"
  },
  {
    name: "Mike T.",
    role: "Tevreden Kantoormanager",
    content: "Onze werkplek straalt nu professionaliteit uit! Frisspits begrijpt dat een schoon kantoor leidt tot gelukkige medewerkers en betere productiviteit. Ze zijn een onmisbaar onderdeel van ons team geworden!"
  },
  {
    name: "Lisa V.",
    role: "Enthousiaste Restauranteigenaar",
    content: "Wow! Frisspits heeft de lat voor schoonmaak hoger gelegd. Onze gasten merken het verschil en complimenteren ons constant. Het is alsof ze magie gebruiken om alles te laten glanzen!"
  }
]

const exampleImages = [
  { 
    src: "https://images.unsplash.com/photo-1593136573819-c3b57b8caf29?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    alt: "Schoonmaken van Keuken", 
    caption: "Stralende woonkamers", 
    link: "/diensten/huishoudelijk-schoonmaak"
  },
  { 
    src: "https://images.unsplash.com/photo-1517414628894-83d47b22f233?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    alt: "Schoonmaken en Glanzende badkamer", 
    caption: "Glanzende badkamers", 
    link: "/diensten/huishoudelijk-schoonmaak#badkamer"
  },
  { 
    src: "https://images.unsplash.com/photo-1576961453646-b4c376c7021b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    alt: "Schoonmaken voor Bedrijven", 
    caption: "Georganiseerde keukens", 
    link: "/diensten/huishoudelijk-schoonmaak#keuken"
  },
  { 
    src: "https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    alt: "Schoonmaken voor kantoor", 
    caption: "Professionele kantoorruimtes", 
    link: "/diensten/kantoor-schoonmaak"
  },
]

const faqs = [
  {
    question: "Hoe vaak moet ik mijn huis laten schoonmaken?",
    answer: "De frequentie hangt af van uw levensstijl en voorkeuren. Wekelijks of tweewekelijks is gebruikelijk voor de meeste huishoudens, maar we kunnen een schema op maat maken dat bij uw behoeften past."
  },
  {
    question: "Gebruiken jullie milieuvriendelijke schoonmaakmiddelen?",
    answer: "Ja, we gebruiken eco-vriendelijke en niet-toxische schoonmaakmiddelen die veilig zijn voor uw gezin en huisdieren, zonder in te boeten aan effectiviteit."
  },
  {
    question: "Kan ik een eenmalige schoonmaak boeken?",
    answer: "Zeker! We bieden zowel eenmalige als regelmatige schoonmaakdiensten aan. Of u nu een grote schoonmaak nodig heeft of regelmatig onderhoud, we staan voor u klaar."
  },
  {
    question: "Zijn jullie schoonmakers verzekerd?",
    answer: "Absoluut. Al onze medewerkers zijn volledig verzekerd en gescreend voor uw gemoedsrust."
  }
]

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-100 to-green-100 relative overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Frisspits: Uitstekende Schoonmaak
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Professionele schoonmaakdiensten voor huizen en bedrijven. Laat Frisspits de rommel opruimen terwijl u zich concentreert op wat belangrijk is.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-black text-white hover:bg-gray-800 h-10 py-2 px-4">
                  Nu Boeken
                </button>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4">
                  Onze Diensten
                </button>
              </div>
            </div>
          </div>
          {[
            { src: '/images/toys.png', position: { top: '5%', left: '5%' } },
            { src: '/images/wcrol.png', position: { top: '15%', right: '10%' } },
            { src: '/images/bottles.png', position: { bottom: '15%', left: '15%' } },
            { src: '/images/car.png', position: { bottom: '10%', right: '5%' } },
          ].map((item, index) => (
            <div
              key={index}
              className="absolute animate-float"
              style={{
                ...item.position,
                // transform: `rotate(${Math.random() * 30 - 15}deg)`,
                zIndex: 1,
                animation: `float ${3 + index}s ease-in-out infinite`,
                animationDelay: `${index * 0.5}s`,
              }}
            >
              <Image
                src={item.src}
                alt={`Cleaning icon ${index + 1}`}
                width={100}
                height={100}
                className="opacity-50 hover:opacity-80 transition-opacity duration-300 filter drop-shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          ))}
        </section>
        {/* Rest of the sections remain unchanged */}
        <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Frisspits Diensten</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                <Sparkles className="h-12 w-12 mb-4 text-blue-500" />
                <h3 className="text-xl font-bold mb-2">Dieptereiniging</h3>
                <p className="text-gray-500">Grondige reiniging van elk hoekje en gaatje.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                <Repeat className="h-12 w-12 mb-4 text-green-500" />
                <h3 className="text-xl font-bold mb-2">Regelmatig Onderhoud</h3>
                <p className="text-gray-500">Houd uw ruimte netjes met onze routinematige schoonmaakdiensten.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                <Trash2 className="h-12 w-12 mb-4 text-purple-500" />
                <h3 className="text-xl font-bold mb-2">Afvalbeheer</h3>
                <p className="text-gray-500">Efficiënte afvoer- en recyclingdiensten.</p>
              </div>
            </div>
            <div className="text-center">
              <Link href="/diensten" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4">
                Bekijk Alle Diensten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
        <ExampleWork 
          title="Ons Werk in Beeld" 
          images={exampleImages} 
        />
        <section id="why-choose-us" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Waarom Kiezen voor Frisspits?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
                <h3 className="text-xl font-bold mb-2">Professioneel & Betrouwbaar</h3>
                <p className="text-gray-600">Ons team bestaat uit ervaren en gescreende professionals die uw vertrouwen waardig zijn.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
                <h3 className="text-xl font-bold mb-2">Milieuvriendelijk</h3>
                <p className="text-gray-600">We gebruiken eco-vriendelijke producten die veilig zijn voor uw gezin en het milieu.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
                <h3 className="text-xl font-bold mb-2">Flexibele Diensten</h3>
                <p className="text-gray-600">Van eenmalige schoonmaak tot regelmatig onderhoud, we passen ons aan uw behoeften aan.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
                <h3 className="text-xl font-bold mb-2">100% Tevredenheidsgarantie</h3>
                <p className="text-gray-600">Niet tevreden? We komen terug en maken het opnieuw schoon, gratis.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Ontdek de Frisspits Ervaring
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Onze klanten zijn onze grootste fans. Lees hier waarom zij zo enthousiast zijn over Frisspits!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                  <p className="text-gray-700 mb-4 text-base italic leading-relaxed">{testimonial.content}</p>
                  <div className="mt-auto">
                    <p className="font-semibold text-lg text-blue-600">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 mb-2">{testimonial.role}</p>
                    <div className="flex justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button className="button">
                Word Ook Een Tevreden Klant!
                <div className="hoverEffect">
                  <div></div>
                </div>
              </button>
            </div>
          </div>
        </section>
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Veelgestelde Vragen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 flex items-start">
                    <HelpCircle className="h-6 w-6 mr-2 text-blue-500 flex-shrink-0 mt-1" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-500 to-green-400 text-white overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">Klaar voor een Stralend Schone Ruimte?</h2>
                <p className="text-xl mb-8 max-w-md mx-auto md:mx-0">
                  Laat Frisspits u helpen met het creëren van een schone, gezonde en aangename omgeving. Vraag vandaag nog een gratis offerte aan!
                </p>
                <button className="inline-flex items-center justify-center rounded-full text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-white text-blue-600 hover:bg-blue-50 h-14 px-8 py-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Vraag een Gratis Offerte Aan
                </button>
              </div>
              <div className="relative h-[400px] md:h-[600px] lg:h-[700px] w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-300 blur-3xl opacity-30"></div>
                <div className="relative h-full w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-green-400/30 z-10"></div>
                  <Image
                    src="/images/cleaners.jpg"
                    alt="Vrolijke schoonmakers"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center 20%"
                    className="shadow-md"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="social-media" className="w-full py-12 bg-gradient-to-r from-blue-500 to-green-500">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 text-white">
              Volg Ons op Social Media
            </h2>
            <p className="text-xl text-center mb-8 text-gray-300">
              Blijf op de hoogte van onze laatste nieuwtjes, tips en aanbiedingen.
            </p>
            <SocialMedia />
          </div>
        </section>
        <ContactForm />
      </main>
      <style jsx>{`
        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 15px 30px;
          border: 0;
          position: relative;
          overflow: hidden;
          border-radius: 10rem;
          transition: all 0.02s;
          font-weight: bold;
          cursor: pointer;
          color: rgb(37, 37, 37);
          z-index: 0;
          box-shadow: 0 0px 7px -5px rgba(0, 0, 0, 0.5);
        }

        .button:hover {
          background: rgb(193, 228, 248);
          color: rgb(33, 0, 85);
        }

        .button:active {
          transform: scale(0.97);
        }

        .hoverEffect {
          position: absolute;
          bottom: 0;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-center: center;
          z-index: -1;
        }

        .hoverEffect div {
          background: rgb(222, 0, 75);
          background: linear-gradient(
            90deg,
            rgba(222, 0, 75, 1) 0%,
            rgba(191, 70, 255, 1) 49%,
            rgba(0, 212, 255, 1) 100%
          );
          border-radius: 40rem;
          width: 10rem;
          height: 10rem;
          transition: 0.4s;
          filter: blur(20px);
          animation: effect infinite 3s linear;
          opacity: 0.5;
        }

        .button:hover .hoverEffect div {
          width: 8rem;
          height: 8rem;
        }

        @keyframes effect {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  )
}
