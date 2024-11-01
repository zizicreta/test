/* ** @type {import('tailwindcss').Config} 
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}
*/
// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Next.js 13 app 디렉토리 사용
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};