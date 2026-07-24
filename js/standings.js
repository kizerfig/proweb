/* ==========================================
 FIFA WORLD CUP 2026 - STANDINGS & PHASES MODULE
 js/standings.js
 ========================================== */

import { fetchWithCache } from './api.js';
import { initLayout } from './layout.js';

let allStandings = [];   // [{ groupId, groupName, teams: [...] }]
let allMatches   = [];   // raw matches from API
let teamsMap     = {};   // { code: { name, flagUri, host } }
let currentTab   = 'all';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🏆 FIFA World Cup 2026 - Clasificación y Fases Initialized');
  initLayout();
  setupTabsListeners();
  loadAll();
});

/* ═══════════════════════════ DATA LOADING ═══════════════════════════════ */

async function loadAll() {
  const container = document.getElementById('group-grid-container');
  if (!container) return;
  renderSkeletons(container, 12);

  try {
    const [rawTeams, rawMatches] = await Promise.all([
      fetchWithCache('teams'),
      fetchWithCache('matches')
    ]);

    // Build teams lookup map
    const teams = Array.isArray(rawTeams) ? rawTeams : (rawTeams?.teams || rawTeams?.data || []);
    teams.forEach(t => {
      const code = t.id || t.code;
      if (!code) return;
      teamsMap[code] = {
        code,
        name    : t.name || code,
        flagUri : t.flag_url || t.flag_uri || t.flag ||
                  `https://api.fifa.com/api/v3/picture/flags-sq-5/${code}`,
        host    : t.host ?? false,
        worldRanking: t.world_ranking ?? 999
      };
    });

    allMatches = Array.isArray(rawMatches) ? rawMatches : (rawMatches?.matches || rawMatches?.data || []);

    // Build standings from real match results
    allStandings = buildStandingsFromMatches(allMatches, teamsMap);

    if (!allStandings.length) {
      renderErrorState(container, 'No se encontraron datos del torneo.');
      return;
    }

    populateGroupSelector(allStandings);
    renderCurrentTab();

  } catch (error) {
    console.error('Error al cargar clasificaciones:', error);
    renderErrorState(container, 'Ocurrió un error al obtener la clasificación.');
  }
}

/* ═══════════════════════════ STANDINGS BUILDER ══════════════════════════ */

function buildStandingsFromMatches(matches, tmap) {
  const groupStats = {};   // { groupLetter: { teamCode: stats } }

  // Process group stage matches
  matches
    .filter(m => m.group && m.group !== '' && m.status === 'Ended')
    .forEach(m => {
      const g = String(m.group).toUpperCase();
      if (!groupStats[g]) groupStats[g] = {};

      const initTeam = code => {
        if (!groupStats[g][code]) {
          groupStats[g][code] = { pj:0, wins:0, draws:0, loss:0, gf:0, ga:0, gd:0, pts:0 };
        }
      };

      initTeam(m.home_id);
      initTeam(m.away_id);

      const hs = m.home_score?.total ?? 0;
      const as = m.away_score?.total ?? 0;

      groupStats[g][m.home_id].pj++;
      groupStats[g][m.away_id].pj++;
      groupStats[g][m.home_id].gf += hs;
      groupStats[g][m.home_id].ga += as;
      groupStats[g][m.away_id].gf += as;
      groupStats[g][m.away_id].ga += hs;

      if (hs > as) {
        groupStats[g][m.home_id].wins++;
        groupStats[g][m.home_id].pts += 3;
        groupStats[g][m.away_id].loss++;
      } else if (hs < as) {
        groupStats[g][m.away_id].wins++;
        groupStats[g][m.away_id].pts += 3;
        groupStats[g][m.home_id].loss++;
      } else {
        groupStats[g][m.home_id].draws++;
        groupStats[g][m.home_id].pts++;
        groupStats[g][m.away_id].draws++;
        groupStats[g][m.away_id].pts++;
      }
    });

  // Merge with teams fallback (for teams with 0 group matches in the API)
  if (!Object.keys(groupStats).length) {
    // No match data found — build from teamsMap with zeroed stats
    Object.values(tmap).forEach(t => {
      const g = t.group || 'X';
      if (!groupStats[g]) groupStats[g] = {};
      if (!groupStats[g][t.code]) {
        groupStats[g][t.code] = { pj:0,wins:0,draws:0,loss:0,gf:0,ga:0,gd:0,pts:0 };
      }
    });
  }

  // Build sorted groups
  return Object.keys(groupStats).sort().map(gId => {
    const teamsList = Object.entries(groupStats[gId]).map(([code, stats]) => {
      const info = tmap[code] || { code, name: code, flagUri: `https://api.fifa.com/api/v3/picture/flags-sq-5/${code}`, host: false, worldRanking: 999 };
      return {
        code,
        name    : info.name,
        flagUri : info.flagUri,
        host    : info.host,
        worldRanking: info.worldRanking,
        ...stats,
        gd: stats.gf - stats.ga
      };
    });

    // Sort: pts desc → gd desc → gf desc → worldRanking asc
    teamsList.sort((a, b) =>
      (b.pts - a.pts) || (b.gd - a.gd) || (b.gf - a.gf) || (a.worldRanking - b.worldRanking)
    );
    teamsList.forEach((t, i) => { t.rank = i + 1; });

    return { groupId: gId, groupName: `Grupo ${gId}`, teams: teamsList };
  });
}

