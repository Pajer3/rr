'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag, Facebook, Twitter, Linkedin } from 'lucide-react'

interface BlogPost {
  title: string
  content: string
  date: string
  author: string
  category: string
}

interface BlogPostContentProps {
  blogPost: BlogPost
}

export default function BlogPostContent({ blogPost }: BlogPostContentProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <Link href="/bedrijf/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-300 mb-8">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="font-semibold">Terug naar Blog</span>
        </Link>

        <article className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{blogPost.title}</h1>
              <div className="flex flex-wrap items-center text-gray-600 space-x-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span>{blogPost.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{new Date(blogPost.date).toLocaleDateString('nl-NL')}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {blogPost.category}
                  </span>
                </div>
              </div>
            </header>

            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: blogPost.content }} />

            <div className="mt-12 border-t pt-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Deel dit artikel</h2>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-600 hover:text-blue-800 transition duration-300">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-600 transition duration-300">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-blue-700 hover:text-blue-900 transition duration-300">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-12 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Laat een reactie achter</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Naam</label>
                <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" required />
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Reactie</label>
                <textarea id="comment" name="comment" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" required></textarea>
              </div>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">Plaats reactie</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
