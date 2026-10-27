# ICAP - vCard & Brochure Institucional

Plataforma interactiva para la presentación institucional y tarjeta de presentación digital (**vCard**) del **Instituto Centroamericano de Administración Pública (ICAP)**, organismo del Sistema de la Integración Centroamericana (SICA).

---

## 🚀 Estructura del Proyecto

```text
ICAP-vCard/
├── index.html                 # Punto de entrada (meta noindex: no aparece en buscadores)
├── public/
│   └── favicon.png
├── src/
│   ├── main.jsx               # Monta la app
│   ├── App.jsx                # Providers + selector de vista (Completa / Móvil 390px)
│   ├── Brochure.jsx           # Página principal: menú, navegación entre secciones, ajustes
│   │
│   ├── sections/              # Una pantalla del menú por archivo
│   │   ├── Hero.jsx, MissionVision.jsx, ValuesWheel.jsx, StatsSection.jsx
│   │   ├── SpecializationAreas.jsx, AuthoritiesSection.jsx, RegionalMap.jsx
│   │   ├── ProyectosAT.jsx, AlliesMarquee.jsx, ContactSection.jsx
│   │   └── Docencia*.jsx, FormacionVisionHero.jsx   # Menú de Docencia
│   │
│   ├── components/            # Piezas reutilizables (BottomSheet, KickerBadge, EscudoICAP,
│   │                          # VCardDownload, Icons, carruseles, pirámide/logo holográfico…)
│   ├── data/                  # Datos y constantes: proyectos, etiquetas, menú, formas del logo
│   ├── hooks/                 # Hooks propios (serpienteDeColor)
│   ├── i18n/                  # Textos ES/EN y su contexto
│   ├── theme/                 # Modo claro/oscuro
│   ├── styles/global.css      # Tailwind, fuentes e identidad ICAP
│   └── assets/                # Escudo, logo y logos de aliados
├── package.json
└── README.md
```

---

## 🎨 Contenido

- **Hero Institucional:** SICA 1954, emblema ICAP, botones de llamada a la acción.
- **Misión y Visión**, **Valores Institucionales** (rueda orbital interactiva) e **ICAP en Cifras**.
- **Áreas de Especialización** y **Proyectos de Asistencia Técnica** con filtros por área y cliente.
- **Autoridades:** organigrama y fichas volteables.
- **Presencia Regional:** mapa interactivo de Centroamérica.
- **Red Institucional:** marquesina de organismos aliados (SICA, OPS/OMS, BID, FLACSO, etc.).
- **Docencia:** misión, impacto, investigación, publicaciones y áreas.
- **Contacto:** WhatsApp, correo, LinkedIn, agendar cita y guardar contacto (`.vcf`).

---

## 🛠️ Tecnologías Utilizadas

- **React 19**
- **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide Icons**
- **Google Fonts** (*Raleway*, *Open Sans*, *IBM Plex Mono*)

---

## 💻 Instrucciones de Uso Local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 🔒 Buscadores

La página es pública (cualquiera con el enlace la abre) pero **no se indexa**: `index.html` lleva
`<meta name="robots" content="noindex, nofollow, …">`. No se usa `robots.txt` con `Disallow`
a propósito: si Google no puede rastrear la página, no ve el `noindex` y podría listar la URL igual.
