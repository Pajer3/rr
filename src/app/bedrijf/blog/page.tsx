import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// This would typically come from a database or API
const blogPosts = [
  {
    id: 1,
    title: "5 Tips voor een Schoner Huis met Minder Moeite",
    excerpt: "Ontdek hoe u uw huis moeiteloos schoon kunt houden met deze eenvoudige maar effectieve tips.",
    date: "2023-05-15",
    author: "Emma de Vries",
    category: "Huishoudelijke Tips",
    slug: "5-tips-voor-een-schoner-huis"
  },
  {
    id: 2,
    title: "De Voordelen van Professionele Kantoorschoonmaak",
    excerpt: "Leer waarom investeren in professionele kantoorschoonmaak cruciaal is voor de productiviteit en gezondheid van uw medewerkers.",
    date: "2023-05-22",
    author: "Lars Janssen",
    category: "Zakelijke Schoonmaak",
    slug: "voordelen-professionele-kantoorschoonmaak"
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-300 mb-8">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="font-semibold">Terug naar Home</span>
        </Link>

        <h1 className="text-4xl font-bold text-center mb-12">Frisspits Blog</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/bedrijf/blog/${post.slug}`} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString('nl-NL')}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="border-2 border-gray-300 rounded-lg p-6 text-center bg-white">
          <p className="text-lg text-gray-600">
            Er zijn momenteel geen andere blogberichten beschikbaar. Kom binnenkort terug voor meer interessante artikelen!
          </p>
        </div>
      </div>
    </div>
  )
}
