/* ==========================================
   FIFA WORLD CUP 2026 - ARCHIVOS DEL TORNEO MODULE
   js/archivos.js
   ========================================== */

import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

let allRecords = [];
let activeCategory = 'all';
let searchTerm = '';

document.addEventListener('DOMContentLoaded', () => {
  console.log('📹 FIFA World Cup 2026 - Archivos del Torneo Initialized');

  // 1. Initialize Layout & Navbar
  initLayout();

  // 2. Setup Category Tabs & Search Event Listeners
  setupFilters();

  // 3. Setup Video Modal Controls
  setupModalEvents();

  // 4. Load Records from API / Cache
  loadRecords();
});

/**
 * Carga la lista de archivos desde la API / Caché
 */
async function loadRecords() {
  const container = document.getElementById('records-grid-container');
  if (!container) return;

  renderSkeletons(container, 6);

  try {
    const data = await FIFA_API.getRecords();
    allRecords = Array.isArray(data) ? data : [];

    if (allRecords.length === 0) {
      renderEmptyState(container, 'No se encontraron archivos multimedia disponibles.');
      return;
    }

    filterAndRenderRecords();

  } catch (error) {
    console.error('Error al cargar archivos del torneo:', error);
    renderErrorState(container, 'No se pudieron recuperar los archivos del torneo. Intenta nuevamente.');
  }
}

/**
 * Configura los eventos para los botones de categoría y la barra de búsqueda
 */
function setupFilters() {
  const tabs = document.querySelectorAll('.video-tabs .tab-btn');
  const searchInput = document.getElementById('records-search-input');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      activeCategory = tab.getAttribute('data-category') || 'all';
      filterAndRenderRecords();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = (e.target.value || '').trim().toLowerCase();
      filterAndRenderRecords();
    });
  }
}

/**
 * Filtra y renderiza los archivos según la categoría activa y el término de búsqueda
 */
function filterAndRenderRecords() {
  const container = document.getElementById('records-grid-container');
  if (!container) return;

  let filtered = allRecords.slice();

  // Filtrar por categoría
  if (activeCategory !== 'all') {
    filtered = filtered.filter(item => 
      String(item.category || '').toLowerCase() === activeCategory.toLowerCase()
    );
  }

  // Filtrar por término de búsqueda
  if (searchTerm) {
    filtered = filtered.filter(item => 
      String(item.title || '').toLowerCase().includes(searchTerm) ||
      String(item.subtitle || '').toLowerCase().includes(searchTerm) ||
      String(item.category || '').toLowerCase().includes(searchTerm)
    );
  }

  if (filtered.length === 0) {
    renderEmptyState(container, 'No se encontraron archivos que coincidan con tu búsqueda.');
    return;
  }

  renderRecordsGrid(container, filtered);
}

/**
 * Renderiza las tarjetas multimedia en el DOM
 */
function renderRecordsGrid(container, recordsList) {
  container.innerHTML = recordsList.map(record => {
    const fallbackImage = '../imagenes/banner1.jpg';
    const thumbUrl = record.thumbnail_url || record.image || fallbackImage;
    const categoryTag = record.category || 'Highlights';
    const recordId = record.id;

    return `
      <article class="record-card" data-record-id="${recordId}">
        <div class="record-thumb-wrap">
          <img src="${thumbUrl}" alt="${record.title}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallbackImage}'">
          <div class="record-play-overlay">
            <div class="play-icon-btn">▶</div>
          </div>
          <span class="record-badge">${categoryTag}</span>
        </div>
        <div class="record-card-body">
          <h3 class="record-card-title">${record.title}</h3>
          <p class="record-card-subtitle">${record.subtitle}</p>
          <div class="record-card-footer">
            <span>▶ Ver highlights</span>
            <span>FIFA WC 2026</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Asignar manejadores de eventos para abrir modal al hacer clic en cualquier tarjeta
  container.querySelectorAll('.record-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-record-id');
      const item = allRecords.find(r => String(r.id) === String(id));
      if (item) {
        openVideoModal(item);
      }
    });
  });
}

/**
 * Renderiza esqueletos de carga
 */
function renderSkeletons(container, count = 6) {
  let skeletonsHtml = '';
  for (let i = 0; i < count; i++) {
    skeletonsHtml += `<div class="skeleton" style="height: 280px; border-radius: 12px;"></div>`;
  }
  container.innerHTML = skeletonsHtml;
}

/**
 * Renderiza estado vacío
 */
function renderEmptyState(container, message) {
  container.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1.5rem; background: rgba(15, 23, 42, 0.5); border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 12px;">
      <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📁</div>
      <h3 style="color: #fff; font-size: 1.2rem; margin-bottom: 0.5rem;">Sin resultados</h3>
      <p style="color: #94a3b8; font-size: 0.95rem;">${message}</p>
    </div>
  `;
}

/**
 * Renderiza estado de error con botón de reintento
 */
function renderErrorState(container, message) {
  container.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1.5rem; background: rgba(225, 29, 72, 0.1); border: 1px solid rgba(225, 29, 72, 0.3); border-radius: 12px;">
      <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⚠️</div>
      <h3 style="color: #fff; font-size: 1.2rem; margin-bottom: 0.5rem;">Error de conexión</h3>
      <p style="color: #fda4af; font-size: 0.95rem; margin-bottom: 1.5rem;">${message}</p>
      <button id="retry-records-btn" class="btn btn-primary" style="padding: 0.6rem 1.2rem; border-radius: 20px;">Reintentar</button>
    </div>
  `;

  const retryBtn = document.getElementById('retry-records-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => loadRecords());
  }
}

/**
 * Abre el reproductor de video modal con la información del registro
 */
function openVideoModal(record) {
  const modal = document.getElementById('records-video-modal');
  const titleEl = document.getElementById('modal-video-title');
  const catEl = document.getElementById('modal-video-category');
  const subEl = document.getElementById('modal-video-subtitle');
  const linkEl = document.getElementById('modal-video-direct-link');
  const videoEl = document.getElementById('modal-video-element');
  const iframeEl = document.getElementById('modal-iframe-element');

  if (!modal) return;

  if (titleEl) titleEl.textContent = record.title || 'Highlights Oficiales';
  if (catEl) catEl.textContent = record.category || 'Highlights';
  if (subEl) subEl.textContent = record.subtitle || '';
  if (linkEl) linkEl.href = record.url || '#';

  const videoUrl = record.url || '';
  const isEmbed = videoUrl.includes('youtube.com') || videoUrl.includes('vimeo.com') || videoUrl.includes('embed');

  if (isEmbed && iframeEl && videoEl) {
    videoEl.pause();
    videoEl.style.display = 'none';
    iframeEl.style.display = 'block';
    iframeEl.src = videoUrl;
  } else if (videoEl && iframeEl) {
    iframeEl.src = '';
    iframeEl.style.display = 'none';
    videoEl.style.display = 'block';
    videoEl.src = videoUrl;
    videoEl.play().catch(() => {});
  }

  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal de video y detiene la reproducción
 */
function closeVideoModal() {
  const modal = document.getElementById('records-video-modal');
  const videoEl = document.getElementById('modal-video-element');
  const iframeEl = document.getElementById('modal-iframe-element');

  if (!modal) return;

  if (videoEl) {
    videoEl.pause();
    videoEl.removeAttribute('src');
    videoEl.load();
  }
  if (iframeEl) {
    iframeEl.src = '';
  }

  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * Configura los eventos para cerrar el modal
 */
function setupModalEvents() {
  const modal = document.getElementById('records-video-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeVideoModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeVideoModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVideoModal();
    }
  });
}
