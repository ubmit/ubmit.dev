import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://ubmit.dev",
  markdown: {
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), sitemap(), react()],
  redirects: {
    "/twitter": "https://x.com/ubmit",
    "/x": "https://x.com/ubmit",
    "/linkedin": "https://www.linkedin.com/in/ubmit/",
    "/github": "https://github.com/ubmit",
    "/meet": "https://cal.com/ubmit/30min",
    "/quick-meet": "https://cal.com/ubmit/15min",
    "/resume": "/resume.pdf",
    /**
     * Blog post redirects: Preserve SEO and prevent broken links.
     * Blog posts were moved from root (/{slug}/) to /writing/{slug}/ route on Dec 23, 2025.
     * These 301 redirects maintain backwards compatibility for existing URLs.
     */
    "/agentic-engineering-without-lock-in/":
      "/writing/agentic-engineering-without-lock-in/",
    "/introduction-to-functional-programming-in-javascript/":
      "/writing/introduction-to-functional-programming-in-javascript/",
    "/use-an-object-instead-of-a-switch/":
      "/writing/use-an-object-instead-of-a-switch/",
  },
});