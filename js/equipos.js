/* ==========================================
   FIFA WORLD CUP 2026 - TEAMS & TEAM DETAIL MODULE
   js/equipos.js & js/teams.js
   ========================================== */

import { FIFA_API, fetchWithCache } from './api.js';
import { initLayout } from './layout.js';

let allTeams = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('⚽ FIFA World Cup 2026 - Módulo de Equipos Inicializado');
  
  // 1. Initialize mobile navbar
  initLayout();

  // 2. Check current page view
  if (document.getElementById('teams-grid-container') || document.querySelector('.teams-grid')) {
    setupFilterListeners();
    loadTeams();
  } else if (document.getElementById('team-detail-container')) {
    loadTeamDetailView();
  }
});

/**
 * Obtener todos los equipos (Exportable según requerimiento)
 */
export async function getTeamsList(forceRefresh = false) {
  return await FIFA_API.getTeams(forceRefresh);
}

/**
 * Obtener equipo detallado por ID (Exportable según requerimiento)
 */
export async function getTeamById(id, forceRefresh = false) {
  return await FIFA_API.getTeamById(id, forceRefresh);
}

/**
 * Carga y renderiza el listado completo de equipos en equipos.html
 */
async function loadTeams() {
  const container = document.getElementById('teams-grid-container') || document.querySelector('.teams-grid');
  if (!container) return;

  renderSkeletons(container, 8);

  try {
    const teamsData = await getTeamsList();

    if (!teamsData || !Array.isArray(teamsData) || teamsData.length === 0) {
      renderErrorState(container, 'No se encontraron equipos disponibles.');
      return;
    }

    allTeams = teamsData;
    populateGroupFilter(allTeams);
    renderTeams(container, allTeams);

  } catch (error) {
    console.error('Error al cargar la lista de equipos:', error);
    renderErrorState(container, 'Ocurrió un error al consultar la API de equipos.');
  }
}

/**
 * Configura los eventos de filtrado por Confederación, Grupo y Búsqueda por texto
 */
function setupFilterListeners() {
  const confSelect = document.getElementById('filter-confederation');
  const groupSelect = document.getElementById('filter-team-group');
  const searchInput = document.getElementById('search-team-input');

  const handleFilter = () => {
    const confVal = confSelect?.value || 'all';
    const groupVal = groupSelect?.value || 'all';
    const searchVal = searchInput?.value.toLowerCase().trim() || '';

    const filtered = allTeams.filter(team => {
      const matchConf = confVal === 'all' || team.confederation === confVal;
      const matchGroup = groupVal === 'all' || normalizeGroupLabel(team.group) === normalizeGroupLabel(groupVal);
      const matchSearch = !searchVal || 
        team.name.toLowerCase().includes(searchVal) || 
        team.code.toLowerCase().includes(searchVal);

      return matchConf && matchGroup && matchSearch;
    });

    const container = document.getElementById('teams-grid-container') || document.querySelector('.teams-grid');
    if (container) {
      renderTeams(container, filtered);
    }
  };

  confSelect?.addEventListener('change', handleFilter);
  groupSelect?.addEventListener('change', handleFilter);
  searchInput?.addEventListener('input', handleFilter);
}

const DEFAULT_GROUPS = Array.from({ length: 12 }, (_, i) => `Grupo ${String.fromCharCode(65 + i)}`);

function normalizeGroupLabel(group) {
  if (!group) return '';
  const value = String(group).trim();
  if (value.length === 1) return `Grupo ${value.toUpperCase()}`;
  if (/^grupo\s+[a-l]$/i.test(value)) {
    return `Grupo ${value.slice(-1).toUpperCase()}`;
  }
  return value;
}

function getGroupLetter(groupName) {
  const normalized = normalizeGroupLabel(groupName);
  const groupMatch = normalized.match(/^Grupo\s+([A-Z])$/i);
  if (groupMatch) return groupMatch[1].toUpperCase();
  if (/^[A-Z]$/.test(normalized)) return normalized;
  return '';
}

function getGroupSortKey(groupName) {
  const letter = getGroupLetter(groupName);
  return letter ? letter.charCodeAt(0) : 999;
}

/**
 * Rellena el selector de grupos con todos los grupos disponibles (A–L)
 */
