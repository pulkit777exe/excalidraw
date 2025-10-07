import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config"; 

const config = {
  content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
      "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [sharedConfig],
} satisfies Config; 

export default config;