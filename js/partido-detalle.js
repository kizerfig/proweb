/* js/partido-detalle.js */
import { FIFA_API } from './api.js';
import { initLayout, getQueryParam } from './layout.js';

document.addEventListener('DOMContentLoaded', async () => {
  initLayout('partidos');
  const container = document.getElementById('detail-container');
  const matchId = getQueryParam('id');

  if (!container) return;

  try {
    const matches = await FIFA_API.getMatches();
    const match = Array.isArray(matches) ? matches.find(m => m.id === matchId) : null;

    if (!match) {
      container.innerHTML = `
        <div class="placeholder-box">
          <h2>Partido no encontrado</h2>
          <p>No se encontró información para el partido solicitado.</p>
          <a href="partidos.html" class="btn btn-secondary">Volver al calendario</a>
        </div>
      `;
      return;
    }

    const team1 = match.team1 || { code: '—', name: 'Por definir', score: '-' };
    const team2 = match.team2 || { code: '—', name: 'Por definir', score: '-' };

    container.innerHTML = `
      <div class="detail-header">
        <a href="partidos.html" class="section-link">&larr; Volver al calendario</a>
        <h1 class="section-title" style="font-size: 2.2rem; margin-top: 1rem;">Detalle del Partido</h1>
      </div>
      <div class="match-card detail-card">
        <div class="match-header">
          <span class="match-venue">${match.city || ''}${match.stadium ? ' • ' + match.stadium : ''}</span>
          <span class="status-badge scheduled">${match.status || 'Programado'}</span>
        </div>
        <div class="match-teams">
          <div class="team-row">
            <div class="team-info">
              <div class="flag-box">${team1.code}</div>
              <span class="team-name">${team1.name}</span>
            </div>
            <span class="team-score">${team1.score ?? '-'}</span>
          </div>
          <div class="team-row">
            <div class="team-info">
              <div class="flag-box">${team2.code}</div>
              <span class="team-name">${team2.name}</span>
            </div>
            <span class="team-score">${team2.score ?? '-'}</span>
          </div>
        </div>
        <div class="match-footer">
          <span>${match.datetime || 'Por confirmar'}</span>
          <span>${match.group || match.round || 'Mundial'}</span>
        </div>
      </div>
    `;
  } catch (e) {
    console.error(e);
  }
});
