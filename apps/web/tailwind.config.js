/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        arabic: ['Noto Sans Arabic', 'system-ui', 'sans-serif']
      },
      colors: {
        hospyar: {
          base: '#FFFFFF',          // Pure White: Main app background, card bodies, charts
          brand: '#0B2E33',         // Deep Teal Navy: Primary headings, navbar, active links, high-contrast text
          action: '#4F7C82',        // Slate Teal: Action buttons (Book Appointment, Save, Submit), selected tabs, icons
          accent: '#6B8B99',        // Icy / Slate Blue: Secondary buttons, patient tag outlines, table header accents
          border: '#93B1B5',        // Muted Aqua Grey: Subtle container borders, card outlines, table gridlines
          soft: '#B8E3E9',          // Soft Powder Blue: Highlighted rows, hover backgrounds, badge chips, alert containers
          surface: '#F8FCFD',       // Ultra-light clean clinical surface
          subtle: '#EBF6F8',        // Powder surface tint
          hover: '#A3D9E0',         // Deeper soft powder blue for hover
          darker: '#061D20',        // Deepest teal navy for shadows/accents
        }
      }
    },
  },
  plugins: [],
}
