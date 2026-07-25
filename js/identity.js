/* ==========================================
   FIFA WORLD CUP 2026 - IDENTITY MODULE
   js/identity.js
   ========================================== */

import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

const IDENTITY_IMAGE_FALLBACK = '../imagenes/banner1.jpg';

document.addEventListener('DOMContentLoaded', () => {
  initLayout();

  const page = document.body.dataset.identityPage;
  if (page === 'ball') loadBallPage();
  else if (page === 'mascots') loadMascotsPage();
  else if (page === 'sound') loadSoundPage();
});

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

function renderFeatureBlocks(features) {
  if (!features?.length) return '';

  return features.map(feature => `
    <div class="identity-feature-block">
      <h3 class="ball-title">${escapeHtml(feature.title)}</h3>
      ${(feature.paragraphs || []).map(paragraph => `
        <p class="ball-desc">${escapeHtml(paragraph)}</p>
      `).join('')}
    </div>
  `).join('');
}

function splitBallFeatures(features) {
  const list = features || [];
  const techIndex = list.findIndex(feature => /tecnolog/i.test(feature.title || ''));

  if (techIndex === -1) {
    return {
      main: list.slice(0, 1),
      tech: list.slice(1)
    };
  }

  return {
    main: list.filter((_, index) => index !== techIndex),
    tech: [list[techIndex]]
  };
}

