import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import SocialMedia from './SocialMedia'

export default function Footer() {
  return (
    <footer className="bg-background text-black py-8 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Frisspits</h3>
            <p className="text-sm mb-4">Professionele schoonmaakdiensten voor bedrijven en huizen.</p>
            <SocialMedia />
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase mb-4">Diensten</h4>
            <ul className="space-y-2">
              <li><Link href="/diensten/huishoudelijk-schoonmaak" className="text-sm hover:underline">Huishoudelijke Schoonmaak</Link></li>
              <li><Link href="/diensten/kantoor-schoonmaak" className="text-sm hover:underline">Kantoor Schoonmaak</Link></li>
              <li><Link href="/diensten/glazenwasser" className="text-sm hover:underline">Glazenwasser</Link></li>
              <li><Link href="/diensten/dakgoten-reinigen" className="text-sm hover:underline">Dakgoten Reinigen</Link></li>
              <li><Link href="/diensten/vve-schoonmaken" className="text-sm hover:underline">VVE Schoonmaken</Link></li>
              <li><Link href="/diensten/zonnepanelen-reinigen" className="text-sm hover:underline">Zonnepanelen Reinigen</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase mb-4">Bedrijf</h4>
            <ul className="space-y-2">
              <li><Link href="/bedrijf/over-ons" className="text-sm hover:underline">Over Ons</Link></li>
              <li><Link href="/bedrijf/carriere" className="text-sm hover:underline">Carrière</Link></li>
              {/* <li><Link href="/bedrijf/blog" className="text-sm hover:underline">Blog</Link></li> */}
              <li><Link href="/bedrijf/contact" className="text-sm hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:info@frisspits.nl" className="text-sm hover:underline">info@frisspits.nl</a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <a href="tel:+31651891004" className="text-sm hover:underline">+31 6 51891004</a>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">Amersfoort</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 sm:mb-0">©Frisspits. Alle rechten voorbehouden.</p>
          <nav className="flex gap-4">
            <Link className="text-xs hover:underline underline-offset-4" href="/bedrijf/servicevoorwaarden">
              Servicevoorwaarden
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="/bedrijf/privacy">
              Privacy
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="/bedrijf/cookie-beleid">
              Cookie Beleid
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