/* ═══════════════════════════ KNOCKOUT BUILDER ═══════════════════════════ */

// WC 2026 Round mapping (confirmed from API match data):
// Round 6  → Dieciseisavos de Final / R32 (16 matches - main bracket)
// Round 5  → Octavos de Final / R16 (8 matches - best 3rd place teams)
// Round 27 → Cuartos de Final / QF  (4 matches)
// Round 28 → Semifinales / SF       (2 matches)
// Round 29 → FINAL                  (1 match - España 1-0 Argentina)
// Round 50 → TERCER LUGAR           (1 match - Francia 4-6 Inglaterra)

function buildKnockoutRounds(matches) {
  const knockout = matches.filter(m => (!m.group || m.group === ''));
  const byRound = {};
  knockout.forEach(m => {
    const r = m.round;
    if (!byRound[r]) byRound[r] = [];
    byRound[r].push(m);
  });

  const rounds = [];

  // 1. Round 6 = Dieciseisavos de Final (R32) — 16 main bracket matches
  const r32 = (byRound[6] || []).sort((a, b) => a.date?.localeCompare(b.date) || 0);
  if (r32.length) rounds.push({ id: 'r32', label: 'Dieciseisavos de Final', matches: r32, type: 'default' });

  // 2. Round 5 = Octavos de Final (R16) — 8 best-3rd-place qualifying matches
  const r16 = (byRound[5] || []).sort((a, b) => a.date?.localeCompare(b.date) || 0);
  if (r16.length) rounds.push({ id: 'r16', label: 'Octavos de Final', matches: r16, type: 'default' });

  // 3. Round 27 = Cuartos de Final (QF) — 4 matches
  const qf = (byRound[27] || []).sort((a, b) => a.date?.localeCompare(b.date) || 0);
  if (qf.length) rounds.push({ id: 'qf', label: 'Cuartos de Final', matches: qf, type: 'default' });

  // 4. Round 28 = Semifinales (SF) — 2 matches
  const sf = (byRound[28] || []).sort((a, b) => a.date?.localeCompare(b.date) || 0);
  if (sf.length) rounds.push({ id: 'sf', label: 'Semifinales', matches: sf, type: 'sf' });

  // 5. Round 29 = FINAL — España 1-0 Argentina
  const finalMatches = (byRound[29] || []).filter(m => m.status === 'Ended');
  const mainFinal = finalMatches[0] || null;
  if (mainFinal) {
    rounds.push({ id: 'final', label: 'Final', matches: [mainFinal], type: 'final' });
  }

  // Round 50 = TERCER LUGAR — Francia 4-6 Inglaterra
  const place3Matches = (byRound[50] || []).filter(m => m.status === 'Ended');
  const place3 = place3Matches[0] || null;

  return { rounds, mainFinal, place3 };
}


/* ═══════════════════════════ UI HELPERS ═════════════════════════════════ */

function populateGroupSelector(groups) {
  const select = document.getElementById('single-group-select');
  if (!select) return;
  select.innerHTML = groups.map(g => `<option value="${g.groupId}">${g.groupName}</option>`).join('');
}

