/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        "paper-2": "var(--color-paper-2)",
        rule: "var(--color-rule)",
        neutral: "var(--color-neutral)",
        muted: "var(--color-muted)",
        ink: "var(--color-ink)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        focus: "var(--color-focus)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
}

