import React from 'react'
import Link from 'next/link'
import { Instagram, Twitter } from 'lucide-react'

interface SocialMediaProps {
  className?: string
}

export default function SocialMedia({ className = '' }: SocialMediaProps) {
  const socialLinks = [
    { name: 'WhatsApp', icon: (props) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ), url: 'https://wa.me/+31651891004' },
    { name: 'Twitter', icon: Twitter, url: 'https://x.com/frisspits' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/frisspits_schoonmaakdiensten/' },
    { name: 'TikTok', icon: (props) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ), url: 'https://tiktok.com/@frisspits' },
  ]

  return (
    <div className={`flex justify-center space-x-6 ${className}`}>
      {socialLinks.map((platform) => (
        <Link
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 transition-colors"
        >
          <platform.icon size={24} />
          <span className="sr-only">{platform.name}</span>
        </Link>
      ))}
    </div>
  )
}
