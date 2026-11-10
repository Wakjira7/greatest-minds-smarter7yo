/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        obsidian: '#090D16',
        slateCard: '#111827',
        borderSubtle: '#1E293B',
      },
    },
  },
  plugins: [],
};
