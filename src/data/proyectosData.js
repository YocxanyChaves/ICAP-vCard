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
 * - tituloEn: el título en inglés (se muestra con el idioma en inglés;
 *            si falta, cae al español). Leerlo siempre con tituloDe().
 * - cliente: organización / cliente.
 * - clienteEn: el cliente en inglés (clienteDe()). `cliente` (en español)
 *            sigue siendo el que se usa para contar clientes y para
 *            reconocer a los socios (SOCIO_PATRON).
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

export const PROYECTOS_AT = [
  {
    titulo: 'Fortalecimiento de capacidades compras públicas y ecoetiquetado',
    tituloEn: 'Capacity building in public procurement and eco-labeling',
    cliente: 'Agencia de cooperación Alemana para el Desarrollo (GIZ)',
    clienteEn: 'German Agency for International Cooperation (GIZ)',
    etiquetas: ['politica', 'ambiente', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Costa Rica',
    desde: '2024-04',
    hasta: '2025-03'
  },
  {
    titulo: 'Capacitación Regulación y Políticas Públicas en el Sector Energía',
    tituloEn: 'Training in Regulation and Public Policy in the Energy Sector',
    cliente: 'Instituto Costarricense de Electricidad (ICE)',
    clienteEn: 'Costa Rican Electricity Institute (ICE)',
    etiquetas: ['politica', 'energia'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2024-09',
    hasta: '2027-02'
  },
  {
    titulo: 'Análisis de factores limitando la implementación basada en resultados por el Ministerio de Educación Pública de Costa Rica',
    tituloEn: 'Analysis of factors limiting results-based implementation by Costa Rica\'s Ministry of Public Education',
    cliente: 'Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura (UNESCO)',
    clienteEn: 'United Nations Educational, Scientific and Cultural Organization (UNESCO)',
    etiquetas: ['politica', 'transformacion', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Costa Rica',
    desde: '2021-10',
    hasta: '2021-12'
  },
  {
    titulo: 'Consultoría de emprendimientos culturales en el marco de la Estrategia Costa Rica creativa y cultural',
    tituloEn: 'Consultancy on cultural entrepreneurship under the Creative and Cultural Costa Rica Strategy',
    cliente: 'Fundación Parque Metropolitano La Libertad - Ministerio de Cultura y Juventud',
    clienteEn: 'La Libertad Metropolitan Park Foundation - Ministry of Culture and Youth',
    etiquetas: ['mipymes', 'economia'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2020-08',
    hasta: '2020-12'
  },
  {
    titulo: 'Elaboración de un diseño conceptual y propuesta de implementación, para la creación de la Unidad de Análisis de Políticas e Información en Niñez y Adolescencia',
    tituloEn: 'Conceptual design and implementation proposal for the creation of the Policy Analysis and Information Unit on Children and Adolescents',
    cliente: 'Fondo de las Naciones Unidas para la Infancia (UNICEF) · Patronato Nacional de la Infancia (PANI)',
    clienteEn: 'United Nations Children\'s Fund (UNICEF) · National Child Welfare Agency (PANI)',
    etiquetas: ['politica', 'transformacion', 'derechos', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Costa Rica',
    desde: '2019-12',
    hasta: '2020-10'
  },
  {
    titulo: 'Levantamiento de los modelos o tipología de MiPymes turísticas e indicadores de impacto del SBD',
    tituloEn: 'Survey of tourism MSME models and typologies, and SBD impact indicators',
    cliente: 'Sistema de Banca para el Desarrollo (SBD)',
    clienteEn: 'Development Banking System (SBD)',
    etiquetas: ['mipymes', 'economia'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2019-07',
    hasta: '2020-05'
  },
  {
    titulo: 'Elaboración de un estado actual y mapeo de expresiones y emprendimientos culturales del Patrimonio Cultural Inmaterial en los ámbitos de la artesanía y la cocina tradicional en Costa Rica, mediante una consulta a actores institucionales y privados',
    tituloEn: 'Current-state assessment and mapping of Intangible Cultural Heritage expressions and enterprises in crafts and traditional cuisine in Costa Rica, through a consultation with institutional and private stakeholders',
    cliente: 'Centro de Conservación Patrimonio Cultural',
    clienteEn: 'Cultural Heritage Conservation Center',
    etiquetas: ['mipymes', 'economia'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2018-10',
    hasta: '2018-12'
  },
  {
    titulo: 'Desarrollo de un diagnóstico sistemático e identificación de oportunidades de mejora para la Junta de Desarrollo de la Zona Sur (JUDESUR)',
    tituloEn: 'Systematic diagnosis and identification of improvement opportunities for the Southern Zone Development Board (JUDESUR)',
    cliente: 'Junta de Desarrollo de la Zona Sur (JUDESUR)',
    clienteEn: 'Southern Zone Development Board (JUDESUR)',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2018-02',
    hasta: '2018-10'
  },
  {
    titulo: 'Contratación de Servicios Profesionales para la Evaluación del Programa Integral de Abastecimiento de Agua para Guanacaste (Pacífico Norte)',
    tituloEn: 'Professional services for the evaluation of the Comprehensive Water Supply Program for Guanacaste (North Pacific)',
    cliente: 'Ministerio de Planificación Nacional y Política Económica (MIDEPLAN)',
    clienteEn: 'Ministry of National Planning and Economic Policy (MIDEPLAN)',
    etiquetas: ['infraestructura', 'politica', 'ambiente'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2018-06',
    hasta: '2018-11'
  },
  {
    titulo: 'Desarrollar el Plan Estratégico Institucional del Patronato Nacional de la Infancia 2018-2022',
    tituloEn: 'Institutional Strategic Plan 2018-2022 of the National Child Welfare Agency',
    cliente: 'Patronato Nacional de la Infancia (PANI)',
    clienteEn: 'National Child Welfare Agency (PANI)',
    etiquetas: ['transformacion', 'derechos'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2018-09',
    hasta: '2018-12'
  },
  {
    titulo: 'Curso de capacitación sobre “Planificación estratégica”',
    tituloEn: 'Training course on “Strategic Planning”',
    cliente: 'Instituto de Desarrollo Profesional (IDP) · Ministerio de Educación Pública (MEP)',
    clienteEn: 'Professional Development Institute (IDP) · Ministry of Public Education (MEP)',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-07',
    hasta: '2017-11'
  },
  {
    titulo: 'Instrumentalización de la propuesta de modelo de gestión de Patrimonio Cultural Inmaterial, mediante una metodología de investigación cualitativa',
    tituloEn: 'Operationalization of the proposed Intangible Cultural Heritage management model through a qualitative research methodology',
    cliente: 'Ministerio de Cultura y Juventud',
    clienteEn: 'Ministry of Culture and Youth',
    etiquetas: ['politica'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-07',
    hasta: '2017-11'
  },
  {
    titulo: 'Evaluación del Programa Emprendimientos y MIPYMES Culturales Creativas para la Secretaría de Planificación Institucional (SEPLA)',
    tituloEn: 'Evaluation of the Cultural and Creative Enterprises and MSMEs Program for the Institutional Planning Secretariat (SEPLA)',
    cliente: 'Ministerio de Cultura y Juventud',
    clienteEn: 'Ministry of Culture and Youth',
    etiquetas: ['mipymes', 'politica'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-07',
    hasta: '2018-01'
  },
  {
    titulo: 'Analizar y establecer tres líneas base de los Indicadores de Resultado y Gestión de los primeros tres Ejes Estratégicos de la Política Nacional de Gestión del Riesgo 2016-2030',
    tituloEn: 'Analysis and establishment of three baselines for the Outcome and Management Indicators of the first three Strategic Pillars of the National Risk Management Policy 2016-2030',
    cliente: 'Comisión Nacional de Emergencias (CNE)',
    clienteEn: 'National Emergency Commission (CNE)',
    etiquetas: ['politica', 'ambiente'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2016-10',
    hasta: '2017-03'
  },

  {
    titulo: 'II Fase: Desarrollar perfiles de proyectos, conforme a las pautas que establecen las metodologías de MIDEPLAN',
    tituloEn: 'Phase II: Development of project profiles following MIDEPLAN methodologies',
    cliente: 'Instituto Costarricense de Puertos del Pacífico (INCOP)',
    clienteEn: 'Costa Rican Pacific Ports Institute (INCOP)',
    etiquetas: ['infraestructura', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2023-04',
    hasta: '2024-04'
  },
  {
    titulo: 'Convenio Específico para la Optimización de las cadenas de valor de la actividad acuícola en CR entre el ICAP y el INDER',
    tituloEn: 'Specific Agreement between ICAP and INDER to optimize aquaculture value chains in Costa Rica',
    cliente: 'Instituto de Desarrollo Rural (INDER)',
    clienteEn: 'Rural Development Institute (INDER)',
    etiquetas: ['mipymes', 'economia', 'alimentaria'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2023-04',
    hasta: '2025-04'
  },
  {
    titulo: 'Desarrollar perfiles de proyectos, conforme a las pautas que establecen las metodologías de MIDEPLAN',
    tituloEn: 'Development of project profiles following MIDEPLAN methodologies',
    cliente: 'Instituto Costarricense de Puertos del Pacífico (INCOP)',
    clienteEn: 'Costa Rican Pacific Ports Institute (INCOP)',
    etiquetas: ['infraestructura', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2022-10',
    hasta: '2023-10'
  },
  {
    titulo: 'Elaborar el Portafolio de Inversión Pública del INCOP y el Portafolio Subordinado del Fideicomiso INCOP-ICT-BNCR',
    tituloEn: 'Development of INCOP\'s Public Investment Portfolio and the Subordinate Portfolio of the INCOP-ICT-BNCR Trust',
    cliente: 'Instituto Costarricense de Puertos del Pacífico (INCOP)',
    clienteEn: 'Costa Rican Pacific Ports Institute (INCOP)',
    etiquetas: ['infraestructura', 'economia', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2022-10',
    hasta: '2023-10'
  },
  {
    titulo: 'Iniciativa Centroamericana para una Inversión Pública con Valor Agregado (INCENTIVA)',
    tituloEn: 'Central American Initiative for Value-Added Public Investment (INCENTIVA)',
    cliente: 'Agencia de cooperación Alemana para el Desarrollo (GIZ)',
    clienteEn: 'German Agency for International Cooperation (GIZ)',
    etiquetas: ['infraestructura', 'politica', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Centroamérica',
    desde: '2020-12',
    hasta: '2021-12'
  },
  {
    titulo: 'Elaboración de perfiles de proyecto del Instituto Costarricense de Turismo (ICT)',
    tituloEn: 'Project profiles for the Costa Rican Tourism Board (ICT)',
    cliente: 'Instituto Costarricense de Turismo (ICT)',
    clienteEn: 'Costa Rican Tourism Board (ICT)',
    etiquetas: ['infraestructura', 'economia'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2020-01',
    hasta: '2020-07'
  },
  {
    titulo: 'Programa de capacitación para la Formulación y evaluación de proyectos en inversión local',
    tituloEn: 'Training program on the formulation and evaluation of local investment projects',
    cliente: 'Instituto de Fomento y Asesoría Municipal (IFAM)',
    clienteEn: 'Municipal Development and Advisory Institute (IFAM)',
    etiquetas: ['infraestructura', 'politica'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-03',
    hasta: '2017-05'
  },
  {
    titulo: 'Curso sobre Formulación y Seguimiento de Proyectos',
    tituloEn: 'Course on Project Formulation and Monitoring',
    cliente: 'Dirección de Planificación, Ministerio de Salud',
    clienteEn: 'Planning Directorate, Ministry of Health',
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
    tituloEn: 'Training program on the formulation and evaluation of public investment projects',
    cliente: 'Consejo de Seguridad Vial (COSEVI)',
    clienteEn: 'Road Safety Council (COSEVI)',
    etiquetas: ['infraestructura', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2015-11',
    hasta: '2015-08'
  },

  {
    titulo: 'Promoción del Empleo Juvenil y de la Resiliencia en Centroamérica (CaPAZ II)',
    tituloEn: 'Promoting Youth Employment and Resilience in Central America (CaPAZ II)',
    cliente: 'Agencia de cooperación Alemana para el Desarrollo (GIZ)',
    clienteEn: 'German Agency for International Cooperation (GIZ)',
    etiquetas: ['economia', 'derechos', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Centroamérica',
    desde: '2023-04',
    hasta: '2026-01'
  },
  {
    titulo: 'Capacitación en diplomacia para personas funcionarias del Ministerio de Relaciones Exteriores de la República de Guatemala',
    tituloEn: 'Diplomacy training for officials of the Ministry of Foreign Affairs of the Republic of Guatemala',
    cliente: 'Academia de Diplomacia de Guatemala y Ministerio de Relaciones Exteriores',
    clienteEn: 'Diplomatic Academy of Guatemala and Ministry of Foreign Affairs',
    etiquetas: ['cooperacion'],
    tipoCliente: 'nacional',
    region: 'Guatemala',
    desde: '2023-04',
    hasta: '2023-12'
  },
  {
    titulo: 'Levantamiento y toma física de activos en el Patronato Nacional de la Infancia (PANI)',
    tituloEn: 'Physical asset survey and inventory at the National Child Welfare Agency (PANI)',
    cliente: 'Patronato Nacional de la Infancia (PANI)',
    clienteEn: 'National Child Welfare Agency (PANI)',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2019-10',
    hasta: '2020-03'
  },
  {
    titulo: 'Curso de capacitación Administración Estratégica de Servicios de Salud para Enfermería',
    tituloEn: 'Training course on Strategic Management of Health Services for Nursing',
    cliente: 'Colegio de Enfermeras de Costa Rica',
    clienteEn: 'Costa Rican College of Nurses',
    etiquetas: ['transformacion', 'salud'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-05',
    hasta: '2017-06'
  },
  {
    titulo: 'Curso de capacitación sobre “Construcción de indicadores”',
    tituloEn: 'Training course on “Building Indicators”',
    cliente: 'Instituto de Desarrollo Profesional (IDP) · Ministerio de Educación Pública (MEP)',
    clienteEn: 'Professional Development Institute (IDP) · Ministry of Public Education (MEP)',
    etiquetas: ['politica', 'transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-04',
    hasta: '2017-07'
  },
  {
    titulo: 'Curso sobre evaluación expost y de impacto de proyectos sociales, con énfasis en salud',
    tituloEn: 'Course on ex-post and impact evaluation of social projects, with an emphasis on health',
    cliente: 'Ministerio de Salud (MINSA)',
    clienteEn: 'Ministry of Health (MINSA)',
    etiquetas: ['politica', 'salud'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2016-06',
    hasta: '2016-11'
  },
  {
    titulo: 'Facilitación y Coordinación del Plan Estratégico Institucional 2016-2020',
    tituloEn: 'Facilitation and Coordination of the Institutional Strategic Plan 2016-2020',
    cliente: 'Instituto Mixto de Ayuda Social (IMAS)',
    clienteEn: 'Joint Institute for Social Aid (IMAS)',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2015-09',
    hasta: '2016-04'
  },

  {
    titulo: 'Programa de formación en integración regional centroamericana, PAIRCA',
    tituloEn: 'Training program on Central American regional integration, PAIRCA',
    cliente: 'Segundo Programa de Apoyo a la Integración Regional Centroamericana (PAIRCA II)',
    clienteEn: 'Second Central American Regional Integration Support Program (PAIRCA II)',
    etiquetas: ['politica', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2013-06',
    hasta: '2014-03'
  },
  {
    titulo: 'Programa de Capacitación: Competencias para la gerencia y gestión de proyectos',
    tituloEn: 'Training Program: Competencies for project management',
    cliente: 'Consejo de Transporte Público (CTP)',
    clienteEn: 'Public Transport Council (CTP)',
    etiquetas: ['transformacion', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-01',
    hasta: '2017-04'
  },
  {
    titulo: 'Fortalecimiento del Sistema de Control Interno del Centro Costarricense de Producción Cinematográfica: Sistema de Autoevaluación y del SEVRI',
    tituloEn: 'Strengthening the Internal Control System of the Costa Rican Film Production Center: Self-Assessment System and SEVRI',
    cliente: 'Centro Costarricense de Producción Cinematográfica',
    clienteEn: 'Costa Rican Film Production Center',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2016-12',
    hasta: '2017-03'
  },
  {
    titulo: 'Programa de habilidades gerenciales para el Ministerio de Hacienda',
    tituloEn: 'Management skills program for the Ministry of Finance',
    cliente: 'Centro de Investigación y Formación Hacendaria (CIFH) del Ministerio de Hacienda',
    clienteEn: 'Center for Fiscal Research and Training (CIFH), Ministry of Finance',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2016-09',
    hasta: '2016-11'
  },
  {
    titulo: 'Proceso de Dimensionamiento del Servicio de Transporte Público y de la Programación del Servicio',
    tituloEn: 'Sizing of the Public Transport Service and Service Scheduling',
    cliente: 'Consejo de Transporte Público (CTP)',
    clienteEn: 'Public Transport Council (CTP)',
    etiquetas: ['politica', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2016-03',
    hasta: '2016-03'
  },
  {
    titulo: 'Curso sobre Formulación y Evaluación de Proyectos de Inversión',
    tituloEn: 'Course on Investment Project Formulation and Evaluation',
    cliente: 'Junta de Administración Portuaria y Desarrollo Económico de la Vertiente Atlántica (JAPDEVA)',
    clienteEn: 'Port Administration and Economic Development Board of the Atlantic Slope (JAPDEVA)',
    etiquetas: ['infraestructura', 'transporte'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2016-10',
    hasta: '2016-12'
  },
  {
    titulo: 'Diplomado para gestores de política de recursos humanos en salud en Centroamérica y República Dominicana',
    tituloEn: 'Diploma program for health human resources policy managers in Central America and the Dominican Republic',
    cliente: 'Organización Panamericana de la Salud (OPS)',
    clienteEn: 'Pan American Health Organization (OPS)',
    etiquetas: ['politica', 'salud', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Centroamérica y Rep. Dominicana',
    desde: '2015-01',
    hasta: '2015-11'
  },
  {
    titulo: 'Análisis y Mejora de la Gestión del Centro Costarricense de Producción Cinematográfica',
    tituloEn: 'Analysis and Improvement of the Management of the Costa Rican Film Production Center',
    cliente: 'Ministerio de Cultura y Juventud',
    clienteEn: 'Ministry of Culture and Youth',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2015-12',
    hasta: '2016-10'
  },
  {
    titulo: 'Programa de capacitación en competencias para la gerencia en organizaciones públicas',
    tituloEn: 'Training program on management competencies in public organizations',
    cliente: 'Dirección Nacional de Centros de Educación y Nutrición y de Centros Infantiles de Atención Integral (CEN-CINAI, Ministerio de Salud)',
    clienteEn: 'National Directorate of Education and Nutrition Centers and Comprehensive Child Care Centers (CEN-CINAI, Ministry of Health)',
    etiquetas: ['transformacion', 'alimentaria', 'salud'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2014-06',
    hasta: '2014-10'
  },

  {
    titulo: 'Programa de Desarrollo de Capacidades para Micro, Pequeñas y Medianas Empresas (MiPymes) de Centroamérica en eficiencia energética, producción más limpia y financiamiento verde',
    tituloEn: 'Capacity Development Program for Central American Micro, Small and Medium-sized Enterprises (MSMEs) in energy efficiency, cleaner production and green finance',
    cliente: 'Banco Centroamericano de Integración Económica (BCIE), el Gobierno de Alemania a través del KfW y la Unión Europea',
    clienteEn: 'Central American Bank for Economic Integration (BCIE), the Government of Germany through KfW, and the European Union',
    etiquetas: ['mipymes', 'energia', 'ambiente', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2024-12',
    hasta: '2025-12'
  },
  {
    titulo: 'Prioridades de adaptación para Centroamérica y República Dominicana a partir de la evidencia científica y los escenarios de cambio climático para la región',
    tituloEn: 'Adaptation priorities for Central America and the Dominican Republic based on scientific evidence and climate change scenarios for the region',
    cliente: 'Consejo Nacional de Rectores, Programa Estado de la Nación y Fundación Alta Tecnología',
    clienteEn: 'National Council of Rectors, State of the Nation Program and High Technology Foundation',
    etiquetas: ['politica', 'ambiente'],
    tipoCliente: 'nacional',
    region: 'Centroamérica y Rep. Dominicana',
    desde: '2024-06',
    hasta: '2024-07'
  },
  {
    titulo: 'Propuesta para el desarrollo de capacidades para la gestión integrada del agua y aguas residuales. Proyecto saneamiento CREW+',
    tituloEn: 'Proposal for capacity development in integrated water and wastewater management. CReW+ sanitation project',
    cliente: 'Agencia de cooperación Alemana para el Desarrollo (GIZ)',
    clienteEn: 'German Agency for International Cooperation (GIZ)',
    etiquetas: ['infraestructura', 'ambiente', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Centroamérica y Caribe',
    desde: '2021-10',
    hasta: '2022-08'
  },
  {
    titulo: 'BID Fase II: Replicabilidad del Mecanismo Regional para la Adopción del Blindaje Climático en la Infraestructura Pública',
    tituloEn: 'BID Phase II: Replicability of the Regional Mechanism for the Adoption of Climate-Proofing in Public Infrastructure',
    cliente: 'Banco Interamericano de Desarrollo (BID) · Contraparte: Centro de Coordinación para la Prevención de los Desastres en América Central y República Dominicana (CEPREDENAC)',
    clienteEn: 'Inter-American Development Bank (BID) · Counterpart: Coordination Center for Disaster Prevention in Central America and the Dominican Republic (CEPREDENAC)',
    etiquetas: ['infraestructura', 'ambiente', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Centroamérica y Rep. Dominicana',
    desde: '2016-11',
    hasta: '2019-11'
  },
  {
    titulo: 'Mecanismo regional para la gestión integral del riesgo y adopción del blindaje climático en la infraestructura pública',
    tituloEn: 'Regional mechanism for comprehensive risk management and adoption of climate-proofing in public infrastructure',
    cliente: 'Banco Interamericano de Desarrollo (BID)',
    clienteEn: 'Inter-American Development Bank (BID)',
    etiquetas: ['infraestructura', 'ambiente', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Centroamérica',
    desde: '2014-08',
    hasta: '2016-08'
  },
  {
    titulo: 'Consultoría en el área de ajuste económico por externalidades sociales y ambientales y análisis costo-beneficio final proyecto hidroeléctrico Diquís',
    tituloEn: 'Consultancy on economic adjustment for social and environmental externalities and final cost-benefit analysis of the Diquís hydroelectric project',
    cliente: 'Instituto Costarricense de Electricidad (ICE)',
    clienteEn: 'Costa Rican Electricity Institute (ICE)',
    etiquetas: ['infraestructura', 'economia', 'energia', 'ambiente'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2014-12',
    hasta: '2015-05'
  },

  {
    titulo: 'Cobertura sanitaria y acceso al empleo decente para la población migrante, refugiada y solicitante de refugio, en condiciones de vulnerabilidad en Costa Rica',
    tituloEn: 'Health coverage and access to decent work for vulnerable migrants, refugees and asylum seekers in Costa Rica',
    cliente: 'Fundación UCR - Agencia Española de Cooperación Internacional para el Desarrollo - Caja Costarricense de Seguro Social',
    clienteEn: 'UCR Foundation - Spanish Agency for International Development Cooperation - Costa Rican Social Security Fund',
    etiquetas: ['salud', 'derechos', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Costa Rica',
    desde: '2024-11',
    hasta: '2025-02'
  },
  {
    titulo: 'Curso de Introducción a la Formulación de un Proyecto',
    tituloEn: 'Introduction to Project Formulation course',
    cliente: 'Sistema de la Integración Centroamericana (SICA)',
    clienteEn: 'Central American Integration System (SICA)',
    etiquetas: ['cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2023-03',
    hasta: '2023-04'
  },
  {
    titulo: 'Plan de formación general para las personas integrantes de las instancias regionales para la atención de la intención suicida (IRAIS) y las instancias locales para atención de la intención suicida (ILAIS)',
    tituloEn: 'General training plan for members of the regional bodies for addressing suicidal intent (IRAIS) and the local bodies for addressing suicidal intent (ILAIS)',
    cliente: 'Ministerio de Salud (MINSA)',
    clienteEn: 'Ministry of Health (MINSA)',
    etiquetas: ['salud'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2021-01',
    hasta: '2021-09'
  },

  {
    titulo: 'THRIVE: Integración de la perspectiva de género para la excelencia inclusiva en la academia',
    tituloEn: 'THRIVE: Integrating the gender perspective for inclusive excellence in academia',
    cliente: 'Unión Europea',
    clienteEn: 'European Union',
    etiquetas: ['genero', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Internacional (Unión Europea)',
    desde: '2026-07',
    hasta: '2028-01'
  },
  {
    titulo: 'Convenio específico #1 de Cooperación entre el Centro para la Promoción de la Micro y Pequeña Empresa en Centroamérica y el Instituto Centroamericano de Administración Pública (ICAP)',
    tituloEn: 'Specific Cooperation Agreement #1 between the Center for the Promotion of Micro and Small Enterprises in Central America and the Central American Institute of Public Administration (ICAP)',
    cliente: 'Centro Regional de Promoción de la Micro, Pequeña y Mediana Empresa (CENPROMYPE)',
    clienteEn: 'Regional Center for the Promotion of Micro, Small and Medium-sized Enterprises (CENPROMYPE)',
    etiquetas: ['mipymes', 'genero', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2022',
    hasta: '2024-12'
  },
  {
    titulo: 'Evaluación del Programa Mujeres Empresarias MEIC',
    tituloEn: 'Evaluation of the MEIC Women Entrepreneurs Program',
    cliente: 'Ministerio de Planificación Nacional y Política Económica (MIDEPLAN)',
    clienteEn: 'Ministry of National Planning and Economic Policy (MIDEPLAN)',
    etiquetas: ['mipymes', 'politica', 'genero'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2017-08',
    hasta: '2018-01'
  },
  {
    titulo: 'Diplomado Regional en Materia de Prevención de la Violencia contra Mujeres, Trata de Personas, Femicidio / Feminicidio en Centroamérica',
    tituloEn: 'Regional Diploma Program on the Prevention of Violence against Women, Human Trafficking and Femicide in Central America',
    cliente: 'Secretaría General del Sistema de la Integración Centroamericana (SG-SICA)',
    clienteEn: 'General Secretariat of the Central American Integration System (SG-SICA)',
    etiquetas: ['genero', 'derechos', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2015-12',
    hasta: '2016-07'
  },
  {
    titulo: 'Elaboración de la Política de igualdad y equidad de género para la prestación de servicios institucionales 2015-2025 y su Plan de acción 2015-2020 del Instituto Mixto de Ayuda Social',
    tituloEn: 'Development of the Gender Equality and Equity Policy for institutional service delivery 2015-2025 and its 2015-2020 Action Plan for the Joint Institute for Social Aid',
    cliente: 'Instituto Mixto de Ayuda Social (IMAS)',
    clienteEn: 'Joint Institute for Social Aid (IMAS)',
    etiquetas: ['politica', 'genero', 'derechos'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2014-06',
    hasta: '2014-12'
  },

  {
    titulo: 'Herramientas de evaluación del impacto cualitativo, cuantitativo y de procesos de la justicia restaurativa en materia penal, en Costa Rica, Colombia y México',
    tituloEn: 'Tools for qualitative, quantitative and process impact evaluation of restorative justice in criminal matters in Costa Rica, Colombia and Mexico',
    cliente: 'Poder Judicial de Costa Rica',
    clienteEn: 'Judiciary of Costa Rica',
    etiquetas: ['politica', 'derechos'],
    tipoCliente: 'nacional',
    region: 'Costa Rica, Colombia y México',
    desde: '2018-10',
    hasta: '2018-11'
  },
  {
    titulo: 'CR: territorios desiguales y políticas locales de seguridad ¿desiguales?',
    tituloEn: 'Costa Rica: unequal territories and local security policies — unequal too?',
    cliente: 'Facultad Latinoamericana de Ciencias Sociales (FLACSO)',
    clienteEn: 'Latin American Faculty of Social Sciences (FLACSO)',
    etiquetas: ['politica', 'derechos'],
    tipoCliente: 'internacional',
    region: 'Costa Rica',
    desde: '2016-02',
    hasta: '2016-08'
  },
  {
    titulo: 'DB1: Profesionalización y tecnificación de las policías e instancias vinculadas a la seguridad y justicia en el nivel nacional y regional (fase II)',
    tituloEn: 'DB1: Professionalization and technical upgrading of police forces and security and justice bodies at the national and regional level (phase II)',
    cliente: 'Secretaría General del Sistema de la Integración Centroamericana (SG-SICA)',
    clienteEn: 'General Secretariat of the Central American Integration System (SG-SICA)',
    etiquetas: ['transformacion', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2014-09',
    hasta: '2015-05'
  },
  {
    titulo: 'DB1: Profesionalización y tecnificación de las policías e instancias vinculadas a la seguridad y justicia en el nivel nacional y regional (fase I)',
    tituloEn: 'DB1: Professionalization and technical upgrading of police forces and security and justice bodies at the national and regional level (phase I)',
    cliente: 'Secretaría General del Sistema de la Integración Centroamericana (SG-SICA)',
    clienteEn: 'General Secretariat of the Central American Integration System (SG-SICA)',
    etiquetas: ['transformacion', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2013-04',
    hasta: '2013-12'
  },

  {
    titulo: 'Realizar evaluaciones de la calidad de Correos de Costa Rica',
    tituloEn: 'Quality evaluations of Correos de Costa Rica',
    cliente: 'Autoridad Reguladora de Servicios Públicos (ARESEP)',
    clienteEn: 'Public Services Regulatory Authority (ARESEP)',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2022-06',
    hasta: '2022-08'
  },
  {
    titulo: 'Realizar evaluaciones de la calidad en la prestación del servicio social de comunicación postal de Correos de Costa Rica',
    tituloEn: 'Quality evaluations of the social postal communication service provided by Correos de Costa Rica',
    cliente: 'Autoridad Reguladora de Servicios Públicos (ARESEP)',
    clienteEn: 'Public Services Regulatory Authority (ARESEP)',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2019-07',
    hasta: '2019-11'
  },
  {
    titulo: 'Análisis y Documentación de los Procesos de Proveeduría',
    tituloEn: 'Analysis and Documentation of Procurement Processes',
    cliente: 'Ministerio de Cultura y Juventud',
    clienteEn: 'Ministry of Culture and Youth',
    etiquetas: ['transformacion'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2015-09',
    hasta: '2015-12'
  },

  {
    titulo: 'Convenio entre el Banco Centroamericano de Integración Económica (BCIE) y el Instituto Centroamericano de Administración Pública (ICAP)',
    tituloEn: 'Agreement between the Central American Bank for Economic Integration (BCIE) and the Central American Institute of Public Administration (ICAP)',
    cliente: 'Banco Centroamericano de Integración Económica (BCIE)',
    clienteEn: 'Central American Bank for Economic Integration (BCIE)',
    etiquetas: ['economia', 'cooperacion'],
    tipoCliente: 'sica',
    region: 'Centroamérica',
    desde: '2025-03',
    hasta: '2026-03'
  },
  {
    titulo: 'Diagnóstico del perfil socioeconómico y las posibles oportunidades económicas/laborales alternativas para las comunidades de pesca artesanal, actividad acuícola y molusquera, en pequeña escala en dos territorios seleccionados de Costa Rica',
    tituloEn: 'Assessment of the socioeconomic profile and potential alternative economic and employment opportunities for small-scale artisanal fishing, aquaculture and shellfish-harvesting communities in two selected territories of Costa Rica',
    cliente: 'Banco Mundial',
    clienteEn: 'World Bank',
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
    tituloEn: 'Specific Agreement between ICAP and INDER to optimize aquaculture value chains in Costa Rica',
    cliente: 'Instituto de Desarrollo Rural (INDER)',
    clienteEn: 'Rural Development Institute (INDER)',
    etiquetas: ['mipymes', 'economia', 'alimentaria'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2021-12',
    hasta: '2023-10'
  },
  {
    titulo: 'Elaboración del estudio socioeconómico de la Región Pacífico Central para la implementación del Proyecto Terminal Pacífico',
    tituloEn: 'Socioeconomic study of the Central Pacific Region for the implementation of the Pacific Terminal Project',
    cliente: 'Refinadora Costarricense de Petróleo (RECOPE)',
    clienteEn: 'Costa Rican Oil Refinery (RECOPE)',
    etiquetas: ['infraestructura', 'economia', 'energia'],
    tipoCliente: 'nacional',
    region: 'Costa Rica',
    desde: '2020-01',
    hasta: '2020-12'
  },
  {
    titulo: 'Diseño de un Programa de Formación para el uso de herramientas de visualización interactiva para la política social, dirigida a personas funcionarias de instituciones de la Estrategia Puente al Desarrollo (EPD)',
    tituloEn: 'Design of a Training Program on interactive visualization tools for social policy, aimed at officials of institutions in the Bridge to Development Strategy (EPD)',
    cliente: 'Organización Internacional del Trabajo (OIT)',
    clienteEn: 'International Labour Organization (OIT)',
    etiquetas: ['politica', 'tecnologia', 'cooperacion'],
    tipoCliente: 'internacional',
    region: 'Costa Rica',
    desde: '2020-12',
    hasta: '2021-05'
  },
  {
    titulo: 'Elaboración de los pronósticos de demanda a largo y corto plazo para los productos que distribuye RECOPE',
    tituloEn: 'Long- and short-term demand forecasts for the products distributed by RECOPE',
    cliente: 'Refinadora Costarricense de Petróleo (RECOPE)',
    clienteEn: 'Costa Rican Oil Refinery (RECOPE)',
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

// Título y cliente según el idioma activo ('es' | 'en').
export const tituloDe = (p, lang) => (lang === 'en' && p.tituloEn) || p.titulo;
export const clienteDe = (p, lang) => (lang === 'en' && p.clienteEn) || p.cliente;

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
