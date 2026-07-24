/* ==========================================
 FIFA WORLD CUP 2026 - CITIES MODULE
 js/cities.js
 ========================================== */

import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

let allCities = [];

document.addEventListener('DOMContentLoaded', () => {
 console.log(' FIFA World Cup 2026 - Ciudades Anfitrionas Initialized');

 // 1. Initialize Navbar
 initLayout();

 // 2. Setup Filter Listener
 setupCountryFilter();

 // 3. Load Cities
 loadCities();
});

async function loadCities() {
 const container = document.getElementById('cities-full-container');
 if (!container) return;

 try {
 const citiesData = await FIFA_API.getCities();
 allCities = citiesData || [];

 renderCities(container, allCities);
 } catch (error) {
 console.error('Error cargando ciudades:', error);
 container.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-secondary);">Ocurrió un error al obtener las ciudades anfitrionas.</p>`;
 }
}

function setupCountryFilter() {
 const filterSelect = document.getElementById('country-filter');
 if (!filterSelect) return;

 filterSelect.addEventListener('change', (e) => {
 const selectedVal = e.target.value;
 const container = document.getElementById('cities-full-container');

 if (selectedVal === 'all') {
 renderCities(container, allCities);
 } else {
 const filtered = allCities.filter(c => c.country.toLowerCase() === selectedVal.toLowerCase());
 renderCities(container, filtered);
 }
 });
}

function renderCities(container, cities) {
 if (!container) return;

 if (cities.length === 0) {
 container.innerHTML = `<div class="no-matches-box" style="grid-column: 1/-1;"><p>No se encontraron sedes para el país seleccionado.</p></div>`;
 return;
 }

 container.innerHTML = cities.map(city => {
 let badgeClass = 'mex';
 if (city.countryCode === 'USA' || city.country === 'Estados Unidos' || city.country === 'EE.UU.') badgeClass = 'usa';
 if (city.countryCode === 'CAN' || city.country === 'Canadá') badgeClass = 'can';

 return `
 <article class="city-card-full">
 <img src="${city.image}" alt="${city.stadium}" class="city-card-img" loading="lazy" />
 <div class="city-card-body">
 <div class="city-card-header">
 <h3 class="city-card-title">${city.name}</h3>
 <span class="country-badge ${badgeClass}">${city.countryCode || 'FIFA'}</span>
 </div>
 <div class="city-stadium-info">
 <span> <strong>País:</strong> ${city.country}</span>
 <span>️ <strong>Estadio:</strong> ${city.stadium}</span>
 <span> <strong>Capacidad:</strong> ${city.capacity || '70,000 personas'}</span>
 </div>
 <button class="btn-detail" onclick="alert('Estadio: ${city.stadium} (${city.name}, ${city.country}). Capacidad: ${city.capacity || 'N/A'}')">Ver detalles &rarr;</button>
 </div>
 </article>
 `;
 }).join('');
}