function setupTabsListeners() {
  const tabButtons        = document.querySelectorAll('.tab-btn');
  const groupSelectWrap   = document.getElementById('group-selector-wrap');
  const singleGroupSelect = document.getElementById('single-group-select');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      e.currentTarget.classList.add('active');
      e.currentTarget.setAttribute('aria-selected', 'true');
      currentTab = e.currentTarget.getAttribute('data-tab');
      if (groupSelectWrap) groupSelectWrap.hidden = (currentTab !== 'by-group');
      renderCurrentTab();
    });
  });

  singleGroupSelect?.addEventListener('change', () => {
    if (currentTab === 'by-group') renderCurrentTab();
  });
}

function renderCurrentTab() {
  const container = document.getElementById('group-grid-container');
  if (!container) return;
  container.className = 'group-grid';

  if (currentTab === 'all') {
    renderAllGroups(container, allStandings);
  } else if (currentTab === 'by-group') {
    const selectedId = document.getElementById('single-group-select')?.value || allStandings[0]?.groupId;
    const single     = allStandings.filter(g => g.groupId === selectedId);
    renderAllGroups(container, single.length ? single : allStandings.slice(0, 1));
  } else if (currentTab === 'knockout') {
    renderKnockoutStage(container);
  }
}

/* ═══════════════════════════ RENDER — GROUPS ════════════════════════════ */

function renderSkeletons(container, count = 6) {
  container.innerHTML = Array(count).fill(0).map(() =>
    `<div class="skeleton" style="height: 260px; border-radius: var(--radius-md);"></div>`
  ).join('');
}

function flagImg(team) {
  if (team.flagUri) {
    return `<img src="${team.flagUri}" alt="${team.name}" loading="lazy"
              style="width:26px;height:17px;object-fit:cover;border-radius:2px;border:1px solid var(--border-color);flex-shrink:0;"
              onerror="this.style.display='none';">`;
  }
  return `<span style="font-weight:800;font-size:0.7rem;color:var(--text-secondary);">${team.code}</span>`;
}

function flagImgByCode(code) {
  const t = teamsMap[code];
  if (t?.flagUri) {
    return `<img src="${t.flagUri}" alt="${t.name}" loading="lazy"
              style="width:20px;height:13px;object-fit:cover;border-radius:2px;border:1px solid rgba(255,255,255,0.15);flex-shrink:0;"
              onerror="this.style.display='none';">`;
  }
  return `<img src="https://api.fifa.com/api/v3/picture/flags-sq-5/${code}" alt="${code}" loading="lazy"
              style="width:20px;height:13px;object-fit:cover;border-radius:2px;border:1px solid rgba(255,255,255,0.15);flex-shrink:0;"
              onerror="this.style.display='none';">`;
}

function teamName(code) {
  return teamsMap[code]?.name || code;
}

