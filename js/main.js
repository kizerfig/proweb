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
 loadRankingSection(),
 loadEventsSection(),
 loadODSSection()
 ]);
}

/**
 * Render News Cards (últimas 3 desde API)
 */
async function loadNewsSection() {
 const container = document.getElementById('news-container');
 if (!container) return;

 try {
 const newsList = await FIFA_API.getNews();
 const latestNews = Array.isArray(newsList) ? newsList.slice(0, 3) : [];

 if (latestNews.length === 0) {
 container.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-secondary);">No hay noticias disponibles en este momento.</p>`;
 return;
 }

 container.innerHTML = latestNews.map(news => `
 <article class="news-card">
 <div class="news-image-wrap">
 <img src="${news.image || '../imagenes/banner1.jpg'}" alt="${news.title}" loading="lazy" />
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
 container.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-secondary);">No se pudieron cargar las noticias desde la API.</p>`;
 }
}

/**
 * Render Upcoming Matches Cards (6 en inicio + enlace al calendario completo)
 */
const MATCHES_PREVIEW_LIMIT = 6;

function getUpcomingMatches(matches) {
 return matches.filter(match =>
 match.status === 'Programado' || match.status === 'En vivo'
 );
}

function renderMatchCard(match) {
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
}

function renderHomeMatches(matches) {
 const container = document.getElementById('matches-container');
 if (!container) return;

 if (!matches.length) {
 container.innerHTML = `<p style="color: var(--text-secondary);">No hay partidos programados.</p>`;
 return;
 }

 container.innerHTML = matches.map(renderMatchCard).join('');
}

async function loadMatchesSection() {
 const container = document.getElementById('matches-container');
 if (!container) return;

 try {
 const allMatches = await FIFA_API.getMatches();
 const upcoming = getUpcomingMatches(allMatches || []);
 const previewMatches = upcoming.slice(0, MATCHES_PREVIEW_LIMIT);

 renderHomeMatches(previewMatches);

 } catch (error) {
 console.error('Error cargando partidos:', error);
 container.innerHTML = `<p style="color: var(--text-secondary);">No se pudieron cargar los partidos.</p>`;
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
 * Render Ranking FIFA preview (top 8)
 */
async function loadRankingSection() {
 const tableBody = document.getElementById('ranking-home-body');
 if (!tableBody) return;

 try {
 const ranking = await FIFA_API.getRanking();
 if (!ranking?.length) {
 tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 1.5rem; color: var(--text-secondary);">No hay datos de ranking disponibles.</td></tr>`;
 return;
 }

 renderHomeRankingTable(tableBody, ranking.slice(0, 8));
 } catch (error) {
 console.error('Error cargando ranking:', error);
 tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 1.5rem; color: var(--text-secondary);">No se pudo cargar el ranking FIFA.</td></tr>`;
 }
}

function renderHomeRankingTable(tbody, data) {
 if (!tbody) return;

 if (!data.length) {
 tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 1.5rem; color: var(--text-secondary);">No hay datos registrados.</td></tr>`;
 return;
 }

 tbody.innerHTML = data.map((team, idx) => `
 <tr>
 <td style="text-align: center; font-weight: 700;">${team.pos || idx + 1}</td>
 <td>
 <div class="team-name-cell">
 <div class="flag-box">${team.code}</div>
 <span class="team-full-name">${team.name}</span>
 </div>
 </td>
 <td style="text-align: center;">
 <span class="conf-label">${team.conf || 'FIFA'}</span>
 </td>
 <td style="text-align: center; font-weight: 700; color: var(--accent-mint);">${team.rank || idx + 1}</td>
 </tr>
 `).join('');
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
