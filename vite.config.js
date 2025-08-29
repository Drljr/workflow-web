import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"],
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Optional: proxy /api to `vercel dev` (Node serverless) during local dev
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // run `vercel dev` on 3000
    },
  },
})
