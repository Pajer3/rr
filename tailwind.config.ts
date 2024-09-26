import type { Config } from "tailwindcss";
import { go3Font } from "@/fonts";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ADD8E6",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        go3: ['var(--font-go3)'],
      },
    },
  },
  plugins: [],
};
export default config;
