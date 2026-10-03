# Guía de arranque — CRM de la empresa

Todo lo que pediste: los conceptos generales, el desglose del esquema
que mandaste, la comparación de lenguajes y las opciones de hosting/
base de datos — retomando lo que ya habíamos definido antes
(Python/Django + PostgreSQL + React).

## 1. Conceptos generales que te conviene tener claros

Un CRM programado "a full" (no en Power BI) es, en el fondo, una
aplicación web normal con estas piezas:

- **Cliente-servidor / frontend-backend.** El **frontend** (React) es
  lo que la gente ve y con lo que hace clic — corre en el navegador de
  cada usuario. El **backend** (Django) vive en un servidor, guarda
  los datos y decide qué puede hacer cada quién. El frontend nunca
  toca la base de datos directamente: siempre le pide las cosas al
  backend.
- **API REST.** Es el "idioma" en el que frontend y backend se hablan:
  el frontend pide cosas a direcciones tipo `/api/proyectos/` usando
  verbos HTTP (`GET` para leer, `POST` para crear, `PUT`/`PATCH` para
  editar, `DELETE` para borrar), y el backend responde en JSON. Django
  con Django REST Framework arma esto por vos casi solo.
- **Base de datos relacional + ORM.** Los datos (proyectos, clientes,
  contactos) viven en tablas relacionadas entre sí (PostgreSQL). Un
  **ORM** (el de Django) te deja trabajar con esas tablas como si
  fueran clases de Python, sin escribir SQL a mano para lo básico —
  aunque igual conviene entender SQL por debajo, que ya lo sabés.
- **Migraciones.** Cada vez que cambiás la estructura de los datos
  (agregás un campo, una tabla), generás una "migración" que Django
  aplica a la base de datos. Es como un historial de cambios del
  esquema, para que todo el equipo tenga la misma estructura.
- **Autenticación vs. autorización.** Autenticación es "¿quién sos?"
  (login). Autorización es "¿qué podés hacer?" (roles/permisos — ej.
  un vendedor ve sus proyectos, un gerente los ve todos). En un CRM
  esto es central desde el día uno, no algo para "después".
- **Variables de entorno.** Datos sensibles o que cambian según el
  ambiente (contraseña de la base de datos, claves) NUNCA van escritos
  directo en el código — van en variables de entorno, distintas en tu
  máquina, en pruebas y en producción.
- **Control de versiones (Git).** Cada cambio se sube como commits;
  para trabajar en equipo sin pisarse, cada quien trabaja en su propia
  rama y se junta todo por Pull Request. Si la empresa va a tener más
  de una persona programando esto, vale la pena acordar esto desde ya.
- **Entornos: desarrollo vs. producción.** "Desarrollo" es tu máquina,
  donde probás cambios. "Producción" es la versión real que usa la
  empresa. Nunca se prueba código nuevo directo en producción.
- **Despliegue (deploy).** Es el proceso de llevar el código de tu
  máquina al servidor donde corre de verdad. Con las plataformas que
  recomiendo abajo, se resume a conectar el repositorio de Git y que
  la plataforma lo publique sola cada vez que hacés push.

Con esto ya tenés el vocabulario para no perderte en la conversación
técnica del equipo, aunque todavía no domines cada pieza a fondo.

## 2. El esquema que te compartieron

No es literal una pantalla o módulo por tarjeta — es una lista de
**beneficios/objetivos típicos de un CRM**, y en la empresa ya
marcaron cuáles SÍ aplican para el de ustedes (sin tachar) y cuáles
quedan **fuera de alcance** (tachados en verde): *Interacción mejorada
con el cliente* y *Cumplimiento legal*. Tiene sentido — el de ustedes
es un CRM **interno**, de seguimiento de proyectos, no una herramienta
de cara al cliente ni un sistema legal, así que esos dos no aplican.

Acá el objetivo de cada uno de los 10 que sí quedaron, traducido a lo
que ya sabemos de su proyecto (seguimiento de proyectos desde el
primer contacto hasta que terminan, con foco en rentabilidad):

