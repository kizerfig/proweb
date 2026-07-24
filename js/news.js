/* ==========================================
 FIFA WORLD CUP 2026 - NEWS PAGE MODULE
 js/news.js
 ========================================== */

import { FIFA_API } from './api.js';
import { initNavbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', () => {
 console.log(' FIFA World Cup 2026 - Noticias Destacadas Initialized');
 
 // 1. Initialize mobile navbar logic
 initNavbar();

 // 2. Load news with 15-min LocalStorage cache strategy
 loadNews();
});

/**
 * Loads news data and renders cards or error state
 * @param {boolean} forceRefresh - If true, bypasses valid cache to force network request
 */
async function loadNews(forceRefresh = false) {
 const container = document.getElementById('news-grid-container');
 if (!container) return;

 // Show Skeleton Loaders during fetch
 renderSkeletons(container, 6);

 try {
 const newsList = await FIFA_API.getNews(forceRefresh);

 if (!newsList || !Array.isArray(newsList) || newsList.length === 0) {
 renderErrorState(container, 'No se encontraron noticias destacadas disponibles.');
 return;
 }

 renderNewsCards(container, newsList);

 } catch (error) {
 console.error('Error al cargar la página de noticias:', error);
 renderErrorState(container, 'Ocurrió un error al obtener las noticias de la API. Por favor, verifica tu conexión a internet.');
 }
}

/**
 * Render Skeleton Loading Skeletons
 */
function renderSkeletons(container, count = 6) {
 container.innerHTML = Array(count).fill(0).map(() => `
 <div class="skeleton" style="height: 320px; border-radius: var(--radius-md);"></div>
 `).join('');
}

/**
 * Render News Cards into DOM
 */
function renderNewsCards(container, newsList) {
 container.innerHTML = newsList.map(news => `
 <article class="news-card">
 <div class="news-image-wrap">
 <img src="${news.image}" alt="${news.title}" loading="lazy" />
 </div>
 <div class="news-body">
 <div class="news-meta">
 <span class="badge-tag">${news.category || 'Mundial'}</span>
 <span class="news-time">${news.time || 'Reciente'}</span>
 </div>
 <h2 class="news-title">${news.title}</h2>
 </div>
 </article>
 `).join('');
}

/**
 * Render Error State with Retry Button
 */
function renderErrorState(container, message) {
 container.innerHTML = `
 <div class="error-box">
 <div class="error-icon">️</div>
 <h3 class="error-title">No se pudieron cargar las noticias</h3>
 <p class="error-desc">${message}</p>
 <button class="btn-retry" id="btn-retry-news">
 Reintentar
 </button>
 </div>
 `;

 // Attach retry button listener
 const retryBtn = document.getElementById('btn-retry-news');
 if (retryBtn) {
 retryBtn.addEventListener('click', () => {
 loadNews(true); // Force refresh on retry
 });
 }
}
