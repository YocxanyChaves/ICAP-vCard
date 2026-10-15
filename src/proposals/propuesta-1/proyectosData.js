/**
 * Proyectos de Asistencia Técnica — tomados de la tabla "Algunos de
 * nuestros proyectos en la última década" del Brochure V2 (docs/Brochure
 * V2.pdf, páginas 10-16), en el mismo orden en que aparecen ahí.
 *
 * Campos:
 * - titulo:  nombre del proyecto, tal cual el brochure.
 * - cliente: organización / cliente.
 * - area:    una de las llaves de AREA_META (areaMeta.js) — así cada
 *            etiqueta usa el mismo color/ícono que en el mapa y aliados.
 *            En el brochure la columna "Área" es una celda combinada que
 *            abarca varias filas; la asignación sigue esos bloques.
 * - tipoCliente: 'nacional' | 'sica' | 'internacional' (las categorías de
 *            la leyenda de "Clientes Destacados", página 9).
 * - alcance: 'Costa Rica' | 'Regional' | otro país.
 * - desde / hasta: 'AAAA-MM' (o sólo 'AAAA' si el brochure no da mes).
 *            Se formatean según el idioma en ProyectosAT.jsx, y "hasta"
 *            decide si el proyecto sale como "En curso" o "Finalizado".
 *
 * Para agregar un proyecto nuevo basta con sumar un objeto a esta lista.
 */
export const TIPOS_CLIENTE = ['nacional', 'sica', 'internacional'];

