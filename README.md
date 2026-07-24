# Copa Mundial de la FIFA 2026 - Portal Web Oficial (UCAB Guayana)

Portal web multi-página para la **Copa Mundial de la FIFA 2026™**, desarrollado con HTML5 Semántico, CSS3 Puro y JavaScript Vanilla (ES6+).

---

## Integrantes del Equipo
* **Abreu, Sodyl**
* **García, Bárbara**
* **Gómez, Daniela**
* **Kizer, Elliooth**
* **Valerio, Jesús**

**Cátedra:** Programación Orientada a la Web  
**Institución:** Universidad Católica Andrés Bello (UCAB Guayana)

---

## Estructura de Archivos HTML

```plaintext
/
├── index.html               # Página de inicio (hero, previews, ODS)
├── noticias.html            # Noticias destacadas
├── partidos.html            # Calendario con filtros
├── partido-detalle.html     # Detalle de un partido (?id=)
├── posiciones.html          # Clasificación / posiciones
├── equipos.html             # Listado de selecciones
├── equipo-detalle.html      # Detalle de equipo (?code=)
├── ciudades.html            # Ciudades anfitrionas
├── ciudad-detalle.html      # Detalle de ciudad (?name=)
├── archivos.html            # Archivo de videos
├── archivo-detalle.html     # Detalle de video (?id=)
├── balon.html               # Balón oficial
├── mascotas.html            # Mascotas oficiales
├── banda-sonora.html        # Banda sonora
├── eventos.html             # Eventos y torneos
├── ranking.html             # Ranking FIFA
├── contacto.html            # Formulario de contacto
├── sobre-nosotros.html      # Información del equipo
├── css/
│   ├── main.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── layout.js            # Header y footer compartidos
│   ├── navbar.js            # Menú móvil
│   ├── api.js               # API + caché localStorage
│   ├── main.js              # index.html
│   ├── news.js              # noticias.html
│   ├── matches.js           # partidos.html
│   ├── equipos.js           # equipos.html
│   ├── ciudades.js          # ciudades.html
│   ├── eventos.js           # eventos.html
│   ├── partido-detalle.js
│   ├── equipo-detalle.js
│   ├── ciudad-detalle.js
│   ├── page-init.js         # Páginas estáticas
│   └── slider.js
└── README.md
```

---

## Navegación

La barra superior (generada por `js/layout.js`) enlaza a las páginas principales:

| Enlace | Archivo |
|--------|---------|
| Inicio | `index.html` |
| Noticias | `noticias.html` |
| Partidos | `partidos.html` |
| Clasificación | `posiciones.html` |
| Equipos | `equipos.html` |
| Ciudades Anfitrionas | `ciudades.html` |
| Ranking FIFA | `ranking.html` |
| Torneos | `eventos.html` |

---

## Cómo Ejecutar Localmente

```bash
python -m http.server 8000
```

Abre `http://localhost:8000` en el navegador. Se requiere servidor local por los módulos ES de JavaScript.
