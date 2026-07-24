/* ==========================================
   FIFA WORLD CUP 2026 - API CLIENT & LOCALSTORAGE CACHE
   js/api.js
   ========================================== */

const API_BASE_URL = 'https://wc-api-u378.onrender.com/wc-api/api/';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos en milisegundos

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.results)) return data.results;
  }
  return [];
}

function getMockKey(cacheKey) {
  const key = cacheKey
    .replace('fifa_2026_', '')
    .replace('fifa_', '')
    .replace('_data', '');

  return MOCK_DATA[key] ? key : null;
}

// Curated high-fidelity mock fallback data to handle network failures or Render latency seamlessly
const MOCK_DATA = {
  news: [
    {
      id: '1',
      category: 'Equipos',
      time: 'Hace 2 horas',
      title: 'México presenta nueva convocatoria para Copa del Mundo 2026',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '2',
      category: 'Estadios',
      time: 'Hace 5 horas',
      title: 'Estadio Azteca listo para el torneo más grande de la historia',
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '3',
      category: 'Oficial',
      time: 'Hace 1 día',
      title: 'FIFA confirma calendario oficial del Mundial 2026',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '4',
      category: 'Cultura',
      time: 'Hace 2 días',
      title: 'Revelada la mascota oficial del Mundial 2026',
      image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '5',
      category: 'Equipos',
      time: 'Hace 3 días',
      title: 'Argentina busca defender el título en suelo norteamericano',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '6',
      category: 'Historia',
      time: 'Hace 4 días',
      title: 'Los mejores momentos de la historia del Mundial',
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=600&q=80'
    }
  ],

  matches: [
    {
      id: 'm1',
      city: 'Ciudad de México',
      stadium: 'Estadio Azteca',
      status: 'En vivo',
      round: 'Fase de Grupos',
      team1: { code: 'MX', name: 'México', score: 2 },
      team2: { code: 'AR', name: 'Argentina', score: 1 },
      datetime: '15 jun • 18:00',
      group: 'Grupo A'
    },
    {
      id: 'm2',
      city: 'Nueva York',
      stadium: 'MetLife Stadium',
      status: 'Programado',
      round: 'Fase de Grupos',
      team1: { code: 'BR', name: 'Brasil', score: '-' },
      team2: { code: 'DE', name: 'Alemania', score: '-' },
      datetime: '16 jun • 20:00',
      group: 'Grupo B'
    },
    {
      id: 'm3',
      city: 'Toronto',
      stadium: 'BMO Field',
      status: 'Finalizado',
      round: 'Fase de Grupos',
      team1: { code: 'ES', name: 'España', score: 1 },
      team2: { code: 'FR', name: 'Francia', score: 1 },
      datetime: '14 jun • 16:00',
      group: 'Grupo C'
    },
    {
      id: 'm4',
      city: 'Los Ángeles',
      stadium: 'SoFi Stadium',
      status: 'Programado',
      round: 'Fase de Grupos',
      team1: { code: 'US', name: 'Estados Unidos', score: '-' },
      team2: { code: 'CA', name: 'Canadá', score: '-' },
      datetime: '17 jun • 19:00',
      group: 'Grupo D'
    },
    {
      id: 'm5',
      city: 'Dallas',
      stadium: 'AT&T Stadium',
      status: 'Programado',
      round: 'Fase de Grupos',
      team1: { code: 'GB', name: 'Inglaterra', score: '-' },
      team2: { code: 'IT', name: 'Italia', score: '-' },
      datetime: '18 jun • 21:00',
      group: 'Grupo E'
    },
    {
      id: 'm6',
      city: 'Kansas City',
      stadium: 'Arrowhead Stadium',
      status: 'Programado',
      round: 'Fase de Grupos',
      team1: { code: 'PT', name: 'Portugal', score: '-' },
      team2: { code: 'NL', name: 'Países Bajos', score: '-' },
      datetime: '19 jun • 17:00',
      group: 'Grupo F'
    }
  ],

  standings: [
    {
      groupId: 'A',
      groupName: 'Grupo A',
      teams: [
        { rank: 1, code: 'MX', name: 'México', pj: 2, pts: 6 },
        { rank: 2, code: 'AR', name: 'Argentina', pj: 2, pts: 4 },
        { rank: 3, code: 'PL', name: 'Polonia', pj: 2, pts: 1 },
        { rank: 4, code: 'SA', name: 'Arabia Saudita', pj: 2, pts: 0 }
      ]
    },
    {
      groupId: 'B',
      groupName: 'Grupo B',
      teams: [
        { rank: 1, code: 'MX', name: 'México', pj: 2, pts: 6 },
        { rank: 2, code: 'AR', name: 'Argentina', pj: 2, pts: 4 },
        { rank: 3, code: 'PL', name: 'Polonia', pj: 2, pts: 1 },
        { rank: 4, code: 'SA', name: 'Arabia Saudita', pj: 2, pts: 0 }
      ]
    },
    {
      groupId: 'C',
      groupName: 'Grupo C',
      teams: [
        { rank: 1, code: 'MX', name: 'México', pj: 2, pts: 6 },
        { rank: 2, code: 'AR', name: 'Argentina', pj: 2, pts: 4 },
        { rank: 3, code: 'PL', name: 'Polonia', pj: 2, pts: 1 },
        { rank: 4, code: 'SA', name: 'Arabia Saudita', pj: 2, pts: 0 }
      ]
    },
    {
      groupId: 'D',
      groupName: 'Grupo D',
      teams: [
        { rank: 1, code: 'MX', name: 'México', pj: 2, pts: 6 },
        { rank: 2, code: 'AR', name: 'Argentina', pj: 2, pts: 4 },
        { rank: 3, code: 'PL', name: 'Polonia', pj: 2, pts: 1 },
        { rank: 4, code: 'SA', name: 'Arabia Saudita', pj: 2, pts: 0 }
      ]
    },
    {
      groupId: 'E',
      groupName: 'Grupo E',
      teams: [
        { rank: 1, code: 'MX', name: 'México', pj: 2, pts: 6 },
        { rank: 2, code: 'AR', name: 'Argentina', pj: 2, pts: 4 },
        { rank: 3, code: 'PL', name: 'Polonia', pj: 2, pts: 1 },
        { rank: 4, code: 'SA', name: 'Arabia Saudita', pj: 2, pts: 0 }
      ]
    },
    {
      groupId: 'F',
      groupName: 'Grupo F',
      teams: [
        { rank: 1, code: 'MX', name: 'México', pj: 2, pts: 6 },
        { rank: 2, code: 'AR', name: 'Argentina', pj: 2, pts: 4 },
        { rank: 3, code: 'PL', name: 'Polonia', pj: 2, pts: 1 },
        { rank: 4, code: 'SA', name: 'Arabia Saudita', pj: 2, pts: 0 }
      ]
    }
  ],

  events: [
    {
      org: 'FIFA',
      status: 'Próximo',
      title: 'FIFA Club World Cup 2025',
      date: '15 Jun — 13 Jul 2025',
      location: 'Estados Unidos'
    },
    {
      org: 'CONCACAF',
      status: 'Próximo',
      title: 'CONCACAF Nations League',
      date: 'Mar — Jun 2025',
      location: 'EE.UU. y México'
    },
    {
      org: 'FIFA',
      status: 'Próximo',
      title: 'Copa Mundial FIFA 2026',
      date: '11 Jun — 19 Jul 2026',
      location: 'EE.UU., México y Canadá'
    },
    {
      org: 'UEFA',
      status: 'Futuro',
      title: 'UEFA Euro 2028',
      date: 'Jun — Jul 2028',
      location: 'Reino Unido e Irlanda'
    }
  ],

  teams: [
    { code: 'AR', name: 'Argentina', group: 'Grupo A', rank: 1, appearances: 18 },
    { code: 'BR', name: 'Brasil', group: 'Grupo B', rank: 5, appearances: 22 },
    { code: 'MX', name: 'México', group: 'Grupo A', rank: 15, appearances: 17 },
    { code: 'ES', name: 'España', group: 'Grupo C', rank: 3, appearances: 16 },
    { code: 'FR', name: 'Francia', group: 'Grupo C', rank: 2, appearances: 16 },
    { code: 'DE', name: 'Alemania', group: 'Grupo B', rank: 9, appearances: 20 },
    { code: 'US', name: 'Estados Unidos', group: 'Grupo D', rank: 11, appearances: 11 },
    { code: 'CA', name: 'Canadá', group: 'Grupo D', rank: 48, appearances: 2 }
  ],

  cities: [
    { name: 'Ciudad de México', stadium: 'Estadio Azteca', country: 'México' },
    { name: 'Guadalajara', stadium: 'Estadio Akron', country: 'México' },
    { name: 'Monterrey', stadium: 'Estadio BBVA', country: 'México' },
    { name: 'Toronto', stadium: 'BMO Field', country: 'Canadá' },
    { name: 'Vancouver', stadium: 'BC Place', country: 'Canadá' },
    { name: 'Nueva York', stadium: 'MetLife Stadium', country: 'EE.UU.' },
    { name: 'Los Ángeles', stadium: 'SoFi Stadium', country: 'EE.UU.' },
    { name: 'Dallas', stadium: 'AT&T Stadium', country: 'EE.UU.' }
  ],

  ods: [
    {
      id: 'ods1',
      number: '13',
      title: 'Acción por el Clima',
      desc: 'Compromiso de huella de carbono neutral con estadios operados 100% por energía renovable.',
      stat: '-50% Emisiones CO₂'
    },
    {
      id: 'ods2',
      number: '08',
      title: 'Trabajo Decente y Crecimiento',
      desc: 'Generación de más de 180,000 empleos directos e indirectos durante la organización.',
      stat: '+180k Empleos'
    },
    {
      id: 'ods3',
      number: '12',
      title: 'Consumo Responsable',
      desc: 'Programa de cero desperdicios plásticos y reciclaje integral en todas las sedes.',
      stat: '100% Reciclaje'
    }
  ]
};

