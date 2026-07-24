/* ==========================================
   FIFA WORLD CUP 2026 - STANDINGS & PHASES MODULE
   js/standings.js
   ========================================== */

import { FIFA_API } from './api.js';
import { initNavbar } from './navbar.js';

let allStandings = [];
let currentTab = 'all';

document.addEventListener('DOMContentLoaded', () => {
  console.log('📈 FIFA World Cup 2026 - Clasificación y Fases Initialized');

  // 1. Initialize mobile navbar
  initNavbar();

  // 2. Setup tabs listeners
  setupTabsListeners();

  // 3. Load standings with 15-min LocalStorage cache strategy
  loadStandings();
});

/**
 * Loads standings data from API / LocalStorage
 */
async function loadStandings() {
  const container = document.getElementById('group-grid-container');
  if (!container) return;

  renderSkeletons(container, 6);

  try {
    const standingsData = await FIFA_API.getStandings();

    if (!standingsData || !Array.isArray(standingsData) || standingsData.length === 0) {
      renderErrorState(container, 'No se encontraron datos de clasificación disponibles.');
      return;
    }

    allStandings = standingsData;
    renderCurrentTab();

  } catch (error) {
    console.error('Error al cargar clasificaciones:', error);
    renderErrorState(container, 'Ocurrió un error al obtener la clasificación de la API. Verifica tu conexión.');
  }
}

/**
 * Setup Tabs Switcher
 */
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

      e.target.classList.add('active');
      e.target.setAttribute('aria-selected', 'true');

      currentTab = e.target.getAttribute('data-tab');

      if (groupSelectWrap) {
        groupSelectWrap.style.display = currentTab === 'by-group' ? 'block' : 'none';
      }

      renderCurrentTab();
    });
  });

  if (singleGroupSelect) {
    singleGroupSelect.addEventListener('change', () => {
      if (currentTab === 'by-group') {
        renderCurrentTab();
      }
    });
  }
}

/**
 * Render according to currently selected tab
 */
function renderCurrentTab() {
  const container = document.getElementById('group-grid-container');
  if (!container) return;

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

/**
 * Render Skeleton Loading Cards
 */
function renderSkeletons(container, count = 6) {
  container.innerHTML = Array(count).fill(0).map(() => `
    <div class="skeleton" style="height: 240px; border-radius: var(--radius-md);"></div>
  `).join('');
}

/**
 * Render All Groups Cards into DOM
 */
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

/**
 * Render Knockout Stage Eliminatorias Bracket
 */
function renderKnockoutStage(container) {
  container.innerHTML = `
    <div class="knockout-container">
      <h3 class="knockout-title">🏆 Cuadro de Eliminatorias Directas</h3>
      <div class="knockout-rounds">
        
        <div class="knockout-round-col">
          <h4>Dieciseisavos (32 Equipos)</h4>
          <div class="match-card" style="padding: 0.85rem;">
            <div class="match-teams">
              <div class="team-row"><span>1A México</span><span>-</span></div>
              <div class="team-row"><span>2B Argentina</span><span>-</span></div>
            </div>
          </div>
          <div class="match-card" style="padding: 0.85rem;">
            <div class="match-teams">
              <div class="team-row"><span>1C España</span><span>-</span></div>
              <div class="team-row"><span>2D Brasil</span><span>-</span></div>
            </div>
          </div>
        </div>

        <div class="knockout-round-col">
          <h4>Octavos de Final</h4>
          <div class="match-card" style="padding: 0.85rem;">
            <div class="match-teams">
              <div class="team-row"><span>Ganador M1</span><span>-</span></div>
              <div class="team-row"><span>Ganador M2</span><span>-</span></div>
            </div>
          </div>
        </div>

        <div class="knockout-round-col">
          <h4>Gran Final 🏆</h4>
          <div class="match-card" style="border-color: var(--accent-gold); padding: 1.1rem;">
            <div class="match-teams">
              <div class="team-row"><span style="font-weight: 800; color: var(--accent-gold);">Finalista 1</span><span>-</span></div>
              <div class="team-row"><span style="font-weight: 800; color: var(--accent-gold);">Finalista 2</span><span>-</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

/**
 * Render Error State Box
 */
function renderErrorState(container, message) {
  container.innerHTML = `
    <div class="error-box">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">No se pudo cargar la clasificación</h3>
      <p class="error-desc">${message}</p>
      <button class="btn-retry" id="btn-retry-standings">🔄 Reintentar</button>
    </div>
  `;

  const retryBtn = document.getElementById('btn-retry-standings');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => loadStandings());
  }
}
