/* ==========================================
 FIFA WORLD CUP 2026 - MATCH DETAIL MODULE
 js/match-detail.js
 ========================================== */

import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
 console.log(' FIFA World Cup 2026 - Detalle de Partido Initialized');

 // 1. Initialize global header/navbar logic
 initLayout();

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

 const isScheduled = match.status === 'Programado' || match.status === 'Scheduled';

 // Format date nicely
 let dateStr = match.datetime || match.date || 'Próximamente';

 container.innerHTML = `
 <div class="hero-header-info">
 <span class="hero-group-round">${match.group ? 'Grupo ' + match.group + ' •' : ''} ${match.round || 'Fase de Grupos'}</span>
 <span class="hero-datetime"> ${dateStr}</span>
 <span class="hero-location"> ${match.stadium || 'Estadio FIFA'}, ${match.city || 'Ciudad Anfitriona'}</span>
 ${match.referee ? `<span class="hero-referee">️ Árbitro: ${match.referee}</span>` : ''}
 </div>

 <div class="hero-scoreboard">
 <!-- Team 1 -->
 <div class="hero-team home">
 <div class="hero-code">${team1.code}</div>
 <div class="hero-team-name">${team1.name}</div>
 <div class="hero-score">${team1.score ?? '-'}</div>
 </div>

 <!-- Divider / Separator -->
 <div class="hero-vs">
 ${isScheduled ? '<span class="status-badge scheduled">VS</span>' : '<span class="hero-divider">-</span>'}
 </div>

 <!-- Team 2 -->
 <div class="hero-team away">
 <div class="hero-code">${team2.code}</div>
 <div class="hero-team-name">${team2.name}</div>
 <div class="hero-score">${team2.score ?? '-'}</div>
 </div>
 </div>
 `;
}

/**
 * Render Timeline Tab (#tab-cronologia)
 * The API returns chronology sorted descending (most recent first).
 * We reverse to show ascending order (earliest events first).
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

 // Reverse to show chronological order (earliest first)
 const ordered = [...timeline].reverse();

 container.innerHTML = ordered.map(event => {
 let badgeClass = 'badge-mint';
 let icon = '⚽';

 if (event.type === 'card-yellow') {
 badgeClass = 'badge-yellow';
 icon = '🟨';
 } else if (event.type === 'card-red') {
 badgeClass = 'badge-red';
 icon = '🟥';
 } else if (event.type === 'substitution') {
 badgeClass = 'badge-blue';
 icon = '🔄';
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
 * Uses the new allStats array from the API for a full table,
 * or falls back to the basic stats object fields.
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

 // If we have the full allStats array from the API, show everything
 if (stats.allStats && stats.allStats.length > 0) {
 const rows = stats.allStats.map(s => ({
 label: translateStatName(s.name),
 val1:  s.home || String(s.home_value || 0),
 val2:  s.away || String(s.away_value || 0),
 num1:  parseFloat(s.home_value) || 0,
 num2:  parseFloat(s.away_value) || 0
 }));

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
 return;
 }

 // Fallback to basic stats fields
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

/**
 * Translate English stat name to Spanish
 */
