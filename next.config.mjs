/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    NEXT_PUBLIC_EMAILJS_SECOND_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_SECOND_TEMPLATE_ID,
    NEXT_PUBLIC_EMAILJS_USER_ID: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
  },
  transpilePackages: ['lucide-react'],
  // niet meebundelen (gebruikt door het factuursysteem voor PDF's op de server)
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  images: {
    domains: ['images.pexels.com', 'images.unsplash.com'],
  },
};

export default nextConfig;
