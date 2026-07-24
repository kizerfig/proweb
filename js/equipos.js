/* js/equipos.js */
import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout('equipos');
  loadTeams();
});

async function loadTeams() {
  const container = document.getElementById('teams-full-container');
  if (!container) return;

  try {
    const teams = await FIFA_API.getTeams();
    if (!Array.isArray(teams) || teams.length === 0) {
      container.innerHTML = `<p class="empty-message">No hay equipos disponibles.</p>`;
      return;
    }

    container.innerHTML = teams.map(team => `
      <a href="equipo-detalle.html?code=${team.code}" class="team-tile team-tile-link">
        <span class="team-tile-code">${team.code}</span>
        <span class="team-tile-name">${team.name}</span>
      </a>
    `).join('');
  } catch (e) {
    console.error('Error en equipos:', e);
  }
}
