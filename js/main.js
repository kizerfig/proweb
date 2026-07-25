import { FIFA_API } from './api.js';
import { initHeroSlider } from './slider.js';
import { initLayout } from './layout.js';
import { renderHomeIdentitySection } from './identity.js';

document.addEventListener('DOMContentLoaded', () => {
 console.log(' FIFA World Cup 2026 Portal Initialized');
 initLayout();
 initHeroSlider();
 loadHomepageData();
});

const NEWS_IMAGE_FALLBACK = '../imagenes/banner1.jpg';

function loadHomepageData() {
  loadNewsSection().catch(err => console.warn('Error en sección noticias:', err));
  loadMatchesSection().catch(err => console.warn('Error en sección partidos:', err));
  loadTeamsAndCitiesSection().catch(err => console.warn('Error en sección equipos/ciudades:', err));
  loadEventsSection().catch(err => console.warn('Error en sección eventos:', err));
  loadIdentitySection().catch(err => console.warn('Error en sección identidad:', err));
  loadODSSection().catch(err => console.warn('Error en sección ODS:', err));
}


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

 container.innerHTML = latestNews.map(news => {
 const articleUrl = news.url || 'https://www.fifa.com/es/articles';
 return `
 <article class="news-card">
 <div class="news-image-wrap">
 <img src="${news.image || NEWS_IMAGE_FALLBACK}" alt="${news.title}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${NEWS_IMAGE_FALLBACK}'" />
 </div>
 <div class="news-body">
 <div class="news-meta">
 <span class="badge-tag">${news.category || 'Mundial'}</span>
 <span class="news-time">${news.time || 'Reciente'}</span>
 </div>
 <h3 class="news-title">${news.title}</h3>
 <a class="news-read-more" href="${articleUrl}" target="_blank" rel="noopener noreferrer">Leer más →</a>
 </div>
 </article>
 `;
 }).join('');

 } catch (error) {
 console.error('Error cargando noticias:', error);
 container.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-secondary);">No se pudieron cargar las noticias desde la API.</p>`;
 }
}


const MATCHES_PREVIEW_LIMIT = 8;

function getUpcomingMatches(matches) {
 return matches.filter(match =>
 match.status === 'Programado' || match.status === 'En vivo' ||
 match.status === 'scheduled' || match.status === 'live'
 );
}

function getHomeMatchesPreview(matches) {
 const upcoming = getUpcomingMatches(matches)
 .slice()
 .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')) || String(a.time || '').localeCompare(String(b.time || '')));

 if (upcoming.length >= MATCHES_PREVIEW_LIMIT) {
 return upcoming.slice(0, MATCHES_PREVIEW_LIMIT);
 }

 const upcomingIds = new Set(upcoming.map(m => String(m.id)));
 const recentFinished = matches
 .filter(m => !upcomingIds.has(String(m.id)))
 .slice()
 .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.time || '').localeCompare(String(a.time || '')));

 return [...upcoming, ...recentFinished].slice(0, MATCHES_PREVIEW_LIMIT);
}

function renderMatchCard(match) {
 const statusClass = match.statusClass || (
 match.status === 'En vivo' || match.status === 'live' ? 'live' :
 match.status === 'Finalizado' || match.status === 'finished' ? 'finished' : 'scheduled'
 );
 const statusText = match.statusLabel || match.status || 'Programado';

 return `
 <a href="detalle-partido.html?id=${match.id}" class="match-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column;">
 <div class="match-header">
 <span class="match-venue">${match.city}${match.stadium ? ' • ' + match.stadium : ''}</span>
 <span class="status-badge ${statusClass}">${statusText}</span>
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
 <span>${match.group || match.round || 'Mundial'}</span>
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
 const previewMatches = getHomeMatchesPreview(allMatches || []);

 renderHomeMatches(previewMatches);

 } catch (error) {
 console.error('Error cargando partidos:', error);
 container.innerHTML = `<p style="color: var(--text-secondary);">No se pudieron cargar los partidos.</p>`;
 }
}


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


const TEAMS_PREVIEW_MAX = 12;
const CITIES_PREVIEW_LIMIT = 8;
let homepageCities = [];

function getHomeTeamsPreview(teams) {
 if (!Array.isArray(teams) || teams.length === 0) return [];
 return teams
  .slice()
  .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'es'))
  .slice(0, TEAMS_PREVIEW_MAX);
}

function escapeHtmlAttr(value) {
 return String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
}

function renderTeamTile(team) {
 const flagHtml = team.flagUri
  ? `<img src="${escapeHtmlAttr(team.flagUri)}" alt="${escapeHtmlAttr(team.name)}" class="team-tile-flag" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.outerHTML='<span class=&quot;team-tile-code&quot;>${escapeHtmlAttr(team.code)}</span>'" />`
  : `<span class="team-tile-code">${team.code}</span>`;

 return `<a href="equipos.html" class="team-tile" style="text-decoration: none; color: inherit; cursor: pointer;">
  ${flagHtml}
  <span class="team-tile-name">${team.name}</span>
 </a>`;
}

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
      const previewTeams = getHomeTeamsPreview(teams || []);
      if (!previewTeams.length) {
        teamsContainer.innerHTML = `<p style="color: var(--text-secondary);">No hay equipos disponibles.</p>`;
      } else {
        teamsContainer.innerHTML = previewTeams.map(renderTeamTile).join('');
      }
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


async function loadIdentitySection() {
 const container = document.getElementById('identity-container');
 if (!container) return;
 await renderHomeIdentitySection(container);
}


async function loadODSSection() {
  const container = document.getElementById('ods-container');
  if (!container) return;

  try {
    const odsList = await FIFA_API.getODS();

    container.innerHTML = odsList.map(ods => `
      <div class="ods-card" style="padding: 1.75rem;">
        <div class="ods-header">
          <span class="ods-number" style="font-size: 1.8rem; color: var(--accent-mint); font-weight: 800;">ODS ${ods.number}</span>
        </div>
        <h3 class="ods-title" style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin: 0.5rem 0;">${ods.title}</h3>
        <p class="ods-desc" style="font-size: 0.9rem; line-height: 1.5; color: var(--text-secondary);">${ods.desc}</p>
        <div class="ods-stat" style="margin-top: 1.25rem; border-top: 1px solid var(--border-color); padding-top: 0.85rem;">
          <span style="font-size: 1.05rem; font-weight: 700; color: var(--accent-mint);">${ods.stat}</span>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error cargando ODS:', error);
  }
}
