/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gh-blue': '#0969da',
        'gh-border': '#d0d7de',
        'gh-bg': '#f6f8fa',
        'gh-canvas': '#ffffff',
        'gh-text': '#24292f',
        'gh-muted': '#57606a',
      },
      fontFamily: {
        'mono': ['ui-monospace', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}