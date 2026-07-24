/* ==========================================
 FIFA WORLD CUP 2026 - MAIN APP ORCHESTRATOR
 js/main.js
 ========================================== */

import { FIFA_API } from './api.js';
import { initHeroSlider } from './slider.js';
import { initLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
 console.log(' FIFA World Cup 2026 Portal Initialized');
 
 // 1. Initialize UI Controls
 initLayout();
 initHeroSlider();

 // 2. Load Dynamic Content from API/Cache
 loadHomepageData();
});

async function loadHomepageData() {
 // Load Sections in parallel
 await Promise.all([
 loadNewsSection(),
 loadMatchesSection(),
 loadTeamsAndCitiesSection(),
 loadEventsSection(),
 loadODSSection()
 ]);
}

/**
 * Render News Cards
 */
async function loadNewsSection() {
 const container = document.getElementById('news-container');
 if (!container) return;

 try {
 const newsList = await FIFA_API.getNews();
 
 if (!newsList || newsList.length === 0) {
 container.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-secondary);">No hay noticias disponibles en este momento.</p>`;
 return;
 }

 container.innerHTML = newsList.map(news => `
 <article class="news-card">
 <div class="news-image-wrap">
 <img src="${news.image}" alt="${news.title}" loading="lazy" />
 </div>
 <div class="news-body">
 <div class="news-meta">
 <span class="badge-tag">${news.category || 'Mundial'}</span>
 <span class="news-time">${news.time || 'Reciente'}</span>
 </div>
 <h3 class="news-title">${news.title}</h3>
 </div>
 </article>
 `).join('');

 } catch (error) {
 console.error('Error cargando noticias:', error);
 }
}

/**
 * Render Upcoming Matches Cards
 */
async function loadMatchesSection() {
 const container = document.getElementById('matches-container');
 if (!container) return;

 try {
 const matchesList = await FIFA_API.getMatches();

 if (!matchesList || matchesList.length === 0) {
 container.innerHTML = `<p style="color: var(--text-secondary);">No hay partidos programados.</p>`;
 return;
 }

 container.innerHTML = matchesList.map(match => {
 let statusClass = 'scheduled';
 if (match.status === 'En vivo') statusClass = 'live';
 if (match.status === 'Finalizado') statusClass = 'finished';

 return `
 <a href="detalle-partido.html?id=${match.id}" class="match-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column;">
 <div class="match-header">
 <span class="match-venue">${match.city}</span>
 <span class="status-badge ${statusClass}">${match.status}</span>
 </div>
 
 <div class="match-teams">
 <div class="team-row">
 <div class="team-info">
 <div class="flag-box">${match.team1.code}</div>
 <span class="team-code">${match.team1.code}</span>
 <span class="team-name">${match.team1.name}</span>
 </div>
 <span class="team-score">${match.team1.score}</span>
 </div>
 
 <div class="team-row">
 <div class="team-info">
 <div class="flag-box">${match.team2.code}</div>
 <span class="team-code">${match.team2.code}</span>
 <span class="team-name">${match.team2.name}</span>
 </div>
 <span class="team-score">${match.team2.score}</span>
 </div>
 </div>

 <div class="match-footer">
 <span>${match.datetime}</span>
 <span>${match.group}</span>
 </div>
 </a>
 `;
 }).join('');

 } catch (error) {
 console.error('Error cargando partidos:', error);
 }
}

/**
 * Render Events Cards
 */
async function loadEventsSection() {
 const container = document.getElementById('events-container');
 if (!container) return;

 try {
 const eventsList = await FIFA_API.getEvents();

 container.innerHTML = eventsList.map(event => `
 <a href="torneos.html" class="event-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; cursor: pointer;">
 <div class="event-top">
 <span class="org-tag">${event.org}</span>
 <span class="status-badge ${event.status === 'Próximo' ? 'live' : 'scheduled'}">${event.status}</span>
 </div>
 <h3 class="event-title">${event.title}</h3>
 <div class="event-details">
 <span>${event.date}</span>
 <span>${event.location}</span>
 </div>
 </a>
 `).join('');

 } catch (error) {
 console.error('Error cargando eventos:', error);
 }
}

/**
 * Render Teams & Host Cities Preview Grids
 */
const CITIES_PREVIEW_LIMIT = 8;
let homepageCities = [];

function renderCityTile(city) {
 return `<a href="ciudades-anfitrionas.html" class="city-tile" style="text-decoration: none; color: inherit; cursor: pointer;"><span class="city-name">${city.name}</span></a>`;
}

function renderCitiesPreview(expanded) {
 const citiesContainer = document.getElementById('cities-container');
 const toggle = document.getElementById('cities-toggle');
 if (!citiesContainer || !homepageCities.length) return;

 const visibleCities = expanded
  ? homepageCities
  : homepageCities.slice(0, CITIES_PREVIEW_LIMIT);

 citiesContainer.innerHTML = visibleCities.map(renderCityTile).join('');

 if (!toggle) return;

 if (homepageCities.length <= CITIES_PREVIEW_LIMIT) {
  toggle.hidden = true;
  return;
 }

 toggle.hidden = false;
 toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
 toggle.textContent = expanded ? 'Ver menos' : 'Ver más →';
}

function initCitiesToggle() {
 const toggle = document.getElementById('cities-toggle');
 if (!toggle || toggle.dataset.bound === 'true') return;

 toggle.dataset.bound = 'true';
 let expanded = false;

 toggle.addEventListener('click', () => {
  expanded = !expanded;
  renderCitiesPreview(expanded);
 });
}

async function loadTeamsAndCitiesSection() {
  const teamsContainer = document.getElementById('teams-container');
  const citiesContainer = document.getElementById('cities-container');

  if (teamsContainer) {
    try {
      const teams = await FIFA_API.getTeams();
      teamsContainer.innerHTML = teams.map(team => `
        <a href="equipos.html" class="team-tile" style="text-decoration: none; color: inherit; cursor: pointer;">
          <span class="team-tile-code">${team.code}</span>
          <span class="team-tile-name">${team.name}</span>
        </a>
      `).join('');
    } catch (e) { console.error('Error en equipos:', e); }
  }

  if (citiesContainer) {
    try {
      homepageCities = await FIFA_API.getCities();
      renderCitiesPreview(false);
      initCitiesToggle();
    } catch (e) { console.error('Error en ciudades:', e); }
  }
}

/**
 * Render ODS Section Cards
 */
async function loadODSSection() {
 const container = document.getElementById('ods-container');
 if (!container) return;

 try {
 const odsList = await FIFA_API.getODS();

 container.innerHTML = odsList.map(ods => `
 <div class="ods-card">
 <div class="ods-header">
 <span class="ods-number">ODS ${ods.number}</span>
 </div>
 <h3 class="ods-title">${ods.title}</h3>
 <p class="ods-desc">${ods.desc}</p>
 <div class="ods-stat">
 <span> ${ods.stat}</span>
 </div>
 </div>
 `).join('');

 } catch (error) {
 console.error('Error cargando ODS:', error);
 }
}
