# Copa Mundial de la FIFA 2026 - Portal Web Oficial (UCAB Guayana)

Este repositorio contiene la implementación de la **Homepage (`index.html`)**, la vista de **Noticias Destacadas (`noticias.html`)** y el **Calendario de Partidos (`partidos.html`)** para la plataforma web oficial de la **Copa Mundial de la FIFA 2026™**, desarrollada cumpliendo estrictamente con los estándares W3C, HTML5 Semántico, CSS3 Puro y JavaScript Vanilla (ES6+).

---

## 👥 Integrantes del Equipo
* **Abreu, Sodyl**
* **García, Bárbara**
* **Gómez, Daniela**
* **Kizer, Elliooth**
* **Valerio, Jesús**

**Cátedra:** Programación Orientada a la Web  
**Institución:** Universidad Católica Andrés Bello (UCAB Guayana)  

---

## 🛠️ Stack Técnico y Restricciones
* **HTML5 Semántico:** Uso exhaustivo de etiquetas estructurales (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) para maximizar la accesibilidad (a11y) y SEO.
* **CSS3 Puro (Modo Oscuro):** Arquitectura CSS modular usando variables en `:root` para mantener la paleta visual oficial:
  * Fondo Primario: `#0D1117`
  * Superficies y Tarjetas: `#161B22`, `#21262D`
  * Textos: `#F0F6FC`, `#8B949E`
  * Acentos: Menta `#00E676`, Azul `#1F6FEB`, Oro `#D29922`, Rojo `#FF3366`
* **JavaScript Vanilla (ES6+):** Programación nativa mediante módulos ES (`import`/`export`), sin dependencias ni bibliotecas externas (0 React, 0 Vue, 0 jQuery, 0 Tailwind, 0 Bootstrap).

---

## 📱 Diseño Responsivo y Breakpoints
La web implementa una arquitectura 100% responsive orientada a dispositivos móviles, tablets y monitores desktop:

| Dispositivo | Media Query / Breakpoint | Adaptaciones Principales |
| :--- | :--- | :--- |
| **Móvil** | `max-width: 767px` | Menú desplegable hamburguesa interactivo con JS, barra de filtros apilada verticalmente, grid a 1 columna, botones y enlaces con área táctil mínima de 44px (`min-height: 48px`). |
| **Tablet** | `min-width: 768px` y `max-width: 1023px` | Grids de 2 columnas para noticias y torneos; grid de partidos a 1 columna expandida; optimización tipográfica. |
| **Desktop** | `min-width: 1024px` | Navegación expandida multinivel, grid de partidos a 2 columnas (`matches-grid-full`), barra de filtros horizontal, animaciones hover aceleradas por hardware. |

---

## ⚡ Estrategia de Caché Local (LocalStorage - 15 min TTL)
Para garantizar la velocidad de carga y mitigar la latencia producida por el *cold-start* del servidor API en Render (`https://wc-api-u378.onrender.com/wc-api/api/`), se implementó la siguiente política en los módulos de JS (`api.js`, `news.js`, `matches.js`):

1. **Consulta Previa:** Comprobación de claves en `localStorage`: `fifa_news_data` para noticias y `fifa_matches_data` para partidos.
2. **Validación de Expira (TTL):** Compara el timestamp guardado contra la hora actual (`Date.now() - timestamp`).
   * **Menor a 15 minutos (900,000 ms):** Retorna y renderiza instantáneamente la información guardada en caché.
   * **Expirado o Ausente:** Ejecuta la solicitud asíncrona `fetch()` utilizando `async/await`.
3. **Persistencia & Reintento:** Al recibir respuesta exitosa, actualiza el registro en `localStorage`. Ante errores de red, activa el respaldo local y opciones de reintento.

---

## ⚽ Sistema de Filtros Multicriterio en Tiempo Real (`partidos.html`)
En la vista de partidos, el módulo `js/matches.js` evalúa simultáneamente ante eventos `change` e `input`:
* **Ciudad:** Filtrado por la sede del encuentro.
* **Ronda:** Fase de Grupos, Octavos, Cuartos, Semifinal, Final, etc.
* **Estatus:** Programado, En vivo (badge parpadeante) y Finalizado.
* **Grupo:** Grupo A al Grupo L.
* **Búsqueda libre:** Coincidencias en nombre o código ISO del equipo.
* **Estado Vacío:** En caso de no encontrar coincidencias, se muestra dinámicamente *"No se encontraron partidos para los filtros seleccionados"*.

---

## 📁 Estructura de Archivos del Proyecto

```plaintext
/
├── index.html               # Estructura semántica de la Homepage
├── noticias.html            # Vista de Noticias Destacadas (Enlace Noticias activo)
├── partidos.html            # Vista de Calendario de Partidos (Enlace Partidos activo + Barra de Filtros)
├── css/
│   ├── main.css             # Estilos globales, resets y variables (:root)
│   ├── responsive.css       # Media Queries nativas (Móvil, Tablet, Desktop)
│   └── components.css       # Estilos de cards, slider, botones, nav, badges, filter-bar y no-matches-box
├── js/
│   ├── api.js               # Cliente Fetch, fallback y gestión de caché (localStorage)
│   ├── slider.js            # Lógica interactiva del Hero Carousel y gestos táctiles
│   ├── navbar.js            # Menú hamburguesa móvil y accesibilidad (aria-expanded)
│   ├── main.js              # Inicialización e inyección dinámica de la Homepage
│   ├── news.js              # Carga, caché y renderizado de noticias.html
│   └── matches.js           # Carga, caché y filtrado dinámico en tiempo real de partidos.html
├── assets/
│   └── images/              # Recursos gráficos estáticos
└── README.md                # Documentación técnica del proyecto
```

---

## 🚀 Cómo Ejecutar Localmente
1. Clona o descarga este repositorio en tu equipo local.
2. Abre cualquiera de los archivos `index.html`, `noticias.html` o `partidos.html` directamente en tu navegador web.
3. O bien, ejecuta un servidor local:
   ```bash
   python -m http.server 8000
   ```
4. Navega a `http://localhost:8000` en tu navegador.