function renderAllGroups(container, groups) {
  if (!container || !groups.length) return;

  container.innerHTML = groups.map(group => {
    const rows = group.teams.map((team, idx) => {
      const rankNum     = team.rank || idx + 1;
      const isQualified = rankNum <= 2;
      const gdStr       = team.gd > 0 ? `+${team.gd}` : `${team.gd}`;
      const hostBadge   = team.host ? `<span title="Anfitrión" style="color:#D29922;margin-left:2px;font-size:0.68rem;">🏠</span>` : '';

      return `
        <tr>
          <td class="col-rank">
            <span class="rank-badge ${isQualified ? 'qualified' : 'eliminated'}">${rankNum}</span>
          </td>
          <td style="min-width:110px;">
            <div style="display:flex;align-items:center;gap:0.55rem;">
              ${flagImg(team)}
              <span style="font-weight:700;font-size:0.82rem;color:var(--text-primary);line-height:1.2;">${team.name}${hostBadge}</span>
            </div>
          </td>
          <td class="col-stat">${team.pj}</td>
          <td class="col-stat">${team.wins}</td>
          <td class="col-stat">${team.draws}</td>
          <td class="col-stat">${team.loss}</td>
          <td class="col-stat">${team.gf}</td>
          <td class="col-stat">${team.ga}</td>
          <td class="col-stat" style="color:${team.gd>0?'#3fb950':team.gd<0?'#f85149':'var(--text-secondary)'};">${gdStr}</td>
          <td class="col-pts"><strong style="color:var(--accent-mint);font-family:'Rajdhani',sans-serif;font-size:1rem;">${team.pts}</strong></td>
        </tr>`;
    }).join('');

    return `
      <div class="group-card">
        <div class="group-card-header">⚽ ${group.groupName}</div>
        <div style="overflow-x:auto;">
          <table class="group-table" aria-label="Tabla ${group.groupName}" style="min-width:430px;">
            <thead>
              <tr>
                <th class="col-rank">#</th>
                <th>Equipo</th>
                <th class="col-stat" title="Partidos Jugados">PJ</th>
                <th class="col-stat" title="Ganados">PG</th>
                <th class="col-stat" title="Empatados">PE</th>
                <th class="col-stat" title="Perdidos">PP</th>
                <th class="col-stat" title="Goles a Favor">GF</th>
                <th class="col-stat" title="Goles en Contra">GC</th>
                <th class="col-stat" title="Diferencia de Goles">DG</th>
                <th class="col-pts" title="Puntos">Pts</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div style="padding:0.35rem 0.8rem 0.5rem;display:flex;gap:1.2rem;flex-wrap:wrap;">
          <span style="font-size:0.72rem;color:var(--text-secondary);display:flex;align-items:center;gap:4px;">
            <span class="rank-badge qualified" style="width:14px;height:14px;font-size:0.58rem;flex-shrink:0;">1</span> Clasificado directo
          </span>
          <span style="font-size:0.72rem;color:var(--text-secondary);display:flex;align-items:center;gap:4px;">
            <span class="rank-badge eliminated" style="width:14px;height:14px;font-size:0.58rem;flex-shrink:0;">3</span> Mejor 3°
          </span>
        </div>
      </div>`;
  }).join('');
}

/* ═══════════════════════════ RENDER — KNOCKOUT ══════════════════════════ */

function matchCard(m, isFinal = false) {
  const hs = m.home_score?.total ?? null;
  const as = m.away_score?.total ?? null;
  const hasResult = hs !== null && as !== null && m.status === 'Ended';
  const homeWon = hasResult && hs > as;
  const awayWon = hasResult && as > hs;

  const scoreStyle  = 'font-weight:800;font-family:"Rajdhani",sans-serif;font-size:1.1rem;min-width:18px;text-align:right;';
  const winColor    = isFinal ? '#D29922' : 'var(--accent-mint)';
  const homeScore   = hasResult ? `<span style="${scoreStyle}color:${homeWon?winColor:'var(--text-secondary)'};">${hs}</span>` : `<span style="${scoreStyle}color:var(--text-secondary);">-</span>`;
  const awayScore   = hasResult ? `<span style="${scoreStyle}color:${awayWon?winColor:'var(--text-secondary)'};">${as}</span>` : `<span style="${scoreStyle}color:var(--text-secondary);">-</span>`;

  const hFlag = flagImgByCode(m.home_id);
  const aFlag = flagImgByCode(m.away_id);

  return `
    <div class="ko-match${isFinal?' ko-match--final':''}">
      <div class="ko-team ${homeWon?'ko-team--winner':''}">
        <div style="display:flex;align-items:center;gap:6px;">
          ${hFlag}
          <span class="ko-team-name">${teamName(m.home_id)}</span>
        </div>
        ${homeScore}
      </div>
      <div class="ko-team ${awayWon?'ko-team--winner':''}">
        <div style="display:flex;align-items:center;gap:6px;">
          ${aFlag}
          <span class="ko-team-name">${teamName(m.away_id)}</span>
        </div>
        ${awayScore}
      </div>
    </div>`;
}

