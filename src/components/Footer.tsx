import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-8 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Frisspits</h3>
            <p className="text-sm mb-4">Professionele schoonmaakdiensten voor huizen en bedrijven.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase mb-4">Diensten</h4>
            <ul className="space-y-2">
              <li><Link href="/diensten/huishoudelijk" className="text-sm hover:underline">Huishoudelijke Schoonmaak</Link></li>
              <li><Link href="/diensten/kantoor" className="text-sm hover:underline">Kantoor Schoonmaak</Link></li>
              <li><Link href="/diensten/specialistisch" className="text-sm hover:underline">Specialistische Reiniging</Link></li>
              <li><Link href="/diensten/glazenwassen" className="text-sm hover:underline">Glazenwassen</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase mb-4">Bedrijf</h4>
            <ul className="space-y-2">
              <li><Link href="/over-ons" className="text-sm hover:underline">Over Ons</Link></li>
              <li><Link href="/carriere" className="text-sm hover:underline">Carrière</Link></li>
              <li><Link href="/blog" className="text-sm hover:underline">Blog</Link></li>
              <li><Link href="/contact" className="text-sm hover:underline">Contact</Link></li>
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
                <a href="tel:+31612345678" className="text-sm hover:underline">+31 6 12345678</a>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">Schoonstraat 1, 1234 AB Amsterdam</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 sm:mb-0">©Frisspits. Alle rechten voorbehouden.</p>
          <nav className="flex gap-4">
            <Link className="text-xs hover:underline underline-offset-4" href="/voorwaarden">
              Servicevoorwaarden
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
              Privacy
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="/cookie-beleid">
              Cookie Beleid
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
