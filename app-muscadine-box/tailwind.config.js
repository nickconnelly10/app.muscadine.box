/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          background: 'rgb(var(--background) / <alpha-value>)',
          foreground: 'rgb(var(--foreground) / <alpha-value>)',
          primary: 'rgb(var(--primary) / <alpha-value>)',
          secondary: 'rgb(var(--secondary) / <alpha-value>)',
          textPrimary: 'rgb(var(--text-primary) / <alpha-value>)',
          textSecondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          backgroundInverted: 'rgb(var(--background-inverted) / <alpha-value>)',
          foregroundInverted: 'rgb(var(--foreground-inverted) / <alpha-value>)',
          secondaryInverted: 'rgb(var(--secondary-inverted) / <alpha-value>)',
          textPrimaryInverted: 'rgb(var(--text-primary-inverted) / <alpha-value>)',
          textSecondaryInverted: 'rgb(var(--text-secondary-inverted) / <alpha-value>)',
        },
      },
    },
    plugins: [],
  };