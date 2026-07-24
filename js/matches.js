/* ==========================================
   FIFA WORLD CUP 2026 - MATCHES CALENDAR MODULE
   js/matches.js
   ========================================== */

import { FIFA_API } from './api.js';
import { initNavbar } from './navbar.js';

let allMatches = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('📅 FIFA World Cup 2026 - Calendario de Partidos Initialized');

  // 1. Initialize mobile navbar
  initNavbar();

  // 2. Setup filter listeners
  setupFilterListeners();

  // 3. Load matches with 15-min LocalStorage cache strategy
  loadMatches();
});

/**
 * Loads matches data and initial render
 */
async function loadMatches() {
  const container = document.getElementById('matches-grid-container');
  if (!container) return;

  // Show Skeleton Loaders during fetch
  renderSkeletons(container, 6);

  try {
    const matchesData = await FIFA_API.getMatches();

    if (!matchesData || !Array.isArray(matchesData) || matchesData.length === 0) {
      renderNoMatchesState(container);
      return;
    }

    allMatches = matchesData;
    filterAndRenderMatches();

  } catch (error) {
    console.error('Error al cargar partidos:', error);
    container.innerHTML = `
      <div class="error-box">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Error al cargar partidos</h3>
        <p class="error-desc">No se pudieron obtener los datos de los partidos. Intenta nuevamente.</p>
        <button class="btn-retry" id="btn-retry-matches">🔄 Reintentar</button>
      </div>
    `;

    const retryBtn = document.getElementById('btn-retry-matches');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => loadMatches());
    }
  }
}

/**
 * Attach event listeners to all filter controls
 */
function setupFilterListeners() {
  const filterCity = document.getElementById('filter-city');
  const filterRound = document.getElementById('filter-round');
  const filterStatus = document.getElementById('filter-status');
  const filterGroup = document.getElementById('filter-group');
  const searchTeam = document.getElementById('search-team');

  const controls = [filterCity, filterRound, filterStatus, filterGroup];
  controls.forEach(control => {
    if (control) {
      control.addEventListener('change', () => filterAndRenderMatches());
    }
  });

  if (searchTeam) {
    searchTeam.addEventListener('input', () => filterAndRenderMatches());
  }
}

/**
 * Filters the matches array based on current inputs and renders output
 */
function filterAndRenderMatches() {
  const container = document.getElementById('matches-grid-container');
  if (!container) return;

  const city = document.getElementById('filter-city')?.value || 'all';
  const round = document.getElementById('filter-round')?.value || 'all';
  const status = document.getElementById('filter-status')?.value || 'all';
  const group = document.getElementById('filter-group')?.value || 'all';
  const search = (document.getElementById('search-team')?.value || '').trim().toLowerCase();

  const filtered = allMatches.filter(match => {
    const cityMatch = city === 'all' || match.city === city;
    const roundMatch = round === 'all' || match.round === round;
    const statusMatch = status === 'all' || match.status === status;
    const groupMatch = group === 'all' || match.group === group;

    const teamMatch = !search ||
      (match.team1.name && match.team1.name.toLowerCase().includes(search)) ||
      (match.team1.code && match.team1.code.toLowerCase().includes(search)) ||
      (match.team2.name && match.team2.name.toLowerCase().includes(search)) ||
      (match.team2.code && match.team2.code.toLowerCase().includes(search));

    return cityMatch && roundMatch && statusMatch && groupMatch && teamMatch;
  });

  if (filtered.length === 0) {
    renderNoMatchesState(container);
  } else {
    renderMatchCards(container, filtered);
  }
}

/**
 * Render Skeleton Loading Cards
 */
function renderSkeletons(container, count = 6) {
  container.innerHTML = Array(count).fill(0).map(() => `
    <div class="skeleton" style="height: 180px; border-radius: var(--radius-md);"></div>
  `).join('');
}

/**
 * Render Match Cards into DOM
 */
function renderMatchCards(container, matchesList) {
  container.innerHTML = matchesList.map(match => {
    let statusClass = 'scheduled';
    if (match.status === 'En vivo') statusClass = 'live';
    if (match.status === 'Finalizado') statusClass = 'finished';

    return `
      <a href="detalle-partido.html?id=${match.id}" class="match-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column;">
        <div class="match-header">
          <span class="match-venue">📍 ${match.city}${match.stadium ? ' • ' + match.stadium : ''}</span>
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
          <span>📅 ${match.datetime}</span>
          <span>🏆 ${match.group || match.round || 'Mundial'}</span>
        </div>
      </a>
    `;
  }).join('');
}

/**
 * Render Empty State when no matches match filters
 */
function renderNoMatchesState(container) {
  container.innerHTML = `
    <div class="no-matches-box">
      <span>🔍</span>
      <p>No se encontraron partidos para los filtros seleccionados</p>
    </div>
  `;
}
