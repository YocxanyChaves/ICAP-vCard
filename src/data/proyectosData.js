/**
 * Proyectos de Asistencia Técnica — tomados de la tabla "Algunos de
 * nuestros proyectos en la última década" del Brochure V2 (docs/Brochure
 * V2.pdf, páginas 10-16), en el mismo orden en que aparecen ahí. Ese
 * orden coincide 1 a 1 con docs/Clasificacion_proyectos_ICAP.pdf, de
 * donde salen `etiquetas` y `region`.
 *
 * Campos:
 * - id:      número del proyecto en la clasificación (1-66), se asigna
 *            solo al final del archivo según el orden de la lista.
 * - titulo:  nombre del proyecto, tal cual el brochure.
 * - cliente: organización / cliente.
 * - etiquetas: ids de etiquetas.js (un proyecto puede tener varias).
 * - tipoCliente: 'nacional' | 'sica' | 'internacional' (las categorías de
 *            la leyenda de "Clientes Destacados", página 9).
 * - region:  la columna "Región" de la clasificación. REGION_PAISES dice
 *            qué países del mapa de Presencia cubre cada una.
 * - desde / hasta: 'AAAA-MM' (o sólo 'AAAA' si el brochure no da mes).
 *            Se formatean según el idioma en ProyectosAT.jsx, y "hasta"
 *            decide si el proyecto sale como "En curso" o "Finalizado".
 *
 * Para agregar un proyecto nuevo basta con sumar un objeto a esta lista.
 */
export const TIPOS_CLIENTE = ['nacional', 'sica', 'internacional'];

