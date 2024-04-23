import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "var(--gray-1)",
          200: "var(--gray-2)",
          300: "var(--gray-3)",
          400: "var(--gray-4)",
          500: "var(--gray-5)",
          600: "var(--gray-6)",
          700: "var(--gray-7)",
          800: "var(--gray-8)",
          900: "var(--gray-9)",
          1000: "var(--gray-10)",
          1100: "var(--gray-11)",
          1200: "var(--gray-12)",
        },
      },
      fontFamily: {
        sans: ["Work Sans", ...defaultTheme.fontFamily.sans],
        mono: ["Commit Mono", ...defaultTheme.fontFamily.mono],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            h1: {
              color: theme("colors.gray.1200"),
              fontSize: theme("fontSize.2xl"),
            },
            h2: {
              color: theme("colors.gray.1200"),
              fontSize: theme("fontSize.xl"),
            },
            h3: {
              color: theme("colors.gray.1200"),
              fontSize: theme("fontSize.lg"),
            },
            p: {
              color: theme("colors.gray.1100"),
            },
            a: {
              color: theme("colors.gray.1100"),
              "&:hover": {
                color: theme("colors.gray.1200"),
              },
            },
            code: {
              color: theme("colors.gray.1200"),
              fontWeight: theme("fontWeight.bold"),
            },
            time: {
              color: theme("colors.gray.1000"),
              fontFamily: theme("fontFamily.mono"),
              fontSize: theme("fontSize.sm"),
              fontWieght: theme("fontWeight.light"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