function translateStatName(name) {
 const map = {
 'Ball possession': 'Posesión',
 'Distance covered': 'Distancia recorrida',
 'Expected goals': 'Goles esperados (xG)',
 'Big chances': 'Ocasiones claras',
 'Total shots': 'Tiros totales',
 'Shots on target': 'Tiros a puerta',
 'Goalkeeper saves': 'Paradas del portero',
 'Number of sprints': 'Número de sprints',
 'Corner kicks': 'Corners',
 'Fouls': 'Faltas',
 'Passes': 'Pases',
 'Accurate passes': 'Pases precisos',
 'Yellow cards': 'Tarjetas amarillas',
 'Red cards': 'Tarjetas rojas',
 'Offsides': 'Fueras de juego',
 'Free kicks': 'Tiros libres',
 'Throw-ins': 'Saques de banda',
 'Goal kicks': 'Saques de puerta'
 };
 return map[name] || name;
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

 const hasTeam1 = lineups?.team1?.starting && lineups.team1.starting.length >= 1;
 const hasTeam2 = lineups?.team2?.starting && lineups.team2.starting.length >= 1;

 if (!hasTeam1 || !hasTeam2) {
 container.innerHTML = `
 <div class="soccer-pitch pitch-unavailable">
 <div class="unavailable-overlay">
 <div class="unavailable-icon"></div>
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
 
 <!-- Lineup Lists side by side -->
 <div class="lineup-extras-grid" style="margin-bottom: 1.5rem;">
 <div class="extras-card">
 <h4>🏠 ${match.team1?.name} ${team1.formation ? '('+team1.formation+')' : ''}</h4>
 <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.5rem;">DT: ${team1.coach || 'N/D'}</p>
 <p style="font-size:0.78rem;font-weight:700;color:var(--accent-mint);margin-bottom:0.4rem;">TITULARES</p>
 <ul>
 ${team1.starting.map(p => `<li><strong>#${p.number}</strong> ${p.name} <span style="color:var(--text-secondary);font-size:0.75rem;">(${p.pos})</span></li>`).join('')}
 </ul>
 ${team1.substitutes && team1.substitutes.length > 0 ? `
 <p style="font-size:0.78rem;font-weight:700;color:var(--text-secondary);margin:0.6rem 0 0.4rem;">SUPLENTES</p>
 <ul>${team1.substitutes.map(s => `<li>• ${s}</li>`).join('')}</ul>
 ` : ''}
 </div>

 <div class="extras-card">
 <h4>✈️ ${match.team2?.name} ${team2.formation ? '('+team2.formation+')' : ''}</h4>
 <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.5rem;">DT: ${team2.coach || 'N/D'}</p>
 <p style="font-size:0.78rem;font-weight:700;color:var(--accent-mint);margin-bottom:0.4rem;">TITULARES</p>
 <ul>
 ${team2.starting.map(p => `<li><strong>#${p.number}</strong> ${p.name} <span style="color:var(--text-secondary);font-size:0.75rem;">(${p.pos})</span></li>`).join('')}
 </ul>
 ${team2.substitutes && team2.substitutes.length > 0 ? `
 <p style="font-size:0.78rem;font-weight:700;color:var(--text-secondary);margin:0.6rem 0 0.4rem;">SUPLENTES</p>
 <ul>${team2.substitutes.map(s => `<li>• ${s}</li>`).join('')}</ul>
 ` : ''}
 </div>
 </div>

 </div>
 `;
}

/**
 * Render Highlights Tab (#tab-highlights)
 * The API provides YouTube links, so we embed them via iframe or show link cards.
 */
function renderHighlights(match) {
 const container = document.getElementById('highlights-view');
 if (!container) return;

 const highlights = match.highlights;

 if (!highlights || !highlights.main) {
 container.innerHTML = `
 <div class="empty-tab-box">
 <span>🎬</span>
 <p>Los resúmenes en video estarán disponibles al finalizar el encuentro.</p>
 </div>
 `;
 return;
 }

 const main = highlights.main;
 const gallery = highlights.gallery || [];

 // Extract YouTube ID if possible
 function getYouTubeId(url) {
 if (!url) return null;
 const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
 return match ? match[1] : null;
 }

 const mainYtId = getYouTubeId(main.url);
 const mainEmbed = mainYtId
 ? `<iframe width="100%" height="380" src="https://www.youtube.com/embed/${mainYtId}"
 frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen
 style="border-radius: var(--radius-md); border: 1px solid var(--border-color);"></iframe>`
 : main.url
 ? `<a href="${main.url}" target="_blank" rel="noopener"
 style="display:block;padding:1.5rem;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);text-decoration:none;color:var(--accent-mint);">
 ▶ Ver video: ${main.title}</a>`
 : '';

 container.innerHTML = `
 <div class="highlights-wrapper">
 
 <!-- Main Video / Link -->
 <div class="main-video-box">
 ${main.poster && !mainYtId ? `<img src="${main.poster}" alt="${main.title}" style="width:100%;border-radius:var(--radius-md);margin-bottom:0.75rem;object-fit:cover;max-height:220px;">` : ''}
 ${mainEmbed}
 <h3 class="video-main-title" style="margin-top:0.75rem;">${main.title}${main.subtitle ? ' — '+main.subtitle : ''}</h3>
 </div>

 <!-- Gallery clips -->
 ${gallery.length > 0 ? `
 <h4 class="gallery-section-title">📽️ Más Clips del Partido</h4>
 <div class="highlights-gallery">
 ${gallery.map(clip => {
 const ytId = getYouTubeId(clip.url);
 return `
 <a class="clip-card" href="${clip.url}" target="_blank" rel="noopener" style="text-decoration:none;">
 <div class="clip-thumb-wrap">
 ${clip.image ? `<img src="${clip.image}" alt="${clip.title}" loading="lazy" />` : `<div style="width:100%;height:80px;background:var(--bg-card);display:flex;align-items:center;justify-content:center;font-size:2rem;">🎬</div>`}
 <div class="play-overlay">▶</div>
 </div>
 <p class="clip-title">${clip.title}</p>
 </a>
 `;
 }).join('')}
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
