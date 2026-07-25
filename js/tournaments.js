/* ==========================================
 FIFA WORLD CUP 2026 - TOURNAMENTS MODULE
 js/tournaments.js
 ========================================== */

import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
 console.log(' FIFA World Cup 2026 - Torneos y Eventos Initialized');

 // 1. Initialize mobile menu and navbar brand redirection
 initLayout();

 // 2. Fetch and render tournaments list with 15-min LocalStorage cache
 loadTournaments();
});

/**
 * Loads tournaments data with LocalStorage cache strategy
 */
async function loadTournaments() {
 const container = document.getElementById('tournaments-container');
 if (!container) return;

 try {
 const tournaments = await FIFA_API.getTournaments();

 if (!tournaments || !Array.isArray(tournaments) || tournaments.length === 0) {
 container.innerHTML = `
 <div class="empty-state-box">
 <span></span>
 <p>No hay torneos ni eventos disponibles en este momento.</p>
 </div>
 `;
 return;
 }

 renderTournamentCards(container, tournaments);

 } catch (error) {
 console.error('Error al cargar la lista de torneos:', error);
 container.innerHTML = `
 <div class="error-box">
 <h3>Error al cargar los torneos</h3>
 <p>No se pudo conectar con el servidor para obtener la información de competiciones.</p>
 </div>
 `;
 }
}

/**
 * Render tournament cards into DOM
 */
function renderTournamentCards(container, tournamentsList) {
 container.innerHTML = tournamentsList.map(item => {
 let statusClass = 'scheduled';
 if (item.status === 'Finalizado') statusClass = 'finished';
 if (item.status === 'Próximo') statusClass = 'live';
 if (item.status === 'Futuro') statusClass = 'future';

 // Theme color helpers based on organization
 let orgClass = 'fifa';
 if (item.org === 'CONMEBOL') orgClass = 'conmebol';
 if (item.org === 'CONCACAF') orgClass = 'concacaf';
 if (item.org === 'UEFA') orgClass = 'uefa';

 return `
 <article class="tournament-card">

 <!-- Center Body Info -->
 <div class="tournament-card-body">
 <div class="tournament-card-header">
 <h2 class="tournament-card-title">${item.title}</h2>
 <span class="status-badge ${statusClass}">${item.status}</span>
 </div>

 <div class="tournament-card-meta">
 <span>️ <strong>${item.org}</strong></span>
 <span> ${item.dates || item.date}</span>
 <span> ${item.location}</span>
 <span> ${item.teams || 'Varios equipos'}</span>
 </div>

 <p class="tournament-card-desc">${item.desc || item.description || ''}</p>
 </div>

 <!-- Right Action Column -->
 <div class="tournament-card-action">
 <a href="${item.officialUrl || item.url || 'https://www.fifa.com/'}" 
 class="btn-official-site ${orgClass}" 
 target="_blank" 
 rel="noopener noreferrer"
 aria-label="Sitio Oficial de ${item.title}">
 Sitio Oficial &rarr;
 </a>
 </div>

 </article>
 `;
 }).join('');
}
