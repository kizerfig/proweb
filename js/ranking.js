/* ==========================================
 FIFA WORLD CUP 2026 - RANKING FIFA MODULE
 js/ranking.js
 ========================================== */

import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

let rankingData = [];

document.addEventListener('DOMContentLoaded', () => {
 console.log('⭐ FIFA World Cup 2026 - Ranking FIFA Initialized');

 // 1. Initialize Navbar
 initLayout();

 // 2. Setup Filter Listeners
 setupFilterListeners();

 // 3. Load Ranking Data
 loadRanking();
});

async function loadRanking() {
 const tbody = document.getElementById('ranking-table-body');
 const podiumContainer = document.getElementById('podium-container');

 try {
 const data = await FIFA_API.getRanking();
 rankingData = data || [];

 renderPodium(podiumContainer, rankingData);
 renderTable(tbody, rankingData);
 } catch (error) {
 console.error('Error cargando ranking FIFA:', error);
 if (tbody) {
 tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Ocurrió un error al obtener el Ranking FIFA.</td></tr>`;
 }
 }
}

function renderPodium(container, data) {
 if (!container || data.length < 3) return;

 const first = data.find(d => d.pos === 1) || data[0];
 const second = data.find(d => d.pos === 2) || data[1];
 const third = data.find(d => d.pos === 3) || data[2];

 container.innerHTML = `
 <!-- #2 Brasil / Francia -->
 <div class="podium-card rank-2">
 <div class="flag-box" style="width: 44px; height: 30px; font-size: 0.95rem;">${second.code}</div>
 <h3 style="font-size: 1.1rem; font-weight: 800; margin-top: 0.25rem;">${second.name}</h3>
 <span style="font-size: 0.8rem; color: var(--text-secondary);">${second.code} • Rank #${second.rank}</span>
 <div class="podium-medal"></div>
 </div>

 <!-- #1 Argentina -->
 <div class="podium-card rank-1">
 <div class="flag-box" style="width: 50px; height: 34px; font-size: 1.1rem;">${first.code}</div>
 <h3 style="font-size: 1.25rem; font-weight: 900; color: #D29922; margin-top: 0.25rem;">${first.name}</h3>
 <span style="font-size: 0.85rem; color: var(--text-secondary);">${first.code} • Rank #${first.rank}</span>
 <div class="podium-medal"></div>
 </div>

 <!-- #3 Francia / México / Brasil -->
 <div class="podium-card rank-3">
 <div class="flag-box" style="width: 44px; height: 30px; font-size: 0.95rem;">${third.code}</div>
 <h3 style="font-size: 1.1rem; font-weight: 800; margin-top: 0.25rem;">${third.name}</h3>
 <span style="font-size: 0.8rem; color: var(--text-secondary);">${third.code} • Rank #${third.rank}</span>
 <div class="podium-medal"></div>
 </div>
 `;
}

function renderTable(tbody, data) {
 if (!tbody) return;

 if (data.length === 0) {
 tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">No hay datos registrados.</td></tr>`;
 return;
 }

 tbody.innerHTML = data.map((team, idx) => `
 <tr>
 <td style="text-align: center; font-weight: 800;">${team.pos || idx + 1}</td>
 <td>
 <div class="team-name-cell">
 <div class="flag-box">${team.code}</div>
 <span class="team-full-name">${team.name}</span>
 </div>
 </td>
 <td style="text-align: center;">
 <span class="badge-tag" style="background: rgba(31, 111, 235, 0.15); color: var(--accent-blue); border-color: rgba(31, 111, 235, 0.3);">${team.conf || 'FIFA'}</span>
 </td>
 <td style="text-align: center; font-weight: 800; color: var(--accent-mint);">${team.rank || idx + 1}</td>
 <td style="text-align: center;"> ${team.titles || 0}</td>
 <td style="color: var(--text-secondary); font-size: 0.85rem;">${team.dt || 'Por definir'}</td>
 </tr>
 `).join('');
}

function setupFilterListeners() {
 const confSelect = document.getElementById('conf-select');
 const btnRank = document.getElementById('btn-by-rank');
 const btnConf = document.getElementById('btn-by-conf');
 const tbody = document.getElementById('ranking-table-body');

 const filterAction = () => {
 const selectedConf = confSelect?.value || 'all';
 let filtered = [...rankingData];

 if (selectedConf !== 'all') {
 filtered = filtered.filter(t => t.conf === selectedConf);
 }

 renderTable(tbody, filtered);
 };

 confSelect?.addEventListener('change', filterAction);

 btnRank?.addEventListener('click', () => {
 btnRank.classList.add('active');
 btnConf?.classList.remove('active');
 rankingData.sort((a, b) => a.pos - b.pos);
 filterAction();
 });

 btnConf?.addEventListener('click', () => {
 btnConf.classList.add('active');
 btnRank?.classList.remove('active');
 rankingData.sort((a, b) => a.conf.localeCompare(b.conf));
 filterAction();
 });
}
