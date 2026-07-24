/* ==========================================
   FIFA WORLD CUP 2026 - TORNEOS MODULE
   js/torneos.js
   ========================================== */

import { FIFA_API } from './api.js';
import { initNavbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚩 FIFA World Cup 2026 - Torneos Initialized');

  initNavbar();
  loadTorneos();
});

async function loadTorneos() {
  const container = document.getElementById('torneos-grid-container');
  if (!container) return;

  try {
    const events = await FIFA_API.getEvents();

    if (!events || events.length === 0) {
      container.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-secondary);">No hay torneos registrados.</p>`;
      return;
    }

    container.innerHTML = events.map(event => `
      <div class="event-card" style="padding: 1.5rem;">
        <div class="event-top">
          <span class="org-tag" style="font-size: 0.85rem; color: var(--accent-mint);">${event.org}</span>
          <span class="status-badge ${event.status === 'Próximo' ? 'live' : 'scheduled'}">${event.status}</span>
        </div>
        <h3 class="event-title" style="font-size: 1.25rem; font-weight: 800; margin: 0.5rem 0;">${event.title}</h3>
        <div class="event-details" style="font-size: 0.9rem; gap: 0.5rem; color: var(--text-secondary);">
          <span>📅 <strong>Fechas:</strong> ${event.date}</span>
          <span>📍 <strong>Sedes:</strong> ${event.location}</span>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error cargando torneos:', error);
    container.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-secondary);">Error al cargar los torneos.</p>`;
  }
}
