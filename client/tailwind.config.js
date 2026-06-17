/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172026',
        mist: '#eef3f2',
        line: '#d9e2df',
        teal: '#0f766e',
        coral: '#e4572e',
        amber: '#b7791f',
        leaf: '#2f855a'
      },
      boxShadow: {
        panel: '0 12px 30px rgba(23, 32, 38, 0.08)'
      }
    },
  },
  plugins: [],
}
