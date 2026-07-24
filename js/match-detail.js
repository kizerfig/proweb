/* ==========================================
   FIFA WORLD CUP 2026 - MATCH DETAIL MODULE
   js/match-detail.js
   ========================================== */

import { FIFA_API } from './api.js';
import { initNavbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('⚽ FIFA World Cup 2026 - Detalle de Partido Initialized');

  // 1. Initialize global header/navbar logic
  initNavbar();

  // 2. Setup interactive tab switcher
  setupTabSwitcher();

  // 3. Load Match Data based on URL ID parameter
  loadMatchDetail();
});

/**
 * Parses URL params and fetches match detail
 */
async function loadMatchDetail() {
  const heroContainer = document.getElementById('match-hero');
  const urlParams = new URLSearchParams(window.location.search);
  const matchId = urlParams.get('id') || 'm1';

  try {
    const match = await FIFA_API.getMatchById(matchId);

    if (!match) {
      if (heroContainer) {
        heroContainer.innerHTML = `
          <div class="error-box">
            <h3>Partido no encontrado</h3>
            <p>No se pudo recuperar la información del partido solicitado.</p>
            <a href="partidos.html" class="btn btn-primary" style="margin-top: 1rem;">Volver al calendario</a>
          </div>
        `;
      }
      return;
    }

    // Render components
    renderHero(match);
    renderTimeline(match);
    renderStats(match);
    renderLineups(match);
    renderHighlights(match);

  } catch (error) {
    console.error('Error al cargar detalle del partido:', error);
    if (heroContainer) {
      heroContainer.innerHTML = `
        <div class="error-box">
          <h3>Error al cargar el partido</h3>
          <p>Ocurrió un inconveniente al conectar con el servidor.</p>
        </div>
      `;
    }
  }
}

/**
 * Render Hero Card (.match-hero-card)
 */
function renderHero(match) {
  const container = document.getElementById('match-hero');
  if (!container) return;

  const team1 = match.team1 || { code: 'T1', name: 'Equipo 1', score: '-' };
  const team2 = match.team2 || { code: 'T2', name: 'Equipo 2', score: '-' };

  const isScheduled = match.status === 'Programado';

  container.innerHTML = `
    <div class="hero-header-info">
      <span class="hero-group-round">${match.group || 'Fase de Grupos'} • ${match.round || 'Fase de Grupos'}</span>
      <span class="hero-datetime">📅 ${match.datetime || 'Próximamente'}</span>
      <span class="hero-location">📍 ${match.stadium || 'Estadio FIFA'}, ${match.city || 'Ciudad Anfitriona'}</span>
      ${match.referee ? `<span class="hero-referee">⚖️ Árbitro: ${match.referee}</span>` : ''}
    </div>

    <div class="hero-scoreboard">
      <!-- Team 1 -->
      <div class="hero-team home">
        <div class="hero-code">${team1.code}</div>
        <div class="hero-team-name">${team1.name}</div>
        <div class="hero-score">${team1.score}</div>
      </div>

      <!-- Divider / Separator -->
      <div class="hero-vs">
        ${isScheduled ? '<span class="status-badge scheduled">VS</span>' : '<span class="hero-divider">-</span>'}
      </div>

      <!-- Team 2 -->
      <div class="hero-team away">
        <div class="hero-code">${team2.code}</div>
        <div class="hero-team-name">${team2.name}</div>
        <div class="hero-score">${team2.score}</div>
      </div>
    </div>
  `;
}

/**
 * Render Timeline Tab (#tab-cronologia)
 */
