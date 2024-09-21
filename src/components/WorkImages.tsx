// import React from 'react'
// import Image from 'next/image'
// // import Link from 'next/link'

// interface ExampleImage {
//   src: string
//   alt: string
//   caption: string
//   link: string
// }

// interface ExampleWorkProps {
//   title: string
//   images: ExampleImage[]
// }

// export default function ExampleWork({ title, images }: ExampleWorkProps) {
//   return (
//     <section className="py-12 bg-background">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {images.map((image, index) => (
//                 <div key={index} className="relative h-64 rounded-lg overflow-hidden group">
//                   <Image
//                     src={image.src}
//                     alt={image.alt}
//                     fill
//                     style={{ objectFit: 'cover' }}
//                     className="transition-transform duration-300 group-hover:scale-105"
//                   />
//                   <div className="absolute inset-x-0 bottom-0 bg-white bg-opacity-75 p-2 transition-opacity duration-300 opacity-100 group-hover:opacity-100">
//                     <span className="text-black text-lg font-semibold block text-center">
//                       {image.caption}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )
//     }
