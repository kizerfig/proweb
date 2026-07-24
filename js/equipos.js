/* ==========================================
 FIFA WORLD CUP 2026 - TEAMS MODULE
 js/equipos.js
 ========================================== */

import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

let allTeams = [];

document.addEventListener('DOMContentLoaded', () => {
 console.log(' FIFA World Cup 2026 - Equipos Initialized');

 // 1. Initialize Mobile Navbar
 initLayout();

 // 2. Setup Filter Listeners
 setupFilterListeners();

 // 3. Load Teams Data
 loadTeams();
});

/**
 * Loads Teams from API / LocalStorage
 */
async function loadTeams() {
 const container = document.getElementById('teams-grid-container');
 if (!container) return;

 renderSkeletons(container, 6);

 try {
 const teamsData = await FIFA_API.getTeams();

 if (!teamsData || !Array.isArray(teamsData) || teamsData.length === 0) {
 renderErrorState(container, 'No se encontraron equipos disponibles.');
 return;
 }

 allTeams = teamsData;
 renderTeams(container, allTeams);

 } catch (error) {
 console.error('Error al cargar equipos:', error);
 renderErrorState(container, 'Ocurrió un error al obtener la lista de equipos.');
 }
}

/**
 * Setup Filter & Search Listeners
 */
function setupFilterListeners() {
 const groupSelect = document.getElementById('filter-team-group');
 const searchInput = document.getElementById('search-team-input');

 const handleFilter = () => {
 const groupVal = groupSelect?.value || 'all';
 const searchVal = searchInput?.value.toLowerCase().trim() || '';

 const filtered = allTeams.filter(team => {
 const matchGroup = groupVal === 'all' || team.group === groupVal;
 const matchSearch = !searchVal || 
 team.name.toLowerCase().includes(searchVal) || 
 team.code.toLowerCase().includes(searchVal);

 return matchGroup && matchSearch;
 });

 const container = document.getElementById('teams-grid-container');
 if (container) {
 renderTeams(container, filtered);
 }
 };

 groupSelect?.addEventListener('change', handleFilter);
 searchInput?.addEventListener('input', handleFilter);
}

/**
 * Render Teams Cards into DOM
 */
function renderTeams(container, teams) {
 if (teams.length === 0) {
 container.innerHTML = `
 <div class="no-matches-box" style="grid-column: 1 / -1;">
 <span></span>
 <p>No se encontraron equipos que coincidan con la búsqueda.</p>
 </div>
 `;
 return;
 }

 container.innerHTML = teams.map(team => `
 <div class="group-card" style="padding: 1.25rem;">
 <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
 <div style="display: flex; align-items: center; gap: 0.75rem;">
 <div class="flag-box" style="width: 36px; height: 26px; font-size: 0.85rem;">${team.code}</div>
 <div>
 <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">${team.name}</h3>
 <span style="font-size: 0.8rem; color: var(--text-secondary);">${team.group || 'Fase de Grupos'}</span>
 </div>
 </div>
 <span class="rank-badge qualified" style="width: auto; height: auto; padding: 0.25rem 0.6rem; border-radius: var(--radius-pill); font-size: 0.75rem;">
 Rank #${team.rank}
 </span>
 </div>

 <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 0.75rem; font-size: 0.85rem; color: var(--text-secondary);">
 <span>Participaciones:</span>
 <strong style="color: var(--text-primary);">${team.appearances || 1} Mundiales</strong>
 </div>
 </div>
 `).join('');
}

/**
 * Render Skeleton Loading Cards
 */
function renderSkeletons(container, count = 6) {
 container.innerHTML = Array(count).fill(0).map(() => `
 <div class="skeleton" style="height: 160px; border-radius: var(--radius-md);"></div>
 `).join('');
}

/**
 * Render Error State Box
 */
function renderErrorState(container, message) {
 container.innerHTML = `
 <div class="error-box" style="grid-column: 1 / -1;">
 <div class="error-icon">️</div>
 <h3 class="error-title">No se pudieron cargar los equipos</h3>
 <p class="error-desc">${message}</p>
 <button class="btn-retry" id="btn-retry-teams"> Reintentar</button>
 </div>
 `;

 const retryBtn = document.getElementById('btn-retry-teams');
 if (retryBtn) {
 retryBtn.addEventListener('click', () => loadTeams());
 }
}
