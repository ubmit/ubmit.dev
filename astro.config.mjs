import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://ubmit.dev",
  markdown: {
    shikiConfig: {
      experimentalThemes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
  integrations: [
    mdx(),
    sitemap(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  redirects: {
    "/resume": "https://ubmit.github.io/resume/resume.pdf",
    "/twitter": "https://x.com/ubmit",
    "/x": "https://x.com/ubmit",
    "/linkedin": "https://www.linkedin.com/in/ubmit/",
    "/github": "https://github.com/ubmit",
    "/meet": "https://cal.com/ubmit/30min",
    "/quick-meet": "https://cal.com/ubmit/15min",
  },
});