async function loadBallPage() {
  const container = document.getElementById('ball-page-content');
  if (!container) return;

  try {
    const ball = await FIFA_API.getBall();
    const gallery = (ball.images || []).slice(1);
    const { main, tech } = splitBallFeatures(ball.features);

    container.innerHTML = `
      <section class="identity-block green-theme">
        <h2 class="identity-block-header">Balón Oficial FIFA 2026 — ${escapeHtml(ball.name)}</h2>
        <div class="identity-grid-two ball-page-grid">
          <div class="ball-img-wrapper ball-img-wrapper--page">
            <img src="${escapeAttr(ball.image)}" alt="${escapeAttr(ball.name)}" class="ball-image ball-image--page" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${IDENTITY_IMAGE_FALLBACK}'" />
          </div>
          <div class="ball-info-content ball-info-content--page">
            <div class="ball-info-main">
              ${renderFeatureBlocks(main)}
            </div>
            <div class="ball-info-tech">
              ${renderFeatureBlocks(tech)}
            </div>
          </div>
        </div>
        ${gallery.length ? `
          <div class="identity-gallery-grid" style="margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            ${gallery.map(image => `
              <img src="${escapeAttr(image)}" alt="${escapeAttr(ball.name)}" style="width:100%; height:180px; object-fit:cover; border-radius: var(--radius-md); border: 1px solid var(--border-color);" loading="lazy" referrerpolicy="no-referrer" />
            `).join('')}
          </div>
        ` : ''}
      </section>
    `;
  } catch (error) {
    console.error('Error cargando balón oficial:', error);
    container.innerHTML = `<p style="color: var(--text-secondary);">No se pudo cargar la información del balón oficial.</p>`;
  }
}

async function loadMascotsPage() {
  const container = document.getElementById('mascots-page-content');
  if (!container) return;

  try {
    const mascots = await FIFA_API.getMascots();

    if (!mascots.length) {
      container.innerHTML = `<p style="color: var(--text-secondary);">No hay mascotas disponibles.</p>`;
      return;
    }

    container.innerHTML = `
      <section class="mascots-section-block">
        <div class="mascots-grid">
          ${mascots.map(mascot => `
            <article class="mascot-card">
              <div class="mascot-img-box">
                <img src="${escapeAttr(mascot.image)}" alt="${escapeAttr(mascot.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${IDENTITY_IMAGE_FALLBACK}'" />
              </div>
              <div class="mascot-card-body">
                <h3 class="mascot-name">${escapeHtml(mascot.name)}</h3>
                <p class="mascot-country-name">🌎 <strong>País:</strong> ${escapeHtml(mascot.country)}</p>
                <div class="mascot-info-item">
                  <span class="mascot-label">Descripción:</span>
                  <p class="mascot-text">${escapeHtml(mascot.description)}</p>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  } catch (error) {
    console.error('Error cargando mascotas:', error);
    container.innerHTML = `<p style="color: var(--text-secondary);">No se pudieron cargar las mascotas oficiales.</p>`;
  }
}

async function loadSoundPage() {
  const container = document.getElementById('sound-page-content');
  if (!container) return;

  try {
    const sound = await FIFA_API.getSound();

    container.innerHTML = `
      <section class="identity-block red-theme">
        <h2 class="identity-block-header">Banda Sonora Oficial</h2>
        <div class="identity-grid-two">
          <div class="album-cover-wrapper">
            <img src="${escapeAttr(sound.image)}" alt="${escapeAttr(sound.title)}" class="album-cover-img" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${IDENTITY_IMAGE_FALLBACK}'" />
            <div class="album-cover-badge">ÁLBUM OFICIAL FIFA 2026</div>
          </div>
          <div class="album-info-content">
            <h3 class="album-title">${escapeHtml(sound.title)}</h3>
            <p class="album-desc">${escapeHtml(sound.resume)}</p>
            ${renderFeatureBlocks(sound.features)}
            <a href="${escapeAttr(sound.url)}" class="btn-listen-album" target="_blank" rel="noopener noreferrer">
              Escuchar Álbum Oficial &rarr;
            </a>
          </div>
        </div>
      </section>
    `;
  } catch (error) {
    console.error('Error cargando banda sonora:', error);
    container.innerHTML = `<p style="color: var(--text-secondary);">No se pudo cargar la banda sonora oficial.</p>`;
  }
}

/**
 * Renderiza las tarjetas de Identidad en la página de inicio
 */
export async function renderHomeIdentitySection(container) {
  if (!container) return;

  try {
    const [ball, mascots, sound] = await Promise.all([
      FIFA_API.getBall(),
      FIFA_API.getMascots(),
      FIFA_API.getSound()
    ]);

    const mascotPreviewImage = mascots[0]?.image || IDENTITY_IMAGE_FALLBACK;

    container.innerHTML = `
      <a href="balon-oficial.html" class="explore-card mint-card" style="text-decoration: none; color: inherit;">
        <div class="explore-img-wrap">
          <img src="${escapeAttr(ball.image)}" alt="Balón Oficial ${escapeAttr(ball.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${IDENTITY_IMAGE_FALLBACK}'" />
        </div>
        <div class="explore-banner-footer">
          <div>
            <h3 class="explore-banner-title">Balón Oficial</h3>
            <p class="explore-banner-desc">Conoce ${escapeHtml(ball.name)}, el balón oficial del Mundial 2026</p>
          </div>
          <span class="explore-btn-link">Ver más &rarr;</span>
        </div>
      </a>

      <a href="mascotas-oficiales.html" class="explore-card blue-card" style="text-decoration: none; color: inherit;">
        <div class="explore-img-wrap">
          <img src="${escapeAttr(mascotPreviewImage)}" alt="Mascotas Oficiales Mundial 2026" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${IDENTITY_IMAGE_FALLBACK}'" />
        </div>
        <div class="explore-banner-footer">
          <div>
            <h3 class="explore-banner-title">Mascotas Oficiales</h3>
            <p class="explore-banner-desc">Descubre las mascotas que representan el torneo</p>
          </div>
          <span class="explore-btn-link">Ver más &rarr;</span>
        </div>
      </a>

      <a href="banda-sonora.html" class="explore-card red-card" style="text-decoration: none; color: inherit;">
        <div class="explore-img-wrap">
          <img src="${escapeAttr(sound.image)}" alt="Banda Sonora Mundial 2026" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${IDENTITY_IMAGE_FALLBACK}'" />
        </div>
        <div class="explore-banner-footer">
          <div>
            <h3 class="explore-banner-title">Banda Sonora</h3>
            <p class="explore-banner-desc">${escapeHtml(sound.resume || 'Escucha el álbum oficial del Mundial 2026')}</p>
          </div>
          <span class="explore-btn-link">Ver más &rarr;</span>
        </div>
      </a>
    `;
  } catch (error) {
    console.error('Error cargando identidad en inicio:', error);
    container.innerHTML = `<p style="color: var(--text-secondary);">No se pudo cargar la sección de identidad.</p>`;
  }
}
