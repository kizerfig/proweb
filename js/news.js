/* ==========================================
 FIFA WORLD CUP 2026 - NEWS PAGE MODULE
 js/news.js
 ========================================== */

import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

const NEWS_IMAGE_FALLBACK = '../imagenes/banner1.jpg';

document.addEventListener('DOMContentLoaded', () => {
 console.log(' FIFA World Cup 2026 - Noticias Destacadas Initialized');
 
 // 1. Initialize mobile navbar logic
 initLayout();

 // 2. Load news with 15-min LocalStorage cache strategy
 loadNews();
});

/**
 * Loads news data and renders cards or error state
 * @param {boolean} forceRefresh - If true, bypasses valid cache to force network request
 */
async function loadNews(forceRefresh = false) {
 const container = document.getElementById('news-grid-container') || document.getElementById('news-grid-full');
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
 * Render News Cards into DOM with click listener to view news detail modal (/v1/news/{id})
 */
function renderNewsCards(container, newsList) {
  container.innerHTML = newsList.map(news => `
    <article class="news-card" data-id="${news.id}" style="cursor: pointer;">
      <div class="news-image-wrap">
        <img src="${news.image || NEWS_IMAGE_FALLBACK}" alt="${news.title}" loading="lazy" onerror="this.onerror=null;this.src='${NEWS_IMAGE_FALLBACK}'" />
      </div>
      <div class="news-body">
        <div class="news-meta">
          <span class="badge-tag">${news.category || 'Mundial'}</span>
          <span class="news-time">${news.time || 'Reciente'}</span>
        </div>
        <h2 class="news-title">${news.title}</h2>
        ${news.summary ? `<p class="news-summary" style="font-size:0.85rem; color: var(--text-secondary); margin-top:0.5rem;">${news.summary}</p>` : ''}
        <button class="btn-read-more" style="margin-top: 1rem; background: transparent; border: 1px solid var(--accent-mint); color: var(--accent-mint); padding: 0.4rem 0.8rem; border-radius: var(--radius-sm); font-size: 0.8rem; cursor: pointer; font-weight: 600;">
          Leer Noticia Completa →
        </button>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      if (id) {
        openNewsModal(id);
      }
    });
  });
}

/**
 * Opens detail modal for specific news ID (/v1/news/{id})
 */
async function openNewsModal(id) {
  let modalOverlay = document.getElementById('news-modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'news-modal-overlay';
    modalOverlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px);
      z-index: 10000; display: flex; align-items: center; justify-content: center;
      padding: 1.5rem; opacity: 0; transition: opacity 0.3s ease;
    `;
    document.body.appendChild(modalOverlay);
  }

  modalOverlay.style.display = 'flex';
  requestAnimationFrame(() => modalOverlay.style.opacity = '1');

  modalOverlay.innerHTML = `
    <div style="background: var(--bg-card, #161B22); border: 1px solid var(--border-color, #30363D); border-radius: 12px; max-width: 650px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2rem; position: relative; color: var(--text-primary, #F0F6FC);">
      <div class="skeleton" style="height: 200px; margin-bottom: 1rem; border-radius: 8px;"></div>
      <div class="skeleton" style="height: 30px; width: 80%; margin-bottom: 0.5rem;"></div>
      <div class="skeleton" style="height: 15px; width: 40%;"></div>
    </div>
  `;

  try {
    const detail = await FIFA_API.getNewsById(id);
    modalOverlay.innerHTML = `
      <div style="background: var(--bg-card, #161B22); border: 1px solid var(--border-color, #30363D); border-radius: 12px; max-width: 650px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2rem; position: relative; color: var(--text-primary, #F0F6FC); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
        <button id="close-news-modal" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255,255,255,0.1); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1.2rem;">&times;</button>
        ${detail.image ? `<img src="${detail.image}" alt="${detail.title}" style="width: 100%; height: 260px; object-fit: cover; border-radius: 8px; margin-bottom: 1.2rem;" onerror="this.onerror=null;this.src='${NEWS_IMAGE_FALLBACK}'" />` : ''}
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
          <span style="background: var(--accent-mint, #00F58C); color: #000; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem;">${detail.category}</span>
          <span style="color: var(--text-secondary, #8B949E); font-size: 0.8rem;">${detail.time} • Por ${detail.author}</span>
        </div>
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; color: #FFF; font-family: 'Rajdhani', sans-serif;">${detail.title}</h2>
        <div style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary, #C9D1D9); white-space: pre-line;">
          ${detail.content}
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('close-news-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modalOverlay.style.opacity = '0';
        setTimeout(() => modalOverlay.style.display = 'none', 300);
      });
    }

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.style.opacity = '0';
        setTimeout(() => modalOverlay.style.display = 'none', 300);
      }
    });

  } catch (error) {
    modalOverlay.innerHTML = `
      <div style="background: var(--bg-card, #161B22); border: 1px solid var(--border-color, #30363D); border-radius: 12px; padding: 2rem; color: white; text-align: center;">
        <p>No se pudo cargar el detalle de la noticia.</p>
        <button id="close-error-news-modal" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--accent-mint); color: black; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">Cerrar</button>
      </div>
    `;
    const errCloseBtn = document.getElementById('close-error-news-modal');
    if (errCloseBtn) {
      errCloseBtn.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
      });
    }
  }
}

/**
 * Render Error State with Retry Button
 */
function renderErrorState(container, message) {
  container.innerHTML = `
    <div class="error-box">
      <div class="error-icon">⚠️</div>
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
