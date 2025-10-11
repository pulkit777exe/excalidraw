import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config"; 

const config: Config = {
  content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
      "./utils/**/*.{js,ts,jsx,tsx,mdx}",
      "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [sharedConfig],
  theme: {
    extend: {
      colors: {
        // Override with CSS variables from globals.css
        "bg-emphasis": "rgb(var(--bg-emphasis) / <alpha-value>)",
        "bg-default": "rgb(var(--bg-default) / <alpha-value>)",
        "bg-subtle": "rgb(var(--bg-subtle) / <alpha-value>)",
        "bg-muted": "rgb(var(--bg-muted) / <alpha-value>)",
        "bg-inverted": "rgb(var(--bg-inverted) / <alpha-value>)",

        "bg-info": "rgb(var(--bg-info) / <alpha-value>)",
        "bg-success": "rgb(var(--bg-success) / <alpha-value>)",
        "bg-attention": "rgb(var(--bg-attention) / <alpha-value>)",
        "bg-error": "rgb(var(--bg-error) / <alpha-value>)",

        "border-emphasis": "rgb(var(--border-emphasis) / <alpha-value>)",
        "border-default": "rgb(var(--border-default) / <alpha-value>)",
        "border-subtle": "rgb(var(--border-subtle) / <alpha-value>)",
        "border-muted": "rgb(var(--border-muted) / <alpha-value>)",

        "content-inverted": "rgb(var(--content-inverted) / <alpha-value>)",
        "content-muted": "rgb(var(--content-muted) / <alpha-value>)",
        "content-subtle": "rgb(var(--content-subtle) / <alpha-value>)",
        "content-default": "rgb(var(--content-default) / <alpha-value>)",
        "content-emphasis": "rgb(var(--content-emphasis) / <alpha-value>)",

        "content-info": "rgb(var(--content-info) / <alpha-value>)",
        "content-success": "rgb(var(--content-success) / <alpha-value>)",
        "content-attention": "rgb(var(--content-attention) / <alpha-value>)",
        "content-error": "rgb(var(--content-error) / <alpha-value>)",
      },
      fontFamily: {
        default: ["system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
    },
  },
};

export default config;