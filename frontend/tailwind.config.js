/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00a884',
        secondary: '#008069',
        light: '#d1f4cc',
        dark: '#075e54',
        gray: '#f0f2f5',
        'gray-dark': '#8696a0',
        'chat-bg': '#efeae2',
        'message-sent': '#dcf8c6',
        'message-received': '#ffffff'
      },
      fontFamily: {
        'app': ['Segoe UI', 'Helvetica Neue', 'Helvetica', 'Lucida Grande', 'Arial', 'Ubuntu', 'Cantarell', 'Fira Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}