import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Home Perlapp / Stitch — no sustituye tokens shadcn */
        perlapp: {
          canvas: "#fff8f6",
          ink: "#261814",
          inkMuted: "#5a413a",
          white: "#ffffff",
          line: "#e2bfb5",
          surfaceLow: "#fff1ed",
          surfaceContainer: "#ffe9e4",
          surfaceVariant: "#f8ddd5",
          orange: "#F15A29",
          teal: "#004447",
          tertiary: "#006389",
          header: "#FDFCFB",
          divider: "#E2E2E2",
          navMuted: "#4A4A4A",
        },
        /* shadcn CSS-variable tokens */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        /* Perlapp brand tokens (acceso directo por nombre) */
        brand: {
          orange: "#F15A29",
          "orange-dark": "#d44b1f",
          teal: "#1D5C4A",
          "teal-dark": "#154336",
          "teal-light": "#2a7a63",
          pearl: "#FDFDFD",
          stone: "#7D8E8B",
          "stone-light": "#a8b5b2",
          sand: "#F1F3E9",
          "sand-dark": "#e2e4d8",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "perlapp-xs": "4px",
        "perlapp-sm": "12px",
        "perlapp-md": "24px",
        "perlapp-lg": "40px",
        "perlapp-margin-mobile": "16px",
        "perlapp-margin-desktop": "32px",
      },
      fontSize: {
        "perlapp-display-lg": [
          "48px",
          {
            lineHeight: "56px",
            letterSpacing: "-0.02em",
            fontWeight: "800",
          },
        ],
        "perlapp-headline-md": [
          "24px",
          { lineHeight: "32px", fontWeight: "600" },
        ],
        "perlapp-label-sm": [
          "12px",
          { lineHeight: "16px", fontWeight: "500" },
        ],
        "perlapp-label-md": [
          "14px",
          {
            lineHeight: "20px",
            letterSpacing: "0.01em",
            fontWeight: "600",
          },
        ],
      },
      boxShadow: {
        "perlapp-float": "0 16px 24px -12px rgba(0, 68, 71, 0.08)",
        "perlapp-nav": "0 -4px 12px rgba(0, 68, 71, 0.05)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Manrope", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
