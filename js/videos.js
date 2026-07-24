/* ==========================================
   FIFA WORLD CUP 2026 - HISTORIC VIDEOS MODULE
   js/videos.js
   ========================================== */

import { initLayout } from './layout.js';

const CACHE_KEY = 'fifa_videos_data';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

// Curated high-fidelity mock video database matching prototype
const MOCK_VIDEOS = [
  {
    id: 'v1',
    title: 'La Mano de Dios — Argentina vs Inglaterra 1986',
    category: 'Momentos Históricos',
    year: '1986',
    duration: '3:24',
    views: '48.2M vistas',
    desc: 'El histórico gol con la mano de Diego Maradona en los cuartos de final del Mundial México 1986 que él mismo nombró como "un poco con la cabeza de Maradona y otro poco con la mano de Dios".',
    meta: 'México 1986 • Argentina 2 — 1 Inglaterra',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'v2',
    title: 'Final Brasil vs Italia 1994 — Definición por Penales',
    category: 'Finales Memorables',
    year: '1994',
    duration: '12:45',
    views: '62.7M vistas',
    desc: 'La primera Final de Copa del Mundo que se definió por penales. Brasil se coronó tetracampeón del mundo tras el desvío de Roberto Baggio en el último tiro.',
    meta: 'Estados Unidos 1994 • Brasil 0 (3) — (2) 0 Italia',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'v3',
    title: 'El Gol del Siglo — Maradona vs Inglaterra 1986',
    category: 'Momentos Históricos',
    year: '1986',
    duration: '2:18',
    views: '81.4M vistas',
    desc: 'Considerado el mejor gol en la historia de los Mundiales. Diego Maradona partió desde su propio campo y en 10 segundos se deshizo de 5 rivales ingleses.',
    meta: 'México 1986 • Argentina 2 — 1 Inglaterra',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'v4',
    title: 'Francia Campeón — Francia vs Croacia 2018',
    category: 'Finales Memorables',
    year: '2018',
    duration: '09:30',
    views: '54.1M vistas',
    desc: 'Con cuatro goles en una espectacular final en el Estadio Luzhniki, Francia se proclamó bicampeona del mundo. Kylian Mbappé anotó con 19 años.',
    meta: 'Rusia 2018 • Francia 4 — 2 Croacia',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'v5',
    title: 'Argentina Campeón — Qatar 2022 Final',
    category: 'Finales Memorables',
    year: '2022',
    duration: '15:20',
    views: '120.5M vistas',
    desc: 'Considerada la mejor final en la historia de la Copa del Mundo. Argentina y Francia protagonizaron una batalla titánica que terminó 3-3 y se definió en penales.',
    meta: 'Qatar 2022 • Argentina 3 (4) — (2) 3 Francia',
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'v6',
    title: 'El Recital de Pelé — Brasil vs Italia 1970',
    category: 'Leyendas',
    year: '1970',
    duration: '4:12',
    views: '39.8M vistas',
    desc: 'La mejor exhibición colectiva en la historia del fútbol. El Brasil de 1970 con Pelé, Jairzinho y Tostão goleó 4-1 a Italia en la Final de México.',
    meta: 'México 1970 • Brasil 4 — 1 Italia',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'v7',
    title: 'La Noche de Zidane — Francia 1998',
    category: 'Leyendas',
    year: '1998',
    duration: '6:20',
    views: '33.4M vistas',
    desc: 'Zinedine Zidane anotó dos goles de cabeza en la Gran Final del Mundial de Francia para derrotar a Brasil por 3-0 y consagrarse campeón.',
    meta: 'Francia 1998 • Francia 3 — 0 Brasil',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'v8',
    title: 'Ronaldo Nazário — Corea Japón 2002',
    category: 'Leyendas',
    year: '2002',
    duration: '08:45',
    views: '47.9M vistas',
    desc: 'Ronaldo Nazário marcó ocho goles en el Mundial 2002 y cerró su actuación con un doblete en la Final ante Alemania para consagrarse pentacampeón.',
    meta: 'Corea-Japón 2002 • Brasil 2 — 0 Alemania',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80'
  }
];

let allVideos = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('FIFA World Cup 2026 - Videos Históricos Initialized');

  // 1. Initialize Navbar
  initLayout();

  // 2. Setup Category Tabs Switcher
  setupCategoryTabs();

  // 3. Load Videos with 15-min LocalStorage cache
  loadVideos();
});

/**
 * Loads video data from cache or mock database
 */
async function loadVideos() {
  const container = document.getElementById('videos-container');
  if (!container) return;

  const cachedData = localStorage.getItem(CACHE_KEY);

  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        console.log('[Cache HIT] Cargando videos históricos desde localStorage');
        allVideos = parsed.data;
        renderVideos(container, allVideos);
        return;
      }
    } catch (e) {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  // Set & cache mock video data
  allVideos = MOCK_VIDEOS;
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    timestamp: Date.now(),
    data: allVideos
  }));

  renderVideos(container, allVideos);
}

/**
 * Setup Tab Category Event Listener
 */
function setupCategoryTabs() {
  const tabs = document.querySelectorAll('.video-tabs .tab-btn');
  const container = document.getElementById('videos-container');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const selectedCategory = tab.getAttribute('data-category');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (selectedCategory === 'all') {
        renderVideos(container, allVideos);
      } else {
        const filtered = allVideos.filter(v => v.category === selectedCategory);
        renderVideos(container, filtered);
      }
    });
  });
}

/**
 * Render video horizontal card list into DOM
 */
function renderVideos(container, videosList) {
  if (!container) return;

  if (!videosList || videosList.length === 0) {
    container.innerHTML = `
      <div class="empty-tab-box" style="grid-column: 1/-1;">
        <p>No se encontraron videos para esta categoría.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = videosList.map(video => `
    <article class="video-horizontal-card" onclick="alert('Reproduciendo: ${video.title}')">
      
      <!-- Left Thumbnail Box -->
      <div class="video-thumb-wrapper">
        <img src="${video.image}" alt="${video.title}" loading="lazy" />
        <span class="video-duration-overlay">${video.duration}</span>
        <div class="play-hover-btn">▶</div>
      </div>

      <!-- Center Body Info -->
      <div class="video-card-body">
        <div class="video-card-meta-top">
          <span class="category-badge-mint">${video.category}</span>
          <span class="year-badge">${video.year}</span>
        </div>
        <h2 class="video-card-title">${video.title}</h2>
        <p class="video-card-desc">${video.desc}</p>
        <span class="video-card-submeta">${video.meta}</span>
      </div>

      <!-- Right Metric Column -->
      <div class="video-card-views">
        <span>${video.views}</span>
      </div>

    </article>
  `).join('');
}