/**
 * Fetch data using LocalStorage strategy with 15 minutes TTL check
 * @param {string} endpoint - API Endpoint relative path
 * @param {string} cacheKey - LocalStorage key identifier
 * @param {boolean} forceRefresh - If true, bypasses valid cache to force network request
 */
export async function fetchWithCache(endpoint, cacheKey, forceRefresh = false) {
  const cachedItem = localStorage.getItem(cacheKey);

  if (cachedItem && !forceRefresh) {
    try {
      const parsed = JSON.parse(cachedItem);
      const now = Date.now();
      const age = now - parsed.timestamp;

      if (age < CACHE_TTL_MS) {
        console.log(`[Cache HIT] Cargando '${cacheKey}' desde localStorage (Edad: ${Math.round(age / 1000)}s)`);
        return Array.isArray(parsed.data) ? parsed.data : normalizeList(parsed.data);
      }
    } catch (e) {
      console.warn(`[Cache Error] Error al leer localStorage para '${cacheKey}':`, e);
      localStorage.removeItem(cacheKey);
    }
  }

  // Network Fetch attempt
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const resolvedData = normalizeList(data);

    const cacheObject = {
      timestamp: Date.now(),
      data: resolvedData
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheObject));
    console.log(`[Cache STORED] Guardado en localStorage para '${cacheKey}'`);

    return resolvedData;

  } catch (error) {
    console.warn(`[Fetch API Fallback] No se pudo conectar a Render API (${endpoint}). Usando mock data estructurado:`, error.message);
    // Map mock fallback
    let fallbackKey = cacheKey.replace('fifa_2026_', '').replace('fifa_', '').replace('_data', '');
    if (fallbackKey === 'news') fallbackKey = 'news';
    if (fallbackKey === 'matches') fallbackKey = 'matches';
    if (fallbackKey === 'standings' || fallbackKey === 'clasificacion') fallbackKey = 'standings';
    
    const fallbackData = MOCK_DATA[fallbackKey] || MOCK_DATA.standings || [];
    
    // Save fallback to cache temporarily
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data: fallbackData
    }));

    return fallbackData;
  }
}

// Public API Methods
export const FIFA_API = {
  getNews: (forceRefresh = false) => fetchWithCache('news', 'fifa_news_data', forceRefresh),
  getMatches: (forceRefresh = false) => fetchWithCache('partidos', 'fifa_matches_data', forceRefresh),
  getStandings: (forceRefresh = false) => fetchWithCache('clasificacion', 'fifa_standings_data', forceRefresh),
  getEvents: () => fetchWithCache('events', 'fifa_2026_events'),
  getTeams: () => fetchWithCache('teams', 'fifa_2026_teams'),
  getCities: () => fetchWithCache('cities', 'fifa_2026_cities'),
  getODS: () => fetchWithCache('ods', 'fifa_2026_ods')
};
