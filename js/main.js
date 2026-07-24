/* ==========================================
   FIFA WORLD CUP 2026 - MAIN (index.html)
   js/main.js
   ========================================== */

import { FIFA_API } from './api.js';
import { initHeroSlider } from './slider.js';
import { initLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout('inicio');
  initHeroSlider();
  loadHomepageData();
});

async function loadHomepageData() {
  await Promise.all([
    loadNewsPreview(),
    loadMatchesPreview(),
    loadODSSection()
  ]);
}

async function loadNewsPreview() {
  const container = document.getElementById('news-container');
  if (!container) return;

  try {
    const newsList = await FIFA_API.getNews();
    if (!Array.isArray(newsList) || newsList.length === 0) {
      container.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-secondary);">No hay noticias disponibles en este momento.</p>`;
      return;
    }

    const preview = newsList.slice(0, 3);
    container.innerHTML = preview.map(news => `
      <article class="news-card">
        <div class="news-image-wrap">
          <img src="${news.image || ''}" alt="${news.title || 'Noticia'}" loading="lazy" />
        </div>
        <div class="news-body">
          <div class="news-meta">
            <span class="badge-tag">${news.category || 'Mundial'}</span>
            <span class="news-time">${news.time || 'Reciente'}</span>
          </div>
          <h3 class="news-title">${news.title || 'Sin título'}</h3>
        </div>
      </article>
    `).join('');
  } catch (error) {
    console.error('Error cargando noticias:', error);
  }
}

async function loadMatchesPreview() {
  const container = document.getElementById('matches-container');
  if (!container) return;

  try {
    const matchesList = await FIFA_API.getMatches();
    if (!Array.isArray(matchesList) || matchesList.length === 0) {
      container.innerHTML = `<p style="color: var(--text-secondary);">No hay partidos programados.</p>`;
      return;
    }

    container.innerHTML = matchesList.slice(0, 6).map(match => renderMatchCard(match)).join('');
  } catch (error) {
    console.error('Error cargando partidos:', error);
  }
}

function renderMatchCard(match) {
  const team1 = match.team1 || { code: '—', name: 'Por definir', score: '-' };
  const team2 = match.team2 || { code: '—', name: 'Por definir', score: '-' };
  let statusClass = 'scheduled';
  if (match.status === 'En vivo') statusClass = 'live';
  if (match.status === 'Finalizado') statusClass = 'finished';

  return `
    <a href="partido-detalle.html?id=${match.id || ''}" class="match-card match-card-link">
      <div class="match-header">
        <span class="match-venue">${match.city || 'Por definir'}</span>
        <span class="status-badge ${statusClass}">${match.status || 'Programado'}</span>
      </div>
      <div class="match-teams">
        <div class="team-row">
          <div class="team-info">
            <div class="flag-box">${team1.code}</div>
            <span class="team-code">${team1.code}</span>
            <span class="team-name">${team1.name}</span>
          </div>
          <span class="team-score">${team1.score ?? '-'}</span>
        </div>
        <div class="team-row">
          <div class="team-info">
            <div class="flag-box">${team2.code}</div>
            <span class="team-code">${team2.code}</span>
            <span class="team-name">${team2.name}</span>
          </div>
          <span class="team-score">${team2.score ?? '-'}</span>
        </div>
      </div>
      <div class="match-footer">
        <span>${match.datetime || 'Por confirmar'}</span>
        <span>${match.group || match.round || 'Mundial'}</span>
      </div>
    </a>
  `;
}

async function loadODSSection() {
  const container = document.getElementById('ods-container');
  if (!container) return;

  try {
    const odsList = await FIFA_API.getODS();
    if (!Array.isArray(odsList) || odsList.length === 0) return;

    container.innerHTML = odsList.map(ods => `
      <div class="ods-card">
        <div class="ods-header">
          <span class="ods-number">ODS ${ods.number}</span>
        </div>
        <h3 class="ods-title">${ods.title}</h3>
        <p class="ods-desc">${ods.desc}</p>
        <div class="ods-stat">
          <span>${ods.stat}</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error cargando ODS:', error);
  }
}
