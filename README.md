# ICAP - vCard & Brochure Institucional

Plataforma interactiva para la presentación institucional y tarjeta de presentación digital (**vCard**) del **Instituto Centroamericano de Administración Pública (ICAP)**, organismo del Sistema de la Integración Centroamericana (SICA).

---

## 🚀 Arquitectura del Proyecto

El repositorio aloja **3 propuestas de diseño independientes y complementarias** sin mezclar su lógica:

```text
ICAP-vCard/
├── public/
│   └── assets/                  # Recursos estáticos y logos
├── src/
│   ├── components/              # Componentes compartidos
│   │   ├── Icons.jsx            # Iconos SVG de marcas (LinkedIn, WhatsApp)
│   │   ├── VCardDownload.jsx    # Generador y descargador de archivo .vcf
│   │   └── ProposalSwitcher.jsx # Barra flotante para comparar propuestas y alternar vistas
│   │
│   ├── styles/
│   │   └── global.css           # Tailwind CSS, fuentes (Raleway, Open Sans) e identidad ICAP
│   │
│   ├── proposals/
│   │   ├── propuesta-1/         # 📄 Propuesta 1: Brochure Institucional Completo + vCard
│   │   │   ├── Hero.jsx
│   │   │   ├── MissionVision.jsx
│   │   │   ├── ValuesWheel.jsx
│   │   │   ├── StatsSection.jsx
│   │   │   ├── SpecializationAreas.jsx
│   │   │   ├── RegionalMap.jsx
│   │   │   ├── AlliesMarquee.jsx
│   │   │   ├── ContactSection.jsx
│   │   │   └── Propuesta1.jsx
│   │   │
│   │   ├── propuesta-2/         # 📇 Propuesta 2: vCard Minimalista
│   │   │   └── Propuesta2.jsx
│   │   │
│   │   └── propuesta-3/         # ⚡ Propuesta 3: Versión Híbrida (vCard + Brochure)
│   │       └── Propuesta3.jsx
│   │
│   ├── App.jsx                  # Orquestador y selector de vistas (Móvil 390px / Full)
│   └── main.jsx
├── package.json
└── README.md
```

---

## 🎨 Descripción de las 3 Propuestas

1. **Propuesta 1 — Brochure Institucional Completo (+ vCard):**
   - **Hero Institucional:** SICA 1954, emblema ICAP, botones de llamada a la acción y modal *"Acerca del ICAP"*.
   - **Misión y Visión:** Tarjetas con modales interactivos de detalle.
   - **Valores Institucionales:** Rueda orbital interactiva de 6 valores con selección de nodos.
   - **ICAP en Cifras:** Métricas de trayectoria (124 proyectos, 47 clientes, 18 países).
   - **Áreas de Especialización:** 6 áreas con modales de información extendida.
   - **Presencia Regional:** Mapa interactivo de Centroamérica con sedes de Costa Rica, Guatemala, Panamá y cobertura regional.
   - **Red Institucional:** Marquesina de organismos aliados (SICA, OPS/OMS, BID, FLACSO, etc.).
   - **Ficha de Contacto:** Acciones directas a WhatsApp, Correo, LinkedIn, Agendar Cita y Guardar Contacto (`.vcf`).

2. **Propuesta 2 — vCard Minimalista:**
   - Tarjeta ejecutiva directa en modo oscuro institucional (`#0B2A4A`), botones de acceso rápido y descarga instantánea de contacto.

3. **Propuesta 3 — Versión Híbrida:**
   - Combina la ficha ejecutiva de contacto en la parte superior con el acceso fluido al brochure institucional en la parte inferior.

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

## 📱 Selector de Propuestas y Simulador Móvil

En la parte inferior de la pantalla encontrarás una **barra flotante**:
- Permite alternar entre **Propuesta 1**, **Propuesta 2** y **Propuesta 3** en tiempo real.
- Permite alternar entre **Vista Móvil (Simulador de iPhone 390px)** y **Vista Completa de Escritorio**.

