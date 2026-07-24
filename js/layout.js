/* ==========================================
   FIFA WORLD CUP 2026 - SHARED LAYOUT
   js/layout.js
   ========================================== */

import { initNavbar } from './navbar.js';

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio', href: 'index.html' },
  { id: 'noticias', label: 'Noticias', href: 'noticias.html' },
  { id: 'partidos', label: 'Partidos', href: 'partidos.html' },
  { id: 'posiciones', label: 'Clasificación', href: 'posiciones.html' },
  { id: 'equipos', label: 'Equipos', href: 'equipos.html' },
  { id: 'ciudades', label: 'Ciudades Anfitrionas', href: 'ciudades.html' },
  { id: 'ranking', label: 'Ranking FIFA', href: 'ranking.html' },
  { id: 'eventos', label: 'Torneos', href: 'eventos.html' }
];

function renderHeader(activePage) {
  const header = document.getElementById('site-header');
  if (!header) return;

  const navLinks = NAV_ITEMS.map(item => `
    <a href="${item.href}" class="nav-link${activePage === item.id ? ' active' : ''}">${item.label}</a>
  `).join('');

  header.innerHTML = `
    <div class="container header-inner">
      <div class="header-brand-row">
        <a href="index.html" class="brand-logo" aria-label="Inicio FIFA World Cup 2026">
          <div class="logo-badge">26</div>
          <div class="brand-info">
            <p class="brand-title">FIFA 2026</p>
            <p class="brand-subtitle">Estados Unidos • México • Canadá</p>
          </div>
        </a>
        <button class="menu-toggle" aria-label="Abrir menú de navegación" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <nav class="main-nav" aria-label="Navegación principal">
        ${navLinks}
      </nav>
    </div>
  `;
}

function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <div class="footer-columns">
        <div class="footer-brand">
          <h3>FIFA World Cup 2026</h3>
          <p>El torneo más grande de la historia del fútbol mundial, celebrado en Estados Unidos, México y Canadá.</p>
        </div>
        <div class="footer-col">
          <h4>Enlaces Rápidos</h4>
          <ul class="footer-links">
            <li><a href="partidos.html">Calendario Completo</a></li>
            <li><a href="posiciones.html">Clasificación</a></li>
            <li><a href="equipos.html">Equipos</a></li>
            <li><a href="ciudades.html">Ciudades Anfitrionas</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Explora el Mundial</h4>
          <ul class="footer-links">
            <li><a href="balon.html">Balón Oficial</a></li>
            <li><a href="archivos.html">Archivo de Videos</a></li>
            <li><a href="eventos.html">Próximos Torneos</a></li>
            <li><a href="contacto.html">Contacto</a></li>
            <li><a href="sobre-nosotros.html">Sobre Nosotros</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 FIFA World Cup. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
}

export function initLayout(activePage) {
  renderHeader(activePage);
  renderFooter();
  initNavbar();
}

export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
