/**
 * Diccionario central de traducciones ES/EN para todo el brochure.
 *
 * Un solo archivo, organizado por sección/componente (mismo nombre que
 * el archivo que lo usa), para que sea fácil ubicar y mantener cada
 * texto. Los arreglos de contenido con "id" propio (áreas, valores,
 * países, aliados) se traducen como objetos keyed por ese mismo id, en
 * vez de mantener dos arreglos completos por separado — así el
 * componente conserva su única fuente de verdad para íconos, colores y
 * estructura, y sólo el texto visible cambia según el idioma.
 *
 * `areaLabels` es un caso especial: las "Áreas de Proyecto" (Gobernanza,
 * Salud, etc.) se usan a la vez como TEXTO visible y como LLAVE para
 * buscar color/ícono en areaMeta.js — así que esa llave se queda fija
 * en español siempre (es el "id" interno), y sólo se traduce lo que se
 * muestra en pantalla a través de este mapa.
 */

export const translations = {
  es: {
    common: {
      close: 'Cerrar'
    },

    header: {
      subtitle: 'Brochure Institucional',
      home: 'Ir al inicio',
      fullView: 'Vista Completa',
      mobileView: 'Vista Móvil (390px)',
      about: 'Sobre ICAP',
      contact: 'Contactanos',
      language: 'Cambiar idioma',
      theme: 'Cambiar tema claro/oscuro',
      settings: 'Configuración',
      settingsView: 'Vista',
      settingsLanguage: 'Idioma',
      settingsTheme: 'Tema',
      viewFullShort: 'Completa',
      viewMobileShort: 'Móvil',
      themeLight: 'Claro',
      themeDark: 'Oscuro',
      deptAT: 'Asistencia Técnica',
      deptDocencia: 'Docencia'
    },

    nav: {
      inicio: 'Inicio',
      mision: 'Misión',
      valores: 'Valores',
      autoridades: 'Autoridades',
      areas: 'Áreas',
      presencia: 'Presencia',
      contacto: 'Contacto',
      docenciaMision: 'Formación',
      docenciaImpacto: 'Impacto',
      docenciaInvestigacion: 'Investigación',
      docenciaPublicaciones: 'Publicaciones',
      docenciaAreas: 'Áreas'
    },

    sectionsStrip: {
      kicker: 'Navegación Rápida'
    },

    hero: {
      badge: 'ICAP · Fundado en 1954',
      title: 'ICAP',
      subtitle: 'Instituto Centroamericano de Administración Pública',
      description:
        'Organismo regional del SICA especializado en la modernización institucional, gestión de políticas públicas y formación del talento humano.',
      ctaAbout: 'CONOCÉ EL ICAP',
      ctaContact: 'CONTACTANOS',
      scrollHint: 'Descubrí más'
    },

    stats: {
      kicker: 'Trayectoria e Impacto',
      title: 'ICAP en Cifras',
      badge: 'Cifras oficiales · Resumen Estratégico ICAP',
      items: {
        proyectos: { label: 'Proyectos', sublabel: 'ejecutados' },
        clientes: { label: 'Clientes', sublabel: 'institucionales' },
        paises: { label: 'Países', sublabel: 'atendidos' }
      }
    },

    specializationAreas: {
      kicker: 'Expertise y Oferta',
      title: 'Áreas de Especialización',
      subtitle: 'Los seis frentes de especialización del ICAP, según su oferta institucional 2026, con un enfoque transversal de género en cada uno.',
      generoNote: 'Género es un eje transversal que atraviesa las seis áreas de especialización.',
      items: {
        salud: {
          title: 'Salud y Seguridad Social',
          tag: 'Gerencia hospitalaria, epidemiología y seguridad social',
          longDesc: 'Según la oferta institucional 2026 del ICAP, esta área comprende:',
          // Descripción de 3 renglones (redactada a partir de los puntos de
          // abajo) + las 3 líneas principales de esa misma lista, para la
          // vista resumida de la tarjeta.
          shortDesc:
            'El ICAP fortalece la gestión hospitalaria y de emergencias en el sector salud. ' +
            'También asesora en temas de pensiones, salud laboral y epidemiología. ' +
            'Su enfoque busca sistemas de salud más eficientes y con mayor cobertura.',
          highlights: ['Gerencia Hospitalaria', 'Epidemiología', 'Pensiones'],
          points: [
            'Gerencia Hospitalaria',
            'Epidemiología',
            'Dirección de servicios de emergencia',
            'Migración y salud',
            'Pensiones',
            'Salud laboral',
            'Servicios de salud'
          ]
        },
        calidad: {
          title: 'Calidad',
          tag: 'Sistemas, información y certificaciones de calidad institucional',
          longDesc: 'Según la oferta institucional 2026 del ICAP, esta área comprende:',
          shortDesc:
            'El ICAP ayuda a las instituciones a construir sistemas de calidad institucional. ' +
            'Diseña mecanismos de información y medición para respaldar la toma de decisiones. ' +
            'Acompaña además los procesos de certificación bajo estándares reconocidos.',
          highlights: ['Calidad institucional', 'Sistemas de calidad', 'Certificaciones'],
          points: [
            'Calidad institucional',
            'Sistema de información y medición',
            'Sistemas de calidad',
            'Certificaciones'
          ]
        },
        proyectos: {
          title: 'Proyectos',
          tag: 'Formulación, factibilidad y certificación de proyectos',
          longDesc: 'Según la oferta institucional 2026 del ICAP, esta área comprende:',
          shortDesc:
            'El ICAP acompaña todo el ciclo de vida de un proyecto, desde su formulación. ' +
            'Realiza estudios de prefactibilidad y factibilidad para sustentar decisiones de inversión. ' +
            'También ofrece procesos de certificación de proyectos.',
          highlights: ['Formulación de proyectos', 'Estudios de factibilidad', 'Certificaciones'],
          points: [
            'Formulación de proyectos',
            'Estudios de factibilidad',
            'Estudios de prefactibilidad',
            'Certificaciones'
          ]
        },
        gobernanza: {
          title: 'Gobernanza',
          tag: 'Modernización, políticas públicas y participación ciudadana',
          longDesc: 'Según la oferta institucional 2026 del ICAP, esta área comprende:',
          shortDesc:
            'El ICAP asesora procesos de modernización y reforma del Estado. ' +
            'Apoya el diseño de políticas públicas y el fortalecimiento de la participación ciudadana. ' +
            'Trabaja también temas de gobernanza digital y gobiernos locales.',
          highlights: ['Modernización y reforma', 'Políticas Públicas', 'Participación ciudadana'],
          points: [
            'Modernización y reforma',
            'Políticas Públicas',
            'Planificación',
            'Participación ciudadana',
            'Gestión, Transparencia y Gobierno Abierto',
            'Gobernanza Digital',
            'Inversión Pública',
            'Gobiernos locales'
          ]
        },
        transformacion: {
          title: 'Transformación Organizacional',
          tag: 'Diseño organizacional, procesos y perfiles de puestos',
          longDesc: 'Según la oferta institucional 2026 del ICAP, esta área comprende:',
          shortDesc:
            'El ICAP acompaña el diseño y la reingeniería de estructuras organizacionales. ' +
            'Apoya la mejora de procesos y procedimientos internos. ' +
            'También asesora en la definición de perfiles de puesto y cargas laborales.',
          highlights: ['Diseño, reingeniería organizacional', 'Procesos y procedimientos', 'Perfiles, puestos y cargas laborales'],
          points: [
            'Diseño, reingeniería organizacional',
            'Procesos y procedimientos',
            'Perfiles, puestos y cargas laborales'
          ]
        },
        ambiente: {
          title: 'Ambiente y energía',
          tag: 'Cambio climático, gestión ambiental y regulación energética',
          longDesc: 'Según la oferta institucional 2026 del ICAP, esta área comprende:',
          shortDesc:
            'El ICAP apoya la adaptación y mitigación frente al cambio climático. ' +
            'Asesora en gestión ambiental y regulación energética. ' +
            'También trabaja la gestión de riesgos y desastres.',
          highlights: ['Cambio Climático', 'Gestión ambiental', 'Regulación energética'],
          points: [
            'Cambio Climático',
            'Gestión ambiental',
            'Regulación energética',
            'Gestión de riesgos y desastres'
          ]
        }
      }
    },

    authorities: {
      kicker: 'Liderazgo Institucional',
      title: 'Autoridades',
      subtitle: 'Equipo directivo y autoridades del ICAP.',
      notice:
        'Sección en construcción · los espacios de abajo se completarán con nombres, cargos y fotografías oficiales una vez definidos.',
      namePending: 'Nombre pendiente',
      titlePending: 'Cargo pendiente',
      tbd: 'Por definir'
    },

    missionVision: {
      kicker: 'Quiénes somos',
      title: 'Misión y Visión',
      subtitle:
        'Los dos pilares que orientan cada proyecto, alianza y programa del ICAP en la región centroamericana. Tocá cada ficha para ver cómo se llevan a la práctica.',
      mission: {
        badge: 'Propósito · 01',
        heading: 'Misión',
        quote:
          'Fortalecer las competencias y capacidades de los Estados y las instituciones por medio de su recurso humano, la modernización de las entidades públicas y el apoyo a la integración centroamericana.',
        pilares: [
          'Desarrollo y formación de competencias directivas en el servicio público.',
          'Modernización e innovación constante en la gestión gubernamental de Centroamérica.',
          'Apoyo activo a la integración y cohesión regional de los países del SICA.'
        ],
        flipLabel: 'Cómo lo cumplimos',
        backBadge: 'Cómo lo cumplimos',
        backHeading: 'En la práctica',
        reverso: [
          'Capacitación ejecutiva y formación continua para el servidor público.',
          'Asesoría técnica especializada a gobiernos e instituciones.',
          'Investigación aplicada a la gestión pública regional.',
          'Cooperación técnica regional e internacional.'
        ],
        footerNote: 'ICAP · Fundado en 1954',
        backLabel: 'Volver'
      },
      vision: {
        badge: 'Horizonte · 02',
        heading: 'Visión',
        quote:
          'Ser la institución del Sistema de la Integración Centroamericana especializada en la gestión pública, que genera conocimiento para las organizaciones y fortalece la gerencia de las políticas públicas a nivel local, nacional y regional, para avanzar hacia el desarrollo sostenible.',
        pilares: [
          'Referente regional e internacional en diseño e implementación de políticas públicas.',
          'Generación de conocimiento aplicado para el fortalecimiento de la gerencia pública.',
          'Impulso al desarrollo sostenible desde lo local, nacional y regional.'
        ],
        flipLabel: 'Compromisos estratégicos',
        backBadge: 'Compromisos estratégicos',
        backHeading: 'Hacia dónde vamos',
        reverso: [
          'Liderazgo regional en el diseño de políticas públicas innovadoras.',
          'Alianzas estratégicas dentro del Sistema de la Integración Centroamericana (SICA).',
          'Contribución activa a los Objetivos de Desarrollo Sostenible (ODS).',
          'Generación de conocimiento aplicado, referente para la región.'
        ],
        footerNote: 'ICAP · SICA',
        backLabel: 'Volver'
      }
    },

    valuesWheel: {
      kicker: 'Nuestra cultura',
      title: 'Valores Institucionales',
      subtitle:
        'Una pequeña galaxia de principios que orbitan el propósito del ICAP: toque cualquier valor para atraerlo al centro.',
      pilarLabel: 'Pilar Institucional',
      footerHint: 'Toca cualquier valor para atraerlo al centro, o dejá que la galaxia gire sola.',
      items: {
        integridad: {
          name: 'Integridad',
          description:
            'Actuamos con ética, honestidad y apego irrestricto a los principios del servicio público y la transparencia.'
        },
        excelencia: {
          name: 'Excelencia',
          description:
            'Buscamos los más altos estándares de calidad técnica, rigor académico e innovación en cada proyecto regional.'
        },
        equipo: {
          name: 'Trabajo en equipo',
          description:
            'Fomentamos la colaboración multidisciplinaria e interinstitucional para alcanzar metas regionales conjuntas.'
        },
        compromiso: {
          name: 'Compromiso',
          description: 'Dedicación total con el desarrollo, bienestar e integración de los pueblos centroamericanos.'
        },
        respeto: {
          name: 'Respeto',
          description: 'Reconocemos y valoramos la diversidad cultural, institucional y humana de nuestra región.'
        },
        transparencia: {
          name: 'Transparencia',
          description:
            'Rendición de cuentas clara, acceso a la información y gestión abierta hacia la ciudadanía y socios.'
        }
      }
    },

    areaLabels: {
      Gobernanza: 'Gobernanza',
      'Proyectos de Inversión': 'Proyectos de Inversión',
      'Formación Continua': 'Formación Continua',
      'Transformación Organizacional': 'Transformación Organizacional',
      Ambiente: 'Ambiente',
      Salud: 'Salud',
      Género: 'Género',
      Seguridad: 'Seguridad',
      Calidad: 'Calidad',
      'Asistencia Técnica': 'Asistencia Técnica'
    },

    regionalMap: {
      kicker: 'Alcance y Territorio',
      title: 'Presencia Regional',
      subtitle:
        'Mapa geográfico a escala real, del istmo centroamericano hasta México, el Caribe y Colombia, con sedes, oficinas nacionales y cobertura del ICAP.',
      mapTitle: 'Cobertura ICAP',
      caribbeanSea: 'Mar Caribe',
      pacificOcean: 'Océano Pacífico',
      mapHint: 'Toca cualquier país en el mapa para seleccionarlo',
      mapFooterTag: 'SICA · ICAP 1954',
      mapLabels: {
        MX: 'MÉXICO',
        GT: 'GT',
        BZ: 'BZ',
        SV: 'SV',
        HN: 'HN',
        NI: 'NI',
        CR: 'CR',
        PA: 'PANAMÁ',
        DO: 'REP. DOMINICANA',
        CO: 'COLOMBIA'
      },
      countryListLabel: 'Listado Oficial de Países (10)',
      countryListHint: 'Los 10 países se ubican en el mapa a escala real',
      sidebarFooterLabel: 'Presencia y Cooperación ICAP',
      institutionalFocusLabel: 'Enfoque Institucional',
      projectCountLabel: 'Cantidad de Proyectos',
      pendingConfirm: 'Pendiente de confirmar',
      documented: 'Documentado en el brochure',
      qtyAbbrev: 'Cant.',
      projectAreasLabel: 'Áreas de Proyecto',
      noAreaRecord: 'Sin registro de área en el brochure de referencia.',
      orgsLabel: 'Organizaciones y Contrapartes',
      noOrgRecord: 'Sin registro de contraparte en el brochure de referencia.',
      officeContactLabel: 'Contacto de oficina · ejemplo',
      countries: {
        CR: {
          name: 'Costa Rica',
          status: 'Sede Central',
          capital: 'San José',
          city: 'San José (Curridabat)',
          description:
            'Sede central directiva del ICAP desde 1954, campus de posgrados internacionales, centro de innovación pública y coordinación regional de cooperación técnica.',
          highlight: 'Sede Central y Campus Académico Principal',
          organizations: ['ICE', 'MIDEPLAN', 'PANI', 'INDER', 'INCOP', 'MINSA', 'ARESEP', 'IMAS', 'Poder Judicial de Costa Rica'],
          dataNote: 'Docenas de proyectos documentados en el brochure · cantidad exacta por confirmar'
        },
        GT: {
          name: 'Guatemala',
          status: 'Sede y Enlace País',
          capital: 'Guatemala',
          city: 'Ciudad de Guatemala',
          description:
            'Oficina nacional de vinculación con ministerios, fortalecimiento institucional y acompañamiento a proyectos de modernización estatal.',
          highlight: 'Programas de Alta Dirección y Enlace Gubernamental',
          organizations: ['Academia de Diplomacia de Guatemala', 'Ministerio de Relaciones Exteriores de Guatemala'],
          dataNote: null
        },
        PA: {
          name: 'Panamá',
          status: 'Centro Regional',
          capital: 'Panama',
          city: 'Ciudad de Panamá',
          description:
            'Centro regional de capacitación técnica, formación ejecutiva y vinculación estratégica con organismos multilaterales de desarrollo.',
          highlight: 'Hub Regional de Capacitación y Cooperación',
          dataNote: 'Sin proyecto nombrado en el brochure de referencia · consta como Estado miembro SICA'
        },
        BZ: {
          name: 'Belice',
          status: 'Estado Miembro SICA',
          capital: 'Belmopan',
          city: 'Belmopán',
          description:
            'Programas de cooperación técnica bilingüe, gestión ambiental, resiliencia climática y formación de cuadros públicos.',
          highlight: 'Cooperación Técnica e Integración Regional',
          dataNote: 'Sin proyecto nombrado en el brochure de referencia · consta como Estado miembro SICA'
        },
        SV: {
          name: 'El Salvador',
          status: 'Estado Miembro SICA',
          capital: 'San Salvador',
          city: 'San Salvador',
          description:
            'Acompañamiento en transformación digital del gobierno, innovación ciudadana y optimización de proyectos de inversión estatal.',
          highlight: 'Transformación Digital y Servicios Ciudadanos',
          dataNote: 'Sin proyecto nombrado en el brochure de referencia · consta como Estado miembro SICA'
        },
        HN: {
          name: 'Honduras',
          status: 'Estado Miembro SICA',
          capital: 'Tegucigalpa',
          city: 'Tegucigalpa',
          description:
            'Fortalecimiento de la gestión en salud pública, programas de posgrado y modernización de la administración territorial.',
          highlight: 'Gerencia en Salud y Políticas Públicas',
          dataNote: 'Sin proyecto nombrado en el brochure de referencia · consta como Estado miembro SICA'
        },
        NI: {
          name: 'Nicaragua',
          status: 'Estado Miembro SICA',
          capital: 'Managua',
          city: 'Managua',
          description:
            'Capacitación en planificación estratégica, gestión por resultados y fortalecimiento de las capacidades del servidor público.',
          highlight: 'Formación y Planificación Estratégica',
          dataNote: 'Sin proyecto nombrado en el brochure de referencia · consta como Estado miembro SICA'
        },
        DO: {
          name: 'Rep. Dominicana',
          status: 'Estado Miembro SICA',
          capital: 'Santo Domingo',
          city: 'Santo Domingo',
          description:
            'Convenios de formación académica superior, compras públicas sostenibles y vinculación caribeña-centroamericana.',
          highlight: 'Alianzas de Posgrado y Contratación Pública',
          organizations: [
            'Organización Panamericana de la Salud (OPS)',
            'Estado de la Nación / CONARE',
            'Banco Interamericano de Desarrollo (BID)',
            'CEPREDENAC'
          ],
          dataNote: 'Proyectos regionales Centroamérica · República Dominicana'
        },
        MX: {
          name: 'México',
          status: 'Cooperación Regional',
          capital: 'Ciudad de México',
          city: 'Ciudad de México',
          description:
            'Convenios de investigación aplicada, intercambio de expertos con instituciones académicas y proyectos mesoamericanos.',
          highlight: 'Alianzas Académicas Mesoamericanas',
          organizations: ['Poder Judicial de Costa Rica'],
          dataNote: 'Proyecto compartido con Costa Rica y Colombia'
        },
        CO: {
          name: 'Colombia',
          status: 'Cooperación Regional',
          capital: 'Bogotá',
          city: 'Bogotá',
          description:
            'Cooperación Sur-Sur en innovación pública, gestión de la seguridad social y transferencia de buenas prácticas.',
          highlight: 'Innovación Pública y Cooperación Sur-Sur',
          organizations: ['Poder Judicial de Costa Rica'],
          dataNote: 'Proyecto compartido con Costa Rica y México'
        }
      }
    },

    docenciaMision: {
      kicker: 'Formación con Visión de Futuro',
      title: 'Conocimiento para Anticipar, Liderar y Transformar',
      subtitle:
        'Las instituciones enfrentan escenarios cada vez más complejos: transformación digital, nuevas demandas ciudadanas, cambios demográficos, desafíos sanitarios, sostenibilidad, innovación tecnológica y evolución de los modelos de gobernanza. Frente a este entorno, el ICAP forma profesionales capaces de interpretar tendencias, anticipar escenarios y transformar conocimiento en decisiones estratégicas. El Departamento de Docencia e Investigación impulsa una formación de posgrado conectada con la realidad regional, la investigación aplicada, la innovación académica y la generación de conocimiento con impacto.',
      // Frase de cierre del bloque de Inicio (FormacionVisionHero.jsx)
      // — antes era la última oración de `subtitle`, pero Yocxany
      // pidió que se destacara aparte, grande, abajo a la derecha,
      // como remate de la sección, en vez de perderse como una
      // oración más dentro del párrafo.
      closing: 'Prepárese para liderar los desafíos del futuro.',
      // Encabezado propio que va arriba del carrusel de cards, en la
      // página dedicada "Formación" del menú (no en el texto de Inicio,
      // que ya tiene su propio kicker/título/subtítulo arriba).
      cardsIntro: {
        kicker: 'Formación con Visión de Futuro',
        text: 'La experiencia académica del ICAP trasciende la adquisición de conocimientos. Promueve capacidades para comprender la complejidad, anticipar escenarios y conducir procesos de transformación en las organizaciones y sociedades de la región.'
      },
      items: {
        prospectiva: {
          name: 'Prospectiva',
          description: 'Interpretar tendencias, identificar señales de cambio y construir escenarios para fortalecer la toma de decisiones.'
        },
        pensamientoEstrategico: {
          name: 'Pensamiento Estratégico',
          description: 'Analizar problemas complejos, reconocer oportunidades y diseñar respuestas con visión de largo plazo.'
        },
        investigacionAplicada: {
          name: 'Investigación Aplicada',
          description: 'Transformar datos, evidencia y conocimiento científico en soluciones para desafíos reales.'
        },
        innovacionDigital: {
          name: 'Innovación y Transformación Digital',
          description: 'Incorporar nuevas metodologías, tecnologías emergentes e inteligencia artificial de manera estratégica, crítica y responsable.'
        },
        liderazgo: {
          name: 'Liderazgo',
          description: 'Fortalecer capacidades para impulsar cambios, articular actores y orientar organizaciones hacia resultados.'
        },
        visionRegional: {
          name: 'Visión Regional',
          description: 'Comprender los desafíos nacionales desde una perspectiva centroamericana, comparada y global.'
        },
        aprendizajeAplicado: {
          name: 'Aprendizaje Aplicado',
          description: 'Conectar la formación académica con situaciones concretas, experiencias profesionales y necesidades institucionales.'
        }
      }
    },

    docenciaImpacto: {
      kicker: 'Formación para Generar Impacto',
      title: 'La Experiencia ICAP Integra',
      subtitle:
        'Nuestros programas están orientados a profesionales que buscan fortalecer su perfil, asumir nuevas responsabilidades y ampliar su capacidad para incidir en organizaciones, políticas públicas y procesos de desarrollo.',
      items: {
        conocimientoEspecializado: {
          name: 'Conocimiento Especializado',
          description: 'Formación vinculada con los principales desafíos de la gestión contemporánea.'
        },
        aplicacionPractica: {
          name: 'Aplicación Práctica',
          description: 'Herramientas para abordar problemas reales desde el ejercicio profesional.'
        },
        investigacion: {
          name: 'Investigación',
          description: 'Capacidad para producir, interpretar y utilizar evidencia.'
        },
        redesRegionales: {
          name: 'Redes Regionales',
          description: 'Intercambio de experiencias con profesionales de distintos países, disciplinas e instituciones.'
        },
        innovacion: {
          name: 'Innovación',
          description: 'Nuevas perspectivas para modernizar organizaciones y fortalecer la gestión.'
        }
      },
      tagline: 'Más que obtener un posgrado, se trata de ampliar su capacidad para transformar.'
    },

    docenciaInvestigacion: {
      kicker: 'Investigación',
      title: 'Comprender el Presente y Construir Futuro',
      paragraphs: [
        'La investigación constituye un componente estratégico de la experiencia académica del ICAP.',
        'Se promueve una producción de conocimiento vinculada con los desafíos de las instituciones, las políticas públicas y el desarrollo regional, con énfasis en su aplicación y utilidad para la toma de decisiones.'
      ],
      fieldsLabel: 'Campos de interés',
      fields: [
        'Gobernanza',
        'Políticas públicas',
        'Prospectiva',
        'Innovación pública',
        'Transformación digital',
        'Salud',
        'Epidemiología',
        'Gestión de proyectos',
        'Calidad institucional',
        'Energía',
        'Desarrollo sostenible',
        'Integración centroamericana'
      ],
      closing:
        'La investigación permite pasar de la información al conocimiento, del conocimiento a la evidencia y de la evidencia a mejores decisiones.',
      tagline: 'Investigar para comprender. Comprender para transformar.'
    },

    docenciaPublicaciones: {
      kicker: 'Ecosistemas Regionales del Conocimiento',
      title: 'Alianzas Interactivas',
      subtitle:
        'El conocimiento producido en el ICAP trasciende el aula. La formación académica se articula con investigación, publicación científica, divulgación y acceso abierto, fortaleciendo la circulación del conocimiento en Centroamérica.',
      items: {
        rcap: {
          name: 'Revista Centroamericana de Administración Pública',
          description:
            'La RCAP, existente desde 1981, constituye un espacio científico especializado para el análisis de la administración pública, la gobernanza, las políticas públicas y los desafíos del desarrollo regional. Su carácter académico permite proyectar investigaciones, reflexiones y experiencias relevantes para la gestión pública centroamericana.'
        },
        cuadernos: {
          name: 'Cuadernos Centroamericanos',
          description: 'Publicación orientada a difundir investigación aplicada, análisis académico y aportes sobre temas estratégicos para Centroamérica.'
        },
        editorial: {
          name: 'Editorial ICAP',
          description: 'Producción especializada que contribuye al debate académico y a la generación de conocimiento sobre gestión pública, integración y desarrollo regional.'
        },
        yaxche: {
          name: 'Repositorio Institucional Yaxché',
          description:
            'Yaxché preserva, organiza y facilita el acceso a la producción académica, científica y editorial del Instituto. Integra Trabajos Finales de Graduación, publicaciones de la RCAP, Cuadernos Centroamericanos, libros y otros productos de conocimiento generados desde la comunidad académica del ICAP.'
        }
      },
      tagline: 'Investigar – Publicar – Divulgar – Compartir – Socializar – Transferir – Transformar'
    },

    docenciaAreas: {
      kicker: 'Nuestra Oferta',
      title: 'Áreas para los Desafíos del Presente y del Futuro',
      subtitle:
        'La oferta académica del ICAP evoluciona de acuerdo con las necesidades de las instituciones y las transformaciones del entorno.',
      // Aviso bajo la tarjeta de adelante del mazo (DocenciaAreasWheel.jsx)
      // — mismo espíritu que el "↩ Tap to explore" de la referencia de
      // Miu Miu que pasó Yocxany, para avisar que la tarjeta se puede
      // tocar y "pasar" a la siguiente.
      tapHint: 'Tocá para explorar',
      items: {
        integracionRegional: {
          name: 'Integración Regional',
          description: 'Gobernanza y mejoras regulatorias para fortalecer la integración centroamericana.'
        },
        politicasPublicas: {
          name: 'Políticas Públicas',
          description: 'Diseño, análisis e implementación de políticas públicas con impacto regional.'
        },
        gestionPredictiva: {
          name: 'Gestión Pública Predictiva',
          description: 'Uso de datos y evidencia para anticipar escenarios en la gestión pública.'
        },
        gerenciaProyectos: {
          name: 'Gerencia de Proyectos',
          description: 'Formulación, dirección y evaluación de proyectos institucionales.'
        },
        transformacionDigital: {
          name: 'Transformación Digital',
          description: 'Incorporación estratégica de tecnología e inteligencia artificial en la gestión.'
        },
        innovacionInstitucional: {
          name: 'Innovación Institucional',
          description: 'Nuevas perspectivas para modernizar organizaciones y fortalecer su gestión.'
        },
        calidad: {
          name: 'Calidad',
          description: 'Sistemas y certificaciones para fortalecer la calidad institucional.'
        },
        saludPublica: {
          name: 'Salud Pública',
          description: 'Gestión y políticas orientadas al fortalecimiento de los sistemas de salud.'
        },
        epidemiologia: {
          name: 'Epidemiología',
          description: 'Análisis e interpretación de evidencia epidemiológica para la toma de decisiones.'
        },
        regulacionEnergia: {
          name: 'Regulación Sector Energía',
          description: 'Marcos regulatorios y gestión estratégica del sector energético.'
        },
        investigacionAplicada: {
          name: 'Investigación Aplicada',
          description: 'Producción de conocimiento vinculado a los desafíos institucionales y regionales.'
        },
        modernizacionOrganizacional: {
          name: 'Modernización Organizacional',
          description: 'Procesos de cambio orientados a fortalecer la capacidad institucional.'
        }
      }
    },

    docenciaComunidad: {
      kicker: 'Alcance Regional',
      title: 'Una Comunidad Académica Centroamericana',
      paragraphs: [
        'Estudiar en el ICAP significa integrarse a una comunidad regional donde convergen profesionales, docentes, investigadores, especialistas y tomadores de decisión.',
        'Esta diversidad permite enriquecer el aprendizaje mediante el intercambio de experiencias, realidades institucionales y perspectivas provenientes de distintos países de Centroamérica.',
        'La dimensión regional constituye uno de los principales elementos diferenciadores de la experiencia ICAP: una formación que permite comprender lo nacional, dialogar con lo regional y actuar frente a desafíos globales.'
      ]
    },

    allies: {
      kicker: 'Red Institucional',
      title: 'Organismos y Socios de Cooperación',
      subtitle: 'Tocá una institución para ver los proyectos que ha trabajado en conjunto con el ICAP.',
      modalSubtitle: 'Organismo Aliado',
      noProjectRecord: 'Sin registro de proyectos conjuntos documentados en el brochure de referencia.',
      projectAreasLabel: 'Áreas de Proyecto',
      noAreaRecord: 'Sin registro de área en el brochure de referencia.',
      items: {
        sica: { name: 'SICA', label: 'Sistema de la Integración Centroamericana', description: null, countryNote: null },
        'ops-oms': {
          name: 'OPS / OMS',
          label: 'Organización Panamericana de la Salud',
          description:
            'Diplomado en gestión de recursos humanos en salud, desarrollado en conjunto con República Dominicana.',
          countryNote: 'República Dominicana'
        },
        bid: {
          name: 'BID',
          label: 'Banco Interamericano de Desarrollo',
          description:
            'Proyectos de adaptación al cambio climático y blindaje climático, junto con CEPREDENAC, en República Dominicana.',
          countryNote: 'República Dominicana'
        },
        flacso: {
          name: 'FLACSO',
          label: 'Facultad Latinoamericana de Ciencias Sociales',
          description: null,
          countryNote: null
        },
        bcie: {
          name: 'BCIE',
          label: 'Banco Centroamericano de Integración Económica',
          description: null,
          countryNote: null
        },
        cepal: { name: 'CEPAL', label: 'Comisión Económica para América Latina', description: null, countryNote: null },
        aecid: { name: 'AECID', label: 'Agencia Española de Cooperación', description: null, countryNote: null },
        oea: { name: 'OEA', label: 'Organización de los Estados Americanos', description: null, countryNote: null }
      }
    },

    contact: {
      kicker: 'Hablemos',
      title: 'Ficha de Contacto',
      subtitle: 'Punto de contacto oficial para proyectos, posgrados y cooperación institucional.',
      sampleTag: 'Dato de ejemplo',
      repTag: 'Representante ICAP',
      hqLine: 'ICAP · Sede Central',
      whatsapp: 'WhatsApp Directo',
      email: 'Enviar Correo',
      linkedin: 'Perfil LinkedIn',
      schedule: 'Agendar una Cita',
      saveHint: 'Descarga la tarjeta digital (.vcf) directamente en tu agenda de contactos.',
      footerLine: 'ICAP · San José, Costa Rica · SICA',
      whatsappMessage: (name) => `Hola ${name}, te contacto desde el brochure ICAP.`,
      scheduleModalTitle: 'Agendar Reunión',
      scheduleModalSubtitle: 'Coordinación Institucional',
      scheduleModalText:
        'Selecciona el canal que prefieras para coordinar una sesión presencial o virtual con el representante de ICAP.',
      viaWhatsapp: 'Coordinar vía WhatsApp',
      viaEmail: 'Solicitar por Correo Electrónico',
      scheduleWhatsappMessage: 'Hola, me gustaría agendar una reunión con el ICAP.'
    },

    aboutModal: {
      title: 'Acerca del ICAP',
      subtitle: 'Organismo Internacional del SICA',
      // Contenido redactado a partir de la página "Presentación" y del
      // "Resumen Estratégico" del brochure institucional 2026 — nada
      // inventado: los 4 datos de las tarjetas y el cierre sobre el
      // modelo educativo vienen directo de ahí.
      intro:
        'El Instituto Centroamericano de Administración Pública (ICAP) es un organismo internacional del Sistema de la Integración Centroamericana (SICA), fundado en 1954, especializado en administración pública y en el fortalecimiento de capacidades del sector público en la región centroamericana. Su objetivo principal es promover una gestión pública eficiente, transparente y orientada al servicio.',
      cards: [
        {
          title: '70 Años de Trayectoria',
          text: 'Referente regional en buen gobierno, ética pública, transparencia, innovación y modernización del Estado.'
        },
        {
          title: 'Oferta de Posgrado',
          text: 'Doctorados, maestrías, micro másters y especializaciones orientados a la gestión pública.'
        },
        {
          title: 'Alianzas con Organismos Clave',
          text: 'Coopera con instituciones como el BID, el Banco Mundial, la OIT, UNESCO y UNICEF, entre otras agencias de cooperación internacional.'
        },
        {
          title: 'Sede Central en Costa Rica',
          text: 'Ubicada en Curridabat, San José, con proyectos en toda Centroamérica, República Dominicana, México y Colombia.'
        }
      ],
      outro:
        'Su modelo educativo pone al estudiante como protagonista de la construcción de su propio conocimiento, combinando aportes de las corrientes conductista, cognitiva y constructivista para formar liderazgo público con impacto real en la región.',
      visitLink: 'Visitar portal web oficial ICAP',
      close: 'Cerrar'
    },

    vcard: {
      firstName: 'Nombre',
      lastName: 'del Contacto',
      fullName: 'Nombre del Contacto',
      title: 'Cargo Institucional',
      notes:
        'Organismo internacional del Sistema de la Integración Centroamericana (SICA) especializado en administración pública.',
      pillLabel: 'Guardar contacto',
      primaryLabel: 'GUARDAR CONTACTO'
    }
  },

  en: {
    common: {
      close: 'Close'
    },

    header: {
      subtitle: 'Institutional Brochure',
      home: 'Go to home',
      fullView: 'Full View',
      mobileView: 'Mobile View (390px)',
      about: 'About ICAP',
      contact: 'Contact Us',
      language: 'Switch language',
      theme: 'Switch light/dark theme',
      settings: 'Settings',
      settingsView: 'View',
      settingsLanguage: 'Language',
      settingsTheme: 'Theme',
      viewFullShort: 'Full',
      viewMobileShort: 'Mobile',
      themeLight: 'Light',
      themeDark: 'Dark',
      deptAT: 'Technical Assistance',
      deptDocencia: 'Teaching'
    },

    nav: {
      inicio: 'Home',
      mision: 'Mission',
      valores: 'Values',
      autoridades: 'Leadership',
      areas: 'Focus Areas',
      presencia: 'Presence',
      contacto: 'Contact',
      docenciaMision: 'Training',
      docenciaImpacto: 'Impact',
      docenciaInvestigacion: 'Research',
      docenciaPublicaciones: 'Publications',
      docenciaAreas: 'Areas'
    },

    sectionsStrip: {
      kicker: 'Quick Navigation'
    },

    hero: {
      badge: 'ICAP · Founded in 1954',
      title: 'ICAP',
      subtitle: 'Central American Institute of Public Administration',
      description:
        'A regional SICA body specialized in institutional modernization, public policy management, and human talent development.',
      ctaAbout: 'ABOUT ICAP',
      ctaContact: 'CONTACT US',
      scrollHint: 'Discover more'
    },

    stats: {
      kicker: 'Track Record & Impact',
      title: 'ICAP by the Numbers',
      badge: 'Official figures · ICAP Strategic Summary',
      items: {
        proyectos: { label: 'Projects', sublabel: 'completed' },
        clientes: { label: 'Clients', sublabel: 'institutional' },
        paises: { label: 'Countries', sublabel: 'served' }
      }
    },

    specializationAreas: {
      kicker: 'Expertise & Offerings',
      title: 'Areas of Specialization',
      subtitle: "ICAP's six areas of specialization, per its 2026 institutional offering, each with a cross-cutting gender focus.",
      generoNote: 'Gender is a cross-cutting theme running through all six areas of specialization.',
      items: {
        salud: {
          title: 'Health and Social Security',
          tag: 'Hospital management, epidemiology, and social security',
          longDesc: "According to ICAP's 2026 institutional offering, this area covers:",
          shortDesc:
            'ICAP strengthens hospital and emergency management in the health sector. ' +
            'It also advises on pensions, occupational health, and epidemiology. ' +
            'Its focus is on more efficient health systems with broader coverage.',
          highlights: ['Hospital Management', 'Epidemiology', 'Pensions'],
          points: [
            'Hospital Management',
            'Epidemiology',
            'Emergency services management',
            'Migration and health',
            'Pensions',
            'Occupational health',
            'Health services'
          ]
        },
        calidad: {
          title: 'Quality',
          tag: 'Quality systems, information, and institutional certifications',
          longDesc: "According to ICAP's 2026 institutional offering, this area covers:",
          shortDesc:
            'ICAP helps institutions build institutional quality systems. ' +
            'It designs information and measurement mechanisms to support decision-making. ' +
            'It also supports certification processes under recognized standards.',
          highlights: ['Institutional quality', 'Quality systems', 'Certifications'],
          points: [
            'Institutional quality',
            'Information and measurement systems',
            'Quality systems',
            'Certifications'
          ]
        },
        proyectos: {
          title: 'Projects',
          tag: 'Project formulation, feasibility, and certification',
          longDesc: "According to ICAP's 2026 institutional offering, this area covers:",
          shortDesc:
            "ICAP supports a project's entire life cycle, starting with its formulation. " +
            'It carries out pre-feasibility and feasibility studies to back investment decisions. ' +
            'It also offers project certification processes.',
          highlights: ['Project formulation', 'Feasibility studies', 'Certifications'],
          points: [
            'Project formulation',
            'Feasibility studies',
            'Pre-feasibility studies',
            'Certifications'
          ]
        },
        gobernanza: {
          title: 'Governance',
          tag: 'Modernization, public policy, and citizen participation',
          longDesc: "According to ICAP's 2026 institutional offering, this area covers:",
          shortDesc:
            'ICAP advises on state modernization and reform processes. ' +
            'It supports public policy design and strengthening citizen participation. ' +
            'It also works on digital governance and local governments.',
          highlights: ['Modernization and reform', 'Public Policy', 'Citizen participation'],
          points: [
            'Modernization and reform',
            'Public Policy',
            'Planning',
            'Citizen participation',
            'Management, Transparency, and Open Government',
            'Digital Governance',
            'Public Investment',
            'Local governments'
          ]
        },
        transformacion: {
          title: 'Organizational Transformation',
          tag: 'Organizational design, processes, and job profiles',
          longDesc: "According to ICAP's 2026 institutional offering, this area covers:",
          shortDesc:
            'ICAP supports the design and reengineering of organizational structures. ' +
            'It helps improve internal processes and procedures. ' +
            'It also advises on defining job profiles and workloads.',
          highlights: ['Organizational design and reengineering', 'Processes and procedures', 'Job profiles, positions, and workloads'],
          points: [
            'Organizational design and reengineering',
            'Processes and procedures',
            'Job profiles, positions, and workloads'
          ]
        },
        ambiente: {
          title: 'Environment and Energy',
          tag: 'Climate change, environmental management, and energy regulation',
          longDesc: "According to ICAP's 2026 institutional offering, this area covers:",
          shortDesc:
            'ICAP supports climate change adaptation and mitigation. ' +
            'It advises on environmental management and energy regulation. ' +
            'It also works on risk and disaster management.',
          highlights: ['Climate Change', 'Environmental management', 'Energy regulation'],
          points: [
            'Climate Change',
            'Environmental management',
            'Energy regulation',
            'Risk and disaster management'
          ]
        }
      }
    },

    authorities: {
      kicker: 'Institutional Leadership',
      title: 'Leadership',
      subtitle: "ICAP's executive team and authorities.",
      notice:
        'Section under construction · the spaces below will be filled in with names, titles, and official photos once confirmed.',
      namePending: 'Name pending',
      titlePending: 'Title pending',
      tbd: 'To be defined'
    },

    missionVision: {
      kicker: 'Who we are',
      title: 'Mission & Vision',
      subtitle:
        "The two pillars that guide every ICAP project, partnership, and program across the Central American region. Tap each card to see how they're put into practice.",
      mission: {
        badge: 'Purpose · 01',
        heading: 'Mission',
        quote:
          'To strengthen the competencies and capacities of States and institutions through their human resources, the modernization of public entities, and support for Central American integration.',
        pilares: [
          'Development and training of managerial competencies in the public service.',
          "Continuous modernization and innovation in Central America's government management.",
          'Active support for the regional integration and cohesion of SICA countries.'
        ],
        flipLabel: 'How we deliver on it',
        backBadge: 'How we deliver on it',
        backHeading: 'In practice',
        reverso: [
          'Executive training and continuing education for public servants.',
          'Specialized technical advisory services for governments and institutions.',
          'Applied research on regional public management.',
          'Regional and international technical cooperation.'
        ],
        footerNote: 'ICAP · Founded in 1954',
        backLabel: 'Back'
      },
      vision: {
        badge: 'Horizon · 02',
        heading: 'Vision',
        quote:
          'To be the specialized institution of the Central American Integration System for public management, generating knowledge for organizations and strengthening public policy management at the local, national, and regional levels, to advance toward sustainable development.',
        pilares: [
          'A regional and international benchmark in the design and implementation of public policy.',
          'Generation of applied knowledge to strengthen public management.',
          'Driving sustainable development from the local to the national and regional levels.'
        ],
        flipLabel: 'Strategic commitments',
        backBadge: 'Strategic commitments',
        backHeading: 'Where we are headed',
        reverso: [
          'Regional leadership in designing innovative public policy.',
          'Strategic partnerships within the Central American Integration System (SICA).',
          'Active contribution to the Sustainable Development Goals (SDGs).',
          'Generation of applied knowledge as a benchmark for the region.'
        ],
        footerNote: 'ICAP · SICA',
        backLabel: 'Back'
      }
    },

    valuesWheel: {
      kicker: 'Our culture',
      title: 'Institutional Values',
      subtitle: "A small galaxy of principles orbiting ICAP's purpose: tap any value to draw it to the center.",
      pilarLabel: 'Institutional Pillar',
      footerHint: 'Tap any value to draw it to the center, or let the galaxy spin on its own.',
      items: {
        integridad: {
          name: 'Integrity',
          description:
            'We act with ethics, honesty, and an unwavering commitment to the principles of public service and transparency.'
        },
        excelencia: {
          name: 'Excellence',
          description:
            'We pursue the highest standards of technical quality, academic rigor, and innovation in every regional project.'
        },
        equipo: {
          name: 'Teamwork',
          description:
            'We foster multidisciplinary and inter-institutional collaboration to achieve shared regional goals.'
        },
        compromiso: {
          name: 'Commitment',
          description: 'Full dedication to the development, well-being, and integration of the Central American peoples.'
        },
        respeto: {
          name: 'Respect',
          description: "We recognize and value our region's cultural, institutional, and human diversity."
        },
        transparencia: {
          name: 'Transparency',
          description: 'Clear accountability, access to information, and open management toward citizens and partners.'
        }
      }
    },

    areaLabels: {
      Gobernanza: 'Governance',
      'Proyectos de Inversión': 'Investment Projects',
      'Formación Continua': 'Continuing Education',
      'Transformación Organizacional': 'Organizational Transformation',
      Ambiente: 'Environment',
      Salud: 'Health',
      Género: 'Gender',
      Seguridad: 'Security',
      Calidad: 'Quality',
      'Asistencia Técnica': 'Technical Assistance'
    },

    regionalMap: {
      kicker: 'Reach & Territory',
      title: 'Regional Presence',
      subtitle:
        'A true-to-scale geographic map, from the Central American isthmus to Mexico, the Caribbean, and Colombia, showing headquarters, national offices, and ICAP coverage.',
      mapTitle: 'ICAP Coverage',
      caribbeanSea: 'Caribbean Sea',
      pacificOcean: 'Pacific Ocean',
      mapHint: 'Tap any country on the map to select it',
      mapFooterTag: 'SICA · ICAP 1954',
      mapLabels: {
        MX: 'MEXICO',
        GT: 'GT',
        BZ: 'BZ',
        SV: 'SV',
        HN: 'HN',
        NI: 'NI',
        CR: 'CR',
        PA: 'PANAMA',
        DO: 'DOM. REP.',
        CO: 'COLOMBIA'
      },
      countryListLabel: 'Official Country List (10)',
      countryListHint: 'All 10 countries are placed on the map to true scale',
      sidebarFooterLabel: 'ICAP Presence & Cooperation',
      institutionalFocusLabel: 'Institutional Focus',
      projectCountLabel: 'Number of Projects',
      pendingConfirm: 'Pending confirmation',
      documented: 'Documented in the brochure',
      qtyAbbrev: 'Qty.',
      projectAreasLabel: 'Project Areas',
      noAreaRecord: 'No area on record in the reference brochure.',
      orgsLabel: 'Organizations & Counterparts',
      noOrgRecord: 'No counterpart on record in the reference brochure.',
      officeContactLabel: 'Office contact · sample',
      countries: {
        CR: {
          name: 'Costa Rica',
          status: 'Headquarters',
          capital: 'San José',
          city: 'San José (Curridabat)',
          description:
            "ICAP's executive headquarters since 1954, an international graduate-studies campus, a hub for public innovation, and regional coordination of technical cooperation.",
          highlight: 'Headquarters and Main Academic Campus',
          organizations: ['ICE', 'MIDEPLAN', 'PANI', 'INDER', 'INCOP', 'MINSA', 'ARESEP', 'IMAS', 'Judicial Branch of Costa Rica'],
          dataNote: 'Dozens of projects documented in the brochure · exact count to be confirmed'
        },
        GT: {
          name: 'Guatemala',
          status: 'Country Office & Liaison',
          capital: 'Guatemala City',
          city: 'Guatemala City',
          description:
            'National liaison office with ministries, institutional strengthening, and support for state modernization projects.',
          highlight: 'Executive Leadership Programs and Government Liaison',
          organizations: ['Diplomatic Academy of Guatemala', 'Ministry of Foreign Affairs of Guatemala'],
          dataNote: null
        },
        PA: {
          name: 'Panama',
          status: 'Regional Center',
          capital: 'Panama',
          city: 'Panama City',
          description:
            'Regional center for technical training, executive education, and strategic engagement with multilateral development organizations.',
          highlight: 'Regional Training and Cooperation Hub',
          dataNote: 'No named project in the reference brochure · listed as a SICA member state'
        },
        BZ: {
          name: 'Belize',
          status: 'SICA Member State',
          capital: 'Belmopan',
          city: 'Belmopan',
          description:
            'Bilingual technical cooperation programs, environmental management, climate resilience, and training for public-sector personnel.',
          highlight: 'Technical Cooperation and Regional Integration',
          dataNote: 'No named project in the reference brochure · listed as a SICA member state'
        },
        SV: {
          name: 'El Salvador',
          status: 'SICA Member State',
          capital: 'San Salvador',
          city: 'San Salvador',
          description:
            'Support for digital government transformation, citizen innovation, and optimization of state investment projects.',
          highlight: 'Digital Transformation and Citizen Services',
          dataNote: 'No named project in the reference brochure · listed as a SICA member state'
        },
        HN: {
          name: 'Honduras',
          status: 'SICA Member State',
          capital: 'Tegucigalpa',
          city: 'Tegucigalpa',
          description:
            'Strengthening public health management, graduate programs, and modernization of territorial administration.',
          highlight: 'Health Management and Public Policy',
          dataNote: 'No named project in the reference brochure · listed as a SICA member state'
        },
        NI: {
          name: 'Nicaragua',
          status: 'SICA Member State',
          capital: 'Managua',
          city: 'Managua',
          description:
            'Training in strategic planning, results-based management, and strengthening the capacities of public servants.',
          highlight: 'Training and Strategic Planning',
          dataNote: 'No named project in the reference brochure · listed as a SICA member state'
        },
        DO: {
          name: 'Dominican Rep.',
          status: 'SICA Member State',
          capital: 'Santo Domingo',
          city: 'Santo Domingo',
          description:
            'Higher academic training agreements, sustainable public procurement, and Caribbean–Central American engagement.',
          highlight: 'Graduate Partnerships and Public Procurement',
          organizations: [
            'Pan American Health Organization (PAHO)',
            'Estado de la Nación / CONARE',
            'Inter-American Development Bank (IDB)',
            'CEPREDENAC'
          ],
          dataNote: 'Regional projects · Central America and the Dominican Republic'
        },
        MX: {
          name: 'Mexico',
          status: 'Regional Cooperation',
          capital: 'Mexico City',
          city: 'Mexico City',
          description:
            'Applied research agreements, expert exchanges with academic institutions, and Mesoamerican projects.',
          highlight: 'Mesoamerican Academic Partnerships',
          organizations: ['Judicial Branch of Costa Rica'],
          dataNote: 'Project shared with Costa Rica and Colombia'
        },
        CO: {
          name: 'Colombia',
          status: 'Regional Cooperation',
          capital: 'Bogotá',
          city: 'Bogotá',
          description:
            'South-South cooperation in public innovation, social security management, and the transfer of best practices.',
          highlight: 'Public Innovation and South-South Cooperation',
          organizations: ['Judicial Branch of Costa Rica'],
          dataNote: 'Project shared with Costa Rica and Mexico'
        }
      }
    },

    docenciaMision: {
      kicker: 'Education with a Vision for the Future',
      title: 'Knowledge to Anticipate, Lead, and Transform',
      subtitle:
        'Institutions face increasingly complex scenarios: digital transformation, new citizen demands, demographic shifts, health challenges, sustainability, technological innovation, and evolving governance models. In this environment, ICAP trains professionals capable of interpreting trends, anticipating scenarios, and turning knowledge into strategic decisions. The Department of Teaching and Research drives graduate-level education connected to regional realities, applied research, academic innovation, and the generation of knowledge with impact.',
      // Closing line for the Inicio block (FormacionVisionHero.jsx) —
      // used to be the last sentence of `subtitle`, split out so it
      // can be shown large, bottom-right, as the section's closing
      // statement instead of blending into the paragraph.
      closing: 'Get ready to lead the challenges of the future.',
      // Heading shown above the cards carousel on the dedicated
      // "Formación" (Training) menu page — not on the Inicio text,
      // which already has its own kicker/title/subtitle above.
      cardsIntro: {
        kicker: 'Education with a Vision for the Future',
        text: "ICAP's academic experience goes beyond acquiring knowledge. It builds capacities to understand complexity, anticipate scenarios, and lead transformation processes in organizations and societies across the region."
      },
      items: {
        prospectiva: {
          name: 'Foresight',
          description: 'Interpreting trends, identifying signals of change, and building scenarios to strengthen decision-making.'
        },
        pensamientoEstrategico: {
          name: 'Strategic Thinking',
          description: 'Analyzing complex problems, recognizing opportunities, and designing long-term responses.'
        },
        investigacionAplicada: {
          name: 'Applied Research',
          description: 'Turning data, evidence, and scientific knowledge into solutions for real challenges.'
        },
        innovacionDigital: {
          name: 'Innovation and Digital Transformation',
          description: 'Incorporating new methodologies, emerging technologies, and artificial intelligence strategically, critically, and responsibly.'
        },
        liderazgo: {
          name: 'Leadership',
          description: 'Strengthening capacities to drive change, engage stakeholders, and steer organizations toward results.'
        },
        visionRegional: {
          name: 'Regional Vision',
          description: 'Understanding national challenges from a Central American, comparative, and global perspective.'
        },
        aprendizajeAplicado: {
          name: 'Applied Learning',
          description: 'Connecting academic training with real situations, professional experience, and institutional needs.'
        }
      }
    },

    docenciaImpacto: {
      kicker: 'Education that Drives Impact',
      title: 'What the ICAP Experience Includes',
      subtitle:
        'Our programs are designed for professionals who want to strengthen their profile, take on new responsibilities, and expand their ability to influence organizations, public policy, and development processes.',
      items: {
        conocimientoEspecializado: {
          name: 'Specialized Knowledge',
          description: 'Training linked to the main challenges of contemporary management.'
        },
        aplicacionPractica: {
          name: 'Practical Application',
          description: 'Tools to address real problems from professional practice.'
        },
        investigacion: {
          name: 'Research',
          description: 'The ability to produce, interpret, and use evidence.'
        },
        redesRegionales: {
          name: 'Regional Networks',
          description: 'Exchange of experience with professionals from different countries, disciplines, and institutions.'
        },
        innovacion: {
          name: 'Innovation',
          description: 'New perspectives to modernize organizations and strengthen management.'
        }
      },
      tagline: "It's not just about earning a graduate degree — it's about expanding your capacity to transform."
    },

    docenciaInvestigacion: {
      kicker: 'Research',
      title: 'Understanding the Present, Building the Future',
      paragraphs: [
        "Research is a strategic component of ICAP's academic experience.",
        'Knowledge production is linked to the challenges facing institutions, public policy, and regional development, with an emphasis on its application and usefulness for decision-making.'
      ],
      fieldsLabel: 'Fields of interest',
      fields: [
        'Governance',
        'Public policy',
        'Foresight',
        'Public innovation',
        'Digital transformation',
        'Health',
        'Epidemiology',
        'Project management',
        'Institutional quality',
        'Energy',
        'Sustainable development',
        'Central American integration'
      ],
      closing:
        'Research makes it possible to move from information to knowledge, from knowledge to evidence, and from evidence to better decisions.',
      tagline: 'Research to understand. Understand to transform.'
    },

    docenciaPublicaciones: {
      kicker: 'Regional Knowledge Ecosystems',
      title: 'Interactive Alliances',
      subtitle:
        'Knowledge produced at ICAP goes beyond the classroom. Academic training is linked to research, scientific publishing, outreach, and open access, strengthening the flow of knowledge across Central America.',
      items: {
        rcap: {
          name: 'Central American Journal of Public Administration',
          description:
            'The RCAP, published since 1981, is a specialized scientific space for analyzing public administration, governance, public policy, and regional development challenges. Its academic standing showcases research, reflections, and experiences relevant to Central American public management.'
        },
        cuadernos: {
          name: 'Cuadernos Centroamericanos',
          description: 'A publication dedicated to disseminating applied research, academic analysis, and contributions on strategic topics for Central America.'
        },
        editorial: {
          name: 'ICAP Editorial',
          description: 'Specialized production that contributes to academic debate and knowledge generation on public management, integration, and regional development.'
        },
        yaxche: {
          name: 'Yaxché Institutional Repository',
          description:
            "Yaxché preserves, organizes, and provides access to the Institute's academic, scientific, and editorial output. It brings together graduation theses, RCAP publications, Cuadernos Centroamericanos, books, and other knowledge products generated by the ICAP academic community."
        }
      },
      tagline: 'Research – Publish – Share – Disseminate – Socialize – Transfer – Transform'
    },

    docenciaAreas: {
      kicker: 'Our Offering',
      title: "Areas for Today's and Tomorrow's Challenges",
      subtitle:
        "ICAP's academic offering evolves alongside the needs of institutions and a changing environment.",
      tapHint: 'Tap to explore',
      items: {
        integracionRegional: {
          name: 'Regional Integration',
          description: 'Governance and regulatory improvements that strengthen Central American integration.'
        },
        politicasPublicas: {
          name: 'Public Policy',
          description: 'Design, analysis, and implementation of public policy with regional impact.'
        },
        gestionPredictiva: {
          name: 'Predictive Public Management',
          description: 'Using data and evidence to anticipate scenarios in public management.'
        },
        gerenciaProyectos: {
          name: 'Project Management',
          description: 'Formulation, direction, and evaluation of institutional projects.'
        },
        transformacionDigital: {
          name: 'Digital Transformation',
          description: 'Strategic incorporation of technology and artificial intelligence into management.'
        },
        innovacionInstitucional: {
          name: 'Institutional Innovation',
          description: 'New perspectives to modernize organizations and strengthen their management.'
        },
        calidad: {
          name: 'Quality',
          description: 'Systems and certifications that strengthen institutional quality.'
        },
        saludPublica: {
          name: 'Public Health',
          description: 'Management and policy aimed at strengthening health systems.'
        },
        epidemiologia: {
          name: 'Epidemiology',
          description: 'Analysis and interpretation of epidemiological evidence for decision-making.'
        },
        regulacionEnergia: {
          name: 'Energy Sector Regulation',
          description: 'Regulatory frameworks and strategic management of the energy sector.'
        },
        investigacionAplicada: {
          name: 'Applied Research',
          description: 'Knowledge production linked to institutional and regional challenges.'
        },
        modernizacionOrganizacional: {
          name: 'Organizational Modernization',
          description: 'Change processes aimed at strengthening institutional capacity.'
        }
      }
    },

    docenciaComunidad: {
      kicker: 'Regional Reach',
      title: 'A Central American Academic Community',
      paragraphs: [
        'Studying at ICAP means joining a regional community where professionals, faculty, researchers, specialists, and decision-makers converge.',
        'This diversity enriches learning through the exchange of experiences, institutional realities, and perspectives from across Central America.',
        'The regional dimension is one of the defining features of the ICAP experience: an education that lets you understand the national context, engage with the regional one, and act on global challenges.'
      ]
    },

    allies: {
      kicker: 'Institutional Network',
      title: 'Partner Organizations & Cooperation Agencies',
      subtitle: 'Tap an institution to see the projects it has carried out together with ICAP.',
      modalSubtitle: 'Partner Organization',
      noProjectRecord: 'No joint projects on record in the reference brochure.',
      projectAreasLabel: 'Project Areas',
      noAreaRecord: 'No area on record in the reference brochure.',
      items: {
        sica: { name: 'SICA', label: 'Central American Integration System', description: null, countryNote: null },
        'ops-oms': {
          name: 'PAHO / WHO',
          label: 'Pan American Health Organization',
          description:
            'A diploma program in health-sector human resources management, developed jointly with the Dominican Republic.',
          countryNote: 'Dominican Republic'
        },
        bid: {
          name: 'IDB',
          label: 'Inter-American Development Bank',
          description:
            'Climate change adaptation and climate-proofing projects, together with CEPREDENAC, in the Dominican Republic.',
          countryNote: 'Dominican Republic'
        },
        flacso: {
          name: 'FLACSO',
          label: 'Latin American Faculty of Social Sciences',
          description: null,
          countryNote: null
        },
        bcie: {
          name: 'CABEI',
          label: 'Central American Bank for Economic Integration',
          description: null,
          countryNote: null
        },
        cepal: { name: 'ECLAC', label: 'Economic Commission for Latin America', description: null, countryNote: null },
        aecid: {
          name: 'AECID',
          label: 'Spanish Agency for International Development Cooperation',
          description: null,
          countryNote: null
        },
        oea: { name: 'OAS', label: 'Organization of American States', description: null, countryNote: null }
      }
    },

    contact: {
      kicker: 'Get in Touch',
      title: 'Contact Card',
      subtitle: 'Official point of contact for projects, graduate programs, and institutional cooperation.',
      sampleTag: 'Sample data',
      repTag: 'ICAP Representative',
      hqLine: 'ICAP · Headquarters',
      whatsapp: 'WhatsApp Direct',
      email: 'Send Email',
      linkedin: 'LinkedIn Profile',
      schedule: 'Schedule a Meeting',
      saveHint: 'Download the digital business card (.vcf) straight to your contacts.',
      footerLine: 'ICAP · San José, Costa Rica · SICA',
      whatsappMessage: (name) => `Hi ${name}, I'm reaching out from the ICAP brochure.`,
      scheduleModalTitle: 'Schedule a Meeting',
      scheduleModalSubtitle: 'Institutional Coordination',
      scheduleModalText:
        'Choose the channel you prefer to coordinate an in-person or virtual session with the ICAP representative.',
      viaWhatsapp: 'Coordinate via WhatsApp',
      viaEmail: 'Request by Email',
      scheduleWhatsappMessage: "Hi, I'd like to schedule a meeting with ICAP."
    },

    aboutModal: {
      title: 'About ICAP',
      subtitle: 'International SICA Body',
      intro:
        "The Central American Institute of Public Administration (ICAP) is an international body of the Central American Integration System (SICA), founded in 1954, specialized in public administration and in strengthening public-sector capacities across the Central American region. Its main objective is to promote efficient, transparent, and service-oriented public management.",
      cards: [
        {
          title: '70 Years of Track Record',
          text: 'A regional reference in good governance, public ethics, transparency, innovation, and state modernization.'
        },
        {
          title: 'Graduate Program Offering',
          text: "Doctoral, master's, micro-master's, and specialization programs focused on public management."
        },
        {
          title: 'Partnerships with Key Organizations',
          text: 'Cooperates with institutions such as the IDB, the World Bank, the ILO, UNESCO, and UNICEF, among other international cooperation agencies.'
        },
        {
          title: 'Headquarters in Costa Rica',
          text: 'Located in Curridabat, San José, with projects across Central America, the Dominican Republic, Mexico, and Colombia.'
        }
      ],
      outro:
        "ICAP's educational model puts the student at the center of building their own knowledge, blending behaviorist, cognitive, and constructivist approaches to shape public leadership with real impact across the region.",
      visitLink: "Visit ICAP's official website",
      close: 'Close'
    },

    vcard: {
      firstName: 'Contact',
      lastName: 'Name',
      fullName: 'Contact Name',
      title: 'Institutional Title',
      notes:
        'International organization of the Central American Integration System (SICA) specialized in public administration.',
      pillLabel: 'Save contact',
      primaryLabel: 'SAVE CONTACT'
    }
  }
};
