/* js/ciudad-detalle.js */
import { FIFA_API } from './api.js';
import { initLayout, getQueryParam } from './layout.js';

document.addEventListener('DOMContentLoaded', async () => {
  initLayout('ciudades');
  const container = document.getElementById('detail-container');
  const name = getQueryParam('name');

  if (!container) return;

  try {
    const cities = await FIFA_API.getCities();
    const city = Array.isArray(cities) ? cities.find(c => c.name === name) : null;

    if (!city) {
      container.innerHTML = `
        <div class="placeholder-box">
          <h2>Ciudad no encontrada</h2>
          <p>No se encontró información para la sede solicitada.</p>
          <a href="ciudades.html" class="btn btn-secondary">Volver a ciudades</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="detail-header">
        <a href="ciudades.html" class="section-link">&larr; Volver a ciudades</a>
        <h1 class="section-title" style="font-size: 2.2rem; margin-top: 1rem;">${city.name}</h1>
      </div>
      <div class="detail-card info-card">
        <p><strong>Estadio:</strong> ${city.stadium || 'Por confirmar'}</p>
        <p><strong>País:</strong> ${city.country || 'N/D'}</p>
      </div>
    `;
  } catch (e) {
    console.error(e);
  }
});