export const PROYECTOS_AT = [
  // --- Gobernanza ---------------------------------------------------------
  {
    titulo: 'Fortalecimiento de capacidades compras públicas y ecoetiquetado',
    cliente: 'Agencia de cooperación Alemana para el Desarrollo (GIZ)',
    area: 'Gobernanza',
    tipoCliente: 'internacional',
    alcance: 'Costa Rica',
    desde: '2024-04',
    hasta: '2025-03'
  },
  {
    titulo: 'Capacitación Regulación y Políticas Públicas en el Sector Energía',
    cliente: 'Instituto Costarricense de Electricidad (ICE)',
    area: 'Gobernanza',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2024-09',
    hasta: '2027-02'
  },
  {
    titulo: 'Análisis de factores limitando la implementación basada en resultados por el Ministerio de Educación Pública de Costa Rica',
    cliente: 'Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura (UNESCO)',
    area: 'Gobernanza',
    tipoCliente: 'internacional',
    alcance: 'Costa Rica',
    desde: '2021-10',
    hasta: '2021-12'
  },
  {
    titulo: 'Consultoría de emprendimientos culturales en el marco de la Estrategia Costa Rica creativa y cultural',
    cliente: 'Fundación Parque Metropolitano La Libertad - Ministerio de Cultura y Juventud',
    area: 'Gobernanza',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2020-08',
    hasta: '2020-12'
  },
  {
    titulo: 'Elaboración de un diseño conceptual y propuesta de implementación, para la creación de la Unidad de Análisis de Políticas e Información en Niñez y Adolescencia',
    cliente: 'Fondo de las Naciones Unidas para la Infancia (UNICEF) · Patronato Nacional de la Infancia (PANI)',
    area: 'Gobernanza',
    tipoCliente: 'internacional',
    alcance: 'Costa Rica',
    desde: '2019-12',
    hasta: '2020-10'
  },
  {
    titulo: 'Levantamiento de los modelos o tipología de MiPymes turísticas e indicadores de impacto del SBD',
    cliente: 'Sistema de Banca para el Desarrollo (SBD)',
    area: 'Gobernanza',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2019-07',
    hasta: '2020-05'
  },
  {
    titulo: 'Elaboración de un estado actual y mapeo de expresiones y emprendimientos culturales del Patrimonio Cultural Inmaterial en los ámbitos de la artesanía y la cocina tradicional en Costa Rica, mediante una consulta a actores institucionales y privados',
    cliente: 'Centro de Conservación Patrimonio Cultural',
    area: 'Gobernanza',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2018-10',
    hasta: '2018-12'
  },
  {
    titulo: 'Desarrollo de un diagnóstico sistemático e identificación de oportunidades de mejora para la Junta de Desarrollo de la Zona Sur (JUDESUR)',
    cliente: 'Junta de Desarrollo de la Zona Sur (JUDESUR)',
    area: 'Gobernanza',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2018-02',
    hasta: '2018-10'
  },
  {
    titulo: 'Contratación de Servicios Profesionales para la Evaluación del Programa Integral de Abastecimiento de Agua para Guanacaste (Pacífico Norte)',
    cliente: 'Ministerio de Planificación Nacional y Política Económica (MIDEPLAN)',
    area: 'Gobernanza',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2018-06',
    hasta: '2018-11'
  },
  {
    titulo: 'Desarrollar el Plan Estratégico Institucional del Patronato Nacional de la Infancia 2018-2022',
    cliente: 'Patronato Nacional de la Infancia (PANI)',
    area: 'Gobernanza',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2018-09',
    hasta: '2018-12'
  },
  {
    titulo: 'Curso de capacitación sobre “Planificación estratégica”',
    cliente: 'Instituto de Desarrollo Profesional (IDP) · Ministerio de Educación Pública (MEP)',
    area: 'Gobernanza',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2017-07',
    hasta: '2017-11'
  },
  {
    titulo: 'Instrumentalización de la propuesta de modelo de gestión de Patrimonio Cultural Inmaterial, mediante una metodología de investigación cualitativa',
    cliente: 'Ministerio de Cultura y Juventud',
    area: 'Gobernanza',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2017-07',
    hasta: '2017-11'
  },
  {
    titulo: 'Evaluación del Programa Emprendimientos y MIPYMES Culturales Creativas para la Secretaría de Planificación Institucional (SEPLA)',
    cliente: 'Ministerio de Cultura y Juventud',
    area: 'Gobernanza',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2017-07',
    hasta: '2018-01'
  },
  {
    titulo: 'Analizar y establecer tres líneas base de los Indicadores de Resultado y Gestión de los primeros tres Ejes Estratégicos de la Política Nacional de Gestión del Riesgo 2016-2030',
    cliente: 'Comisión Nacional de Emergencias (CNE)',
    area: 'Gobernanza',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2016-10',
    hasta: '2017-03'
  },

  // --- Proyectos de Inversión --------------------------------------------
  {
    titulo: 'II Fase: Desarrollar perfiles de proyectos, conforme a las pautas que establecen las metodologías de MIDEPLAN',
    cliente: 'Instituto Costarricense de Puertos del Pacífico (INCOP)',
    area: 'Proyectos de Inversión',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2023-04',
    hasta: '2024-04'
  },
  {
    titulo: 'Convenio Específico para la Optimización de las cadenas de valor de la actividad acuícola en CR entre el ICAP y el INDER',
    cliente: 'Instituto de Desarrollo Rural (INDER)',
    area: 'Proyectos de Inversión',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2023-04',
    hasta: '2025-04'
  },
  {
    titulo: 'Desarrollar perfiles de proyectos, conforme a las pautas que establecen las metodologías de MIDEPLAN',
    cliente: 'Instituto Costarricense de Puertos del Pacífico (INCOP)',
    area: 'Proyectos de Inversión',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2022-10',
    hasta: '2023-10'
  },
  {
    titulo: 'Elaborar el Portafolio de Inversión Pública del INCOP y el Portafolio Subordinado del Fideicomiso INCOP-ICT-BNCR',
    cliente: 'Instituto Costarricense de Puertos del Pacífico (INCOP)',
    area: 'Proyectos de Inversión',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2022-10',
    hasta: '2023-10'
  },
  {
    titulo: 'Iniciativa Centroamericana para una Inversión Pública con Valor Agregado (INCENTIVA)',
    cliente: 'Agencia de cooperación Alemana para el Desarrollo (GIZ)',
    area: 'Proyectos de Inversión',
    tipoCliente: 'internacional',
    alcance: 'Regional',
    desde: '2020-12',
    hasta: '2021-12'
  },
  {
    titulo: 'Elaboración de perfiles de proyecto del Instituto Costarricense de Turismo (ICT)',
    cliente: 'Instituto Costarricense de Turismo (ICT)',
    area: 'Proyectos de Inversión',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2020-01',
    hasta: '2020-07'
  },
  {
    titulo: 'Programa de capacitación para la Formulación y evaluación de proyectos en inversión local',
    cliente: 'Instituto de Fomento y Asesoría Municipal (IFAM)',
    area: 'Proyectos de Inversión',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2017-03',
    hasta: '2017-05'
  },
  {
    titulo: 'Curso sobre Formulación y Seguimiento de Proyectos',
    cliente: 'Dirección de Planificación, Ministerio de Salud',
    area: 'Proyectos de Inversión',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2016-10',
    hasta: '2016-12'
  },
  {
    // En el brochure el período dice "Noviembre 2015 - Agosto 2015"
    // (fin antes del inicio) — pendiente de confirmar la fecha correcta.
    titulo: 'Programa de capacitación formulación y evaluación de proyectos de inversión pública',
    cliente: 'Consejo de Seguridad Vial (COSEVI)',
    area: 'Proyectos de Inversión',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2015-11',
    hasta: '2015-08'
  },

  // --- Formación Continua -------------------------------------------------
  {
    titulo: 'Promoción del Empleo Juvenil y de la Resiliencia en Centroamérica (CaPAZ II)',
    cliente: 'Agencia de cooperación Alemana para el Desarrollo (GIZ)',
    area: 'Formación Continua',
    tipoCliente: 'internacional',
    alcance: 'Regional',
    desde: '2023-04',
    hasta: '2026-01'
  },
  {
    titulo: 'Capacitación en diplomacia para personas funcionarias del Ministerio de Relaciones Exteriores de la República de Guatemala',
    cliente: 'Academia de Diplomacia de Guatemala y Ministerio de Relaciones Exteriores',
    area: 'Formación Continua',
    tipoCliente: 'nacional',
    alcance: 'Guatemala',
    desde: '2023-04',
    hasta: '2023-12'
  },
  {
    titulo: 'Levantamiento y toma física de activos en el Patronato Nacional de la Infancia (PANI)',
    cliente: 'Patronato Nacional de la Infancia (PANI)',
    area: 'Formación Continua',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2019-10',
    hasta: '2020-03'
  },
  {
    titulo: 'Curso de capacitación Administración Estratégica de Servicios de Salud para Enfermería',
    cliente: 'Colegio de Enfermeras de Costa Rica',
    area: 'Formación Continua',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2017-05',
    hasta: '2017-06'
  },
  {
    titulo: 'Curso de capacitación sobre “Construcción de indicadores”',
    cliente: 'Instituto de Desarrollo Profesional (IDP) · Ministerio de Educación Pública (MEP)',
    area: 'Formación Continua',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2017-04',
    hasta: '2017-07'
  },
  {
    titulo: 'Curso sobre evaluación expost y de impacto de proyectos sociales, con énfasis en salud',
    cliente: 'Ministerio de Salud (MINSA)',
    area: 'Formación Continua',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2016-06',
    hasta: '2016-11'
  },
  {
    titulo: 'Facilitación y Coordinación del Plan Estratégico Institucional 2016-2020',
    cliente: 'Instituto Mixto de Ayuda Social (IMAS)',
    area: 'Formación Continua',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2015-09',
    hasta: '2016-04'
  },

  // --- Transformación Organizacional -------------------------------------
  {
    titulo: 'Programa de formación en integración regional centroamericana, PAIRCA',
    cliente: 'Segundo Programa de Apoyo a la Integración Regional Centroamericana (PAIRCA II)',
    area: 'Transformación Organizacional',
    tipoCliente: 'sica',
    alcance: 'Regional',
    desde: '2013-06',
    hasta: '2014-03'
  },
  {
    titulo: 'Programa de Capacitación: Competencias para la gerencia y gestión de proyectos',
    cliente: 'Consejo de Transporte Público (CTP)',
    area: 'Transformación Organizacional',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2017-01',
    hasta: '2017-04'
  },
  {
    titulo: 'Fortalecimiento del Sistema de Control Interno del Centro Costarricense de Producción Cinematográfica: Sistema de Autoevaluación y del SEVRI',
    cliente: 'Centro Costarricense de Producción Cinematográfica',
    area: 'Transformación Organizacional',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2016-12',
    hasta: '2017-03'
  },
  {
    titulo: 'Programa de habilidades gerenciales para el Ministerio de Hacienda',
    cliente: 'Centro de Investigación y Formación Hacendaria (CIFH) del Ministerio de Hacienda',
    area: 'Transformación Organizacional',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2016-09',
    hasta: '2016-11'
  },
  {
    titulo: 'Proceso de Dimensionamiento del Servicio de Transporte Público y de la Programación del Servicio',
    cliente: 'Consejo de Transporte Público (CTP)',
    area: 'Transformación Organizacional',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2016-03',
    hasta: '2016-03'
  },
  {
    titulo: 'Curso sobre Formulación y Evaluación de Proyectos de Inversión',
    cliente: 'Junta de Administración Portuaria y Desarrollo Económico de la Vertiente Atlántica (JAPDEVA)',
    area: 'Transformación Organizacional',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2016-10',
    hasta: '2016-12'
  },
  {
    titulo: 'Diplomado para gestores de política de recursos humanos en salud en Centroamérica y República Dominicana',
    cliente: 'Organización Panamericana de la Salud (OPS)',
    area: 'Transformación Organizacional',
    tipoCliente: 'internacional',
    alcance: 'Regional',
    desde: '2015-01',
    hasta: '2015-11'
  },
  {
    titulo: 'Análisis y Mejora de la Gestión del Centro Costarricense de Producción Cinematográfica',
    cliente: 'Ministerio de Cultura y Juventud',
    area: 'Transformación Organizacional',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2015-12',
    hasta: '2016-10'
  },
  {
    titulo: 'Programa de capacitación en competencias para la gerencia en organizaciones públicas',
    cliente: 'Dirección Nacional de Centros de Educación y Nutrición y de Centros Infantiles de Atención Integral (CEN-CINAI, Ministerio de Salud)',
    area: 'Transformación Organizacional',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2014-06',
    hasta: '2014-10'
  },

  // --- Ambiente -----------------------------------------------------------
  {
    titulo: 'Programa de Desarrollo de Capacidades para Micro, Pequeñas y Medianas Empresas (MiPymes) de Centroamérica en eficiencia energética, producción más limpia y financiamiento verde',
    cliente: 'Banco Centroamericano de Integración Económica (BCIE), el Gobierno de Alemania a través del KfW y la Unión Europea',
    area: 'Ambiente',
    tipoCliente: 'sica',
    alcance: 'Regional',
    desde: '2024-12',
    hasta: '2025-12'
  },
  {
    titulo: 'Prioridades de adaptación para Centroamérica y República Dominicana a partir de la evidencia científica y los escenarios de cambio climático para la región',
    cliente: 'Consejo Nacional de Rectores, Programa Estado de la Nación y Fundación Alta Tecnología',
    area: 'Ambiente',
    tipoCliente: 'nacional',
    alcance: 'Regional',
    desde: '2024-06',
    hasta: '2024-07'
  },
  {
    titulo: 'Propuesta para el desarrollo de capacidades para la gestión integrada del agua y aguas residuales. Proyecto saneamiento CREW+',
    cliente: 'Agencia de cooperación Alemana para el Desarrollo (GIZ)',
    area: 'Ambiente',
    tipoCliente: 'internacional',
    alcance: 'Costa Rica',
    desde: '2021-10',
    hasta: '2022-08'
  },
  {
    titulo: 'BID Fase II: Replicabilidad del Mecanismo Regional para la Adopción del Blindaje Climático en la Infraestructura Pública',
    cliente: 'Banco Interamericano de Desarrollo (BID) · Contraparte: Centro de Coordinación para la Prevención de los Desastres en América Central y República Dominicana (CEPREDENAC)',
    area: 'Ambiente',
    tipoCliente: 'internacional',
    alcance: 'Regional',
    desde: '2016-11',
    hasta: '2019-11'
  },
  {
    titulo: 'Mecanismo regional para la gestión integral del riesgo y adopción del blindaje climático en la infraestructura pública',
    cliente: 'Banco Interamericano de Desarrollo (BID)',
    area: 'Ambiente',
    tipoCliente: 'internacional',
    alcance: 'Regional',
    desde: '2014-08',
    hasta: '2016-08'
  },
  {
    titulo: 'Consultoría en el área de ajuste económico por externalidades sociales y ambientales y análisis costo-beneficio final proyecto hidroeléctrico Diquís',
    cliente: 'Instituto Costarricense de Electricidad (ICE)',
    area: 'Ambiente',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2014-12',
    hasta: '2015-05'
  },

  // --- Salud --------------------------------------------------------------
  {
    titulo: 'Cobertura sanitaria y acceso al empleo decente para la población migrante, refugiada y solicitante de refugio, en condiciones de vulnerabilidad en Costa Rica',
    cliente: 'Fundación UCR - Agencia Española de Cooperación Internacional para el Desarrollo - Caja Costarricense de Seguro Social',
    area: 'Salud',
    tipoCliente: 'internacional',
    alcance: 'Costa Rica',
    desde: '2024-11',
    hasta: '2025-02'
  },
  {
    titulo: 'Curso de Introducción a la Formulación de un Proyecto',
    cliente: 'Sistema de la Integración Centroamericana (SICA)',
    area: 'Salud',
    tipoCliente: 'sica',
    alcance: 'Regional',
    desde: '2023-03',
    hasta: '2023-04'
  },
  {
    titulo: 'Plan de formación general para las personas integrantes de las instancias regionales para la atención de la intención suicida (IRAIS) y las instancias locales para atención de la intención suicida (ILAIS)',
    cliente: 'Ministerio de Salud (MINSA)',
    area: 'Salud',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2021-01',
    hasta: '2021-09'
  },

  // --- Género -------------------------------------------------------------
  {
    titulo: 'THRIVE: Integración de la perspectiva de género para la excelencia inclusiva en la academia',
    cliente: 'Unión Europea',
    area: 'Género',
    tipoCliente: 'internacional',
    alcance: 'Regional',
    desde: '2026-07',
    hasta: '2028-01'
  },
  {
    titulo: 'Convenio específico #1 de Cooperación entre el Centro para la Promoción de la Micro y Pequeña Empresa en Centroamérica y el Instituto Centroamericano de Administración Pública (ICAP)',
    cliente: 'Centro Regional de Promoción de la Micro, Pequeña y Mediana Empresa (CENPROMYPE)',
    area: 'Género',
    tipoCliente: 'sica',
    alcance: 'Regional',
    desde: '2022',
    hasta: '2024-12'
  },
  {
    titulo: 'Evaluación del Programa Mujeres Empresarias MEIC',
    cliente: 'Ministerio de Planificación Nacional y Política Económica (MIDEPLAN)',
    area: 'Género',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2017-08',
    hasta: '2018-01'
  },
  {
    titulo: 'Diplomado Regional en Materia de Prevención de la Violencia contra Mujeres, Trata de Personas, Femicidio / Feminicidio en Centroamérica',
    cliente: 'Secretaría General del Sistema de la Integración Centroamericana (SG-SICA)',
    area: 'Género',
    tipoCliente: 'sica',
    alcance: 'Regional',
    desde: '2015-12',
    hasta: '2016-07'
  },
  {
    titulo: 'Elaboración de la Política de igualdad y equidad de género para la prestación de servicios institucionales 2015-2025 y su Plan de acción 2015-2020 del Instituto Mixto de Ayuda Social',
    cliente: 'Instituto Mixto de Ayuda Social (IMAS)',
    area: 'Género',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2014-06',
    hasta: '2014-12'
  },

  // --- Seguridad ----------------------------------------------------------
  {
    titulo: 'Herramientas de evaluación del impacto cualitativo, cuantitativo y de procesos de la justicia restaurativa en materia penal, en Costa Rica, Colombia y México',
    cliente: 'Poder Judicial de Costa Rica',
    area: 'Seguridad',
    tipoCliente: 'nacional',
    alcance: 'Regional',
    desde: '2018-10',
    hasta: '2018-11'
  },
  {
    titulo: 'CR: territorios desiguales y políticas locales de seguridad ¿desiguales?',
    cliente: 'Facultad Latinoamericana de Ciencias Sociales (FLACSO)',
    area: 'Seguridad',
    tipoCliente: 'internacional',
    alcance: 'Costa Rica',
    desde: '2016-02',
    hasta: '2016-08'
  },
  {
    titulo: 'DB1: Profesionalización y tecnificación de las policías e instancias vinculadas a la seguridad y justicia en el nivel nacional y regional (fase II)',
    cliente: 'Secretaría General del Sistema de la Integración Centroamericana (SG-SICA)',
    area: 'Seguridad',
    tipoCliente: 'sica',
    alcance: 'Regional',
    desde: '2014-09',
    hasta: '2015-05'
  },
  {
    titulo: 'DB1: Profesionalización y tecnificación de las policías e instancias vinculadas a la seguridad y justicia en el nivel nacional y regional (fase I)',
    cliente: 'Secretaría General del Sistema de la Integración Centroamericana (SG-SICA)',
    area: 'Seguridad',
    tipoCliente: 'sica',
    alcance: 'Regional',
    desde: '2013-04',
    hasta: '2013-12'
  },

  // --- Calidad ------------------------------------------------------------
  {
    titulo: 'Realizar evaluaciones de la calidad de Correos de Costa Rica',
    cliente: 'Autoridad Reguladora de Servicios Públicos (ARESEP)',
    area: 'Calidad',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2022-06',
    hasta: '2022-08'
  },
  {
    titulo: 'Realizar evaluaciones de la calidad en la prestación del servicio social de comunicación postal de Correos de Costa Rica',
    cliente: 'Autoridad Reguladora de Servicios Públicos (ARESEP)',
    area: 'Calidad',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2019-07',
    hasta: '2019-11'
  },
  {
    titulo: 'Análisis y Documentación de los Procesos de Proveeduría',
    cliente: 'Ministerio de Cultura y Juventud',
    area: 'Calidad',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2015-09',
    hasta: '2015-12'
  },

  // --- Asistencia Técnica -------------------------------------------------
  {
    titulo: 'Convenio entre el Banco Centroamericano de Integración Económica (BCIE) y el Instituto Centroamericano de Administración Pública (ICAP)',
    cliente: 'Banco Centroamericano de Integración Económica (BCIE)',
    area: 'Asistencia Técnica',
    tipoCliente: 'sica',
    alcance: 'Regional',
    desde: '2025-03',
    hasta: '2026-03'
  },
  {
    titulo: 'Diagnóstico del perfil socioeconómico y las posibles oportunidades económicas/laborales alternativas para las comunidades de pesca artesanal, actividad acuícola y molusquera, en pequeña escala en dos territorios seleccionados de Costa Rica',
    cliente: 'Banco Mundial',
    area: 'Asistencia Técnica',
    tipoCliente: 'internacional',
    alcance: 'Costa Rica',
    desde: '2022-10',
    hasta: '2023-03'
  },
  {
    // Mismo nombre que el convenio INDER de "Proyectos de Inversión", con
    // otro período — así viene en el brochure (¿dos etapas?).
    titulo: 'Convenio Específico para la Optimización de las cadenas de valor de la actividad acuícola en CR entre el ICAP y el INDER',
    cliente: 'Instituto de Desarrollo Rural (INDER)',
    area: 'Asistencia Técnica',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2021-12',
    hasta: '2023-10'
  },
  {
    titulo: 'Elaboración del estudio socioeconómico de la Región Pacífico Central para la implementación del Proyecto Terminal Pacífico',
    cliente: 'Refinadora Costarricense de Petróleo (RECOPE)',
    area: 'Asistencia Técnica',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2020-01',
    hasta: '2020-12'
  },
  {
    titulo: 'Diseño de un Programa de Formación para el uso de herramientas de visualización interactiva para la política social, dirigida a personas funcionarias de instituciones de la Estrategia Puente al Desarrollo (EPD)',
    cliente: 'Organización Internacional del Trabajo (OIT)',
    area: 'Asistencia Técnica',
    tipoCliente: 'internacional',
    alcance: 'Costa Rica',
    desde: '2020-12',
    hasta: '2021-05'
  },
  {
    titulo: 'Elaboración de los pronósticos de demanda a largo y corto plazo para los productos que distribuye RECOPE',
    cliente: 'Refinadora Costarricense de Petróleo (RECOPE)',
    area: 'Asistencia Técnica',
    tipoCliente: 'nacional',
    alcance: 'Costa Rica',
    desde: '2019-07',
    hasta: '2019-12'
  }
];
