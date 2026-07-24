/* ==========================================
   FIFA WORLD CUP 2026 - CITIES & CITY DETAIL MODULE
   js/cities.js
   ========================================== */

import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

let allCities = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('🏙️ FIFA World Cup 2026 - Módulo de Ciudades Anfitrionas Inicializado');

  // 1. Initialize mobile navbar
  initLayout();

  // 2. Determine active page view
  if (document.getElementById('cities-grid-container') || document.getElementById('cities-full-container') || document.querySelector('.cities-grid')) {
    setupCountryFilter();
    loadCitiesView();
  } else if (document.getElementById('city-detail-container')) {
    loadCityDetailView();
  }
});

/**
 * Obtener todas las ciudades (Exportable según especificaciones)
 */
export async function getCitiesList(forceRefresh = false) {
  return await FIFA_API.getCities(forceRefresh);
}

/**
 * Obtener ciudad detallada por ID (Exportable según especificaciones)
 */
export async function getCityById(id, forceRefresh = false) {
  return await FIFA_API.getCityById(id, forceRefresh);
}

/**
 * Carga la lista de ciudades anfitrionas en la vista general
 */
async function loadCitiesView() {
  const container = document.getElementById('cities-grid-container') || 
                    document.getElementById('cities-full-container') || 
                    document.querySelector('.cities-grid');
  if (!container) return;

  renderSkeletons(container, 8);

  try {
    const citiesData = await getCitiesList();
    allCities = citiesData || [];

    if (!allCities || allCities.length === 0) {
      renderErrorState(container, 'No se encontraron ciudades anfitrionas disponibles.');
      return;
    }

    renderCitiesGrid(container, allCities);

  } catch (error) {
    console.error('Error al cargar la lista de ciudades:', error);
    renderErrorState(container, 'Ocurrió un error al obtener las ciudades de la API.');
  }
}

/**
 * Configura los eventos del filtro por país (#filter-country y #country-filter)
 */
function setupCountryFilter() {
  const filterSelect = document.getElementById('filter-country') || document.getElementById('country-filter');
  if (!filterSelect) return;

  filterSelect.addEventListener('change', (e) => {
    const selectedVal = e.target.value;
    const container = document.getElementById('cities-grid-container') || 
                      document.getElementById('cities-full-container') || 
                      document.querySelector('.cities-grid');

    if (!container) return;

    if (selectedVal === 'all' || selectedVal === 'Todos los países') {
      renderCitiesGrid(container, allCities);
    } else {
      const filtered = allCities.filter(c => 
        c.country.toLowerCase().trim() === selectedVal.toLowerCase().trim() ||
        c.countryCode.toLowerCase().trim() === selectedVal.toLowerCase().trim()
      );
      renderCitiesGrid(container, filtered);
    }
  });
}

/**
 * Renderiza las tarjetas de la grilla de ciudades
 */
