# Copa Mundial de la FIFA 2026 - Portal Web Oficial (UCAB Guayana)

Este repositorio contiene la implementación de la **Homepage (Pantalla de Inicio)** para la plataforma web de la **Copa Mundial de la FIFA 2026™**, desarrollada cumpliendo estrictamente con los estándares W3C, HTML5 Semántico, CSS3 Puro y JavaScript Vanilla (ES6+).

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
| **Móvil** | `max-width: 767px` | Menú desplegable hamburguesa interactivo con JS, disposición a 1 columna, botones y enlaces con área táctil mínima de 44px (`min-height: 48px`), scroll horizontal para partidos. |
| **Tablet** | `min-width: 768px` y `max-width: 1023px` | Grids de 2 columnas para noticias, torneos y ODS; optimización de escala tipográfica. |
| **Desktop** | `min-width: 1024px` | Navegación expandida multinivel, grids de 3 a 4 columnas, animaciones hover aceleradas por hardware. |

---

## ⚡ Estrategia de Caché Local (LocalStorage - 15 min TTL)
Para garantizar la velocidad de carga y mitigar la latencia producida por el *cold-start* del servidor API en Render (`https://wc-api-u378.onrender.com/wc-api/api/`), se implementó la siguiente política en `js/api.js`:

1. **Consulta Previa:** Antes de realizar una solicitud HTTP de red (`fetch`), la función `fetchWithCache()` verifica si existen datos almacenados en `localStorage` bajo la clave correspondiente.
2. **Validación de Expira (TTL):** Compara el timestamp guardado contra la hora actual (`Date.now() - timestamp`).
   * **Menor a 15 minutos (900,000 ms):** Retorna y renderiza instantáneamente la información guardada en caché.
   * **Expirado o Ausente:** Ejecuta la solicitud asíncrona `fetch()` utilizando `async/await`.
3. **Persistencia:** Al recibir respuesta exitosa, actualiza el registro en `localStorage` con un nuevo timestamp.
4. **Respaldo Asíncrono (Mock Fallback):** Ante fallos de red o errores 500 del servidor remoto, el sistema activa transparentemente una estructura de datos local para evitar pantallas en blanco y mantener la continuidad visual y de prueba.

---

## 📁 Estructura de Archivos del Proyecto

```plaintext
/
├── index.html               # Estructura semántica de la Homepage
├── css/
│   ├── main.css             # Estilos globales, resets y variables (:root)
│   ├── responsive.css       # Media Queries nativas (Móvil, Tablet, Desktop)
│   └── components.css       # Estilos de cards, slider, botones, nav y footer
├── js/
│   ├── api.js               # Cliente Fetch, fallback y gestión de caché (localStorage)
│   ├── slider.js            # Lógica interactiva del Hero Carousel y gestos táctiles
│   ├── navbar.js            # Menú hamburguesa móvil y accesibilidad (aria-expanded)
│   └── main.js              # Inicialización e inyección dinámica de datos al DOM
├── assets/
│   └── images/              # Recursos gráficos estáticos
└── README.md                # Documentación técnica del proyecto
```

---

## 🚀 Cómo Ejecutar Localmente
1. Clona o descarga este repositorio en tu equipo local.
2. Abre el archivo `index.html` directamente en cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
3. O bien, ejecuta un servidor local como Live Server en VS Code o HTTP Server en Python:
   ```bash
   python -m http.server 8000
   ```
4. Navega a `http://localhost:8000` en tu navegador.
