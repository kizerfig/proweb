/* js/equipo-detalle.js */
import { FIFA_API } from './api.js';
import { initLayout, getQueryParam } from './layout.js';

document.addEventListener('DOMContentLoaded', async () => {
  initLayout('equipos');
  const container = document.getElementById('detail-container');
  const code = getQueryParam('code');

  if (!container) return;

  try {
    const teams = await FIFA_API.getTeams();
    const team = Array.isArray(teams) ? teams.find(t => t.code === code) : null;

    if (!team) {
      container.innerHTML = `
        <div class="placeholder-box">
          <h2>Equipo no encontrado</h2>
          <p>No se encontró información para la selección solicitada.</p>
          <a href="equipos.html" class="btn btn-secondary">Volver a equipos</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="detail-header">
        <a href="equipos.html" class="section-link">&larr; Volver a equipos</a>
        <h1 class="section-title" style="font-size: 2.2rem; margin-top: 1rem;">${team.name}</h1>
      </div>
      <div class="detail-card info-card">
        <p><strong>Código FIFA:</strong> ${team.code}</p>
        <p><strong>Grupo:</strong> ${team.group || 'Por definir'}</p>
        <p><strong>Ranking FIFA:</strong> ${team.rank || 'N/D'}</p>
        <p><strong>Participaciones:</strong> ${team.appearances || 'N/D'}</p>
      </div>
    `;
  } catch (e) {
    console.error(e);
  }
});
