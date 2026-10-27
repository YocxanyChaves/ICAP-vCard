import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve el sitio en /ICAP-vCard/, no en la raíz.
  base: '/ICAP-vCard/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
