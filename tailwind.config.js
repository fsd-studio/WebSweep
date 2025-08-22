/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,jsx}', // For your component library
    './.storybook/**/*.{js,jsx}', // For Storybook
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}