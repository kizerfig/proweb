/* ==========================================
 FIFA WORLD CUP 2026 - STANDINGS & PHASES MODULE
 js/standings.js
 ========================================== */

import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

let allStandings = [];
let knockoutRounds = [];
let currentTab = 'all';

document.addEventListener('DOMContentLoaded', () => {
 console.log(' FIFA World Cup 2026 - Clasificación y Fases Initialized');

 initLayout();
 setupTabsListeners();
 loadStandings();
});

async function loadStandings() {
 const container = document.getElementById('group-grid-container');
 if (!container) return;

 renderSkeletons(container, 6);

 try {
 const [standingsData, knockoutData] = await Promise.all([
 FIFA_API.getStandings(),
 FIFA_API.getKnockout()
 ]);

 if (!standingsData || !Array.isArray(standingsData) || standingsData.length === 0) {
 renderErrorState(container, 'No se encontraron datos de clasificación disponibles.');
 return;
 }

 allStandings = standingsData;
 knockoutRounds = Array.isArray(knockoutData) ? knockoutData : [];
 populateGroupSelector(allStandings);
 renderCurrentTab();

 } catch (error) {
 console.error('Error al cargar clasificaciones:', error);
 renderErrorState(container, 'Ocurrió un error al obtener la clasificación. Verifica tu conexión.');
 }
}

function populateGroupSelector(groups) {
 const select = document.getElementById('single-group-select');
 if (!select) return;

 select.innerHTML = groups.map(group => `
 <option value="${group.groupId}">${group.groupName}</option>
 `).join('');
}

function setupTabsListeners() {
 const tabButtons = document.querySelectorAll('.tab-btn');
 const groupSelectWrap = document.getElementById('group-selector-wrap');
 const singleGroupSelect = document.getElementById('single-group-select');

 tabButtons.forEach(btn => {
 btn.addEventListener('click', (e) => {
 tabButtons.forEach(b => {
 b.classList.remove('active');
 b.setAttribute('aria-selected', 'false');
 });

 e.currentTarget.classList.add('active');
 e.currentTarget.setAttribute('aria-selected', 'true');

 currentTab = e.currentTarget.getAttribute('data-tab');

 if (groupSelectWrap) {
 groupSelectWrap.hidden = currentTab !== 'by-group';
 }

 renderCurrentTab();
 });
 });

 singleGroupSelect?.addEventListener('change', () => {
 if (currentTab === 'by-group') {
 renderCurrentTab();
 }
 });
}

function renderCurrentTab() {
 const container = document.getElementById('group-grid-container');
 if (!container) return;

 container.className = 'group-grid';

 if (currentTab === 'all') {
 renderAllGroups(container, allStandings);
 } else if (currentTab === 'by-group') {
 const selectedGroupId = document.getElementById('single-group-select')?.value || 'A';
 const singleGroup = allStandings.filter(g => g.groupId === selectedGroupId);
 renderAllGroups(container, singleGroup.length ? singleGroup : [allStandings[0]]);
 } else if (currentTab === 'knockout') {
 renderKnockoutStage(container);
 }
}

function renderSkeletons(container, count = 6) {
 container.innerHTML = Array(count).fill(0).map(() => `
 <div class="skeleton" style="height: 240px; border-radius: var(--radius-md);"></div>
 `).join('');
}

function renderAllGroups(container, groups) {
 container.innerHTML = groups.map(group => `
 <div class="group-card">
 <div class="group-card-header">${group.groupName}</div>
 <table class="group-table" aria-label="Tabla de posiciones ${group.groupName}">
 <thead>
 <tr>
 <th class="col-rank">#</th>
 <th>Equipo</th>
 <th class="col-pj">PJ</th>
 <th class="col-pts">Pts</th>
 </tr>
 </thead>
 <tbody>
 ${group.teams.map(team => `
 <tr>
 <td class="col-rank">
 <span class="rank-badge ${team.rank <= 2 ? 'qualified' : 'eliminated'}">${team.rank}</span>
 </td>
 <td>
 <div class="team-name-cell">
 <span class="team-code-bold">${team.code}</span>
 <span class="team-full-name">${team.name}</span>
 </div>
 </td>
 <td class="col-pj">${team.pj}</td>
 <td class="col-pts"><strong>${team.pts}</strong></td>
 </tr>
 `).join('')}
 </tbody>
 </table>
 </div>
 `).join('');
}

function renderKnockoutMatch(match, highlight = false) {
 return `
 <div class="knockout-match-card${highlight ? ' knockout-match-card--highlight' : ''}">
 <div class="knockout-team">
 <span>${match.team1}</span>
 <span class="knockout-score">${match.score1 ?? '-'}</span>
 </div>
 <div class="knockout-team">
 <span>${match.team2}</span>
 <span class="knockout-score">${match.score2 ?? '-'}</span>
 </div>
 </div>
 `;
}

function renderKnockoutStage(container) {
 container.className = 'group-grid knockout-grid';

 if (!knockoutRounds.length) {
 container.innerHTML = `
 <div class="knockout-container">
 <p style="color: var(--text-secondary); text-align: center;">No hay datos de eliminatorias disponibles.</p>
 </div>
 `;
 return;
 }

 container.innerHTML = `
 <div class="knockout-container">
 <h3 class="knockout-title">Llaves de Eliminatoria Directa</h3>
 <div class="knockout-bracket">
 ${knockoutRounds.map(round => {
 const isFinal = round.id === 'final';
 const isThird = round.id === 'third';
 const highlight = isFinal || isThird;

 return `
 <div class="knockout-round-col${highlight ? ' knockout-round-col--highlight' : ''}">
 <h4>${round.name}</h4>
 ${round.matches.map(match => renderKnockoutMatch(match, isFinal)).join('')}
 </div>
 `;
 }).join('')}
 </div>
 </div>
 `;
}

function renderErrorState(container, message) {
 container.innerHTML = `
 <div class="error-box">
 <div class="error-icon">⚠️</div>
 <h3 class="error-title">No se pudo cargar la clasificación</h3>
 <p class="error-desc">${message}</p>
 <button class="btn-retry" id="btn-retry-standings">Reintentar</button>
 </div>
 `;

 document.getElementById('btn-retry-standings')?.addEventListener('click', () => loadStandings());
}
