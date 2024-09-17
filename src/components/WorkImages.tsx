import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ExampleImage {
  src: string
  alt: string
  caption: string
  link: string
}

interface ExampleWorkProps {
  title: string
  images: ExampleImage[]
}

export default function ExampleWork({ title, images }: ExampleWorkProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((image, index) => (
            <Link href={image.link} key={index} className="block">
              <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white text-xl font-semibold text-center px-4">{image.caption}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