function renderTimeline(match) {
  const container = document.getElementById('timeline-list');
  if (!container) return;

  const timeline = match.timeline;

  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
    container.innerHTML = `
      <div class="empty-tab-box">
        <span>⏱️</span>
        <p>No hay eventos registrados en la cronología de este encuentro.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = timeline.map(event => {
    let badgeClass = 'badge-mint';
    let icon = '⚽';

    if (event.type === 'card-yellow') {
      badgeClass = 'badge-yellow';
      icon = '🟨';
    } else if (event.type === 'card-red') {
      badgeClass = 'badge-red';
      icon = '🟥';
    }

    return `
      <div class="timeline-item">
        <div class="minute-badge ${badgeClass}">${event.minute}</div>
        <div class="timeline-info">
          <div class="timeline-title">
            <span>${icon}</span> ${event.title}
          </div>
          <p class="timeline-desc">${event.desc}</p>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render Statistics Tab (#tab-estadisticas)
 */
function renderStats(match) {
  const container = document.getElementById('stats-list');
  if (!container) return;

  const stats = match.stats;

  if (!stats) {
    container.innerHTML = `
      <div class="empty-tab-box">
        <span>📊</span>
        <p>Estadísticas no disponibles para este encuentro.</p>
      </div>
    `;
    return;
  }

  const team1Name = match.team1?.name || 'Local';
  const team2Name = match.team2?.name || 'Visitante';

  const rows = [
    { label: 'Posesión', val1: `${stats.possession[0]}%`, val2: `${stats.possession[1]}%`, num1: stats.possession[0], num2: stats.possession[1] },
    { label: 'Tiros a puerta', val1: stats.shotsOnTarget[0], val2: stats.shotsOnTarget[1], num1: stats.shotsOnTarget[0], num2: stats.shotsOnTarget[1] },
    { label: 'Corners', val1: stats.corners[0], val2: stats.corners[1], num1: stats.corners[0], num2: stats.corners[1] },
    { label: 'Faltas', val1: stats.fouls[0], val2: stats.fouls[1], num1: stats.fouls[0], num2: stats.fouls[1] },
    { label: 'Tarjetas Amarillas', val1: renderCardBadges(stats.yellowCards[0], 'yellow'), val2: renderCardBadges(stats.yellowCards[1], 'yellow'), num1: stats.yellowCards[0], num2: stats.yellowCards[1], isCustom: true },
    { label: 'Tarjetas Rojas', val1: renderCardBadges(stats.redCards[0], 'red'), val2: renderCardBadges(stats.redCards[1], 'red'), num1: stats.redCards[0], num2: stats.redCards[1], isCustom: true }
  ];

  container.innerHTML = `
    <div class="stats-header-teams">
      <span class="team-lbl home">${match.team1?.code} ${team1Name}</span>
      <span class="team-lbl away">${team2Name} ${match.team2?.code}</span>
    </div>
    <div class="stats-rows">
      ${rows.map(row => {
        const total = (row.num1 + row.num2) || 1;
        const pct1 = Math.round((row.num1 / total) * 100);
        const pct2 = 100 - pct1;

        return `
          <div class="stat-row">
            <div class="stat-meta">
              <span class="stat-val home">${row.val1}</span>
              <span class="stat-label">${row.label}</span>
              <span class="stat-val away">${row.val2}</span>
            </div>
            <div class="stat-bar-wrapper">
              <div class="stat-bar-left" style="width: ${pct1}%;"></div>
              <div class="stat-bar-right" style="width: ${pct2}%;"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderCardBadges(count, type) {
  if (!count || count === 0) return `<span>0</span>`;
  const badgeHTML = `<span class="mini-card-icon ${type}"></span>`.repeat(count);
  return `<div class="cards-flex">${badgeHTML} <span>(${count})</span></div>`;
}

/**
 * Render Lineups Tab (#tab-alineaciones)
 */
function renderLineups(match) {
  const container = document.getElementById('lineups-view');
  if (!container) return;

  const lineups = match.lineups;

  // Validation rule: If starting 11 are not available for either team, display explicit fallback message
  const hasTeam1 = lineups?.team1?.starting && lineups.team1.starting.length >= 11;
  const hasTeam2 = lineups?.team2?.starting && lineups.team2.starting.length >= 11;

  if (!hasTeam1 || !hasTeam2) {
    container.innerHTML = `
      <div class="soccer-pitch pitch-unavailable">
        <div class="unavailable-overlay">
          <div class="unavailable-icon">⚽</div>
          <h3 class="unavailable-title">Alineación no disponible para este encuentro</h3>
          <p class="unavailable-sub">Las alineaciones oficiales se confirman 1 hora antes del inicio del partido.</p>
        </div>
      </div>
    `;
    return;
  }

  const team1 = lineups.team1;
  const team2 = lineups.team2;

  container.innerHTML = `
    <div class="lineups-wrapper">
      
      <!-- Interactive Pitch -->
      <div class="soccer-pitch">
        <div class="pitch-half top-half">
          <div class="pitch-team-title">${match.team1?.name} (${team1.formation})</div>
          ${team1.starting.map(p => `
            <div class="pitch-player team-home" style="top: ${p.row * 22}%; left: ${p.col}%;">
              <div class="player-circle">${p.number}</div>
              <span class="player-name">${p.name}</span>
            </div>
          `).join('')}
        </div>

        <div class="pitch-center-line"></div>
        <div class="pitch-center-circle"></div>

        <div class="pitch-half bottom-half">
          <div class="pitch-team-title bottom">${match.team2?.name} (${team2.formation})</div>
          ${team2.starting.map(p => `
            <div class="pitch-player team-away" style="bottom: ${(5 - p.row) * 22}%; left: ${p.col}%;">
              <div class="player-circle">${p.number}</div>
              <span class="player-name">${p.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Lineup Extras (Substitutes & Coaches) -->
      <div class="lineup-extras-grid">
        <div class="extras-card">
          <h4>👥 Suplentes - ${match.team1?.name}</h4>
          <ul>${team1.substitutes.map(s => `<li>• ${s}</li>`).join('')}</ul>
          <p class="coach-info">👔 <strong>Director Técnico:</strong> ${team1.coach}</p>
        </div>

        <div class="extras-card">
          <h4>👥 Suplentes - ${match.team2?.name}</h4>
          <ul>${team2.substitutes.map(s => `<li>• ${s}</li>`).join('')}</ul>
          <p class="coach-info">👔 <strong>Director Técnico:</strong> ${team2.coach}</p>
        </div>
      </div>

    </div>
  `;
}

/**
 * Render Highlights Tab (#tab-highlights)
 */
function renderHighlights(match) {
  const container = document.getElementById('highlights-view');
  if (!container) return;

  const highlights = match.highlights;

  if (!highlights || !highlights.main) {
    container.innerHTML = `
      <div class="empty-tab-box">
        <span>🎥</span>
        <p>Los resúmenes en video estarán disponibles al finalizar el encuentro.</p>
      </div>
    `;
    return;
  }

  const main = highlights.main;
  const gallery = highlights.gallery || [];

  container.innerHTML = `
    <div class="highlights-wrapper">
      
      <!-- Main Player -->
      <div class="main-video-box">
        <div class="video-container">
          <video controls poster="${main.poster}">
            <source src="${main.videoUrl}" type="video/mp4">
            Tu navegador no soporta el reproductor de video.
          </video>
        </div>
        <h3 class="video-main-title">${main.title}</h3>
      </div>

      <!-- Gallery / Carousel of clip thumbnails -->
      ${gallery.length > 0 ? `
        <h4 class="gallery-section-title">Momento a Momento</h4>
        <div class="highlights-gallery">
          ${gallery.map(clip => `
            <div class="clip-card">
              <div class="clip-thumb-wrap">
                <img src="${clip.image}" alt="${clip.title}" loading="lazy" />
                <span class="clip-duration">⏱️ ${clip.duration}</span>
                <div class="play-overlay">▶</div>
              </div>
              <p class="clip-title">${clip.title}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

    </div>
  `;
}

/**
 * Setup Tab Switcher Event Listener
 */
function setupTabSwitcher() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button state
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update contents visibility
      tabContents.forEach(content => {
        if (content.id === `tab-${targetTab}`) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
}
