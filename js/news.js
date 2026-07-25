import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

const NEWS_IMAGE_FALLBACK = '../imagenes/banner1.jpg';
const FIFA_NEWS_FALLBACK = 'https://www.fifa.com/es/articles';

document.addEventListener('DOMContentLoaded', () => {
 console.log(' FIFA World Cup 2026 - Noticias Destacadas Initialized');
 initLayout();
 loadNews();
});


async function loadNews(forceRefresh = false) {
 const container = document.getElementById('news-grid-container') || document.getElementById('news-grid-full');
 if (!container) return;
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


function renderSkeletons(container, count = 6) {
 container.innerHTML = Array(count).fill(0).map(() => `
 <div class="skeleton" style="height: 320px; border-radius: var(--radius-md);"></div>
 `).join('');
}


function escapeAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}


function renderNewsCards(container, newsList) {
  container.innerHTML = newsList.map(news => {
    const articleUrl = news.url || FIFA_NEWS_FALLBACK;
    return `
    <article class="news-card">
      <div class="news-image-wrap">
        <img src="${escapeAttr(news.image || NEWS_IMAGE_FALLBACK)}" alt="${escapeAttr(news.title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${NEWS_IMAGE_FALLBACK}'" />
      </div>
      <div class="news-body">
        <div class="news-meta">
          <span class="badge-tag">${escapeAttr(news.category || 'Mundial')}</span>
          <span class="news-time">${escapeAttr(news.time || 'Reciente')}</span>
        </div>
        <h2 class="news-title">${escapeAttr(news.title)}</h2>
        ${news.summary ? `<p class="news-summary" style="font-size:0.85rem; color: var(--text-secondary); margin-top:0.5rem;">${escapeAttr(news.summary)}</p>` : ''}
        <a class="news-read-more" href="${escapeAttr(articleUrl)}" target="_blank" rel="noopener noreferrer">Leer más →</a>
      </div>
    </article>
  `;
  }).join('');
}


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
  const retryBtn = document.getElementById('btn-retry-news');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      loadNews(true); // Force refresh on retry
    });
  }
}
