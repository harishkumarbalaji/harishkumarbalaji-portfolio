import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use base path only for production (GitHub Pages)
  base: process.env.NODE_ENV === 'production' ? '/harishkumarbalaji-portfolio/' : '/',
})
