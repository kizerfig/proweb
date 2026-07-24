/* js/ciudades.js */
import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout('ciudades');
  loadCities();
});

async function loadCities() {
  const container = document.getElementById('cities-full-container');
  if (!container) return;

  try {
    const cities = await FIFA_API.getCities();
    if (!Array.isArray(cities) || cities.length === 0) {
      container.innerHTML = `<p class="empty-message">No hay ciudades disponibles.</p>`;
      return;
    }

    container.innerHTML = cities.map(city => `
      <a href="ciudad-detalle.html?name=${encodeURIComponent(city.name)}" class="city-tile city-tile-link">
        <div class="city-icon" aria-hidden="true"></div>
        <span class="city-name">${city.name}</span>
        <span class="city-stadium">${city.stadium || ''}</span>
      </a>
    `).join('');
  } catch (e) {
    console.error('Error en ciudades:', e);
  }
}