export const PROYECTOS_AT = [
  {
    titulo: 'Fortalecimiento de capacidades compras públicas y ecoetiquetado',
    cliente: 'Agencia de cooperación Alemana para el Desarrollo (GIZ)',
    etiquetas: ['politica', 'ambiente', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Costa Rica',
    desde: '2024-04',
    hasta: '2025-03'
  },
  {
    titulo: 'Capacitación Regulación y Políticas Públicas en el Sector Energía',
    cliente: 'Instituto Costarricense de Electricidad (ICE)',
    etiquetas: ['politica', 'energia'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2024-09',
    hasta: '2027-02'
  },
  {
    titulo: 'Análisis de factores limitando la implementación basada en resultados por el Ministerio de Educación Pública de Costa Rica',
    cliente: 'Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura (UNESCO)',
    etiquetas: ['politica', 'transformacion', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Costa Rica',
    desde: '2021-10',
    hasta: '2021-12'
  },
  {
    titulo: 'Consultoría de emprendimientos culturales en el marco de la Estrategia Costa Rica creativa y cultural',
    cliente: 'Fundación Parque Metropolitano La Libertad - Ministerio de Cultura y Juventud',
    etiquetas: ['mipymes', 'economia'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2020-08',
    hasta: '2020-12'
  },
  {
    titulo: 'Elaboración de un diseño conceptual y propuesta de implementación, para la creación de la Unidad de Análisis de Políticas e Información en Niñez y Adolescencia',
    cliente: 'Fondo de las Naciones Unidas para la Infancia (UNICEF) · Patronato Nacional de la Infancia (PANI)',
    etiquetas: ['politica', 'transformacion', 'derechos', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Costa Rica',
    desde: '2019-12',
    hasta: '2020-10'
  },
  {
    titulo: 'Levantamiento de los modelos o tipología de MiPymes turísticas e indicadores de impacto del SBD',
    cliente: 'Sistema de Banca para el Desarrollo (SBD)',
    etiquetas: ['mipymes', 'economia'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2019-07',
    hasta: '2020-05'
  },
  {
    titulo: 'Elaboración de un estado actual y mapeo de expresiones y emprendimientos culturales del Patrimonio Cultural Inmaterial en los ámbitos de la artesanía y la cocina tradicional en Costa Rica, mediante una consulta a actores institucionales y privados',
    cliente: 'Centro de Conservación Patrimonio Cultural',
    etiquetas: ['mipymes', 'economia'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2018-10',
    hasta: '2018-12'
  },
  {
    titulo: 'Desarrollo de un diagnóstico sistemático e identificación de oportunidades de mejora para la Junta de Desarrollo de la Zona Sur (JUDESUR)',
    cliente: 'Junta de Desarrollo de la Zona Sur (JUDESUR)',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2018-02',
    hasta: '2018-10'
  },
  {
    titulo: 'Contratación de Servicios Profesionales para la Evaluación del Programa Integral de Abastecimiento de Agua para Guanacaste (Pacífico Norte)',
    cliente: 'Ministerio de Planificación Nacional y Política Económica (MIDEPLAN)',
    etiquetas: ['infraestructura', 'politica', 'ambiente'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2018-06',
    hasta: '2018-11'
  },
  {
    titulo: 'Desarrollar el Plan Estratégico Institucional del Patronato Nacional de la Infancia 2018-2022',
    cliente: 'Patronato Nacional de la Infancia (PANI)',
    etiquetas: ['transformacion', 'derechos'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2018-09',
    hasta: '2018-12'
  },
  {
    titulo: 'Curso de capacitación sobre “Planificación estratégica”',
    cliente: 'Instituto de Desarrollo Profesional (IDP) · Ministerio de Educación Pública (MEP)',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-07',
    hasta: '2017-11'
  },
  {
    titulo: 'Instrumentalización de la propuesta de modelo de gestión de Patrimonio Cultural Inmaterial, mediante una metodología de investigación cualitativa',
    cliente: 'Ministerio de Cultura y Juventud',
    etiquetas: ['politica'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-07',
    hasta: '2017-11'
  },
  {
    titulo: 'Evaluación del Programa Emprendimientos y MIPYMES Culturales Creativas para la Secretaría de Planificación Institucional (SEPLA)',
    cliente: 'Ministerio de Cultura y Juventud',
    etiquetas: ['mipymes', 'politica'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-07',
    hasta: '2018-01'
  },
  {
    titulo: 'Analizar y establecer tres líneas base de los Indicadores de Resultado y Gestión de los primeros tres Ejes Estratégicos de la Política Nacional de Gestión del Riesgo 2016-2030',
    cliente: 'Comisión Nacional de Emergencias (CNE)',
    etiquetas: ['politica', 'ambiente'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2016-10',
    hasta: '2017-03'
  },

  {
    titulo: 'II Fase: Desarrollar perfiles de proyectos, conforme a las pautas que establecen las metodologías de MIDEPLAN',
    cliente: 'Instituto Costarricense de Puertos del Pacífico (INCOP)',
    etiquetas: ['infraestructura', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2023-04',
    hasta: '2024-04'
  },
  {
    titulo: 'Convenio Específico para la Optimización de las cadenas de valor de la actividad acuícola en CR entre el ICAP y el INDER',
    cliente: 'Instituto de Desarrollo Rural (INDER)',
    etiquetas: ['mipymes', 'economia', 'alimentaria'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2023-04',
    hasta: '2025-04'
  },
  {
    titulo: 'Desarrollar perfiles de proyectos, conforme a las pautas que establecen las metodologías de MIDEPLAN',
    cliente: 'Instituto Costarricense de Puertos del Pacífico (INCOP)',
    etiquetas: ['infraestructura', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2022-10',
    hasta: '2023-10'
  },
  {
    titulo: 'Elaborar el Portafolio de Inversión Pública del INCOP y el Portafolio Subordinado del Fideicomiso INCOP-ICT-BNCR',
    cliente: 'Instituto Costarricense de Puertos del Pacífico (INCOP)',
    etiquetas: ['infraestructura', 'economia', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2022-10',
    hasta: '2023-10'
  },
  {
    titulo: 'Iniciativa Centroamericana para una Inversión Pública con Valor Agregado (INCENTIVA)',
    cliente: 'Agencia de cooperación Alemana para el Desarrollo (GIZ)',
    etiquetas: ['infraestructura', 'politica', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Centroamérica',
    desde: '2020-12',
    hasta: '2021-12'
  },
  {
    titulo: 'Elaboración de perfiles de proyecto del Instituto Costarricense de Turismo (ICT)',
    cliente: 'Instituto Costarricense de Turismo (ICT)',
    etiquetas: ['infraestructura', 'economia'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2020-01',
    hasta: '2020-07'
  },
  {
    titulo: 'Programa de capacitación para la Formulación y evaluación de proyectos en inversión local',
    cliente: 'Instituto de Fomento y Asesoría Municipal (IFAM)',
    etiquetas: ['infraestructura', 'politica'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-03',
    hasta: '2017-05'
  },
  {
    titulo: 'Curso sobre Formulación y Seguimiento de Proyectos',
    cliente: 'Dirección de Planificación, Ministerio de Salud',
    etiquetas: ['transformacion', 'salud'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2016-10',
    hasta: '2016-12'
  },
  {
    // En el brochure el período dice "Noviembre 2015 - Agosto 2015"
    // (fin antes del inicio) — pendiente de confirmar la fecha correcta.
    titulo: 'Programa de capacitación formulación y evaluación de proyectos de inversión pública',
    cliente: 'Consejo de Seguridad Vial (COSEVI)',
    etiquetas: ['infraestructura', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2015-11',
    hasta: '2015-08'
  },

  {
    titulo: 'Promoción del Empleo Juvenil y de la Resiliencia en Centroamérica (CaPAZ II)',
    cliente: 'Agencia de cooperación Alemana para el Desarrollo (GIZ)',
    etiquetas: ['economia', 'derechos', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Centroamérica',
    desde: '2023-04',
    hasta: '2026-01'
  },
  {
    titulo: 'Capacitación en diplomacia para personas funcionarias del Ministerio de Relaciones Exteriores de la República de Guatemala',
    cliente: 'Academia de Diplomacia de Guatemala y Ministerio de Relaciones Exteriores',
    etiquetas: ['cooperacion'],
    tipoCliente: 'nacional',
    region: 'Guatemala',
    desde: '2023-04',
    hasta: '2023-12'
  },
  {
    titulo: 'Levantamiento y toma física de activos en el Patronato Nacional de la Infancia (PANI)',
    cliente: 'Patronato Nacional de la Infancia (PANI)',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2019-10',
    hasta: '2020-03'
  },
  {
    titulo: 'Curso de capacitación Administración Estratégica de Servicios de Salud para Enfermería',
    cliente: 'Colegio de Enfermeras de Costa Rica',
    etiquetas: ['transformacion', 'salud'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-05',
    hasta: '2017-06'
  },
  {
    titulo: 'Curso de capacitación sobre “Construcción de indicadores”',
    cliente: 'Instituto de Desarrollo Profesional (IDP) · Ministerio de Educación Pública (MEP)',
    etiquetas: ['politica', 'transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-04',
    hasta: '2017-07'
  },
  {
    titulo: 'Curso sobre evaluación expost y de impacto de proyectos sociales, con énfasis en salud',
    cliente: 'Ministerio de Salud (MINSA)',
    etiquetas: ['politica', 'salud'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2016-06',
    hasta: '2016-11'
  },
  {
    titulo: 'Facilitación y Coordinación del Plan Estratégico Institucional 2016-2020',
    cliente: 'Instituto Mixto de Ayuda Social (IMAS)',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2015-09',
    hasta: '2016-04'
  },

  {
    titulo: 'Programa de formación en integración regional centroamericana, PAIRCA',
    cliente: 'Segundo Programa de Apoyo a la Integración Regional Centroamericana (PAIRCA II)',
    etiquetas: ['politica', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2013-06',
    hasta: '2014-03'
  },
  {
    titulo: 'Programa de Capacitación: Competencias para la gerencia y gestión de proyectos',
    cliente: 'Consejo de Transporte Público (CTP)',
    etiquetas: ['transformacion', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-01',
    hasta: '2017-04'
  },
  {
    titulo: 'Fortalecimiento del Sistema de Control Interno del Centro Costarricense de Producción Cinematográfica: Sistema de Autoevaluación y del SEVRI',
    cliente: 'Centro Costarricense de Producción Cinematográfica',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2016-12',
    hasta: '2017-03'
  },
  {
    titulo: 'Programa de habilidades gerenciales para el Ministerio de Hacienda',
    cliente: 'Centro de Investigación y Formación Hacendaria (CIFH) del Ministerio de Hacienda',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2016-09',
    hasta: '2016-11'
  },
  {
    titulo: 'Proceso de Dimensionamiento del Servicio de Transporte Público y de la Programación del Servicio',
    cliente: 'Consejo de Transporte Público (CTP)',
    etiquetas: ['politica', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2016-03',
    hasta: '2016-03'
  },
  {
    titulo: 'Curso sobre Formulación y Evaluación de Proyectos de Inversión',
    cliente: 'Junta de Administración Portuaria y Desarrollo Económico de la Vertiente Atlántica (JAPDEVA)',
    etiquetas: ['infraestructura', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2016-10',
    hasta: '2016-12'
  },
  {
    titulo: 'Diplomado para gestores de política de recursos humanos en salud en Centroamérica y República Dominicana',
    cliente: 'Organización Panamericana de la Salud (OPS)',
    etiquetas: ['politica', 'salud', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Centroamérica y Rep. Dominicana',
    desde: '2015-01',
    hasta: '2015-11'
  },
  {
    titulo: 'Análisis y Mejora de la Gestión del Centro Costarricense de Producción Cinematográfica',
    cliente: 'Ministerio de Cultura y Juventud',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2015-12',
    hasta: '2016-10'
  },
  {
    titulo: 'Programa de capacitación en competencias para la gerencia en organizaciones públicas',
    cliente: 'Dirección Nacional de Centros de Educación y Nutrición y de Centros Infantiles de Atención Integral (CEN-CINAI, Ministerio de Salud)',
    etiquetas: ['transformacion', 'alimentaria', 'salud'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2014-06',
    hasta: '2014-10'
  },

  {
    titulo: 'Programa de Desarrollo de Capacidades para Micro, Pequeñas y Medianas Empresas (MiPymes) de Centroamérica en eficiencia energética, producción más limpia y financiamiento verde',
    cliente: 'Banco Centroamericano de Integración Económica (BCIE), el Gobierno de Alemania a través del KfW y la Unión Europea',
    etiquetas: ['mipymes', 'energia', 'ambiente', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2024-12',
    hasta: '2025-12'
  },
  {
    titulo: 'Prioridades de adaptación para Centroamérica y República Dominicana a partir de la evidencia científica y los escenarios de cambio climático para la región',
    cliente: 'Consejo Nacional de Rectores, Programa Estado de la Nación y Fundación Alta Tecnología',
    etiquetas: ['politica', 'ambiente'],
    tipoCliente: 'nacional',
    region: 'Centroamérica y Rep. Dominicana',
    desde: '2024-06',
    hasta: '2024-07'
  },
  {
    titulo: 'Propuesta para el desarrollo de capacidades para la gestión integrada del agua y aguas residuales. Proyecto saneamiento CREW+',
    cliente: 'Agencia de cooperación Alemana para el Desarrollo (GIZ)',
    etiquetas: ['infraestructura', 'ambiente', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Centroamérica y Caribe',
    desde: '2021-10',
    hasta: '2022-08'
  },
  {
    titulo: 'BID Fase II: Replicabilidad del Mecanismo Regional para la Adopción del Blindaje Climático en la Infraestructura Pública',
    cliente: 'Banco Interamericano de Desarrollo (BID) · Contraparte: Centro de Coordinación para la Prevención de los Desastres en América Central y República Dominicana (CEPREDENAC)',
    etiquetas: ['infraestructura', 'ambiente', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Centroamérica y Rep. Dominicana',
    desde: '2016-11',
    hasta: '2019-11'
  },
  {
    titulo: 'Mecanismo regional para la gestión integral del riesgo y adopción del blindaje climático en la infraestructura pública',
    cliente: 'Banco Interamericano de Desarrollo (BID)',
    etiquetas: ['infraestructura', 'ambiente', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Centroamérica',
    desde: '2014-08',
    hasta: '2016-08'
  },
  {
    titulo: 'Consultoría en el área de ajuste económico por externalidades sociales y ambientales y análisis costo-beneficio final proyecto hidroeléctrico Diquís',
    cliente: 'Instituto Costarricense de Electricidad (ICE)',
    etiquetas: ['infraestructura', 'economia', 'energia', 'ambiente'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2014-12',
    hasta: '2015-05'
  },

  {
    titulo: 'Cobertura sanitaria y acceso al empleo decente para la población migrante, refugiada y solicitante de refugio, en condiciones de vulnerabilidad en Costa Rica',
    cliente: 'Fundación UCR - Agencia Española de Cooperación Internacional para el Desarrollo - Caja Costarricense de Seguro Social',
    etiquetas: ['salud', 'derechos', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Costa Rica',
    desde: '2024-11',
    hasta: '2025-02'
  },
  {
    titulo: 'Curso de Introducción a la Formulación de un Proyecto',
    cliente: 'Sistema de la Integración Centroamericana (SICA)',
    etiquetas: ['cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2023-03',
    hasta: '2023-04'
  },
  {
    titulo: 'Plan de formación general para las personas integrantes de las instancias regionales para la atención de la intención suicida (IRAIS) y las instancias locales para atención de la intención suicida (ILAIS)',
    cliente: 'Ministerio de Salud (MINSA)',
    etiquetas: ['salud'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2021-01',
    hasta: '2021-09'
  },

  {
    titulo: 'THRIVE: Integración de la perspectiva de género para la excelencia inclusiva en la academia',
    cliente: 'Unión Europea',
    etiquetas: ['genero', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Internacional (Unión Europea)',
    desde: '2026-07',
    hasta: '2028-01'
  },
  {
    titulo: 'Convenio específico #1 de Cooperación entre el Centro para la Promoción de la Micro y Pequeña Empresa en Centroamérica y el Instituto Centroamericano de Administración Pública (ICAP)',
    cliente: 'Centro Regional de Promoción de la Micro, Pequeña y Mediana Empresa (CENPROMYPE)',
    etiquetas: ['mipymes', 'genero', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2022',
    hasta: '2024-12'
  },
  {
    titulo: 'Evaluación del Programa Mujeres Empresarias MEIC',
    cliente: 'Ministerio de Planificación Nacional y Política Económica (MIDEPLAN)',
    etiquetas: ['mipymes', 'politica', 'genero'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-08',
    hasta: '2018-01'
  },
  {
    titulo: 'Diplomado Regional en Materia de Prevención de la Violencia contra Mujeres, Trata de Personas, Femicidio / Feminicidio en Centroamérica',
    cliente: 'Secretaría General del Sistema de la Integración Centroamericana (SG-SICA)',
    etiquetas: ['genero', 'derechos', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2015-12',
    hasta: '2016-07'
  },
  {
    titulo: 'Elaboración de la Política de igualdad y equidad de género para la prestación de servicios institucionales 2015-2025 y su Plan de acción 2015-2020 del Instituto Mixto de Ayuda Social',
    cliente: 'Instituto Mixto de Ayuda Social (IMAS)',
    etiquetas: ['politica', 'genero', 'derechos'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2014-06',
    hasta: '2014-12'
  },

  {
    titulo: 'Herramientas de evaluación del impacto cualitativo, cuantitativo y de procesos de la justicia restaurativa en materia penal, en Costa Rica, Colombia y México',
    cliente: 'Poder Judicial de Costa Rica',
    etiquetas: ['politica', 'derechos'],
    tipoCliente: 'nacional',
    region: 'Costa Rica, Colombia y México',
    desde: '2018-10',
    hasta: '2018-11'
  },
  {
    titulo: 'CR: territorios desiguales y políticas locales de seguridad ¿desiguales?',
    cliente: 'Facultad Latinoamericana de Ciencias Sociales (FLACSO)',
    etiquetas: ['politica', 'derechos'],
    tipoCliente: 'internacional',
    region: 'Costa Rica',
    desde: '2016-02',
    hasta: '2016-08'
  },
  {
    titulo: 'DB1: Profesionalización y tecnificación de las policías e instancias vinculadas a la seguridad y justicia en el nivel nacional y regional (fase II)',
    cliente: 'Secretaría General del Sistema de la Integración Centroamericana (SG-SICA)',
    etiquetas: ['transformacion', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2014-09',
    hasta: '2015-05'
  },
  {
    titulo: 'DB1: Profesionalización y tecnificación de las policías e instancias vinculadas a la seguridad y justicia en el nivel nacional y regional (fase I)',
    cliente: 'Secretaría General del Sistema de la Integración Centroamericana (SG-SICA)',
    etiquetas: ['transformacion', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2013-04',
    hasta: '2013-12'
  },

  {
    titulo: 'Realizar evaluaciones de la calidad de Correos de Costa Rica',
    cliente: 'Autoridad Reguladora de Servicios Públicos (ARESEP)',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2022-06',
    hasta: '2022-08'
  },
  {
    titulo: 'Realizar evaluaciones de la calidad en la prestación del servicio social de comunicación postal de Correos de Costa Rica',
    cliente: 'Autoridad Reguladora de Servicios Públicos (ARESEP)',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2019-07',
    hasta: '2019-11'
  },
  {
    titulo: 'Análisis y Documentación de los Procesos de Proveeduría',
    cliente: 'Ministerio de Cultura y Juventud',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2015-09',
    hasta: '2015-12'
  },

  {
    titulo: 'Convenio entre el Banco Centroamericano de Integración Económica (BCIE) y el Instituto Centroamericano de Administración Pública (ICAP)',
    cliente: 'Banco Centroamericano de Integración Económica (BCIE)',
    etiquetas: ['economia', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2025-03',
    hasta: '2026-03'
  },
  {
    titulo: 'Diagnóstico del perfil socioeconómico y las posibles oportunidades económicas/laborales alternativas para las comunidades de pesca artesanal, actividad acuícola y molusquera, en pequeña escala en dos territorios seleccionados de Costa Rica',
    cliente: 'Banco Mundial',
    etiquetas: ['economia', 'alimentaria', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Costa Rica',
    desde: '2022-10',
    hasta: '2023-03'
  },
  {
    // Mismo nombre que el convenio INDER de "Proyectos de Inversión", con
    // otro período — así viene en el brochure (¿dos etapas?).
    titulo: 'Convenio Específico para la Optimización de las cadenas de valor de la actividad acuícola en CR entre el ICAP y el INDER',
    cliente: 'Instituto de Desarrollo Rural (INDER)',
    etiquetas: ['mipymes', 'economia', 'alimentaria'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2021-12',
    hasta: '2023-10'
  },
  {
    titulo: 'Elaboración del estudio socioeconómico de la Región Pacífico Central para la implementación del Proyecto Terminal Pacífico',
    cliente: 'Refinadora Costarricense de Petróleo (RECOPE)',
    etiquetas: ['infraestructura', 'economia', 'energia'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2020-01',
    hasta: '2020-12'
  },
  {
    titulo: 'Diseño de un Programa de Formación para el uso de herramientas de visualización interactiva para la política social, dirigida a personas funcionarias de instituciones de la Estrategia Puente al Desarrollo (EPD)',
    cliente: 'Organización Internacional del Trabajo (OIT)',
    etiquetas: ['politica', 'tecnologia', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Costa Rica',
    desde: '2020-12',
    hasta: '2021-05'
  },
  {
    titulo: 'Elaboración de los pronósticos de demanda a largo y corto plazo para los productos que distribuye RECOPE',
    cliente: 'Refinadora Costarricense de Petróleo (RECOPE)',
    etiquetas: ['economia', 'energia'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2019-07',
    hasta: '2019-12'
  }
];

PROYECTOS_AT.forEach((p, i) => {
  p.id = i + 1;
});

export const getProyecto = (id) => PROYECTOS_AT.find((p) => p.id === id);

// Países del mapa de Presencia (códigos de RegionalMap.jsx) que cubre
// cada región. "Centroamérica" son los siete países centroamericanos; la
// República Dominicana sólo entra cuando la región la nombra (o dice
// "Caribe", porque es el único país caribeño del mapa).
const CENTROAMERICA = ['GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA'];
export const REGION_PAISES = {
  'Costa Rica': ['CR'],
  Guatemala: ['GT'],
  'Centroamérica': CENTROAMERICA,
  'Centroamérica y Rep. Dominicana': [...CENTROAMERICA, 'DO'],
  'Centroamérica y Caribe': [...CENTROAMERICA, 'DO'],
  'Costa Rica, Colombia y México': ['CR', 'CO', 'MX'],
  'Internacional (Unión Europea)': []
};

export const proyectosDePais = (codigo) =>
  PROYECTOS_AT.filter((p) => (REGION_PAISES[p.region] || []).includes(codigo));

// Un proyecto es "regional" cuando su región abarca más de un país.
export const esRegional = (p) => (REGION_PAISES[p.region] || []).length > 1;

// Socios del carrusel "Organismos y Socios" (ids de AlliesMarquee.jsx) y
// cómo aparecen dentro del campo `cliente` de los proyectos. CEPAL y OEA
// no figuran como clientes en ningún proyecto de la clasificación.
const SOCIO_PATRON = {
  sica: /\bSICA\b/,
  'ops-oms': /\(OPS\)/,
  bid: /\(BID\)/,
  flacso: /FLACSO/,
  bcie: /\bBCIE\b/,
  aecid: /Agencia Española de Cooperación|AECID/
};

export const proyectosDeSocio = (socio) => {
  const patron = SOCIO_PATRON[socio];
  return patron ? PROYECTOS_AT.filter((p) => patron.test(p.cliente)) : [];
};
