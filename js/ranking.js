import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

let rankingData = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('⭐ FIFA World Cup 2026 - Ranking FIFA Initialized');
  initLayout();
  setupFilterListeners();
  loadRanking();
});


export async function getRankingList(forceRefresh = false) {
  return await FIFA_API.getRanking(forceRefresh);
}


async function loadRanking(forceRefresh = false) {
  const tbody = document.getElementById('ranking-table-body');
  const podiumContainer = document.getElementById('podium-container');

  renderSkeletons(tbody, podiumContainer);

  try {
    const data = await getRankingList(forceRefresh);
    rankingData = data || [];

    if (!rankingData || rankingData.length === 0) {
      renderErrorState(tbody, podiumContainer, 'No se encontraron datos en el Ranking FIFA.');
      return;
    }

    renderPodium(podiumContainer, rankingData);
    renderTable(tbody, rankingData);

  } catch (error) {
    console.error('Error al cargar el Ranking FIFA:', error);
    renderErrorState(tbody, podiumContainer, 'Ocurrió un error al obtener la clasificación mundial.');
  }
}


function renderPodium(container, data) {
  if (!container) return;

  if (data.length < 3) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'grid';

  const first = data.find(d => Number(d.pos) === 1) || data[0];
  const second = data.find(d => Number(d.pos) === 2) || data[1];
  const third = data.find(d => Number(d.pos) === 3) || data[2];

  const getFlagHtml = (team, width = '48px', height = '32px') => {
    if (team.flagUri) {
      return `<img src="${team.flagUri}" alt="${team.name}" style="width: ${width}; height: ${height}; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);" loading="lazy">`;
    }
    return `<div class="flag-box" style="width: ${width}; height: ${height}; font-size: 1rem; font-weight: 800; border-radius: 4px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.08); border: 1px solid var(--border-color);">${team.code}</div>`;
  };

  container.innerHTML = `

    <div class="podium-card rank-2">
      <div style="position: absolute; top: -12px; background: #8B949E; color: #000; font-weight: 800; padding: 2px 10px; border-radius: 12px; font-size: 0.75rem;">2° LUGAR</div>
      ${getFlagHtml(second, '48px', '32px')}
      <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0.4rem 0 0.1rem 0;">${second.name}</h3>
      <span style="font-size: 0.85rem; color: var(--accent-mint); font-weight: 700;">${second.points ? second.points.toFixed(2) + ' pts' : 'Ranking #' + second.rank}</span>
      <span style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">${second.conf} • Ranking #${second.rank}</span>
      <div class="podium-medal">🥈</div>
    </div>


    <div class="podium-card rank-1">
      <div style="position: absolute; top: -14px; background: #D29922; color: #000; font-weight: 900; padding: 3px 14px; border-radius: 12px; font-size: 0.8rem; letter-spacing: 0.05em;">👑 LÍDER MUNDIAL</div>
      ${getFlagHtml(first, '56px', '38px')}
      <h3 style="font-size: 1.4rem; font-weight: 900; color: #D29922; margin: 0.4rem 0 0.1rem 0; font-family: 'Rajdhani', sans-serif;">${first.name}</h3>
      <span style="font-size: 0.95rem; color: #D29922; font-weight: 800;">${first.points ? first.points.toFixed(2) + ' pts' : 'Ranking #' + first.rank}</span>
      <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; margin-top: 2px;">${first.conf} • Ranking #${first.rank}</span>
      <div class="podium-medal">🥇</div>
    </div>


    <div class="podium-card rank-3">
      <div style="position: absolute; top: -12px; background: #DB6D28; color: #000; font-weight: 800; padding: 2px 10px; border-radius: 12px; font-size: 0.75rem;">3° LUGAR</div>
      ${getFlagHtml(third, '48px', '32px')}
      <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0.4rem 0 0.1rem 0;">${third.name}</h3>
      <span style="font-size: 0.85rem; color: var(--accent-mint); font-weight: 700;">${third.points ? third.points.toFixed(2) + ' pts' : 'Ranking #' + third.rank}</span>
      <span style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">${third.conf} • Ranking #${third.rank}</span>
      <div class="podium-medal">🥉</div>
    </div>
  `;
}