1. **Mayor automatización** — que el sistema haga solo las tareas
   repetitivas (recordatorios, cambios de estado) en vez de que
   alguien las haga a mano. Ej.: avisar cuando un proyecto lleva
   tiempo sin movimiento.
2. **Información centralizada** — un solo lugar con todo (proyectos,
   clientes, contactos), en vez de Excel + Power BI + SharePoint
   sueltos como ahora. Es, literalmente, el problema que están
   resolviendo al salir de Power BI.
3. **Operaciones mejoradas** — que el proceso de dar seguimiento a un
   proyecto de inicio a fin fluya guiado por el sistema, no que el
   sistema sea sólo una bodega de datos sueltos.
4. **Rentabilidad** — esto ya lo tenían definido: mostrar cuánto dejó
   de ganancia neta cada proyecto y qué tipos son más rentables. Es
   casi literal una pantalla/reporte del sistema.
5. **Mayor productividad** — que el equipo pierda menos tiempo
   buscando información o hago tareas manuales.
6. **Espacio de trabajo móvil** — poder consultar/actualizar desde el
   celular. Con React esto se resuelve haciendo el diseño responsive
   (que se adapte a pantalla chica) — no hace falta una app aparte.
7. **Toma de decisiones basadas en datos** — el dashboard con
   gráficos/reportes (lo que hoy hacen en Power BI), para que
   gerencia decida con números.
8. **Proceso de ventas optimizado** — el "pipeline": ver en qué etapa
   está cada proyecto desde el primer contacto hasta que cierra.
   Calza directo con lo que ya tenían anotado del objetivo del
   sistema.
9. **Comunicación contextual** — que al ver un proyecto/cliente, se
   vea ahí mismo el historial de notas/conversaciones relacionadas,
   sin tener que buscarlas en otro lado.
10. **Colaboración sencilla del equipo** — que varias personas
    trabajen sobre los mismos proyectos sin pisarse (permisos, notas
    compartidas, responsables asignados).

**Posible agrupación en fases** (primer borrador, para afinar cuando
tengan más claro qué va primero):
- **Fase 1 — la base:** información centralizada + rentabilidad +
  toma de decisiones basadas en datos (esto es, ni más ni menos, lo
  que hoy resuelve el Power BI que quieren reemplazar).
- **Fase 2 — el seguimiento:** proceso de ventas optimizado +
  operaciones mejoradas + comunicación contextual (el "pipeline" de
  proyectos en sí).
- **Fase 3 — pulido:** automatización + productividad + colaboración
  del equipo + espacio de trabajo móvil.

## 3. Lenguajes: lo que ya sabés vs. qué más convendría

**Lo que ya manejás:** SQL, JavaScript/TypeScript, HTML/CSS.
**Lo que ya habían elegido para esto:** Python, para el backend con
Django (sería el único lenguaje nuevo a aprender).

¿Tiene sentido esa elección o convendría otra? Comparando en serio:

- **Python + Django (la opción ya elegida).** La razón de peso más
  fuerte para un CRM específicamente: Django trae de fábrica un
  **panel de administración** (Django Admin) — una interfaz para
  crear/editar/borrar registros sin programarla vos misma. Para un
  CRM interno eso es un ahorro enorme de tiempo. Además el ORM es muy
  maduro, hay mucha documentación en español, y la curva de
  aprendizaje desde cero (viniendo de programar en general) es de las
  más suaves que hay. Contra: es un lenguaje más que sumar a tu caja
  de herramientas.
- **Node.js/Express o NestJS + TypeScript.** La ventaja fuerte: ya
  sabés TypeScript, así que backend y frontend quedarían en el MISMO
  lenguaje — menos cambio de "modo mental" al programar. Pero pierde
  justo lo que más ayuda a un CRM: no trae un panel de admin gratis
  (hay que armarlo o instalar algo aparte), y el ecosistema para
  proyectos tipo CRUD/CRM es más disperso (hay que decidir vos misma
  más piezas sueltas).