function renderKnockoutStage(container) {
  container.className = 'group-grid knockout-grid';

  const { rounds, mainFinal, place3 } = buildKnockoutRounds(allMatches);

  if (!rounds.length && !mainFinal) {
    container.innerHTML = `
      <div class="knockout-container" style="grid-column:1/-1;">
        <p style="color:var(--text-secondary);text-align:center;padding:3rem;font-size:1rem;">
          Las llaves eliminatorias estarán disponibles al finalizar la fase de grupos.
        </p>
      </div>`;
    return;
  }

  // Determine champion from the FINAL match (round 29)
  let champion = null;
  if (mainFinal && mainFinal.status === 'Ended') {
    const hs = mainFinal.home_score?.total ?? 0;
    const as = mainFinal.away_score?.total ?? 0;
    champion = hs >= as ? mainFinal.home_id : mainFinal.away_id;
  }

  container.innerHTML = `
    <div class="knockout-container" style="grid-column:1/-1;overflow-x:auto;">
      <h2 style="text-align:center;font-family:'Rajdhani',sans-serif;font-size:1.4rem;font-weight:800;color:var(--accent-mint);letter-spacing:0.08em;margin-bottom:1.5rem;">
        🏆 LLAVES DE ELIMINATORIA DIRECTA
      </h2>

      <!-- Main bracket (scrollable tree with vertical alignment) -->
      <div class="ko-bracket">
        ${rounds.map(round => {
          const isFinalCol = round.type === 'final';
          const titleClass = round.type === 'sf' ? 'ko-round-title--red' : round.type === 'final' ? 'ko-round-title--gold' : '';
          return `
            <div class="ko-round">
              <div class="ko-round-title ${titleClass}">${round.label}</div>
              <div class="ko-round-matches">
                ${round.matches.map(m => matchCard(m, isFinalCol)).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Bottom summary cards: Tercer Puesto & Gran Final side by side -->
      <div style="margin-top:2.5rem;width:100%;border-top:1px dashed var(--border-color);padding-top:1.5rem;display:flex;gap:2rem;flex-wrap:wrap;justify-content:center;align-items:flex-start;">
        ${place3 ? `
          <div style="min-width:240px;">
            <div class="ko-round-title ko-round-title--red" style="margin-bottom:0.6rem;font-size:0.82rem;">🥉 TERCER PUESTO</div>
            ${matchCard(place3, false)}
          </div>
        ` : ''}
        ${mainFinal ? `
          <div style="min-width:240px;">
            <div class="ko-round-title ko-round-title--gold" style="margin-bottom:0.6rem;font-size:0.82rem;">🏆 GRAN FINAL</div>
            ${matchCard(mainFinal, true)}
          </div>
        ` : ''}
      </div>

      <!-- Champion banner -->
      ${champion ? (() => {
        const winnerInfo = teamsMap[champion] || { name: champion, flagUri: `https://api.fifa.com/api/v3/picture/flags-sq-5/${champion}` };
        return `
          <div style="margin-top:2rem;width:100%;text-align:center;padding:1.5rem 1rem;background:linear-gradient(135deg,rgba(210,153,34,0.15),rgba(210,153,34,0.05));border:1px solid rgba(210,153,34,0.3);border-radius:var(--radius-md);">
            <div style="font-size:2.5rem;margin-bottom:0.4rem;">🏆</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:0.5rem;">Campeón Mundial FIFA 2026</div>
            <div style="display:flex;align-items:center;justify-content:center;gap:0.85rem;">
              <img src="${winnerInfo.flagUri}" alt="${winnerInfo.name}"
                   style="width:48px;height:32px;object-fit:cover;border-radius:3px;border:2px solid #D29922;box-shadow:0 0 12px rgba(210,153,34,0.4);"
                   onerror="this.style.display='none';">
              <span style="font-family:'Rajdhani',sans-serif;font-size:2.2rem;font-weight:900;color:#D29922;text-shadow:0 0 20px rgba(210,153,34,0.4);">
                ${winnerInfo.name}
              </span>
            </div>
          </div>`;
      })() : ''}
    </div>`;
}

/* ═══════════════════════════ ERROR / SKELETON ═══════════════════════════ */

function renderErrorState(container, message) {
  container.innerHTML = `
    <div class="error-box">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">No se pudo cargar la clasificación</h3>
      <p class="error-desc">${message}</p>
      <button class="btn-retry" id="btn-retry-standings">🔄 Reintentar</button>
    </div>`;
  document.getElementById('btn-retry-standings')?.addEventListener('click', loadAll);
}
