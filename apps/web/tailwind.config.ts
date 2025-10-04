import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config"; 

const config = {
  content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [sharedConfig],
} satisfies Config; 

export default config;