function populateGroupFilter(teams) {
  const groupSelect = document.getElementById('filter-team-group');
  if (!groupSelect) return;

  const groupsFromTeams = [...new Set(
    (teams || []).map(team => normalizeGroupLabel(team.group)).filter(Boolean)
  )];

  const groups = (groupsFromTeams.length > 0 ? groupsFromTeams : DEFAULT_GROUPS)
    .sort((a, b) => getGroupSortKey(a) - getGroupSortKey(b));

  const currentValue = groupSelect.value;

  groupSelect.innerHTML = `
    <option value="all">Todos los grupos</option>
    ${groups.map(group => `<option value="${escapeHtmlAttr(group)}">${group}</option>`).join('')}
  `;

  if (currentValue && [...groupSelect.options].some(option => option.value === currentValue)) {
    groupSelect.value = currentValue;
  }
}

/**
 * Escapa atributos HTML dinámicos
 */
function escapeHtmlAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Renderiza bandera del equipo o fallback con código ISO
 */
function renderTeamFlag(team, width, height, fontSize = '0.9rem') {
  if (team.flagUri) {
    return `<img src="${escapeHtmlAttr(team.flagUri)}" alt="${escapeHtmlAttr(team.name)}" class="team-flag-img" style="width: ${width}; height: ${height}; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color); flex-shrink: 0;" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.outerHTML='<div class=&quot;flag-box&quot; style=&quot;width:${width};height:${height};font-weight:800;font-size:${fontSize};border-radius:4px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.08);border:1px solid var(--border-color);flex-shrink:0;&quot;>${escapeHtmlAttr(team.code)}</div>'" />`;
  }

  return `<div class="flag-box" style="width: ${width}; height: ${height}; font-weight: 800; font-size: ${fontSize}; border-radius: 4px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.08); border: 1px solid var(--border-color); flex-shrink: 0;">${team.code}</div>`;
}

/**
 * Renderiza las tarjetas de equipo en la grilla
 */
