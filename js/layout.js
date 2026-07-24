/* ==========================================
   FIFA WORLD CUP 2026 - SHARED LAYOUT
   js/layout.js
   ========================================== */

import { initNavbar } from './navbar.js';

const MAIN_NAV = [
  { id: 'inicio', label: 'Inicio', href: 'index.html' },
  { id: 'noticias', label: 'Noticias', href: 'noticias.html' },
  { id: 'partidos', label: 'Partidos', href: 'partidos.html' },
  { id: 'clasificacion', label: 'Clasificación', href: 'clasificacion.html' },
  { id: 'equipos', label: 'Equipos', href: 'equipos.html' },
  { id: 'ranking', label: 'Ranking', href: 'ranking-fifa.html' },
  { id: 'sedes', label: 'Ciudades Anfitrionas', href: 'ciudades-anfitrionas.html' },
  { id: 'identidad', label: 'Identidad', href: 'identidad.html' },
  { id: 'eventos', label: 'Próximos Eventos', href: 'torneos.html' },
  { id: 'archivos', label: 'Archivos', href: 'archivos.html' }
];

const FOOTER_NAV = [
  { id: 'ods', label: 'ODS', href: 'ods.html' },
  { id: 'contacto', label: 'Contacto', href: 'contacto.html' },
  { id: 'nosotros', label: 'Sobre Nosotros', href: 'nosotros.html' }
];

const MAIN_ACTIVE_BY_FILE = {
  'index.html': 'inicio',
  'noticias.html': 'noticias',
  'partidos.html': 'partidos',
  'clasificacion.html': 'clasificacion',
  'equipos.html': 'equipos',
  'ranking-fifa.html': 'ranking',
  'ciudades-anfitrionas.html': 'sedes',
  'identidad.html': 'identidad',
  'torneos.html': 'eventos',
  'archivos.html': 'archivos'
};

function getCurrentFile() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
}

function renderHeader(activeMain) {
  const header = document.getElementById('site-header');
  if (!header) return;

  const mainLinks = MAIN_NAV.map(item => `
    <a href="${item.href}" class="nav-link${activeMain === item.id ? ' active' : ''}">${item.label}</a>
  `).join('');

  header.innerHTML = `
    <div class="container">
      <div class="header-top">
        <a href="index.html" class="brand-logo" aria-label="Inicio FIFA World Cup 2026">
          <img src="../imagenes/logoOficialActualizado.png" alt="FIFA World Cup 2026" class="brand-logo-img" width="44" height="44" />
          <div class="brand-info">
            <h1>FIFA WORLD CUP 2026</h1>
          </div>
        </a>
        <nav class="main-nav" aria-label="Navegación principal">
          ${mainLinks}
        </nav>
        <button class="menu-toggle" aria-label="Abrir menú de navegación" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  `;
}

function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  const footerLinks = FOOTER_NAV.map(item => `
    <li><a href="${item.href}">${item.label}</a></li>
  `).join('');

  footer.innerHTML = `
    <div class="container">
      <div class="footer-columns">
        <div class="footer-brand">
          <h3>FIFA World Cup 2026</h3>
          <p>El torneo más grande de la historia del fútbol mundial, celebrado en Estados Unidos, México y Canadá.</p>
        </div>
        <div class="footer-col footer-col-info">
          <h4>Información</h4>
          <ul class="footer-links">
            ${footerLinks}
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 FIFA World Cup. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
}

export function initLayout() {
  const currentFile = getCurrentFile();
  const activeMain = MAIN_ACTIVE_BY_FILE[currentFile] || null;

  renderHeader(activeMain);
  renderFooter();
  initNavbar();
}

export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
