import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// Link directo a Docencia (/ICAP-vCard/docencia/): GitHub Pages no tiene
// fallback de SPA, así que se copia el index.html ya armado a
// docencia/index.html. Los assets usan rutas absolutas (base), así que la
// copia funciona tal cual; Brochure.jsx lee la ruta y fija Docencia.
const docenciaEntry = () => ({
  name: 'docencia-entry',
  apply: 'build',
  closeBundle() {
    const dist = resolve(import.meta.dirname, 'dist')
    mkdirSync(resolve(dist, 'docencia'), { recursive: true })
    copyFileSync(resolve(dist, 'index.html'), resolve(dist, 'docencia', 'index.html'))
  }
})
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve el sitio en /ICAP-vCard/, no en la raíz.
  base: '/ICAP-vCard/',
  plugins: [
    react(),
    tailwindcss(),
    docenciaEntry(),
  ],
})
