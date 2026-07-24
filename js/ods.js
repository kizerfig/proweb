/* ==========================================
   FIFA WORLD CUP 2026 - ODS MODULE
   js/ods.js
   ========================================== */

import { FIFA_API } from './api.js';
import { initNavbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌱 FIFA World Cup 2026 - ODS Initialized');

  initNavbar();
  loadODSData();
});

async function loadODSData() {
  const container = document.getElementById('ods-grid-container');
  if (!container) return;

  try {
    const odsList = await FIFA_API.getODS();

    if (!odsList || odsList.length === 0) {
      container.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-secondary);">No hay información de ODS disponible.</p>`;
      return;
    }

    container.innerHTML = odsList.map(ods => `
      <div class="ods-card" style="padding: 1.75rem;">
        <div class="ods-header">
          <span class="ods-number" style="font-size: 1.8rem; color: var(--accent-mint);">ODS ${ods.number}</span>
        </div>
        <h3 class="ods-title" style="font-size: 1.2rem; font-weight: 800;">${ods.title}</h3>
        <p class="ods-desc" style="font-size: 0.9rem; line-height: 1.5; color: var(--text-secondary);">${ods.desc}</p>
        <div class="ods-stat" style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
          <span style="font-size: 1.1rem; color: var(--accent-mint);">🌱 ${ods.stat}</span>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error cargando ODS:', error);
    container.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-secondary);">Error al cargar los datos de ODS.</p>`;
  }
}