function renderTeams(container, teams) {
  if (!teams || teams.length === 0) {
    container.innerHTML = `
      <div class="no-matches-box" style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <p style="color: var(--text-secondary); font-size: 1.1rem;">No se encontraron selecciones con los filtros aplicados.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = teams.map(team => `
    <a href="detalle-equipo.html?id=${team.id}" class="group-card team-card-item" style="text-decoration: none; color: inherit; display: block; padding: 1.25rem; cursor: pointer;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          ${renderTeamFlag(team, '40px', '28px')}
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0;">${team.name}</h3>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">${team.group}</span>
          </div>
        </div>
        <span class="badge-tag" style="background: rgba(0, 245, 140, 0.15); color: var(--accent-mint); font-weight: 700; border: 1px solid rgba(0, 245, 140, 0.3);">
          ${team.confederation}
        </span>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem; font-size: 0.85rem; color: var(--text-secondary);">
        <span>Ranking FIFA: <strong style="color: var(--text-primary);">#${team.rank}</strong></span>
        <span>Participaciones: <strong style="color: var(--text-primary);">${team.appearances}</strong></span>
      </div>
    </a>
  `).join('');
}

/**
 * Carga el detalle del equipo en detalle-equipo.html
 */
async function loadTeamDetailView() {
  const container = document.getElementById('team-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get('id') || 'MX';

  renderDetailSkeleton(container);

  try {
    const team = await getTeamById(teamId);

    if (!team) {
      container.innerHTML = `<div class="error-box"><p>No se encontró la información del equipo solicitado.</p><a href="equipos.html" class="btn-retry">← Volver a Equipos</a></div>`;
      return;
    }

    renderTeamDetailHTML(container, team);

  } catch (error) {
    console.error('Error cargando detalle de equipo:', error);
    container.innerHTML = `
      <div class="error-box" style="text-align: center; padding: 3rem;">
        <h3>Error de conexión</h3>
        <p>No se pudo cargar la información técnica del equipo.</p>
        <a href="equipos.html" class="btn-retry" style="display: inline-block; margin-top: 1rem; text-decoration: none;">← Volver a Equipos</a>
      </div>
    `;
  }
}

/**
 * Renderiza la interfaz detallada de una selección
 */
function renderTeamDetailHTML(container, team) {
  container.innerHTML = `
    <!-- Top Back Navigation -->
    <div style="margin-bottom: 1.5rem;">
      <a href="equipos.html" style="display: inline-flex; align-items: center; gap: 0.5rem; color: var(--accent-mint); text-decoration: none; font-weight: 600; font-size: 0.95rem;">
        &larr; Volver a Equipos
      </a>
    </div>

    <!-- Team Hero Header -->
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 1.5rem;">
        ${renderTeamFlag(team, '72px', '50px', '1.5rem')}
        <div>
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem;">
            <h1 style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary); margin: 0; font-family: 'Rajdhani', sans-serif;">${team.name}</h1>
            <span class="badge-tag" style="background: rgba(0, 245, 140, 0.2); color: var(--accent-mint); font-weight: 700; border: 1px solid var(--accent-mint); font-size: 0.85rem;">${team.confederation}</span>
          </div>
          <p style="color: var(--text-secondary); margin: 0; font-size: 1rem;">Entrenador / DT: <strong style="color: var(--text-primary);">${team.coach}</strong></p>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div style="display: flex; gap: 1.5rem; background: rgba(255,255,255,0.03); padding: 1rem 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div style="text-align: center;">
          <span style="font-size: 0.75rem; color: var(--text-secondary); display: block; text-transform: uppercase;">Ranking FIFA</span>
          <strong style="font-size: 1.4rem; color: var(--accent-mint); font-weight: 800;">#${team.rank}</strong>
        </div>
        <div style="width: 1px; background: var(--border-color);"></div>
        <div style="text-align: center;">
          <span style="font-size: 0.75rem; color: var(--text-secondary); display: block; text-transform: uppercase;">Mundiales</span>
          <strong style="font-size: 1.4rem; color: var(--text-primary); font-weight: 800;">${team.appearances}</strong>
        </div>
        <div style="width: 1px; background: var(--border-color);"></div>
        <div style="text-align: center;">
          <span style="font-size: 0.75rem; color: var(--text-secondary); display: block; text-transform: uppercase;">Grupo Assigned</span>
          <strong style="font-size: 1.4rem; color: var(--text-primary); font-weight: 800;">${team.group}</strong>
        </div>
      </div>
    </div>

    <!-- Squad List Section -->
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem;">
      <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1.5rem; font-family: 'Rajdhani', sans-serif; display: flex; align-items: center; gap: 0.5rem;">
        📋 Nómina Oficial / Convocados
      </h2>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-secondary); text-transform: uppercase; font-size: 0.8rem;">
              <th style="padding: 0.75rem 1rem; width: 60px;">Dorsal</th>
              <th style="padding: 0.75rem 1rem;">Jugador</th>
              <th style="padding: 0.75rem 1rem;">Posición</th>
              <th style="padding: 0.75rem 1rem;">Club Actual</th>
            </tr>
          </thead>
          <tbody>
            ${team.squad.map(player => `
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s ease;">
                <td style="padding: 0.9rem 1rem; font-weight: 800; color: var(--accent-mint); text-align: center; background: rgba(0,245,140,0.05); border-radius: 4px;">#${player.number}</td>
                <td style="padding: 0.9rem 1rem; font-weight: 700; color: var(--text-primary);">${player.name}</td>
                <td style="padding: 0.9rem 1rem;"><span class="badge-tag" style="font-size: 0.75rem; background: rgba(255,255,255,0.08);">${player.pos}</span></td>
                <td style="padding: 0.9rem 1rem; color: var(--text-secondary);">${player.club}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Render Skeletons Loading List
 */
function renderSkeletons(container, count = 6) {
  container.innerHTML = Array(count).fill(0).map(() => `
    <div class="skeleton" style="height: 140px; border-radius: var(--radius-md);"></div>
  `).join('');
}

/**
 * Render Detail Skeleton
 */
function renderDetailSkeleton(container) {
  container.innerHTML = `
    <div class="skeleton" style="height: 200px; border-radius: var(--radius-lg); margin-bottom: 2rem;"></div>
    <div class="skeleton" style="height: 350px; border-radius: var(--radius-lg);"></div>
  `;
}

/**
 * Render Error State
 */
function renderErrorState(container, message) {
  container.innerHTML = `
    <div class="error-box" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">No se pudieron cargar los equipos</h3>
      <p class="error-desc">${message}</p>
      <button class="btn-retry" id="btn-retry-teams">Reintentar</button>
    </div>
  `;

  const retryBtn = document.getElementById('btn-retry-teams');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => loadTeams());
  }
}
