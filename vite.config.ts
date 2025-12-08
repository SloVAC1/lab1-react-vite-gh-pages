import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/lab1-react-vite-gh-pages/',
  test: {
    globals: true,
    environment: 'jsdom',              // ИСПРАВЛЕНО 'jsdom'
    setupFiles: './src/setupTests.ts', // ИСПРАВЛЕНО .ts вместо .cs
    css: true,
  },
})