function renderCitiesGrid(container, cities) {
  if (!container) return;

  if (!cities || cities.length === 0) {
    container.innerHTML = `
      <div class="no-matches-box" style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <p style="color: var(--text-secondary); font-size: 1.1rem;">No se encontraron sedes para el país seleccionado.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = cities.map(city => {
    const isoCode = city.countryCode || (city.country === 'México' ? 'MEX' : city.country === 'Canadá' ? 'CAN' : 'USA');

    return `
      <article class="city-card">
        <div class="city-card-img-wrap">
          <img src="${city.image}" alt="${city.stadium}" loading="lazy" />
          <span class="country-badge-iso ${isoCode}">${isoCode}</span>
        </div>
        <div class="city-card-content">
          <h3 class="city-card-name">${city.name}</h3>
          <div class="city-stadium-name">
            📍 <strong>Estadio:</strong> ${city.stadium}
          </div>
          <div class="city-capacity-info">
            👥 <strong>Capacidad:</strong> ${city.capacity || '70,000 personas'}
          </div>
          <a href="detalle-ciudad.html?id=${city.id}" class="btn-details">
            Ver detalles &rarr;
          </a>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * Carga la vista de detalle de ciudad en detalle-ciudad.html
 */
async function loadCityDetailView() {
  const container = document.getElementById('city-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const cityId = urlParams.get('id') || 'c1';

  renderDetailSkeleton(container);

  try {
    const city = await getCityById(cityId);

    if (!city) {
      container.innerHTML = `<div class="error-box"><p>No se encontró la información de la sede solicitada.</p><a href="ciudades.html" class="btn-retry">← Volver a Ciudades</a></div>`;
      return;
    }

    renderCityDetailHTML(container, city);

  } catch (error) {
    console.error('Error al cargar detalle de ciudad:', error);
    container.innerHTML = `
      <div class="error-box" style="text-align: center; padding: 3rem;">
        <h3>Error de conexión</h3>
        <p>No se pudo consultar los detalles técnicos de esta ciudad anfitriona.</p>
        <a href="ciudades.html" class="btn-retry" style="display: inline-block; margin-top: 1rem; text-decoration: none;">← Volver a Ciudades</a>
      </div>
    `;
  }
}

/**
 * Renderiza el detalle completo de la ciudad y su estadio
 */
function renderCityDetailHTML(container, city) {
  const isoCode = city.countryCode || (city.country === 'México' ? 'MEX' : city.country === 'Canadá' ? 'CAN' : 'USA');
  const stadiumInfo = city.stadiumInfo || {};
  const matches = city.matches || [];

  container.innerHTML = `
    <!-- Navegación superior -->
    <div style="margin-bottom: 1.5rem;">
      <a href="ciudades.html" style="display: inline-flex; align-items: center; gap: 0.5rem; color: var(--accent-mint); text-decoration: none; font-weight: 600; font-size: 0.95rem;">
        &larr; Volver a Ciudades Anfitrionas
      </a>
    </div>

    <!-- Hero / Banner Panorámico de la Ciudad -->
    <div style="position: relative; width: 100%; height: 360px; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 2.5rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-md);">
      <img src="${city.image}" alt="${city.name}" style="width: 100%; height: 100%; object-fit: cover;" />
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(13, 17, 23, 0.95) 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 2rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
          <span class="country-badge-iso ${isoCode}" style="position: static; font-size: 0.85rem; padding: 4px 12px;">${isoCode}</span>
          <span style="color: var(--text-secondary); font-size: 1rem; font-weight: 600;">${city.country}</span>
        </div>
        <h1 style="font-size: 2.8rem; font-weight: 900; color: #FFF; margin: 0; font-family: 'Rajdhani', sans-serif;">${city.name}</h1>
        <p style="color: var(--accent-mint); font-size: 1.2rem; font-weight: 700; margin-top: 0.25rem;">📍 Estadio Principal: ${city.stadium}</p>
      </div>
    </div>

    <!-- Sección: Acerca de la Ciudad -->
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 2rem;">
      <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem; font-family: 'Rajdhani', sans-serif; display: flex; align-items: center; gap: 0.5rem;">
        🌆 Acerca de ${city.name}
      </h2>
      <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.7; margin: 0;">
        ${city.description}
      </p>
    </div>

    <!-- Sección: Información del Estadio -->
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 2rem;">
      <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1.5rem; font-family: 'Rajdhani', sans-serif; display: flex; align-items: center; gap: 0.5rem;">
        🏟️ Información Técnica del Estadio
      </h2>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: center;">
        <div>
          <img src="${stadiumInfo.image || city.image}" alt="${city.stadium}" style="width: 100%; height: 220px; object-fit: cover; border-radius: var(--radius-md); border: 1px solid var(--border-color);" />
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.9rem;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
            <span style="color: var(--text-secondary);">Nombre del Estadio:</span>
            <strong style="color: var(--text-primary);">${city.stadium}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
            <span style="color: var(--text-secondary);">Capacidad Oficial:</span>
            <strong style="color: var(--accent-mint); font-weight: 800;">${city.capacity}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
            <span style="color: var(--text-secondary);">Tipo de Terreno:</span>
            <strong style="color: var(--text-primary);">${stadiumInfo.surface || 'Césped Híbrido FIFA'}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
            <span style="color: var(--text-secondary);">Año de Apertura:</span>
            <strong style="color: var(--text-primary);">${stadiumInfo.opened || '2010'}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">Coordenadas:</span>
            <strong style="color: var(--text-primary);">${stadiumInfo.coordinates || 'Coordenadas Oficiales'}</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección: Partidos Programados en esta Sede -->
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem;">
      <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1.5rem; font-family: 'Rajdhani', sans-serif; display: flex; align-items: center; gap: 0.5rem;">
        ⚽ Partidos Programados en esta Sede
      </h2>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
        ${matches.map(m => `
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span class="badge-tag" style="background: rgba(0, 245, 140, 0.15); color: var(--accent-mint); font-weight: 700;">${m.round}</span>
              <span style="font-size: 0.8rem; color: var(--text-secondary);">📅 ${m.datetime}</span>
            </div>
            <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin: 0.5rem 0;">${m.teams}</h4>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Skeletons para la vista de grilla
 */
function renderSkeletons(container, count = 8) {
  container.innerHTML = Array(count).fill(0).map(() => `
    <div class="skeleton" style="height: 320px; border-radius: var(--radius-lg);"></div>
  `).join('');
}

/**
 * Skeleton para la vista de detalle
 */
function renderDetailSkeleton(container) {
  container.innerHTML = `
    <div class="skeleton" style="height: 360px; border-radius: var(--radius-lg); margin-bottom: 2rem;"></div>
    <div class="skeleton" style="height: 200px; border-radius: var(--radius-lg); margin-bottom: 2rem;"></div>
    <div class="skeleton" style="height: 250px; border-radius: var(--radius-lg);"></div>
  `;
}

/**
 * Estado de error
 */
function renderErrorState(container, message) {
  container.innerHTML = `
    <div class="error-box" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">No se pudieron cargar las ciudades</h3>
      <p class="error-desc">${message}</p>
      <button class="btn-retry" id="btn-retry-cities" style="padding: 0.5rem 1rem; background: var(--accent-mint); color: #000; border: none; border-radius: 4px; font-weight: 700; cursor: pointer;">Reintentar</button>
    </div>
  `;

  const retryBtn = document.getElementById('btn-retry-cities');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => loadCitiesView());
  }
}
