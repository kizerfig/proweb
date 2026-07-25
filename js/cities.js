import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

let allCities = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('🏙️ FIFA World Cup 2026 - Módulo de Ciudades Anfitrionas Inicializado');
  initLayout();
  if (document.getElementById('cities-grid-container') || document.getElementById('cities-full-container') || document.querySelector('.cities-grid')) {
    setupCountryFilter();
    loadCitiesView();
  } else if (document.getElementById('city-detail-container')) {
    loadCityDetailView();
  }
});


export async function getCitiesList(forceRefresh = false) {
  return await FIFA_API.getCities(forceRefresh);
}


export async function getCityById(id, forceRefresh = false) {
  return await FIFA_API.getCityById(id, forceRefresh);
}


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

  container.innerHTML = cities.map(city => `
      <article class="city-card">
        <div class="city-card-img-wrap">
          <img src="${city.stadiumImage || city.image}" alt="${city.stadium}" loading="lazy" />
        </div>
        <div class="city-card-content">
          <h3 class="city-card-name">${city.name}</h3>
          <div class="city-country-name">
            🌎 <strong>País:</strong> ${city.country}
          </div>
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
    `).join('');
}


async function loadCityDetailView() {
  const container = document.getElementById('city-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const cityId = urlParams.get('id');

  if (!cityId) {
    container.innerHTML = `<div class="error-box"><p>No se indicó ninguna sede.</p><a href="ciudades-anfitrionas.html" class="btn-retry">← Volver a Ciudades</a></div>`;
    return;
  }

  renderDetailSkeleton(container);

  try {
    const city = await getCityById(cityId);

    if (!city) {
      container.innerHTML = `<div class="error-box"><p>No se encontró la información de la sede solicitada.</p><a href="ciudades-anfitrionas.html" class="btn-retry">← Volver a Ciudades</a></div>`;
      return;
    }

    document.title = `${city.stadium} - ${city.name} | Copa Mundial FIFA 2026`;
    renderCityDetailHTML(container, city);

  } catch (error) {
    console.error('Error al cargar detalle de ciudad:', error);
    container.innerHTML = `
      <div class="error-box" style="text-align: center; padding: 3rem;">
        <h3>Error de conexión</h3>
        <p>No se pudo consultar los detalles técnicos de esta ciudad anfitriona.</p>
        <a href="ciudades-anfitrionas.html" class="btn-retry" style="display: inline-block; margin-top: 1rem; text-decoration: none;">← Volver a Ciudades</a>
      </div>
    `;
  }
}


function renderCityDetailHTML(container, city) {
  const stadiumInfo = city.stadiumInfo || {};
  const matches = city.matches || [];
  const extraInfo = city.extraInfo;
  const heroImage = city.stadiumImage || stadiumInfo.image || city.image;
  const logoHtml = city.logo
    ? `<img src="${city.logo}" alt="Logo ${city.name}" style="width: 56px; height: 56px; object-fit: contain; background: rgba(255,255,255,0.08); border-radius: var(--radius-md); padding: 0.35rem;" />`
    : '';
  const officialLinkHtml = city.officialUrl
    ? `<a href="${city.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn-official-site" style="margin-top: 1.5rem; display: inline-flex;">Sitio oficial FIFA &rarr;</a>`
    : '';
  const extraInfoHtml = extraInfo && (extraInfo.title || extraInfo.description)
    ? `
      <div style="background: rgba(0, 245, 140, 0.06); border: 1px solid rgba(0, 245, 140, 0.2); border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1.5rem;">
        ${extraInfo.title ? `<h3 style="font-size: 1.1rem; font-weight: 800; color: var(--accent-mint); margin: 0 0 0.5rem;">${extraInfo.title}</h3>` : ''}
        ${extraInfo.description ? `<p style="color: var(--text-secondary); margin: 0; line-height: 1.6;">${extraInfo.description}</p>` : ''}
        ${extraInfo.hashtag ? `<p style="color: var(--text-primary); margin: 0.75rem 0 0; font-weight: 700;">${extraInfo.hashtag}</p>` : ''}
      </div>
    `
    : '';
  const technicalRows = [
    { label: 'Nombre del Estadio', value: city.stadium },
    { label: 'Ciudad Sede', value: city.name },
    { label: 'País', value: city.country },
    { label: 'Capacidad Oficial', value: city.capacity, accent: true },
    stadiumInfo.coordinates ? { label: 'Coordenadas', value: stadiumInfo.coordinates } : null,
    stadiumInfo.surface ? { label: 'Tipo de Terreno', value: stadiumInfo.surface } : null,
    stadiumInfo.opened ? { label: 'Año de Apertura', value: stadiumInfo.opened } : null
  ].filter(Boolean);
  const matchesHtml = matches.length > 0
    ? `
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
    `
    : '';

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <a href="ciudades-anfitrionas.html" style="display: inline-flex; align-items: center; gap: 0.5rem; color: var(--accent-mint); text-decoration: none; font-weight: 600; font-size: 0.95rem;">
        &larr; Volver a Ciudades Anfitrionas
      </a>
    </div>

    <div style="position: relative; width: 100%; height: 360px; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 2.5rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-md);">
      <img src="${heroImage}" alt="${city.stadium}" style="width: 100%; height: 100%; object-fit: cover;" />
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(13, 17, 23, 0.95) 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 2rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
          ${logoHtml}
          <span style="color: var(--text-secondary); font-size: 1rem; font-weight: 600;">🌎 ${city.country} · ${city.name}</span>
        </div>
        <h1 style="font-size: 2.8rem; font-weight: 900; color: #FFF; margin: 0; font-family: 'Rajdhani', sans-serif;">${city.stadium}</h1>
        <p style="color: var(--accent-mint); font-size: 1.1rem; font-weight: 700; margin-top: 0.35rem;">🏟️ Estadio oficial de ${city.name}</p>
      </div>
    </div>

    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 2rem;">
      <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem; font-family: 'Rajdhani', sans-serif; display: flex; align-items: center; gap: 0.5rem;">
        🌆 Acerca de ${city.name}
      </h2>
      <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.7; margin: 0;">
        ${city.description}
      </p>
    </div>

    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 2rem;">
      <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1.5rem; font-family: 'Rajdhani', sans-serif; display: flex; align-items: center; gap: 0.5rem;">
        🏟️ Detalle del Estadio
      </h2>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; align-items: start;">
        <div>
          <img src="${stadiumInfo.image || heroImage}" alt="${city.stadium}" style="width: 100%; height: 240px; object-fit: cover; border-radius: var(--radius-md); border: 1px solid var(--border-color);" />
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.9rem;">
          ${technicalRows.map(row => `
            <div style="display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
              <span style="color: var(--text-secondary);">${row.label}:</span>
              <strong style="color: ${row.accent ? 'var(--accent-mint)' : 'var(--text-primary)'}; text-align: right;">${row.value}</strong>
            </div>
          `).join('')}
        </div>
      </div>

      ${extraInfoHtml}
      ${officialLinkHtml}
    </div>

    ${matchesHtml}
  `;
}


function renderSkeletons(container, count = 8) {
  container.innerHTML = Array(count).fill(0).map(() => `
    <div class="skeleton" style="height: 320px; border-radius: var(--radius-lg);"></div>
  `).join('');
}


function renderDetailSkeleton(container) {
  container.innerHTML = `
    <div class="skeleton" style="height: 360px; border-radius: var(--radius-lg); margin-bottom: 2rem;"></div>
    <div class="skeleton" style="height: 200px; border-radius: var(--radius-lg); margin-bottom: 2rem;"></div>
    <div class="skeleton" style="height: 250px; border-radius: var(--radius-lg);"></div>
  `;
}


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
