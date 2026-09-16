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
      theme: 'Cambiar tema claro/oscuro'
    },

    nav: {
      inicio: 'Inicio',
      mision: 'Misión',
      valores: 'Valores',
      autoridades: 'Autoridades',
      areas: 'Áreas',
      presencia: 'Presencia',
      contacto: 'Contacto'
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
      theme: 'Switch light/dark theme'
    },

    nav: {
      inicio: 'Home',
      mision: 'Mission',
      valores: 'Values',
      autoridades: 'Leadership',
      areas: 'Focus Areas',
      presencia: 'Presence',
      contacto: 'Contact'
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