function renderTable(tbody, data) {
  if (!tbody) return;

  if (!data || data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-secondary);">
          No se encontraron selecciones para la confederación seleccionada.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = data.map((team, idx) => {
    const posNum = team.pos || idx + 1;
    let medalBadge = '';
    if (posNum === 1) medalBadge = '<span style="margin-right: 6px; font-size: 1.1rem;">🥇</span>';
    else if (posNum === 2) medalBadge = '<span style="margin-right: 6px; font-size: 1.1rem;">🥈</span>';
    else if (posNum === 3) medalBadge = '<span style="margin-right: 6px; font-size: 1.1rem;">🥉</span>';

    const flagHtml = team.flagUri
      ? `<img src="${team.flagUri}" alt="${team.name}" style="width: 30px; height: 20px; object-fit: cover; border-radius: 3px; border: 1px solid var(--border-color); flex-shrink: 0;" loading="lazy">`
      : `<div class="flag-box" style="width: 30px; height: 20px; font-weight: 800; font-size: 0.75rem; border-radius: 3px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.08); border: 1px solid var(--border-color); flex-shrink: 0;">${team.code}</div>`;
    let changeHtml = '<span style="color: var(--text-secondary); font-weight: 600;">-</span>';
    if (team.previousRank && team.previousRank !== posNum) {
      const diff = team.previousRank - posNum;
      if (diff > 0) {
        changeHtml = `<span style="color: #3fb950; font-weight: 700; display: inline-flex; align-items: center; gap: 2px;">▲ ${diff}</span>`;
      } else if (diff < 0) {
        changeHtml = `<span style="color: #f85149; font-weight: 700; display: inline-flex; align-items: center; gap: 2px;">▼ ${Math.abs(diff)}</span>`;
      }
    }

    const pointsFormatted = team.points ? team.points.toFixed(2) : '-';

    return `
      <tr style="transition: background 0.2s ease;">
        <td style="text-align: center; font-weight: 800; color: var(--text-primary); font-size: 1rem;">${posNum}</td>
        <td>
          <div class="team-name-cell" style="display: flex; align-items: center; gap: 0.75rem;">
            ${medalBadge}
            ${flagHtml}
            <span class="team-full-name" style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${team.name}</span>
          </div>
        </td>
        <td style="text-align: center;">
          <span class="badge-tag" style="background: rgba(255,255,255,0.06); color: var(--text-primary); border: 1px solid var(--border-color); font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${team.conf || 'FIFA'}</span>
        </td>
        <td style="text-align: center; font-weight: 800; color: var(--accent-mint); font-family: 'Rajdhani', sans-serif; font-size: 1.05rem;">
          ${pointsFormatted}
        </td>
        <td style="text-align: center;">
          ${changeHtml}
        </td>
        <td style="text-align: center; font-weight: 700; color: var(--text-secondary);">
          #${team.rank || posNum}
        </td>
        <td style="text-align: center; font-weight: 700; color: var(--text-primary);">
          🏆 ${team.appearances || team.titles || 0}
        </td>
      </tr>
    `;
  }).join('');
}


function setupFilterListeners() {
  const confSelect = document.getElementById('filter-confederation') || document.getElementById('conf-select');
  const btnRank = document.getElementById('btn-by-rank');
  const btnConf = document.getElementById('btn-by-conf');
  const tbody = document.getElementById('ranking-table-body');

  const filterAction = () => {
    const selectedConf = confSelect?.value || 'all';
    let filtered = [...rankingData];

    if (selectedConf !== 'all') {
      filtered = filtered.filter(t => t.conf.toUpperCase() === selectedConf.toUpperCase());
    }

    renderTable(tbody, filtered);
  };

  confSelect?.addEventListener('change', filterAction);

  btnRank?.addEventListener('click', () => {
    btnRank.style.backgroundColor = 'var(--accent-mint)';
    btnRank.style.color = '#000';
    if (btnConf) {
      btnConf.style.backgroundColor = 'transparent';
      btnConf.style.color = 'var(--text-primary)';
    }
    rankingData.sort((a, b) => Number(a.pos) - Number(b.pos));
    filterAction();
  });

  btnConf?.addEventListener('click', () => {
    btnConf.style.backgroundColor = 'var(--accent-mint)';
    btnConf.style.color = '#000';
    if (btnRank) {
      btnRank.style.backgroundColor = 'transparent';
      btnRank.style.color = 'var(--text-primary)';
    }
    rankingData.sort((a, b) => a.conf.localeCompare(b.conf) || Number(a.pos) - Number(b.pos));
    filterAction();
  });
}


function renderSkeletons(tbody, podiumContainer) {
  if (podiumContainer) {
    podiumContainer.innerHTML = `
      <div class="skeleton" style="height: 140px; border-radius: var(--radius-md);"></div>
      <div class="skeleton" style="height: 170px; border-radius: var(--radius-md);"></div>
      <div class="skeleton" style="height: 140px; border-radius: var(--radius-md);"></div>
    `;
  }

  if (tbody) {
    tbody.innerHTML = Array(6).fill(0).map(() => `
      <tr>
        <td colspan="7" style="padding: 0.75rem;"><div class="skeleton" style="height: 25px; border-radius: 4px;"></div></td>
      </tr>
    `).join('');
  }
}


function renderErrorState(tbody, podiumContainer, message) {
  if (podiumContainer) podiumContainer.style.display = 'none';

  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem;">
          <p style="color: var(--text-secondary); margin-bottom: 1rem;">${message}</p>
          <button class="btn-retry" id="btn-retry-ranking" style="padding: 0.5rem 1rem; background: var(--accent-mint); color: #000; border: none; border-radius: 4px; font-weight: 700; cursor: pointer;">Reintentar</button>
        </td>
      </tr>
    `;

    const retryBtn = document.getElementById('btn-retry-ranking');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => loadRanking(true));
    }
  }
}