- **PHP + Laravel.** Es MUY usado en sistemas de gestión empresarial
  tipo este, con paneles de administración también casi gratis
  (Filament) y hosting barato y abundante. Pero seguiría siendo un
  lenguaje nuevo (como Python), sin la ventaja de que ya sepas algo
  de él, y el ecosistema se siente menos ordenado que el de Django
  para este tipo de proyecto puntual.
- **Java + Spring o C# + .NET.** Son la opción "de verdad
  empresarial" — muy usados en CRMs grandes de compañías con equipos
  de desarrollo grandes. Para lo que pide tu empresa (barato, liviano,
  un proyecto chico) son overkill: más pesados de escribir, de
  desplegar y de mantener sin necesidad.
- **Ruby on Rails.** Filosofía parecida a Django (trae mucho resuelto
  de fábrica), pero hoy tiene menos comunidad/hosting barato que
  Python, y lo tendrías que aprender desde cero igual — sin ninguna
  ventaja extra sobre Python para este caso.

**Conclusión:** Python + Django sigue siendo la opción más sensata —
no sólo "porque ya se eligió", sino porque el panel de administración
gratis encaja perfecto con un CRM interno, y la curva de aprendizaje
es razonable. Vale la pena que lo puedas explicar así en la empresa,
en vez de sólo repetir la elección.

**Frontend:** seguí con React — ya lo manejás, no hay razón para
cambiarlo.

## 4. Base de datos: PostgreSQL

También ya elegido, y tiene sentido mantenerlo: es relacional (encaja
con cómo pensás los datos de proyectos/clientes), gratis y de código
abierto, se lleva perfecto con el ORM de Django, y **todas** las
opciones de hosting de abajo lo ofrecen ya administrado (sin que
tengas que instalar/mantener el motor de base de datos vos misma).

## 5. Dónde hostear (barato y liviano, como pide la empresa)

Investigué las opciones vigentes ahora mismo. Para un CRM interno de
uso bajo (no es un sitio público de mucho tráfico), lo más simple es
que Django sirva TANTO la API como el build ya compilado de React —
un solo servicio desplegado, sin tener que mantener dos hostings
separados ni pelear con CORS entre ellos.

| Opción | Costo aprox. | Para qué sirve |
|---|---|---|
| **Render** | Gratis (se "duerme" tras 15 min sin uso) o $7/mes con Postgres administrado | Buena opción inicial — deploy con git push, base de datos incluida |
| **Railway** | Desde ~$5/mes + uso (suele salir más barato que Render con carga baja, ronda $14/mes contra $20 de Render en cargas comparables) | Muy parecido a Render, cobra según uso real en vez de un monto fijo |
| **PythonAnywhere** | $10/mes fijo | El más simple de todos — hecho específicamente para Python, sin Docker ni configuración de despliegue que aprender |
| **VPS (DigitalOcean/Hetzner)** | Lo más barato en crudo | Sólo si alguien en el equipo ya sabe administrar servidores — hay que instalar y mantener todo a mano |

**Recomendación para arrancar:** Render o Railway — traen la base de
datos PostgreSQL administrada incluida, el despliegue es prácticamente
automático (conectás el repositorio de Git y listo), y no hay que
mantener ningún servidor. Se puede migrar a un VPS más adelante si el
proyecto crece y quieren ahorrar más, pero no tiene sentido empezar
ahí.

Sources:
- [Best Hosting for Django (2026) | StackPicker](https://www.stackpicker.dev/guides/django/hosting/)
- [Railway vs Render (2026): Pricing, Cold Starts, and When Each Wins](https://www.13labs.au/compare/railway-vs-render)
- [Django Hosting: 7 Options Compared (2026) | Granite.so](https://granite.so/hosting/django)

## 6. Qué sigue

1. Afinar la agrupación en fases de la sección 2 con el equipo (ese
   borrador es sólo un punto de partida).
2. Con las fases acordadas, armamos el modelo de datos (qué tablas:
   proyectos, clientes, contactos, etapas, usuarios/roles) antes de
   escribir la primera línea de código.
