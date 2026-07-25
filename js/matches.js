import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

let allMatches = [];

document.addEventListener('DOMContentLoaded', () => {
 console.log(' FIFA World Cup 2026 - Calendario de Partidos Initialized');
 initLayout();
 setupFilterListeners();
 loadMatches();
});


async function loadMatches() {
 const container = document.getElementById('matches-grid-container');
 if (!container) return;
 renderSkeletons(container, 6);

 try {
 const matchesData = await FIFA_API.getMatches();

 if (!matchesData || !Array.isArray(matchesData) || matchesData.length === 0) {
 renderNoMatchesState(container);
 return;
 }

 allMatches = matchesData;
 allMatches.sort((a, b) => {
 const byDate = String(a.date || '').localeCompare(String(b.date || ''));
 if (byDate !== 0) return byDate;
 return String(a.time || '').localeCompare(String(b.time || ''));
 });
 populateTeamFilter(allMatches);
 filterAndRenderMatches();

 } catch (error) {
 console.error('Error al cargar partidos:', error);
 container.innerHTML = `
 <div class="error-box">
 <div class="error-icon">️</div>
 <h3 class="error-title">Error al cargar partidos</h3>
 <p class="error-desc">No se pudieron obtener los datos de los partidos. Intenta nuevamente.</p>
 <button class="btn-retry" id="btn-retry-matches"> Reintentar</button>
 </div>
 `;

 const retryBtn = document.getElementById('btn-retry-matches');
 if (retryBtn) {
 retryBtn.addEventListener('click', () => loadMatches());
 }
 }
}


function setupFilterListeners() {
  const filterCity = document.getElementById('filter-city');
  const filterRound = document.getElementById('filter-round');
  const filterStatus = document.getElementById('filter-status');
  const filterGroup = document.getElementById('filter-group');
  const filterTeam = document.getElementById('filter-team');

  const controls = [filterCity, filterRound, filterStatus, filterGroup, filterTeam];
  controls.forEach(control => {
    if (control) {
      control.addEventListener('change', () => filterAndRenderMatches());
    }
  });
}


function populateTeamFilter(matches) {
  const filterTeam = document.getElementById('filter-team');
  if (!filterTeam) return;

  const teamsMap = new Map();
  matches.forEach(match => {
    if (match.team1?.name && match.team1?.code) {
      teamsMap.set(match.team1.code, match.team1.name);
    }
    if (match.team2?.name && match.team2?.code) {
      teamsMap.set(match.team2.code, match.team2.name);
    }
  });

  const sortedTeams = [...teamsMap.entries()].sort((a, b) =>
    a[1].localeCompare(b[1])
  );

  filterTeam.innerHTML = `<option value="all">Todos los equipos</option>` +
    sortedTeams.map(([code, name]) =>
      `<option value="${code}">${name}</option>`
    ).join('');
}


function filterAndRenderMatches() {
  const container = document.getElementById('matches-grid-container');
  if (!container) return;

  const city = document.getElementById('filter-city')?.value || 'all';
  const round = document.getElementById('filter-round')?.value || 'all';
  const status = document.getElementById('filter-status')?.value || 'all';
  const group = document.getElementById('filter-group')?.value || 'all';
  const team = document.getElementById('filter-team')?.value || 'all';

  const filtered = allMatches.filter(match => {
    const cityMatch = city === 'all' || match.city === city;
    const roundMatch = round === 'all' || match.round === round;
    const statusMatch = status === 'all' || match.status === status;
    const groupMatch = group === 'all' || match.group === group;

    const teamMatch = team === 'all' ||
      match.team1?.code === team ||
      match.team2?.code === team;

    return cityMatch && roundMatch && statusMatch && groupMatch && teamMatch;
  });

 if (filtered.length === 0) {
 renderNoMatchesState(container);
 } else {
 renderMatchCards(container, filtered);
 }
}


function renderSkeletons(container, count = 6) {
 container.innerHTML = Array(count).fill(0).map(() => `
 <div class="skeleton" style="height: 180px; border-radius: var(--radius-md);"></div>
 `).join('');
}


function renderMatchCards(container, matchesList) {
  const getFlagImgHtml = (code, name) => {
    const flagUrl = `https://api.fifa.com/api/v3/picture/flags-sq-5/${code}`;
    return `<div class="flag-box" style="padding:0; overflow:hidden; display:flex; align-items:center; justify-content:center; width:32px; height:22px; border-radius:3px; border:1px solid rgba(255,255,255,0.15); flex-shrink:0;">
      <img src="${flagUrl}" alt="${name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
      <span style="display:none; font-weight:800; font-size:0.7rem;">${code}</span>
    </div>`;
  };

  container.innerHTML = matchesList.map(match => {
    const statusClass = match.statusClass || (
      match.status === 'En vivo' || match.status === 'live' ? 'live' :
      match.status === 'Finalizado' || match.status === 'finished' ? 'finished' : 'scheduled'
    );
    const statusText = match.statusLabel || match.status || 'Finalizado';

    return `
    <a href="detalle-partido.html?id=${match.id}" class="match-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column;">
      <div class="match-header">
        <span class="match-venue">📍 ${match.city}${match.stadium ? ' • ' + match.stadium : ''}</span>
        <span class="status-badge ${statusClass}">${statusText}</span>
      </div>

      <div class="match-teams">
        <div class="team-row">
          <div class="team-info">
            ${getFlagImgHtml(match.team1.code, match.team1.name)}
            <span class="team-code">${match.team1.code}</span>
            <span class="team-name">${match.team1.name}</span>
          </div>
          <span class="team-score">${match.team1.score}</span>
        </div>

        <div class="team-row">
          <div class="team-info">
            ${getFlagImgHtml(match.team2.code, match.team2.name)}
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


function renderNoMatchesState(container) {
 container.innerHTML = `
 <div class="no-matches-box">
 <span></span>
 <p>No se encontraron partidos para los filtros seleccionados</p>
 </div>
 `;
}
