const API_CONFIG = {
  BASE_URL: 'https://wc-api-u378.onrender.com/wc-api/api/v1',
  CORS_PROXY: 'https://api.allorigins.win/raw?url=',
  CACHE_TTL: 15 * 60 * 1000 // 15 minutos
};

const CACHE_VERSION = '20';
const CACHE_VERSION_KEY = 'fifa_cache_version';

const MEMORY_CACHE = new Map();
const IN_FLIGHT_REQUESTS = new Map();

function isLocalEnvironment() {
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:'
  );
}


function getApiBaseUrl() {
  if (typeof window === 'undefined') return API_CONFIG.BASE_URL;

  if (!isLocalEnvironment()) {
    return `${window.location.origin}/api/wc-api`;
  }

  return API_CONFIG.BASE_URL;
}


function getProductionProxyUrls(endpoint) {
  const origin = window.location.origin;
  return [
    buildApiUrl(getApiBaseUrl(), endpoint),
    buildApiUrl(`${origin}/wc-api/api/v1`, endpoint)
  ];
}

function buildApiUrl(baseUrl, endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
}

function isValidApiPayload(data) {
  return data !== null && data !== undefined;
}

async function fetchJsonFromUrl(url, label = 'fetch') {
  try {
    const response = await fetchWithTimeout(url, 2500);
    if (!response.ok) return null;

    const data = await response.json();
    if (!isValidApiPayload(data)) return null;

    console.log(`[API OK] ${label}`);
    return data;
  } catch (err) {
    console.warn(`[API FAIL] ${label} (${err.message})`);
    return null;
  }
}


async function fetchApiEndpoint(endpoint) {
  const renderUrl = buildApiUrl(API_CONFIG.BASE_URL, endpoint);
  const attempts = [];

  if (!isLocalEnvironment()) {
    getProductionProxyUrls(endpoint).forEach((url, index) => {
      attempts.push({
        url,
        label: index === 0 ? 'vercel proxy' : 'vercel rewrite'
      });
    });
  } else {
    attempts.push({ url: renderUrl, label: 'direct render' });
    attempts.push({
      url: `${API_CONFIG.CORS_PROXY}${encodeURIComponent(renderUrl)}`,
      label: 'cors proxy'
    });
    return tryFetchAttempts(attempts);
  }

  return tryFetchAttempts(attempts);
}

async function tryFetchAttempts(attempts) {
  for (const attempt of attempts) {
    const data = await fetchJsonFromUrl(attempt.url, attempt.label);
    if (data !== null) return data;
  }
  return null;
}

function clearFifaCache() {
  try {
    MEMORY_CACHE.clear();
    IN_FLIGHT_REQUESTS.clear();
    Object.keys(localStorage)
      .filter(key => key.startsWith('fifa_') && key !== CACHE_VERSION_KEY)
      .forEach(key => localStorage.removeItem(key));
    console.log('[Cache] Caché FIFA limpiada totalmente');
  } catch (e) {
    console.warn('[Cache] No se pudo limpiar localStorage:', e);
  }
}

function ensureCacheVersion() {
  try {
    const stored = localStorage.getItem(CACHE_VERSION_KEY);
    if (stored !== CACHE_VERSION) {
      clearFifaCache();
      localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
      console.log(`[Cache] Versión de caché actualizada a ${CACHE_VERSION}`);
    }
  } catch (e) {
    console.warn('[Cache] No se pudo validar versión de caché:', e);
  }
}

ensureCacheVersion();

const MOCK_DATA = {
  news: [
    {
      id: '1',
      category: 'Equipos',
      time: 'Hace 2 horas',
      title: 'México presenta nueva convocatoria para Copa del Mundo 2026',
      image: '../imagenes/banner1.jpg',
      url: 'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026'
    },
    {
      id: '2',
      category: 'Estadios',
      time: 'Hace 5 horas',
      title: 'Estadio Azteca listo para el torneo más grande de la historia',
      image: '../imagenes/banner2.jpg',
      url: 'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026'
    },
    {
      id: '3',
      category: 'Oficial',
      time: 'Hace 1 día',
      title: 'FIFA confirma calendario oficial del Mundial 2026',
      image: '../imagenes/banner3.jpg',
      url: 'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026'
    },
    {
      id: '4',
      category: 'Cultura',
      time: 'Hace 2 días',
      title: 'Revelada la mascota oficial del Mundial 2026',
      image: '../imagenes/banner1.jpg',
      url: 'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026'
    },
    {
      id: '5',
      category: 'Equipos',
      time: 'Hace 3 días',
      title: 'Argentina busca defender el título en suelo norteamericano',
      image: '../imagenes/banner2.jpg',
      url: 'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026'
    },
    {
      id: '6',
      category: 'Historia',
      time: 'Hace 4 días',
      title: 'Los mejores momentos de la historia del Mundial',
      image: '../imagenes/banner3.jpg',
      url: 'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026'
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
    },
    {
      id: 'm7',
      city: 'Miami',
      stadium: 'Hard Rock Stadium',
      status: 'Programado',
      round: 'Fase de Grupos',
      team1: { code: 'CO', name: 'Colombia', score: '-' },
      team2: { code: 'UY', name: 'Uruguay', score: '-' },
      datetime: '20 jun • 16:00',
      group: 'Grupo G'
    },
    {
      id: 'm8',
      city: 'Atlanta',
      stadium: 'Mercedes-Benz Stadium',
      status: 'Programado',
      round: 'Fase de Grupos',
      team1: { code: 'BE', name: 'Bélgica', score: '-' },
      team2: { code: 'HR', name: 'Croacia', score: '-' },
      datetime: '20 jun • 19:00',
      group: 'Grupo H'
    },
    {
      id: 'm9',
      city: 'Seattle',
      stadium: 'Lumen Field',
      status: 'Programado',
      round: 'Fase de Grupos',
      team1: { code: 'JP', name: 'Japón', score: '-' },
      team2: { code: 'MA', name: 'Marruecos', score: '-' },
      datetime: '21 jun • 14:00',
      group: 'Grupo I'
    },
    {
      id: 'm10',
      city: 'Houston',
      stadium: 'NRG Stadium',
      status: 'Programado',
      round: 'Fase de Grupos',
      team1: { code: 'MX', name: 'México', score: '-' },
      team2: { code: 'ES', name: 'España', score: '-' },
      datetime: '21 jun • 20:00',
      group: 'Grupo J'
    },
    {
      id: 'm11',
      city: 'Filadelfia',
      stadium: 'Lincoln Financial Field',
      status: 'Programado',
      round: 'Fase de Grupos',
      team1: { code: 'FR', name: 'Francia', score: '-' },
      team2: { code: 'GB', name: 'Inglaterra', score: '-' },
      datetime: '22 jun • 18:00',
      group: 'Grupo K'
    },
    {
      id: 'm12',
      city: 'San Francisco',
      stadium: 'Levi\'s Stadium',
      status: 'Programado',
      round: 'Fase de Grupos',
      team1: { code: 'AR', name: 'Argentina', score: '-' },
      team2: { code: 'BR', name: 'Brasil', score: '-' },
      datetime: '22 jun • 21:00',
      group: 'Grupo L'
    }
  ],

  standings: [
    { groupId: 'A', groupName: 'Grupo A', teams: [
      { rank: 1, code: 'MX', name: 'México', pj: 3, pts: 7 },
      { rank: 2, code: 'AR', name: 'Argentina', pj: 3, pts: 6 },
      { rank: 3, code: 'PL', name: 'Polonia', pj: 3, pts: 3 },
      { rank: 4, code: 'SA', name: 'Arabia Saudita', pj: 3, pts: 1 }
    ]},
    { groupId: 'B', groupName: 'Grupo B', teams: [
      { rank: 1, code: 'BR', name: 'Brasil', pj: 3, pts: 9 },
      { rank: 2, code: 'DE', name: 'Alemania', pj: 3, pts: 4 },
      { rank: 3, code: 'JP', name: 'Japón', pj: 3, pts: 3 },
      { rank: 4, code: 'CM', name: 'Camerún', pj: 3, pts: 0 }
    ]},
    { groupId: 'C', groupName: 'Grupo C', teams: [
      { rank: 1, code: 'ES', name: 'España', pj: 3, pts: 7 },
      { rank: 2, code: 'FR', name: 'Francia', pj: 3, pts: 5 },
      { rank: 3, code: 'CR', name: 'Costa Rica', pj: 3, pts: 3 },
      { rank: 4, code: 'AU', name: 'Australia', pj: 3, pts: 1 }
    ]},
    { groupId: 'D', groupName: 'Grupo D', teams: [
      { rank: 1, code: 'US', name: 'Estados Unidos', pj: 3, pts: 6 },
      { rank: 2, code: 'CA', name: 'Canadá', pj: 3, pts: 4 },
      { rank: 3, code: 'UY', name: 'Uruguay', pj: 3, pts: 3 },
      { rank: 4, code: 'GH', name: 'Ghana', pj: 3, pts: 1 }
    ]},
    { groupId: 'E', groupName: 'Grupo E', teams: [
      { rank: 1, code: 'GB', name: 'Inglaterra', pj: 3, pts: 7 },
      { rank: 2, code: 'IT', name: 'Italia', pj: 3, pts: 5 },
      { rank: 3, code: 'SN', name: 'Senegal', pj: 3, pts: 3 },
      { rank: 4, code: 'EC', name: 'Ecuador', pj: 3, pts: 0 }
    ]},
    { groupId: 'F', groupName: 'Grupo F', teams: [
      { rank: 1, code: 'PT', name: 'Portugal', pj: 3, pts: 8 },
      { rank: 2, code: 'NL', name: 'Países Bajos', pj: 3, pts: 5 },
      { rank: 3, code: 'KR', name: 'Corea del Sur', pj: 3, pts: 3 },
      { rank: 4, code: 'IR', name: 'Irán', pj: 3, pts: 1 }
    ]},
    { groupId: 'G', groupName: 'Grupo G', teams: [
      { rank: 1, code: 'CO', name: 'Colombia', pj: 3, pts: 7 },
      { rank: 2, code: 'BE', name: 'Bélgica', pj: 3, pts: 6 },
      { rank: 3, code: 'HR', name: 'Croacia', pj: 3, pts: 2 },
      { rank: 4, code: 'TN', name: 'Túnez', pj: 3, pts: 1 }
    ]},
    { groupId: 'H', groupName: 'Grupo H', teams: [
      { rank: 1, code: 'MA', name: 'Marruecos', pj: 3, pts: 6 },
      { rank: 2, code: 'CH', name: 'Suiza', pj: 3, pts: 5 },
      { rank: 3, code: 'RS', name: 'Serbia', pj: 3, pts: 3 },
      { rank: 4, code: 'QA', name: 'Qatar', pj: 3, pts: 1 }
    ]},
    { groupId: 'I', groupName: 'Grupo I', teams: [
      { rank: 1, code: 'AT', name: 'Austria', pj: 3, pts: 7 },
      { rank: 2, code: 'DK', name: 'Dinamarca', pj: 3, pts: 4 },
      { rank: 3, code: 'SE', name: 'Suecia', pj: 3, pts: 3 },
      { rank: 4, code: 'NG', name: 'Nigeria', pj: 3, pts: 1 }
    ]},
    { groupId: 'J', groupName: 'Grupo J', teams: [
      { rank: 1, code: 'PY', name: 'Paraguay', pj: 3, pts: 6 },
      { rank: 2, code: 'BO', name: 'Bolivia', pj: 3, pts: 4 },
      { rank: 3, code: 'PE', name: 'Perú', pj: 3, pts: 3 },
      { rank: 4, code: 'VE', name: 'Venezuela', pj: 3, pts: 0 }
    ]},
    { groupId: 'K', groupName: 'Grupo K', teams: [
      { rank: 1, code: 'EG', name: 'Egipto', pj: 3, pts: 5 },
      { rank: 2, code: 'DZ', name: 'Argelia', pj: 3, pts: 4 },
      { rank: 3, code: 'CI', name: 'Costa de Marfil', pj: 3, pts: 3 },
      { rank: 4, code: 'ZA', name: 'Sudáfrica', pj: 3, pts: 2 }
    ]},
    { groupId: 'L', groupName: 'Grupo L', teams: [
      { rank: 1, code: 'HT', name: 'Haití', pj: 3, pts: 6 },
      { rank: 2, code: 'JM', name: 'Jamaica', pj: 3, pts: 5 },
      { rank: 3, code: 'PA', name: 'Panamá', pj: 3, pts: 3 },
      { rank: 4, code: 'CU', name: 'Cuba', pj: 3, pts: 1 }
    ]}
  ],

  knockout: [
    {
      id: 'r32',
      name: 'Dieciseisavos de Final',
      matches: [
        { team1: '1A México', team2: '2B Alemania', score1: '-', score2: '-' },
        { team1: '1B Brasil', team2: '2A Argentina', score1: '-', score2: '-' },
        { team1: '1C España', team2: '2D Canadá', score1: '-', score2: '-' },
        { team1: '1D Estados Unidos', team2: '2C Francia', score1: '-', score2: '-' },
        { team1: '1E Inglaterra', team2: '2F Países Bajos', score1: '-', score2: '-' },
        { team1: '1F Portugal', team2: '2E Italia', score1: '-', score2: '-' },
        { team1: '1G Colombia', team2: '2H Suiza', score1: '-', score2: '-' },
        { team1: '1H Marruecos', team2: '2G Bélgica', score1: '-', score2: '-' }
      ]
    },
    {
      id: 'r16',
      name: 'Octavos de Final',
      matches: [
        { team1: 'Ganador R32-1', team2: 'Ganador R32-2', score1: '-', score2: '-' },
        { team1: 'Ganador R32-3', team2: 'Ganador R32-4', score1: '-', score2: '-' },
        { team1: 'Ganador R32-5', team2: 'Ganador R32-6', score1: '-', score2: '-' },
        { team1: 'Ganador R32-7', team2: 'Ganador R32-8', score1: '-', score2: '-' }
      ]
    },
    {
      id: 'qf',
      name: 'Cuartos de Final',
      matches: [
        { team1: 'Ganador R16-1', team2: 'Ganador R16-2', score1: '-', score2: '-' },
        { team1: 'Ganador R16-3', team2: 'Ganador R16-4', score1: '-', score2: '-' },
        { team1: '1I Austria', team2: '2J Bolivia', score1: '-', score2: '-' },
        { team1: '1K Egipto', team2: '2L Jamaica', score1: '-', score2: '-' }
      ]
    },
    {
      id: 'sf',
      name: 'Semifinales',
      matches: [
        { team1: 'Ganador QF-1', team2: 'Ganador QF-2', score1: '-', score2: '-' },
        { team1: 'Ganador QF-3', team2: 'Ganador QF-4', score1: '-', score2: '-' }
      ]
    },
    {
      id: 'third',
      name: 'Tercer Lugar',
      matches: [
        { team1: 'Perdedor SF-1', team2: 'Perdedor SF-2', score1: '-', score2: '-' }
      ]
    },
    {
      id: 'final',
      name: 'Final',
      matches: [
        { team1: 'Ganador SF-1', team2: 'Ganador SF-2', score1: '-', score2: '-' }
      ]
    }
  ],

  tournaments: [
    {
      id: 't1',
      title: 'Copa América 2024',
      status: 'Finalizado',
      org: 'CONMEBOL',
      dates: '20 Jun — 14 Jul 2024',
      location: 'Estados Unidos',
      teams: '16 equipos',
      desc: 'El torneo continental sudamericano más importante, celebrado en 14 ciudades de Estados Unidos con la participación de 16 selecciones.',
      officialUrl: 'https://copaamerica.com/',
      icon: ''
    },
    {
      id: 't2',
      title: 'CONCACAF Nations League',
      status: 'Próximo',
      org: 'CONCACAF',
      dates: 'Mar — Jun 2025',
      location: 'EE.UU. y México',
      teams: '41 equipos',
      desc: 'La competición oficial de selecciones nacionales de la Confederación de Norteamérica, Centroamérica y el Caribe.',
      officialUrl: 'https://www.concacaf.com/nations-league/',
      icon: ''
    },
    {
      id: 't3',
      title: 'FIFA Club World Cup 2025',
      status: 'Próximo',
      org: 'FIFA',
      dates: '15 Jun — 13 Jul 2025',
      location: 'Estados Unidos',
      teams: '32 equipos',
      desc: 'El nuevo formato del Mundial de Clubes con 32 equipos de todo el mundo, celebrado en Estados Unidos como preludio al Mundial 2026.',
      officialUrl: 'https://www.fifa.com/',
      icon: ''
    },
    {
      id: 't4',
      title: 'Copa Mundial FIFA 2026',
      status: 'Próximo',
      org: 'FIFA',
      dates: '11 Jun — 19 Jul 2026',
      location: 'EE.UU. • México • Canadá',
      teams: '48 equipos',
      desc: 'El torneo más grande en la historia de la Copa del Mundo con 48 selecciones, 16 sedes y 104 partidos en tres países anfitriones.',
      officialUrl: 'https://www.fifa.com/',
      icon: ''
    },
    {
      id: 't5',
      title: 'UEFA Euro 2028',
      status: 'Futuro',
      org: 'UEFA',
      dates: 'Jun — Jul 2028',
      location: 'Reino Unido e Irlanda',
      teams: '24 equipos',
      desc: 'La Eurocopa 2028 se celebrará en el Reino Unido e Irlanda, con estadios emblemáticos como Wembley y el Aviva Stadium.',
      officialUrl: 'https://www.uefa.com/',
      icon: '⭐'
    },
    {
      id: 't6',
      title: 'Copa América 2028',
      status: 'Futuro',
      org: 'CONMEBOL',
      dates: 'Jun — Jul 2028',
      location: 'Sudamérica',
      teams: '16 equipos',
      desc: 'La próxima edición de la Copa América volverá al continente sudamericano en 2028, reafirmando la tradición del fútbol continental.',
      officialUrl: 'https://www.conmebol.com/',
      icon: ''
    }
  ],

  teams: [

    { id: 'MEX', code: 'MEX', name: 'México',           confederation: 'CONCACAF', group: 'A', world_ranking: 14, appearances: 18, host: true,  flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/MEX' },
    { id: 'KOR', code: 'KOR', name: 'República de Corea', confederation: 'AFC',    group: 'A', world_ranking: 25, appearances: 12, host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/KOR' },
    { id: 'CZE', code: 'CZE', name: 'Chequia',          confederation: 'UEFA',     group: 'A', world_ranking: 40, appearances: 10, host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/CZE' },
    { id: 'RSA', code: 'RSA', name: 'Sudáfrica',        confederation: 'CAF',      group: 'A', world_ranking: 60, appearances: 4,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/RSA' },

    { id: 'CAN', code: 'CAN', name: 'Canadá',           confederation: 'CONCACAF', group: 'B', world_ranking: 47, appearances: 2,  host: true,  flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/CAN' },
    { id: 'BIH', code: 'BIH', name: 'Bosnia y Herzegovina', confederation: 'UEFA', group: 'B', world_ranking: 62, appearances: 1,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/BIH' },
    { id: 'QAT', code: 'QAT', name: 'Catar',            confederation: 'AFC',      group: 'B', world_ranking: 58, appearances: 2,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/QAT' },
    { id: 'SUI', code: 'SUI', name: 'Suiza',            confederation: 'UEFA',     group: 'B', world_ranking: 19, appearances: 12, host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/SUI' },

    { id: 'HAI', code: 'HAI', name: 'Haití',            confederation: 'CONCACAF', group: 'C', world_ranking: 83, appearances: 2,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/HAI' },
    { id: 'BRA', code: 'BRA', name: 'Brasil',           confederation: 'CONMEBOL', group: 'C', world_ranking: 6,  appearances: 23, host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/BRA' },
    { id: 'SCO', code: 'SCO', name: 'Escocia',          confederation: 'UEFA',     group: 'C', world_ranking: 39, appearances: 8,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/SCO' },
    { id: 'MAR', code: 'MAR', name: 'Marruecos',        confederation: 'CAF',      group: 'C', world_ranking: 14, appearances: 7,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/MAR' },

    { id: 'AUS', code: 'AUS', name: 'Australia',        confederation: 'AFC',      group: 'D', world_ranking: 24, appearances: 6,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/AUS' },
    { id: 'TUR', code: 'TUR', name: 'Turquía',          confederation: 'UEFA',     group: 'D', world_ranking: 26, appearances: 2,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/TUR' },
    { id: 'USA', code: 'USA', name: 'EE. UU.',          confederation: 'CONCACAF', group: 'D', world_ranking: 11, appearances: 11, host: true,  flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/USA' },
    { id: 'PAR', code: 'PAR', name: 'Paraguay',         confederation: 'CONMEBOL', group: 'D', world_ranking: 64, appearances: 9,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/PAR' },

    { id: 'CIV', code: 'CIV', name: 'Costa de Marfil', confederation: 'CAF',      group: 'E', world_ranking: 52, appearances: 4,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/CIV' },
    { id: 'GER', code: 'GER', name: 'Alemania',         confederation: 'UEFA',     group: 'E', world_ranking: 12, appearances: 20, host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/GER' },
    { id: 'CUW', code: 'CUW', name: 'Curazao',          confederation: 'CONCACAF', group: 'E', world_ranking: 90, appearances: 1,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/CUW' },
    { id: 'ECU', code: 'ECU', name: 'Ecuador',          confederation: 'CONMEBOL', group: 'E', world_ranking: 35, appearances: 4,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/ECU' },

    { id: 'JPN', code: 'JPN', name: 'Japón',            confederation: 'AFC',      group: 'F', world_ranking: 15, appearances: 8,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/JPN' },
    { id: 'NED', code: 'NED', name: 'Países Bajos',     confederation: 'UEFA',     group: 'F', world_ranking: 7,  appearances: 11, host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/NED' },
    { id: 'SWE', code: 'SWE', name: 'Suecia',           confederation: 'UEFA',     group: 'F', world_ranking: 22, appearances: 12, host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/SWE' },
    { id: 'TUN', code: 'TUN', name: 'Túnez',            confederation: 'CAF',      group: 'F', world_ranking: 31, appearances: 6,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/TUN' },

    { id: 'EGY', code: 'EGY', name: 'Egipto',           confederation: 'CAF',      group: 'G', world_ranking: 34, appearances: 3,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/EGY' },
    { id: 'NZL', code: 'NZL', name: 'Nueva Zelanda',    confederation: 'OFC',      group: 'G', world_ranking: 97, appearances: 3,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/NZL' },
    { id: 'IRN', code: 'IRN', name: 'RI de Irán',       confederation: 'AFC',      group: 'G', world_ranking: 21, appearances: 7,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/IRN' },
    { id: 'BEL', code: 'BEL', name: 'Bélgica',          confederation: 'UEFA',     group: 'G', world_ranking: 3,  appearances: 14, host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/BEL' },

    { id: 'URU', code: 'URU', name: 'Uruguay',          confederation: 'CONMEBOL', group: 'H', world_ranking: 16, appearances: 14, host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/URU' },
    { id: 'CPV', code: 'CPV', name: 'Islas de Cabo Verde', confederation: 'CAF',  group: 'H', world_ranking: 76, appearances: 1,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/CPV' },
    { id: 'KSA', code: 'KSA', name: 'Arabia Saudí',     confederation: 'AFC',      group: 'H', world_ranking: 56, appearances: 6,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/KSA' },
    { id: 'ESP', code: 'ESP', name: 'España',            confederation: 'UEFA',     group: 'H', world_ranking: 5,  appearances: 16, host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/ESP' },

    { id: 'SEN', code: 'SEN', name: 'Senegal',          confederation: 'CAF',      group: 'I', world_ranking: 20, appearances: 4,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/SEN' },
    { id: 'NOR', code: 'NOR', name: 'Noruega',          confederation: 'UEFA',     group: 'I', world_ranking: 18, appearances: 3,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/NOR' },
    { id: 'IRQ', code: 'IRQ', name: 'Irak',             confederation: 'AFC',      group: 'I', world_ranking: 64, appearances: 2,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/IRQ' },
    { id: 'FRA', code: 'FRA', name: 'Francia',          confederation: 'UEFA',     group: 'I', world_ranking: 2,  appearances: 16, host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/FRA' },

    { id: 'ALG', code: 'ALG', name: 'Argelia',          confederation: 'CAF',      group: 'J', world_ranking: 28, appearances: 5,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/ALG' },
    { id: 'JOR', code: 'JOR', name: 'Jordania',         confederation: 'AFC',      group: 'J', world_ranking: 74, appearances: 1,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/JOR' },
    { id: 'ARG', code: 'ARG', name: 'Argentina',        confederation: 'CONMEBOL', group: 'J', world_ranking: 1,  appearances: 18, host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/ARG' },
    { id: 'AUT', code: 'AUT', name: 'Austria',          confederation: 'UEFA',     group: 'J', world_ranking: 27, appearances: 7,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/AUT' },

    { id: 'COL', code: 'COL', name: 'Colombia',         confederation: 'CONMEBOL', group: 'K', world_ranking: 10, appearances: 7,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/COL' },
    { id: 'COD', code: 'COD', name: 'RD Congo',         confederation: 'CAF',      group: 'K', world_ranking: 73, appearances: 2,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/COD' },
    { id: 'POR', code: 'POR', name: 'Portugal',         confederation: 'UEFA',     group: 'K', world_ranking: 8,  appearances: 9,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/POR' },
    { id: 'UZB', code: 'UZB', name: 'Uzbekistán',       confederation: 'AFC',      group: 'K', world_ranking: 70, appearances: 1,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/UZB' },

    { id: 'CRO', code: 'CRO', name: 'Croacia',          confederation: 'UEFA',     group: 'L', world_ranking: 9,  appearances: 7,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/CRO' },
    { id: 'ENG', code: 'ENG', name: 'Inglaterra',       confederation: 'UEFA',     group: 'L', world_ranking: 4,  appearances: 16, host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/ENG' },
    { id: 'GHA', code: 'GHA', name: 'Ghana',            confederation: 'CAF',      group: 'L', world_ranking: 55, appearances: 4,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/GHA' },
    { id: 'PAN', code: 'PAN', name: 'Panamá',           confederation: 'CONCACAF', group: 'L', world_ranking: 49, appearances: 2,  host: false, flag_url: 'https://api.fifa.com/api/v3/picture/flags-sq-5/PAN' }
  ],


  ranking: [
    { pos: 1, code: 'AR', name: 'Argentina', conf: 'CONMEBOL', rank: 1, titles: 3, dt: 'Lionel Scaloni' },
    { pos: 2, code: 'FR', name: 'Francia', conf: 'UEFA', rank: 2, titles: 2, dt: 'Didier Deschamps' },
    { pos: 3, code: 'BR', name: 'Brasil', conf: 'CONMEBOL', rank: 3, titles: 5, dt: 'Dorival Júnior' },
    { pos: 4, code: 'GB', name: 'Inglaterra', conf: 'UEFA', rank: 4, titles: 1, dt: 'Gareth Southgate' },
    { pos: 5, code: 'BE', name: 'Bélgica', conf: 'UEFA', rank: 5, titles: 0, dt: 'Domenico Tedesco' },
    { pos: 6, code: 'PT', name: 'Portugal', conf: 'UEFA', rank: 6, titles: 0, dt: 'Roberto Martínez' },
    { pos: 7, code: 'NL', name: 'Países Bajos', conf: 'UEFA', rank: 7, titles: 0, dt: 'Ronald Koeman' },
    { pos: 8, code: 'ES', name: 'España', conf: 'UEFA', rank: 8, titles: 1, dt: 'Luis de la Fuente' },
    { pos: 9, code: 'IT', name: 'Italia', conf: 'UEFA', rank: 9, titles: 4, dt: 'Luciano Spalletti' },
    { pos: 10, code: 'CO', name: 'Colombia', conf: 'CONMEBOL', rank: 10, titles: 0, dt: 'Néstor Lorenzo' },
    { pos: 11, code: 'DE', name: 'Alemania', conf: 'UEFA', rank: 11, titles: 4, dt: 'Julian Nagelsmann' },
    { pos: 12, code: 'MX', name: 'México', conf: 'CONCACAF', rank: 12, titles: 0, dt: 'Javier Aguirre' },
    { pos: 13, code: 'US', name: 'Estados Unidos', conf: 'CONCACAF', rank: 13, titles: 0, dt: 'Mauricio Pochettino' },
    { pos: 14, code: 'UY', name: 'Uruguay', conf: 'CONMEBOL', rank: 14, titles: 2, dt: 'Marcelo Bielsa' },
    { pos: 15, code: 'JP', name: 'Japón', conf: 'AFC', rank: 15, titles: 0, dt: 'Hajime Moriyasu' },
    { pos: 16, code: 'MA', name: 'Marruecos', conf: 'CAF', rank: 16, titles: 0, dt: 'Walid Regragui' }
  ],

  cities: [
    {
      id: 'c1',
      name: 'Ciudad de México',
      stadium: 'Estadio Azteca',
      country: 'México',
      countryCode: 'MEX',
      capacity: '87,523 personas',
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
      description: 'La Ciudad de México es la capital cultural y deportiva de Norteamérica. Con una altitud de 2,240 metros, ha sido sede de dos finales históricas de la Copa Mundial de la FIFA en 1970 y 1986.',
      stadiumInfo: {
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
        surface: 'Césped Híbrido Natural',
        opened: '1966 (Remodelación 2025)',
        coordinates: '19.3029° N, 99.1505° W',
        highlights: 'Primer estadio en albergar tres ediciones de la Copa Mundial de la FIFA.'
      },
      matches: [
        { id: 'm1', round: 'Partido Inaugural', teams: 'México vs Argentina', datetime: '11 Jun 2026 • 18:00' },
        { id: 'm10', round: 'Fase de Grupos', teams: 'México vs España', datetime: '21 Jun 2026 • 20:00' }
      ]
    },
    {
      id: 'c2',
      name: 'Nueva York / Nueva Jersey',
      stadium: 'MetLife Stadium',
      country: 'Estados Unidos',
      countryCode: 'USA',
      capacity: '82,500 personas',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      description: 'La metrópolis más icónica del mundo albergará la gran Final de la Copa Mundial de la FIFA 2026 en el imponente MetLife Stadium en East Rutherford.',
      stadiumInfo: {
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
        surface: 'Césped Natural Avanzado',
        opened: '2010',
        coordinates: '40.8135° N, 74.0744° W',
        highlights: 'Sede confirmada para la Gran Final de la Copa Mundial FIFA 2026 el 19 de julio.'
      },
      matches: [
        { id: 'm-final', round: 'Gran Final Mundial', teams: 'Ganador SF1 vs Ganador SF2', datetime: '19 Jul 2026 • 15:00' },
        { id: 'm2', round: 'Fase de Grupos', teams: 'Brasil vs Alemania', datetime: '13 Jun 2026 • 20:00' }
      ]
    },
    {
      id: 'c3',
      name: 'Toronto',
      stadium: 'BMO Field',
      country: 'Canadá',
      countryCode: 'CAN',
      capacity: '45,500 personas',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      description: 'Toronto es la ciudad más multicultural de Canadá y el corazón financiero del país. BMO Field ha sido ampliado para cumplir los estándares FIFA.',
      stadiumInfo: {
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
        surface: 'Césped Híbrido Natural',
        opened: '2007 (Ampliación 2025)',
        coordinates: '43.6332° N, 79.4186° W',
        highlights: 'Primer partido histórico de la Copa Mundial masculina en suelo canadiense.'
      },
      matches: [
        { id: 'm3', round: 'Fase de Grupos', teams: 'Canadá vs Francia', datetime: '12 Jun 2026 • 19:00' }
      ]
    },
    {
      id: 'c4',
      name: 'Los Ángeles',
      stadium: 'SoFi Stadium',
      country: 'Estados Unidos',
      countryCode: 'USA',
      capacity: '70,240 personas',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
      description: 'Inglewood, Los Ángeles. Un recinto arquitectónico ultramoderno equipado con la pantalla de video 4K de doble cara más grande jamás construida.',
      stadiumInfo: {
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
        surface: 'Matrix Turf / Césped Natural Adaptado',
        opened: '2020',
        coordinates: '33.9535° N, 118.3390° W',
        highlights: 'Sede del debut de la Selección Masculina de Estados Unidos.'
      },
      matches: [
        { id: 'm4', round: 'Fase de Grupos', teams: 'EE.UU. vs Colombia', datetime: '12 Jun 2026 • 21:00' }
      ]
    },
    {
      id: 'c5',
      name: 'Guadalajara',
      stadium: 'Estadio Akron',
      country: 'México',
      countryCode: 'MEX',
      capacity: '48,000 personas',
      image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
      description: 'La cuna del Mariachi y el Tequila albergará partidos de la fase de grupos en uno de los estadios ecológicos más bellos de Latinoamérica.',
      stadiumInfo: {
        image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
        surface: 'Césped Natural Pasto Bermuda',
        opened: '2010',
        coordinates: '20.6817° N, 103.4626° W',
        highlights: 'Diseño en forma de volcán integrado con la naturaleza de Zapopan.'
      },
      matches: [
        { id: 'm5', round: 'Fase de Grupos', teams: 'Uruguay vs Portugal', datetime: '18 Jun 2026 • 17:00' }
      ]
    },
    {
      id: 'c6',
      name: 'Monterrey',
      stadium: 'Estadio BBVA',
      country: 'México',
      countryCode: 'MEX',
      capacity: '53,500 personas',
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
      description: 'Conocido como "El Gigante de Acero", el Estadio BBVA ofrece una vista espectacular del imponente Cerro de la Silla en Guadalupe, Nuevo León.',
      stadiumInfo: {
        image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
        surface: 'Césped Natural',
        opened: '2015',
        coordinates: '25.6702° N, 100.2458° W',
        highlights: 'Considerado uno de los estadios más modernos y sostenibles de América.'
      },
      matches: [
        { id: 'm6', round: 'Fase de Grupos', teams: 'España vs Japón', datetime: '19 Jun 2026 • 19:00' }
      ]
    },
    {
      id: 'c7',
      name: 'Vancouver',
      stadium: 'BC Place',
      country: 'Canadá',
      countryCode: 'CAN',
      capacity: '54,500 personas',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      description: 'Ubicada en la hermosa costa del Pacífico canadiense, Vancouver acogerá a miles de aficionados en el renovado estadio con techo retráctil BC Place.',
      stadiumInfo: {
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
        surface: 'Césped Certificado FIFA',
        opened: '1983 (Renovado 2011)',
        coordinates: '49.2767° N, 123.1119° W',
        highlights: 'Sede de la Final del Mundial Femenino de la FIFA 2015.'
      },
      matches: [
        { id: 'm7', round: 'Fase de Grupos', teams: 'Canadá vs Marruecos', datetime: '18 Jun 2026 • 21:00' }
      ]
    },
    {
      id: 'c8',
      name: 'Miami',
      stadium: 'Hard Rock Stadium',
      country: 'Estados Unidos',
      countryCode: 'USA',
      capacity: '64,767 personas',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      description: 'La capital del sol y el fútbol caribeño. Hard Rock Stadium alberga eventos globales de primer nivel como el Super Bowl y la Copa América.',
      stadiumInfo: {
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
        surface: 'Césped Natural Tifway 419',
        opened: '1987 (Remodelado 2016)',
        coordinates: '25.9580° N, 80.2389° W',
        highlights: 'Sede del partido por el Tercer Lugar del Mundial 2026.'
      },
      matches: [
        { id: 'm8', round: 'Tercer Lugar', teams: 'Perdedor SF1 vs Perdedor SF2', datetime: '18 Jul 2026 • 17:00' }
      ]
    }
  ],

  records: [
    {
      id: 1,
      title: 'Mejores goles de la Fase de Grupos',
      subtitle: 'Compilación de las jugadas espectaculares y anotaciones más destacadas del torneo.',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      category: 'Goles'
    },
    {
      id: 2,
      title: 'Resúmenes oficiales por jornada',
      subtitle: 'Cobertura semanal completa con los partidos más importantes de cada sede en Norteamérica.',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      category: 'Resúmenes'
    },
    {
      id: 3,
      title: 'Entrevistas y conferencias exclusivas',
      subtitle: 'Declaraciones de seleccionadores, directores técnicos y figuras principales del torneo.',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
      category: 'Entrevistas'
    },
    {
      id: 4,
      title: 'Las mejores atajadas de la jornada',
      subtitle: 'Paradas memorables de los guardametas en los estadios de México, Estados Unidos y Canadá.',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail_url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
      category: 'Atajadas'
    },
    {
      id: 5,
      title: 'Inauguración Histórica en el Estadio Azteca',
      subtitle: 'Revive el ambiente festivo y el espectáculo de apertura de la Copa Mundial 2026.',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnail_url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
      category: 'Oficial'
    },
    {
      id: 6,
      title: 'Highlights de la Fase Eliminatoria',
      subtitle: 'Los momentos más intensos de los partidos de vida o muerte rumbo a la Gran Final.',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      thumbnail_url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
      category: 'Resúmenes'
    }
  ]
};


async function fetchWithTimeout(url, timeoutMs = 2500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timer);
    return response;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}


async function executeApiFetch(cleanEndpoint) {
  if (IN_FLIGHT_REQUESTS.has(cleanEndpoint)) {
    console.log(`[Deduplication HIT] Reutilizando petición en vuelo para: ${cleanEndpoint}`);
    return IN_FLIGHT_REQUESTS.get(cleanEndpoint);
  }

  const fetchPromise = (async () => {
    try {
      const data = await fetchApiEndpoint(cleanEndpoint);
      return data;
    } finally {
      IN_FLIGHT_REQUESTS.delete(cleanEndpoint);
    }
  })();

  IN_FLIGHT_REQUESTS.set(cleanEndpoint, fetchPromise);
  return fetchPromise;
}


function revalidateInBackground(cleanEndpoint, cacheKey) {
  const scheduler = typeof window !== 'undefined' && window.requestIdleCallback
    ? window.requestIdleCallback
    : (fn) => setTimeout(fn, 150);

  scheduler(async () => {
    try {
      const freshData = await executeApiFetch(cleanEndpoint);
      if (freshData !== null) {
        const payload = { timestamp: Date.now(), data: freshData };
        MEMORY_CACHE.set(cleanEndpoint, payload);
        try {
          localStorage.setItem(cacheKey, JSON.stringify(payload));
        } catch (e) {}
        console.log(`[SWR Revalidated] Caché actualizada en segundo plano para ${cleanEndpoint}`);
      }
    } catch (e) {}
  });
}


export async function fetchWithCache(endpoint, forceRefresh = false) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const cacheKey = `fifa_cache_${cleanEndpoint.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const now = Date.now();

  if (!forceRefresh && MEMORY_CACHE.has(cleanEndpoint)) {
    const cached = MEMORY_CACHE.get(cleanEndpoint);
    if (now - cached.timestamp < API_CONFIG.CACHE_TTL && cached.data) {
      console.log(`[RAM Cache HIT 0ms] Servido desde memoria RAM: ${cleanEndpoint}`);
      return cached.data;
    }
  }

  let existingCacheData = null;
  const rawLocalStorage = localStorage.getItem(cacheKey);
  if (rawLocalStorage) {
    try {
      const parsed = JSON.parse(rawLocalStorage);
      const isNotEmpty = Array.isArray(parsed.data) ? parsed.data.length > 0 : Boolean(parsed.data);
      if (isNotEmpty) {
        existingCacheData = parsed.data;
        MEMORY_CACHE.set(cleanEndpoint, { timestamp: parsed.timestamp || 0, data: parsed.data });

        if (!forceRefresh && (now - (parsed.timestamp || 0) < API_CONFIG.CACHE_TTL)) {
          console.log(`[Caché Local HIT] Cargado desde localStorage: ${cleanEndpoint}`);
          return parsed.data;
        }
      }
    } catch (e) {}
  }


  if (existingCacheData && !forceRefresh) {
    console.log(`[SWR HIT 0ms] Sirviendo datos en caché mientras se revalida en segundo plano: ${cleanEndpoint}`);
    revalidateInBackground(cleanEndpoint, cacheKey);
    return existingCacheData;
  }

  const networkData = await executeApiFetch(cleanEndpoint);

  if (networkData !== null) {
    try {
      const payload = { timestamp: Date.now(), data: networkData };
      MEMORY_CACHE.set(cleanEndpoint, payload);
      localStorage.setItem(cacheKey, JSON.stringify(payload));
    } catch (e) {}
    return networkData;
  }

  if (existingCacheData) {
    console.warn(`[Fallback Caché Stale] Sirviendo datos previos para ${cleanEndpoint}`);
    return existingCacheData;
  }

  let rootEndpoint = cleanEndpoint.split('?')[0].split('/')[0];
  if (rootEndpoint === 'noticias') rootEndpoint = 'news';
  if (rootEndpoint === 'partidos') rootEndpoint = 'matches';
  if (rootEndpoint === 'clasificacion') rootEndpoint = 'standings';
  if (rootEndpoint === 'eliminatorias') rootEndpoint = 'knockout';
  if (rootEndpoint === 'torneos') rootEndpoint = 'tournaments';
  if (rootEndpoint === 'events') rootEndpoint = 'tournaments';

  const mockFallback = MOCK_DATA[rootEndpoint] || MOCK_DATA.news || [];
  console.warn(`[Fallback Mock Instantáneo <100ms] Cargando MOCK_DATA para '${rootEndpoint}'`);

  revalidateInBackground(cleanEndpoint, cacheKey);

  return mockFallback;
}

const MATCH_DETAILS_MOCK = {
  'm1': {
    id: 'm1',
    group: 'Grupo A',
    round: 'Fase de Grupos',
    datetime: 'Lunes, 15 de junio de 2026 • 18:00',
    stadium: 'Estadio Azteca',
    city: 'Ciudad de México',
    referee: 'Pierluigi Collina',
    status: 'En vivo',
    team1: { code: 'MX', name: 'México', score: 2 },
    team2: { code: 'AR', name: 'Argentina', score: 1 },
    timeline: [
      { minute: "12'", type: "goal", title: "¡GOL! México", desc: "Jiménez anota tras gran jugada colectiva", team: "MX" },
      { minute: "28'", type: "card-yellow", title: "Tarjeta Amarilla", desc: "Guardado por falta táctica", team: "MX" },
      { minute: "45'+2", type: "goal", title: "¡GOL! México", desc: "Vega de tiro libre espectacular", team: "MX" },
      { minute: "67'", type: "goal", title: "¡GOL! Argentina", desc: "Descuento tras córner", team: "AR" }
    ],
    stats: {
      possession: [58, 42],
      shotsOnTarget: [8, 5],
      corners: [6, 4],
      fouls: [12, 15],
      yellowCards: [2, 3],
      redCards: [0, 0]
    },
    lineups: {
      team1: {
        formation: "4-3-3",
        starting: [
          { number: 13, name: "Ochoa", pos: "GK", row: 1, col: 50 },
          { number: 2, name: "Sánchez", pos: "RB", row: 2, col: 15 },
          { number: 3, name: "Montes", pos: "CB", row: 2, col: 38 },
          { number: 5, name: "Vásquez", pos: "CB", row: 2, col: 62 },
          { number: 23, name: "Gallardo", pos: "LB", row: 2, col: 85 },
          { number: 4, name: "Edson", pos: "DM", row: 3, col: 50 },
          { number: 18, name: "Chávez", pos: "CM", row: 3, col: 25 },
          { number: 17, name: "Guardado", pos: "CM", row: 3, col: 75 },
          { number: 22, name: "Lozano", pos: "RW", row: 4, col: 20 },
          { number: 9, name: "Jiménez", pos: "ST", row: 4, col: 50 },
          { number: 10, name: "Vega", pos: "LW", row: 4, col: 80 }
        ],
        substitutes: ["Talavera (POR)", "Montes (DEF)", "Arteaga (DEF)", "Antuna (DEL)", "Martín (DEL)"],
        coach: "Javier Aguirre"
      },
      team2: {
        formation: "4-3-3",
        starting: [
          { number: 23, name: "D. Martínez", pos: "GK", row: 4, col: 50 },
          { number: 26, name: "Molina", pos: "RB", row: 3, col: 15 },
          { number: 13, name: "Romero", pos: "CB", row: 3, col: 38 },
          { number: 19, name: "Otamendi", pos: "CB", row: 3, col: 62 },
          { number: 8, name: "Acuña", pos: "LB", row: 3, col: 85 },
          { number: 7, name: "De Paul", pos: "CM", row: 2, col: 25 },
          { number: 24, name: "Enzo", pos: "DM", row: 2, col: 50 },
          { number: 20, name: "Mac Allister", pos: "CM", row: 2, col: 75 },
          { number: 10, name: "Messi", pos: "RW", row: 1, col: 20 },
          { number: 9, name: "Julián", pos: "ST", row: 1, col: 50 },
          { number: 11, name: "Di María", pos: "LW", row: 1, col: 80 }
        ],
        substitutes: ["Armani (POR)", "Pezzella (DEF)", "Paredes (MED)", "Lautaro (DEL)", "Dybala (DEL)"],
        coach: "Lionel Scaloni"
      }
    },
    highlights: {
      main: {
        title: "Resumen del partido | México vs Argentina | Momentos Destacados",
        poster: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      },
      gallery: [
        { title: "¡Golazo de Jiménez! (12')", duration: "01:15", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80" },
        { title: "Tiro libre magistral de Vega (45'+2)", duration: "01:45", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80" },
        { title: "Atajada clave de Memo Ochoa", duration: "00:58", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=400&q=80" },
        { title: "Descuento argentino tras córner (67')", duration: "01:20", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80" }
      ]
    }
  }
};


export async function getMatchById(id = 'm1', forceRefresh = false) {
  try {
    const data = await fetchWithCache(`matches/${id}`, forceRefresh);
    if (data && (data.id || data.home_id || data.date)) {
      return normalizeMatchDetail(data, id);
    }
  } catch (error) {
    console.warn(`[getMatchById] Fallback a MOCK_DATA para partido ${id}:`, error.message);
  }

  let detail = MATCH_DETAILS_MOCK[id];
  if (!detail) {
    const matchesList = await getMatches({}, forceRefresh);
    const basicMatch = matchesList.find(m => String(m.id) === String(id)) || matchesList[0];
    detail = {
      id: basicMatch?.id || id,
      city: basicMatch?.city || '',
      stadium: basicMatch?.stadium || '',
      status: basicMatch?.status || 'Programado',
      statusLabel: basicMatch?.statusLabel || basicMatch?.status || 'Programado',
      statusClass: basicMatch?.statusClass || 'scheduled',
      round: basicMatch?.round || 'Fase de Grupos',
      group: basicMatch?.group || '',
      team1: basicMatch?.team1 || { code: '???', name: 'Equipo Local', score: '-' },
      team2: basicMatch?.team2 || { code: '???', name: 'Equipo Visitante', score: '-' },
      datetime: basicMatch?.datetime || '',
      referee: basicMatch?.referee || '',
      // No copiar timeline/stats/lineups/highlights del mock m1,
      // para no mostrar eventos de un partido diferente
      timeline: [],
      stats: null,
      lineups: null,
      highlights: null
    };
  }

  return detail;
}


function normalizeMatchDetail(raw, requestedId) {
  const item = raw?.data || raw?.match || raw;
  const base = normalizeMatch(item);
  if (!base) return null;

  const chronology = Array.isArray(item.chronology) ? item.chronology : [];
  const timeline = chronology
    .sort((a, b) => (b.time || 0) - (a.time || 0)) // más reciente primero
    .map(ev => {
      const playerName = ev.player?.name || ev.player_in?.name || '';
      const playerOut  = ev.player_out?.name || '';
      let type  = 'goal';
      let title = '⚽ Gol';
      let desc  = playerName || 'Desconocido';

      if (ev.type === 'goal') {
        type  = 'goal';
        title = `⚽ ¡Gol!`;
        desc  = playerName || 'Desconocido';
      } else if (ev.type === 'card') {
        type  = ev.card === 'red' ? 'card-red' : 'card-yellow';
        title = ev.card === 'red' ? '🟥 Tarjeta Roja' : '🟨 Tarjeta Amarilla';
        desc  = playerName || 'Desconocido';
      } else if (ev.type === 'substitution') {
        type  = 'substitution';
        title = '🔄 Sustitución';
        desc  = `Entra: ${ev.player_in?.name || '?'} — Sale: ${playerOut || '?'}`;
      }

      return {
        minute: `${ev.time || '?'}'`,
        type,
        title,
        desc
      };
    });

  let stats = null;
  const rawStats = Array.isArray(item.statistics) ? item.statistics : [];
  if (rawStats.length > 0) {

    const allStats = [];
    rawStats.forEach(group => {
      if (Array.isArray(group.statistics)) allStats.push(...group.statistics);
    });
    const find = name => allStats.find(s => s.name?.toLowerCase().includes(name.toLowerCase())) || { home_value: 0, away_value: 0, home: '0', away: '0' };

    const pos   = find('possession');
    const shots = find('total shots');
    const onT   = find('shots on target') || find('goalkeeper saves');
    const cor   = find('corner');
    const fouls = find('foul');
    const yc    = find('yellow card') || { home_value: 0, away_value: 0 };
    const rc    = find('red card') || { home_value: 0, away_value: 0 };

    stats = {
      possession:    [pos.home_value || 0,   pos.away_value || 0],
      shotsOnTarget: [onT.home_value || 0,   onT.away_value || 0],
      totalShots:    [shots.home_value || 0,  shots.away_value || 0],
      corners:       [cor.home_value || 0,   cor.away_value || 0],
      fouls:         [fouls.home_value || 0, fouls.away_value || 0],
      yellowCards:   [yc.home_value || 0,    yc.away_value || 0],
      redCards:      [rc.home_value || 0,    rc.away_value || 0],
      allStats       // all stats for extended table
    };
  }

  let lineups = null;
  if (item.line_ups?.home && item.line_ups?.away) {
    const mapTeam = (side) => {
      const t = item.line_ups[side];
      if (!t) return null;
      const starters = Object.values(t.starting_players || {});
      return {
        formation:   t.formation || '',
        coach:       t.coach || '',
        starting:    starters.map((p, i) => ({
          number: p.number,
          name:   p.name,
          pos:    p.position,
          photo:  p.photo_url || '',
          row:    Math.floor(i / 3) + 1,
          col:    [20, 50, 80][i % 3]
        })),
        substitutes: (t.substitutes || []).map(p => `${p.name} (#${p.number})`)
      };
    };
    lineups = { team1: mapTeam('home'), team2: mapTeam('away') };
  }

  let highlights = null;
  const rawHighlights = Array.isArray(item.highlight) ? item.highlight : [];
  if (rawHighlights.length > 0) {
    const main = rawHighlights.find(h => h.url?.includes('sofascore') || h.url?.includes('highlights')) || rawHighlights[0];
    highlights = {
      main: {
        title:    main?.title || 'Resumen del partido',
        subtitle: main?.subtitle || '',
        url:      main?.url || '',
        poster:   main?.thumbnail_url || ''
      },
      gallery: rawHighlights.slice(1).map(h => ({
        title:    `${h.title}${h.subtitle ? ' — ' + h.subtitle : ''}`,
        url:      h.url || '',
        image:    h.thumbnail_url || '',
        duration: ''
      }))
    };
  }

  const city = item.city || {};
  const stadium = city.stadium?.name || '';
  const cityName = city.name || base.city || '';

  return {
    ...base,
    id:          base.id || requestedId,
    city:        cityName,
    stadium:     stadium,
    referee:     item.referee || base.referee || '',
    status:      base.status,
    statusLabel: base.statusLabel,
    statusClass: base.statusClass,
    timeline,
    stats,
    lineups,
    highlights
  };
}


function resolveNewsImage(item) {
  const raw = item.image_url ?? item.image ?? item.imagen ?? item.urlImagen ?? item.img ?? '';
  if (!raw || typeof raw !== 'string') return '';

  let url = raw.trim();
  if (!url) return '';

  if (url.startsWith('//')) url = `https:${url}`;
  if (url.startsWith('/')) url = `https://wc-api-u378.onrender.com${url}`;

  if (/digitalhub\.fifa\.com/i.test(url) && !/[?&]io=/i.test(url)) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}io=transform:fill,width:800,height:450`;
  }

  return url;
}

function formatNewsDate(value) {
  if (!value) return 'Reciente';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}


function resolveNewsUrl(item) {
  const raw = item?.url ?? item?.link ?? item?.source_url ?? item?.article_url ?? item?.href ?? '';
  if (!raw || typeof raw !== 'string') return '';

  let url = raw.trim();
  if (!url) return '';

  if (url.startsWith('//')) url = `https:${url}`;
  if (url.startsWith('/')) url = `https://www.fifa.com${url}`;

  url = url.replace(/^(https?:\/\/[^/]+)\/{2,}/i, '$1/');

  if (!/^https?:\/\//i.test(url)) return '';
  return url;
}


function normalizeNewsList(raw) {
  if (!raw) return [];

  const list = Array.isArray(raw)
    ? raw
    : (raw.data || raw.noticias || raw.news || raw.items || []);

  if (!Array.isArray(list)) return [];

  return list.map((item, index) => ({
    id: item.id ?? item._id ?? String(index + 1),
    title: item.title ?? item.titulo ?? 'Sin título',
    category: item.category ?? item.categoria ?? 'Mundial',
    time: item.time ?? formatNewsDate(item.published_date) ?? item.fecha ?? item.date ?? item.publicadoEn ?? 'Reciente',
    image: resolveNewsImage(item),
    summary: item.preview_text ?? item.summary ?? item.resumen ?? item.description ?? item.descripcion ?? '',
    content: item.content ?? item.contenido ?? item.body ?? item.preview_text ?? '',
    url: resolveNewsUrl(item)
  }));
}


function normalizeNewsDetail(raw, requestedId) {
  if (!raw) return null;
  const item = raw.data || raw.news || raw;
  return {
    id: item.id ?? item._id ?? String(requestedId),
    title: item.title ?? item.titulo ?? 'Sin título',
    category: item.category ?? item.categoria ?? 'Mundial',
    time: item.time ?? formatNewsDate(item.published_date) ?? item.fecha ?? item.date ?? item.publicadoEn ?? 'Reciente',
    image: resolveNewsImage(item),
    summary: item.preview_text ?? item.summary ?? item.resumen ?? item.description ?? item.descripcion ?? '',
    content: item.content ?? item.contenido ?? item.body ?? item.preview_text ?? 'Detalles de la noticia oficial de la FIFA Copa Mundial 2026.',
    author: item.author ?? item.autor ?? 'FIFA Media',
    url: resolveNewsUrl(item)
  };
}


const COUNTRY_NAMES = {
  MX: 'México', MEX: 'México',
  AR: 'Argentina', ARG: 'Argentina',
  BR: 'Brasil', BRA: 'Brasil',
  DE: 'Alemania', GER: 'Alemania',
  ES: 'España', ESP: 'España',
  FR: 'Francia', FRA: 'Francia',
  US: 'Estados Unidos', USA: 'Estados Unidos',
  CA: 'Canadá', CAN: 'Canadá',
  GB: 'Inglaterra', ENG: 'Inglaterra',
  IT: 'Italia', ITA: 'Italia',
  PT: 'Portugal', POR: 'Portugal',
  NL: 'Países Bajos', NED: 'Países Bajos',
  CO: 'Colombia', COL: 'Colombia',
  UY: 'Uruguay', URU: 'Uruguay',
  BE: 'Bélgica', BEL: 'Bélgica',
  HR: 'Croacia', CRO: 'Croacia',
  JP: 'Japón', JPN: 'Japón',
  MA: 'Marruecos', MAR: 'Marruecos',
  CL: 'Chile', CHI: 'Chile',
  PE: 'Perú', PER: 'Perú',
  EC: 'Ecuador', ECU: 'Ecuador',
  AT: 'Austria', AUT: 'Austria',
  DK: 'Dinamarca', DEN: 'Dinamarca',
  SE: 'Suecia', SWE: 'Suecia',
  NG: 'Nigeria', NGA: 'Nigeria',
  PY: 'Paraguay', PAR: 'Paraguay',
  BO: 'Bolivia', BOL: 'Bolivia',
  VE: 'Venezuela', VEN: 'Venezuela',
  EG: 'Egipto', EGY: 'Egipto',
  DZ: 'Argelia', ALG: 'Argelia',
  CI: 'Costa de Marfil', CIV: 'Costa de Marfil',
  ZA: 'Sudáfrica', RSA: 'Sudáfrica',
  HT: 'Haití', HAI: 'Haití',
  JM: 'Jamaica', JAM: 'Jamaica',
  PA: 'Panamá', PAN: 'Panamá',
  CU: 'Cuba', CUB: 'Cuba',
  PL: 'Polonia', POL: 'Polonia',
  SA: 'Arabia Saudita', KSA: 'Arabia Saudita',
  CR: 'Costa Rica', CRC: 'Costa Rica',
  AU: 'Australia', AUS: 'Australia',
  GH: 'Ghana', GHA: 'Ghana',
  SN: 'Senegal', SEN: 'Senegal',
  IR: 'Irán', IRN: 'Irán',
  TN: 'Túnez', TUN: 'Túnez',
  CH: 'Suiza', SUI: 'Suiza',
  RS: 'Serbia', SRB: 'Serbia',
  QA: 'Catar', QAT: 'Catar',
  NO: 'Noruega', NOR: 'Noruega',
  NZ: 'Nueva Zelanda', NZL: 'Nueva Zelanda',
  KR: 'Corea del Sur', KOR: 'Corea del Sur',
  IQ: 'Irak', IRQ: 'Irak',
  JO: 'Jordania', JOR: 'Jordania',
  CZ: 'Chequia', CZE: 'Chequia',
  BA: 'Bosnia y Herzegovina', BIH: 'Bosnia y Herzegovina',
  CW: 'Curazao', CUW: 'Curazao',
  CV: 'Cabo Verde', CPV: 'Cabo Verde',
  CD: 'RD Congo', COD: 'RD Congo',
  TR: 'Turquía', TUR: 'Turquía',
  UZ: 'Uzbekistán', UZB: 'Uzbekistán',
  SCO: 'Escocia', SCT: 'Escocia'
};


const CITY_META = {
  1: { name: 'Ciudad de México', stadium: 'Estadio Azteca' },
  2: { name: 'Nueva York / Nueva Jersey', stadium: 'MetLife Stadium' },
  3: { name: 'Los Ángeles', stadium: 'SoFi Stadium' },
  4: { name: 'Toronto', stadium: 'BMO Field' },
  5: { name: 'Guadalajara', stadium: 'Estadio Akron' },
  6: { name: 'Monterrey', stadium: 'Estadio BBVA' },
  7: { name: 'Vancouver', stadium: 'BC Place' },
  8: { name: 'Miami', stadium: 'Hard Rock Stadium' },
  9: { name: 'Dallas', stadium: 'AT&T Stadium' },
  10: { name: 'Atlanta', stadium: 'Mercedes-Benz Stadium' },
  11: { name: 'Kansas City', stadium: 'Arrowhead Stadium' },
  12: { name: 'Houston', stadium: 'NRG Stadium' },
  13: { name: 'Seattle', stadium: 'Lumen Field' },
  14: { name: 'San Francisco', stadium: "Levi's Stadium" },
  15: { name: 'Boston', stadium: 'Gillette Stadium' },
  16: { name: 'Filadelfia', stadium: 'Lincoln Financial Field' }
};

const CITY_NAMES = Object.fromEntries(
  Object.entries(CITY_META).map(([id, meta]) => [Number(id), meta.name])
);


const ROUND_NAMES = {
  1: 'Fase de Grupos',
  2: 'Fase de Grupos',
  3: 'Fase de Grupos',
  6: 'Dieciseisavos',
  5: 'Octavos',
  27: 'Cuartos',
  28: 'Semifinal',
  50: 'Tercer Lugar',
  29: 'Final'
};

function formatMatchDatetime(dateStr, timeStr) {
  if (!dateStr && !timeStr) return 'Por definir';
  let datePart = dateStr || '';
  if (dateStr) {
    const parsed = new Date(`${dateStr}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      datePart = parsed.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }
  let timePart = '';
  if (timeStr) {
    timePart = String(timeStr).slice(0, 5);
  }
  if (datePart && timePart) return `${datePart} • ${timePart}`;
  return datePart || timePart || 'Por definir';
}

function mapMatchStatus(rawStatus) {
  const value = String(rawStatus || '').trim().toLowerCase();

  if (['live', 'in progress', 'inplay', 'playing', 'en vivo', 'en directo'].includes(value)) {
    return { status: 'En vivo', statusLabel: '● En vivo', statusClass: 'live' };
  }

  if (['ended', 'finished', 'ft', 'aet', 'pen', 'finalizado', 'completed', 'complete'].includes(value)) {
    return { status: 'Finalizado', statusLabel: 'Finalizado', statusClass: 'finished' };
  }

  if (['not started', 'scheduled', 'fixture', 'ns', 'programado'].includes(value)) {
    return { status: 'Programado', statusLabel: 'Programado', statusClass: 'scheduled' };
  }

  return { status: 'Programado', statusLabel: 'Programado', statusClass: 'scheduled' };
}


function normalizeMatch(match) {
  if (!match) return null;

  const isApiFormat = match.home_id !== undefined || match.home_score !== undefined || match.city_id !== undefined;
  const isDetailFormat = match.home_team !== undefined || match.away_team !== undefined;

  let homeCode, awayCode;
  if (isDetailFormat) {

    homeCode = String(match.home_team?.id || match.home_id || match.team1?.code || 'TBD').toUpperCase();
    awayCode = String(match.away_team?.id || match.away_id || match.team2?.code || 'TBD').toUpperCase();
  } else if (isApiFormat) {

    homeCode = String(match.home_id || match.team1?.code || 'TBD').toUpperCase();
    awayCode = String(match.away_id || match.team2?.code || 'TBD').toUpperCase();
  } else {

    homeCode = String(match.team1?.code || match.homeCode || 'TBD').toUpperCase();
    awayCode = String(match.team2?.code || match.awayCode || 'TBD').toUpperCase();
  }

  const homeName = match.home_team?.name || match.team1?.name || match.home_name || COUNTRY_NAMES[homeCode] || homeCode;
  const awayName = match.away_team?.name || match.team2?.name || match.away_name || COUNTRY_NAMES[awayCode] || awayCode;

  const { status, statusLabel, statusClass } = mapMatchStatus(match.status);

  let homeScoreVal = '-';
  let awayScoreVal = '-';

  if (status !== 'Programado') {
    if (typeof match.home_score === 'object' && match.home_score !== null) {
      homeScoreVal = match.home_score.total ?? match.home_score.fulltime ?? '-';
    } else if (match.home_score !== undefined && match.home_score !== null) {
      homeScoreVal = match.home_score;
    } else if (match.team1?.score !== undefined) {
      homeScoreVal = match.team1.score;
    }

    if (typeof match.away_score === 'object' && match.away_score !== null) {
      awayScoreVal = match.away_score.total ?? match.away_score.fulltime ?? '-';
    } else if (match.away_score !== undefined && match.away_score !== null) {
      awayScoreVal = match.away_score;
    } else if (match.team2?.score !== undefined) {
      awayScoreVal = match.team2.score;
    }
  }

  const cityIdRaw = match.city_id ?? match.cityId ?? (typeof match.city === 'number' ? match.city : null);
  const cityId = cityIdRaw !== null && cityIdRaw !== undefined ? Number(cityIdRaw) : null;
  const cityMeta = cityId !== null && !Number.isNaN(cityId) ? CITY_META[cityId] : null;

  let cityName = match.city_name || (typeof match.city === 'string' ? match.city : '') || cityMeta?.name || '';
  if (!cityName && cityId !== null) cityName = CITY_NAMES[cityId] || `Ciudad ${cityId}`;
  if (!cityName) cityName = 'Sede Oficial';

  const stadium = match.stadium || match.venue || cityMeta?.stadium || '';

  let groupName = match.group || '';
  if (groupName && String(groupName).length === 1) groupName = `Grupo ${String(groupName).toUpperCase()}`;
  if (!groupName) groupName = '';

  let roundName = match.round;
  if (typeof roundName === 'number') {
    roundName = ROUND_NAMES[roundName] || `Ronda ${roundName}`;
  } else if (!roundName) {
    roundName = groupName ? 'Fase de Grupos' : 'Mundial';
  }

  let datetimeStr = match.datetime;
  if (!datetimeStr) {
    datetimeStr = formatMatchDatetime(match.date, match.time);
  }

  return {
    id: match.id || 'm1',
    city: cityName,
    cityId: cityId,
    stadium: stadium,
    status: status,
    statusLabel: statusLabel,
    statusClass: statusClass,
    round: roundName,
    group: groupName || roundName,
    home: {
      code: homeCode,
      name: homeName,
      score: homeScoreVal
    },
    away: {
      code: awayCode,
      name: awayName,
      score: awayScoreVal
    },
    team1: { code: homeCode, name: homeName, score: homeScoreVal },
    team2: { code: awayCode, name: awayName, score: awayScoreVal },
    datetime: datetimeStr,
    date: match.date || '',
    time: match.time || '',
    referee: match.referee || ''
  };
}

function normalizeMatchesList(rawData) {
  if (!rawData) return [];
  const list = Array.isArray(rawData) ? rawData : (rawData.matches || rawData.data || []);
  if (!Array.isArray(list)) return [];
  return list
    .filter(isValidApiMatch)
    .map(normalizeMatch)
    .filter(Boolean);
}


function isValidApiMatch(match) {
  if (!match) return false;

  const round = Number(match.round);
  if (round >= 27 || round === 50) return true;

  if (match.date && (match.date < '2026-06-01' || match.date > '2026-07-31')) return false;
  return true;
}


function resolveTeamFlagUri(raw, code) {
  const rawFlag = raw.flag_url || raw.flag_uri || raw.flag || raw.bandera || '';
  let flagUri = typeof rawFlag === 'string' ? rawFlag.trim() : '';

  if (flagUri.startsWith('//')) flagUri = `https:${flagUri}`;
  if (flagUri.startsWith('/')) flagUri = `https://wc-api-u378.onrender.com${flagUri}`;

  if (!flagUri && code && String(code) !== 'FIFA') {
    flagUri = `https://api.fifa.com/api/v3/picture/flags-sq-5/${code}`;
  }

  return flagUri;
}


function normalizeTeam(item) {
  if (!item) return null;
  const raw = item.data || item.team || item;
  const code = raw.code || raw.isoCode || raw.id || 'MX';
  const name = raw.name || raw.nombre || COUNTRY_NAMES[code] || code;
  const conf = raw.confederation || raw.confederacion || raw.conf || (['MX', 'US', 'CA', 'PA', 'CR', 'JM', 'HT', 'CU'].includes(code) ? 'CONCACAF' : ['AR', 'BR', 'CO', 'UY', 'PY', 'BO', 'PE', 'VE', 'CL', 'EC'].includes(code) ? 'CONMEBOL' : ['ES', 'FR', 'DE', 'GB', 'IT', 'PT', 'NL', 'BE', 'HR', 'AT', 'DK', 'SE', 'PL', 'CH', 'RS'].includes(code) ? 'UEFA' : ['JP', 'QA', 'IR'].includes(code) ? 'AFC' : 'CAF');
  const group = raw.group || raw.grupo || 'Grupo A';
  const rank = raw.rank || raw.ranking || raw.world_ranking || raw.pos || 10;
  const appearances = raw.appearances || raw.participaciones || 10;
  const coach = raw.coach || raw.entrenador || raw.dt || 'Director Técnico FIFA';
  const flagUri = resolveTeamFlagUri(raw, code);

  return {
    id: String(raw.id || code),
    code: code,
    name: name,
    confederation: conf,
    group: typeof group === 'string' && group.length === 1 ? `Grupo ${group}` : group,
    rank: rank,
    appearances: appearances,
    coach: coach,
    flagUri: flagUri,
    squad: Array.isArray(raw.squad || raw.jugadores || raw.players) ? (raw.squad || raw.jugadores || raw.players) : [
      { number: 1, name: 'Portero Titular', pos: 'POR', club: 'Club Oficial' },
      { number: 4, name: 'Defensa Central', pos: 'DEF', club: 'Club Oficial' },
      { number: 8, name: 'Mediocampista', pos: 'MED', club: 'Club Oficial' },
      { number: 10, name: 'Delantero Estrella', pos: 'DEL', club: 'Club Oficial' }
    ]
  };
}


async function fetchLocalData(filename, fallbackEndpoint, forceRefresh = false) {
  try {
    const isHtmlDir = window.location.pathname.includes('/html/');
    const localPath = isHtmlDir ? `../data/${filename}` : `./data/${filename}`;
    const res = await fetch(localPath);
    if (res.ok) {
      const json = await res.json();
      if (json) return json;
    }
  } catch (e) {
    console.warn(`[fetchLocalData] Fallo al cargar data/${filename}, usando API:`, e);
  }
  return fetchWithCache(fallbackEndpoint, forceRefresh);
}


export async function getTeams(forceRefresh = false) {
  try {
    const data = await fetchLocalData('teams.json', 'teams', forceRefresh);
    const list = Array.isArray(data) ? data : (data?.teams || data?.data || []);
    const normalized = list.map(normalizeTeam).filter(Boolean);
    return normalized.length > 0 ? normalized : MOCK_DATA.teams.map(normalizeTeam);
  } catch (error) {
    console.warn('[getTeams] Fallback a MOCK_DATA.teams:', error);
    return MOCK_DATA.teams.map(normalizeTeam);
  }
}


export async function getTeamById(id, forceRefresh = false) {
  try {
    const teamsList = await getTeams(forceRefresh);
    const found = teamsList.find(t => String(t.id).toLowerCase() === String(id).toLowerCase() || String(t.code).toLowerCase() === String(id).toLowerCase());
    if (found) return found;
  } catch (error) {
    console.warn(`[getTeamById] Fallback para id ${id}:`, error);
  }

  const mockItem = MOCK_DATA.teams.find(t => String(t.id).toLowerCase() === String(id).toLowerCase() || String(t.code).toLowerCase() === String(id).toLowerCase()) || MOCK_DATA.teams[0];
  return normalizeTeam(mockItem);
}


export async function getNews(forceRefresh = false) {
  try {
    const data = await fetchWithCache('news', forceRefresh);
    return normalizeNewsList(data);
  } catch (error) {
    console.warn('[getNews] Fallback final a MOCK_DATA news:', error);
    return normalizeNewsList(MOCK_DATA.news);
  }
}


export async function getNewsById(id, forceRefresh = false) {
  try {
    const data = await fetchWithCache(`news/${id}`, forceRefresh);
    return normalizeNewsDetail(data, id);
  } catch (error) {
    console.warn(`[getNewsById] Fallback a MOCK_DATA para id ${id}:`, error);
    const mockItem = MOCK_DATA.news.find(n => String(n.id) === String(id)) || MOCK_DATA.news[0];
    return normalizeNewsDetail(mockItem, id);
  }
}


export async function getMatches(filters = {}, forceRefresh = false) {
  try {
    const rawData = await fetchLocalData('matches.json', 'matches', forceRefresh);
    let normalized = normalizeMatchesList(rawData);
    if (!normalized || normalized.length === 0) {
      normalized = normalizeMatchesList(MOCK_DATA.matches);
    }

    if (filters && typeof filters === 'object') {
      if (filters.city_id && filters.city_id !== 'all') normalized = normalized.filter(m => String(m.cityId) === String(filters.city_id));
      if (filters.round && filters.round !== 'all') normalized = normalized.filter(m => String(m.round).toLowerCase() === String(filters.round).toLowerCase());
      if (filters.status && filters.status !== 'all') normalized = normalized.filter(m => String(m.status).toLowerCase() === String(filters.status).toLowerCase());
      if (filters.group && filters.group !== 'all') normalized = normalized.filter(m => String(m.group).toLowerCase() === String(filters.group).toLowerCase());
      if (filters.home_id) normalized = normalized.filter(m => m.home?.code === filters.home_id || m.team1?.code === filters.home_id);
      if (filters.away_id) normalized = normalized.filter(m => m.away?.code === filters.away_id || m.team2?.code === filters.away_id);
    }
    return normalized;
  } catch (error) {
    console.warn('[getMatches] Fallback a MOCK_DATA matches:', error);
    return normalizeMatchesList(MOCK_DATA.matches);
  }
}


function normalizeRankingItem(item, idx) {
  if (!item) return null;

  const rawTeam = item.team || item;

  const code = rawTeam.id || rawTeam.code || rawTeam.isoCode || 'FIFA';
  const name = rawTeam.name || rawTeam.nombre || COUNTRY_NAMES[code] || code;
  const conf = rawTeam.confederation || rawTeam.confederacion || rawTeam.conf || 'FIFA';
  const flagUri = rawTeam.flag_uri || rawTeam.flag_url || rawTeam.flag || rawTeam.bandera || (code && code !== 'FIFA' ? `https://api.fifa.com/api/v3/picture/flags-sq-5/${code}` : '');

  const pos = item.rank !== undefined && item.rank !== null ? Number(item.rank) : (item.pos || idx + 1);
  const previousRank = item.previous_rank !== undefined && item.previous_rank !== null ? Number(item.previous_rank) : (item.previousRank ?? pos);

  const pointsVal = item.points !== undefined && item.points !== null ? Number(item.points) : (pos ? Math.max(1200, 2000 - pos * 15) : 0);
  const previousPointsVal = item.previous_points !== undefined && item.previous_points !== null ? Number(item.previous_points) : pointsVal;

  const worldRank = item.rank || rawTeam.world_ranking || pos;
  const appearances = rawTeam.appearances || rawTeam.participaciones || item.appearances || item.titles || 0;
  const titles = item.titles ?? rawTeam.titles ?? rawTeam.titulos ?? 0;
  const dt = item.dt || rawTeam.coach || rawTeam.entrenador || item.coach || 'Director Técnico';

  return {
    pos: Number(pos),
    code: String(code),
    name: String(name),
    conf: String(conf),
    flagUri: String(flagUri),
    rank: Number(worldRank),
    previousRank: Number(previousRank),
    points: Number(pointsVal),
    previousPoints: Number(previousPointsVal),
    appearances: Number(appearances),
    titles: Number(titles),
    dt: String(dt)
  };
}


export async function getRanking(forceRefresh = false) {
  try {
    const data = await fetchLocalData('ranking.json', 'ranking', forceRefresh);
    const list = Array.isArray(data) ? data : (data?.ranking || data?.data || []);
    const normalized = list.map(normalizeRankingItem).filter(Boolean);
    return normalized.length > 0 ? normalized : MOCK_DATA.ranking.map(normalizeRankingItem);
  } catch (error) {
    console.warn('[getRanking] Fallback a MOCK_DATA.ranking:', error);
    return MOCK_DATA.ranking.map(normalizeRankingItem);
  }
}


function resolveCountryDisplay(rawCountry) {
  const value = String(rawCountry || '').trim();
  const map = {
    Mexico: 'México',
    'United States': 'Estados Unidos',
    Canada: 'Canadá',
    'México': 'México',
    'Estados Unidos': 'Estados Unidos',
    'Canadá': 'Canadá',
    'EE.UU.': 'Estados Unidos',
    EEUU: 'Estados Unidos'
  };
  return map[value] || value || 'Estados Unidos';
}

function resolveStadiumInfo(rawStadium) {
  if (!rawStadium) {
    return { name: 'Estadio Oficial FIFA', capacity: null, image: '', coordinates: null };
  }
  if (typeof rawStadium === 'string') {
    return { name: rawStadium, capacity: null, image: '', coordinates: null };
  }
  return {
    name: rawStadium.name || rawStadium.stadium || 'Estadio Oficial FIFA',
    capacity: rawStadium.capacity ?? null,
    image: resolveFifaImageUrl(rawStadium.image_url || rawStadium.image || ''),
    coordinates: rawStadium.coordinates || null
  };
}

function formatStadiumCoordinates(coords) {
  if (!coords || typeof coords !== 'object') return '';
  const lat = coords.latitude ?? coords.lat;
  const lng = coords.longitude ?? coords.lng ?? coords.lon;
  if (lat == null || lng == null) return '';
  const latDir = Number(lat) >= 0 ? 'N' : 'S';
  const lngDir = Number(lng) >= 0 ? 'E' : 'W';
  return `${Math.abs(Number(lat)).toFixed(4)}° ${latDir}, ${Math.abs(Number(lng)).toFixed(4)}° ${lngDir}`;
}

function formatCityCapacity(capacity) {
  if (capacity === null || capacity === undefined || capacity === '') {
    return '70,000 personas';
  }
  if (typeof capacity === 'string') {
    return capacity.toLowerCase().includes('personas') ? capacity : `${capacity} personas`;
  }
  return `${Number(capacity).toLocaleString('es-ES')} personas`;
}

function normalizeCity(item) {
  if (!item) return null;
  const raw = item.data || item.city || item;
  const id = String(raw.id || raw.cityId || 'c1');
  const name = raw.name || raw.nombre || 'Ciudad Anfitriona';
  const stadiumData = resolveStadiumInfo(raw.stadium || raw.estadio);
  const country = resolveCountryDisplay(raw.country || raw.pais);
  let countryCode = raw.countryCode || raw.codigoPais || 'USA';
  if (country === 'México') countryCode = 'MEX';
  if (country === 'Canadá') countryCode = 'CAN';
  if (country === 'Estados Unidos') countryCode = 'USA';

  const capacity = formatCityCapacity(raw.capacity || raw.capacidad || stadiumData.capacity);
  const cityImage = resolveFifaImageUrl(raw.image_url || raw.image || raw.imagen || raw.img || '')
    || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80';
  const stadiumImage = stadiumData.image || cityImage;
  const descriptionRaw = raw.description || raw.descripcion;
  const description = Array.isArray(descriptionRaw)
    ? descriptionRaw.join(' ')
    : (descriptionRaw || `${name} es una de las 16 sedes oficiales confirmadas para la Copa Mundial de la FIFA 2026.`);

  const extraInfoRaw = raw.extra_info || raw.extraInfo;
  const extraInfo = extraInfoRaw
    ? {
        title: extraInfoRaw.title || '',
        description: Array.isArray(extraInfoRaw.description)
          ? extraInfoRaw.description.filter(Boolean).join(' ')
          : (extraInfoRaw.description || ''),
        hashtag: extraInfoRaw.hashtag || ''
      }
    : null;

  return {
    id: id,
    name: name,
    stadium: stadiumData.name,
    country: country,
    countryCode: countryCode,
    capacity: capacity,
    image: cityImage,
    stadiumImage: stadiumImage,
    logo: resolveFifaImageUrl(raw.logo_url || raw.logo || ''),
    officialUrl: raw.url || raw.officialUrl || '',
    description: description,
    extraInfo,
    stadiumInfo: raw.stadiumInfo || {
      image: stadiumImage,
      surface: '',
      opened: '',
      coordinates: formatStadiumCoordinates(stadiumData.coordinates) || '',
      highlights: extraInfo?.description || `Sede oficial en ${name} para la Copa Mundial de la FIFA 2026.`
    },
    matches: Array.isArray(raw.matches) && raw.matches.length > 0 ? raw.matches : []
  };
}


export async function getCities(forceRefresh = false) {
  try {
    let data = await fetchWithCache('cities', forceRefresh);

    if (!data) {
      try {
        const isHtmlDir = window.location.pathname.includes('/html/');
        const localPath = isHtmlDir ? '../data/cities.json' : './data/cities.json';
        const res = await fetch(localPath);
        if (res.ok) data = await res.json();
      } catch (e) {
        console.warn('[getCities] Fallback a data/cities.json:', e);
      }
    }

    const list = Array.isArray(data) ? data : (data?.cities || data?.data || (typeof data === 'object' ? Object.values(data) : []));
    const normalized = list.map(normalizeCity).filter(Boolean);
    return normalized.length > 0 ? normalized : MOCK_DATA.cities.map(normalizeCity);
  } catch (error) {
    console.warn('[getCities] Fallback a MOCK_DATA.cities:', error);
    return MOCK_DATA.cities.map(normalizeCity);
  }
}


export async function getCityById(id, forceRefresh = false) {
  const cleanId = String(id || '').trim();
  if (!cleanId) return null;

  try {
    const data = await fetchWithCache(`cities/${cleanId}`, forceRefresh);
    if (data && (data.id || data.name || data.stadium)) {
      return normalizeCity(data);
    }
  } catch (error) {
    console.warn(`[getCityById] API cities/${cleanId} falló:`, error);
  }

  try {
    const list = await getCities(forceRefresh);
    const fromList = list.find(city => String(city.id) === cleanId);
    if (fromList) return fromList;
  } catch (error) {
    console.warn(`[getCityById] Fallback desde listado para id ${cleanId}:`, error);
  }

  try {
    const isHtmlDir = window.location.pathname.includes('/html/');
    const localPath = isHtmlDir ? '../data/cities.json' : './data/cities.json';
    const res = await fetch(localPath);
    if (res.ok) {
      const json = await res.json();
      const item = json[cleanId] || Object.values(json).find(city => String(city.id) === cleanId);
      if (item) return normalizeCity(item);
    }
  } catch (error) {
    console.warn(`[getCityById] Fallback data/cities.json para id ${cleanId}:`, error);
  }

  const mockItem = MOCK_DATA.cities.find(city =>
    String(city.id).toLowerCase() === cleanId.toLowerCase() ||
    String(city.id).replace(/^c/i, '') === cleanId
  );

  return mockItem ? normalizeCity(mockItem) : null;
}


function resolveFifaImageUrl(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let url = raw.trim();
  if (!url) return '';

  if (url.startsWith('//')) url = `https:${url}`;
  if (url.startsWith('/')) url = `https://wc-api-u378.onrender.com${url}`;

  if (/digitalhub\.fifa\.com/i.test(url) && !/[?&]io=transform/i.test(url)) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}io=transform:fill,width:800,height:450`;
  }

  return url;
}

function normalizeBall(raw) {
  const item = raw?.data || raw || {};
  const images = (item.images_url || item.images || [])
    .map(resolveFifaImageUrl)
    .filter(Boolean);
  const features = Array.isArray(item.features)
    ? item.features.map(feature => ({
        title: feature.title || '',
        paragraphs: Array.isArray(feature.description)
          ? feature.description.filter(Boolean)
          : feature.description ? [String(feature.description)] : []
      }))
    : [];

  const defaultFeatures = [
    {
      title: 'Homenaje a los tres países anfitriones',
      paragraphs: [
        'El sugerente nombre de TRIONDA rinde homenaje al hecho de que, por primera vez, tres países —Canadá, México y Estados Unidos— se unirán para albergar la Copa Mundial de la FIFA™.',
        'El diseño del esférico presenta un patrón rojo, verde y azul, con cuatro paneles que forman un triángulo central en referencia a la unión de los tres países anfitriones.'
      ]
    },
    {
      title: 'Tecnología sofisticada',
      paragraphs: [
        'Su composición de cuatro paneles incorpora costuras profundas que garantizan estabilidad y resistencia aerodinámica uniforme en el aire. Los gráficos en relieve mejoran la adherencia bajo lluvia o alta humedad.',
        'TRIONDA incluye la tecnología del balón conectado con un sensor de movimiento de 500 Hz que envía datos precisos al VAR en tiempo real para apoyar decisiones como los fueras de juego.'
      ]
    }
  ];

  return {
    name: item.name || 'Trionda',
    image: images[0] || '../imagenes/banner1.jpg',
    images,
    features: features.length > 0 ? features : defaultFeatures
  };
}

function normalizeMascotItem(item) {
  if (!item) return null;
  const rawCountry = item.country || '';
  const country = resolveCountryDisplay(rawCountry);
  const countryLower = String(rawCountry).toLowerCase();
  let countryCode = 'fifa';
  if (countryLower.includes('mex')) countryCode = 'mx';
  else if (countryLower.includes('usa') || countryLower.includes('estados')) countryCode = 'us';
  else if (countryLower.includes('canad')) countryCode = 'ca';

  return {
    id: item.id,
    name: item.name || 'Mascota Oficial',
    country,
    countryCode,
    image: resolveFifaImageUrl(item.image_url || item.image) || '../imagenes/banner2.jpg',
    description: Array.isArray(item.description)
      ? item.description.join(' ')
      : String(item.description || '')
  };
}

function normalizeMascots(raw) {
  const list = Array.isArray(raw) ? raw : (raw?.mascots || raw?.data || []);
  return list.map(normalizeMascotItem).filter(Boolean);
}

function normalizeSound(raw) {
  const item = raw?.data || raw || {};
  const features = Array.isArray(item.features)
    ? item.features.map(feature => ({
        title: feature.title || '',
        paragraphs: Array.isArray(feature.description)
          ? feature.description.filter(Boolean)
          : feature.description ? [String(feature.description)] : []
      }))
    : [];

  return {
    title: item.title || 'Álbum Oficial FIFA 2026',
    resume: item.resume || item.description || '',
    image: resolveFifaImageUrl(item.image_url || item.image) || '../imagenes/banner3.jpg',
    url: item.url || 'https://www.fifa.com/',
    features
  };
}

export async function getBall(forceRefresh = false) {
  try {
    const data = await fetchWithCache('ball', forceRefresh);
    return normalizeBall(data);
  } catch (error) {
    console.warn('[getBall] Fallback:', error);
    return normalizeBall(null);
  }
}

export async function getMascots(forceRefresh = false) {
  try {
    const data = await fetchWithCache('mascots', forceRefresh);
    const normalized = normalizeMascots(data);
    return normalized.length > 0 ? normalized : normalizeMascots([]);
  } catch (error) {
    console.warn('[getMascots] Fallback:', error);
    return normalizeMascots([]);
  }
}

export async function getSound(forceRefresh = false) {
  try {
    const data = await fetchWithCache('sound', forceRefresh);
    return normalizeSound(data);
  } catch (error) {
    console.warn('[getSound] Fallback:', error);
    return normalizeSound(null);
  }
}


function normalizeStandingItem(item, idx) {
  if (!item) return null;
  const rawTeam = item.team || item;
  const code = rawTeam.id || rawTeam.code || rawTeam.isoCode || 'FIFA';
  const name = rawTeam.name || rawTeam.nombre || COUNTRY_NAMES[code] || code;
  const flagUri = rawTeam.flag_uri || rawTeam.flag_url || rawTeam.flag || (code && code !== 'FIFA' ? `https://api.fifa.com/api/v3/picture/flags-sq-5/${code}` : '');

  const rank = item.position !== undefined ? Number(item.position) : (item.rank || item.pos || idx + 1);
  const pj = item.matches !== undefined ? Number(item.matches) : (item.pj !== undefined ? Number(item.pj) : 0);
  const wins = item.wins !== undefined ? Number(item.wins) : (item.v !== undefined ? Number(item.v) : 0);
  const draws = item.draws !== undefined ? Number(item.draws) : (item.e !== undefined ? Number(item.e) : 0);
  const loss = item.loss !== undefined ? Number(item.loss) : (item.p !== undefined ? Number(item.p) : 0);
  const gf = item.goals_scored !== undefined ? Number(item.goals_scored) : (item.gf !== undefined ? Number(item.gf) : 0);
  const ga = item.goals_against !== undefined ? Number(item.goals_against) : (item.ga !== undefined ? Number(item.ga) : 0);
  const gd = item.goal_difference !== undefined ? Number(item.goal_difference) : (item.dg !== undefined ? Number(item.dg) : (gf - ga));
  const pts = item.points !== undefined ? Number(item.points) : (item.pts !== undefined ? Number(item.pts) : 0);

  return {
    rank: Number(rank),
    position: Number(rank),
    code: String(code),
    name: String(name),
    flagUri: String(flagUri),
    pj: Number(pj),
    wins: Number(wins),
    draws: Number(draws),
    loss: Number(loss),
    gf: Number(gf),
    ga: Number(ga),
    gd: Number(gd),
    pts: Number(pts)
  };
}


function normalizeStandingsData(rawData) {
  if (!rawData) return null;

  if (Array.isArray(rawData) && rawData.length > 0) {
    return rawData.map(group => {
      const gId = String(group.groupId || group.group || 'A').toUpperCase().replace('GRUPO', '').trim();
      const gName = group.groupName || `Grupo ${gId}`;
      const teamsList = Array.isArray(group.teams) ? group.teams : [];
      return {
        groupId: gId,
        groupName: gName,
        teams: teamsList.map(normalizeStandingItem).filter(Boolean)
      };
    });
  }

  if (typeof rawData === 'object' && rawData !== null) {
    const groupKeys = Object.keys(rawData).filter(k => k.length === 1 || k.startsWith('Grupo'));
    if (groupKeys.length === 0) return null;

    let hasAnyData = false;
    const result = groupKeys.sort().map(key => {
      const gId = key.toUpperCase().replace('GRUPO', '').trim();
      const gName = `Grupo ${gId}`;
      const rawList = Array.isArray(rawData[key]) ? rawData[key] : [];
      if (rawList.length > 0) hasAnyData = true;

      const teams = rawList.map(normalizeStandingItem).filter(Boolean);
      return {
        groupId: gId,
        groupName: gName,
        teams: teams
      };
    });

    if (!hasAnyData) return null;
    return result;
  }

  return null;
}


export async function getStandings(forceRefresh = false) {
  try {
    const data = await fetchWithCache('standings', forceRefresh);
    const normalized = normalizeStandingsData(data);
    if (normalized && normalized.length > 0) {
      return normalized;
    }
  } catch (error) {
    console.warn('[getStandings] Fallback a MOCK_DATA.standings:', error);
  }
  return normalizeStandingsData(MOCK_DATA.standings);
}


export async function getStandingsByGroup(groupLetter, forceRefresh = false) {
  const cleanGroup = String(groupLetter || 'A').toUpperCase().replace('GRUPO', '').trim();
  try {
    const data = await fetchWithCache(`standings/${cleanGroup}/group`, forceRefresh);
    if (Array.isArray(data) && data.length > 0) {
      return data.map(normalizeStandingItem).filter(Boolean);
    }
  } catch (error) {
    console.warn(`[getStandingsByGroup] Fallback para grupo ${cleanGroup}:`, error);
  }
  const all = await getStandings(forceRefresh);
  const found = all.find(g => g.groupId === cleanGroup);
  return found ? found.teams : [];
}


function normalizeRecordItem(item, idx) {
  if (!item) return null;
  const raw = item.data || item;
  const id = raw.id ?? raw._id ?? (idx + 1);

  let title = String(raw.title || raw.titulo || '').trim();
  let subtitle = String(raw.subtitle || raw.subtitulo || raw.description || raw.descripcion || '').trim();
  let rawUrl = String(raw.url || raw.video_url || raw.link || '').trim();
  let rawThumb = raw.thumbnail_url || raw.thumbnail || raw.image || raw.imagen || '';

  if (title === 'string' || !title) title = `Highlight del Partido #${idx + 1}`;
  if (subtitle === 'string') subtitle = 'Momento destacado de la Copa Mundial de la FIFA 2026';
  if (rawUrl === 'string') rawUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  let thumbnail = resolveFifaImageUrl(rawThumb);
  if (!thumbnail || thumbnail.includes('string') || thumbnail.includes('example.com')) {
    const FALLBACK_POSTERS = [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80'
    ];
    thumbnail = FALLBACK_POSTERS[idx % FALLBACK_POSTERS.length];
  }

  let category = 'Highlights';
  const combinedText = `${title} ${subtitle}`.toLowerCase();
  if (combinedText.includes('goal') || combinedText.includes('gol')) {
    category = 'Goles';
  } else if (combinedText.includes('chance') || combinedText.includes('cross') || combinedText.includes('atajada') || combinedText.includes('save') || combinedText.includes('var')) {
    category = 'Atajadas';
  } else if (combinedText.includes('match') || combinedText.includes('resumen') || combinedText.includes('reaction') || combinedText.includes('final') || combinedText.includes('end of')) {
    category = 'Resúmenes';
  } else if (combinedText.includes('interview') || combinedText.includes('entrevista') || combinedText.includes('conferencia')) {
    category = 'Entrevistas';
  } else if (combinedText.includes('oficial') || combinedText.includes('inaugura')) {
    category = 'Oficial';
  }

  return {
    id: id,
    title: title,
    subtitle: subtitle,
    url: rawUrl,
    thumbnail_url: thumbnail,
    image: thumbnail,
    category: category
  };
}


export async function getRecords(forceRefresh = false) {
  async function fetchRecords() {
    try {
      const isHtmlDir = window.location.pathname.includes('/html/');
      const localPath = isHtmlDir ? '../data/records.json' : './data/records.json';
      const res = await fetch(localPath);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn('Error loading local records:', e);
    }
    return fetchWithCache('records', `${API_CONFIG.BASE_URL}/records/`);
  }
  try {
    const data = await fetchRecords();
    const list = Array.isArray(data) ? data : (data?.records || data?.data || []);
    const normalized = list.map(normalizeRecordItem).filter(Boolean);
    if (normalized.length > 0) return normalized;
  } catch (error) {
    console.warn('[getRecords] Fallback a MOCK_DATA.records:', error);
  }
  return MOCK_DATA.records.map(normalizeRecordItem);
}

function extractYearFromText(text) {
  const match = String(text || '').match(/\b(20\d{2})\b/);
  return match ? parseInt(match[1], 10) : null;
}

function inferEventStatus(year) {
  if (!year) return 'Próximo';
  const currentYear = new Date().getFullYear();
  if (year <= currentYear + 1) return 'Próximo';
  return 'Futuro';
}

function inferEventLocation(title, description) {
  const combined = `${title} ${description}`;

  const afterFifa = String(title).match(/de la FIFA\s+(.+?)\s+20\d{2}/i);
  if (afterFifa) return afterFifa[1].replace(/™/g, '').trim();

  if (/españa|marruecos y portugal|2030/i.test(combined)) return 'España, Marruecos y Portugal';
  if (/brasil/i.test(combined)) return 'Brasil';
  if (/polonia/i.test(combined)) return 'Polonia';
  if (/catar|qatar/i.test(combined)) return 'Catar';
  if (/marruecos|morocco/i.test(combined)) return 'Marruecos';

  return 'Por confirmar';
}

function normalizeEventItem(item) {
  if (!item) return null;

  const title = String(item.title || '').trim();
  if (!title) return null;

  const description = String(item.description || item.desc || '').trim();
  const year = extractYearFromText(title) || extractYearFromText(description);

  return {
    id: item.id,
    title,
    description,
    url: item.url || item.officialUrl || '',
    image_url: item.image_url || item.image || '',
    org: item.org || 'FIFA',
    status: item.status || inferEventStatus(year),
    date: item.date || item.dates || (year ? String(year) : 'Por confirmar'),
    location: item.location || inferEventLocation(title, description)
  };
}

function normalizeTournamentItem(item) {
  const normalized = normalizeEventItem(item);
  if (!normalized) return null;

  return {
    ...normalized,
    dates: item.dates || normalized.date,
    teams: item.teams || 'Varios equipos',
    desc: item.desc || normalized.description,
    officialUrl: item.officialUrl || normalized.url,
    icon: item.icon || ''
  };
}

export async function fetchEventsRaw(forceRefresh = false) {
  try {
    const data = await fetchWithCache('events', forceRefresh);
    const list = Array.isArray(data) ? data : (data?.events || data?.data || []);
    if (list.length > 0) return list;
  } catch (error) {
    console.warn('[fetchEventsRaw] Fallback a MOCK_DATA.tournaments:', error);
  }

  return MOCK_DATA.tournaments;
}

export async function getEvents(forceRefresh = false) {
  const list = await fetchEventsRaw(forceRefresh);
  return list.map(normalizeEventItem).filter(Boolean);
}

export async function getTournaments(forceRefresh = false) {
  const list = await fetchEventsRaw(forceRefresh);
  return list.map(normalizeTournamentItem).filter(Boolean);
}

export async function getODS() {
  return [
    {
      id: 3,
      number: '3',
      title: 'Salud y Bienestar',
      icon: '❤️',
      desc: 'Promoción del deporte y actividad física. El fútbol como herramienta para la salud pública en 48 naciones participantes.',
      stat: '🌱 Salud Pública & Deporte'
    },
    {
      id: 4,
      number: '4',
      title: 'Educación de Calidad',
      icon: '📚',
      desc: 'Programas educativos FIFA en comunidades anfitrionas. Acceso igualitario a formación deportiva para jóvenes de toda la región.',
      stat: '🎓 Formación Juvenil FIFA'
    },
    {
      id: 5,
      number: '5',
      title: 'Igualdad de Género',
      icon: '⚡',
      desc: 'El Mundial 2026 potencia el desarrollo del fútbol femenino y promueve la igualdad de oportunidades en el deporte.',
      stat: '⚡ Igualdad & Inclusión'
    },
    {
      id: 7,
      number: '7',
      title: 'Energía Asequible',
      icon: '☀️',
      desc: '100% de los estadios sede operarán con energía renovable. Iluminación LED de última generación en los 16 recintos.',
      stat: '☀️ 100% Energía Renovable'
    },
    {
      id: 11,
      number: '11',
      title: 'Ciudades Sostenibles',
      icon: '🏙️',
      desc: 'Infraestructura de transporte público reforzada en todas las ciudades sede para minimizar la huella de carbono del evento.',
      stat: '🏙️ Movilidad Verde Sede'
    },
    {
      id: 13,
      number: '13',
      title: 'Acción por el Clima',
      icon: '🌍',
      desc: 'Compensación de emisiones de CO2 del torneo mediante proyectos de reforestación en los tres países anfitriones.',
      stat: '🌍 Huella Carbono Neutra'
    },
    {
      id: 16,
      number: '16',
      title: 'Paz e Instituciones',
      icon: '🕊️',
      desc: 'El fútbol como diplomacia deportiva: el Mundial une culturas y promueve el diálogo entre 48 naciones del planeta.',
      stat: '🕊️ Diplomacia & Unión'
    },
    {
      id: 17,
      number: '17',
      title: 'Alianzas para los Objetivos',
      icon: '🤝',
      desc: 'FIFA, CONMEBOL, UEFA y confederaciones aliadas coordinan iniciativas globales de sostenibilidad con organismos de la ONU.',
      stat: '🤝 Alianzas Globales ONU'
    }
  ];
}

export const FIFA_API = {
  getNews,
  getNewsById,
  getMatches,
  getMatchById: (id, forceRefresh = false) => getMatchById(id, forceRefresh),
  getTeams: (forceRefresh = false) => getTeams(forceRefresh),
  getTeamsList: (forceRefresh = false) => getTeams(forceRefresh),
  getTeamById: (id, forceRefresh = false) => getTeamById(id, forceRefresh),
  getRanking: (forceRefresh = false) => getRanking(forceRefresh),
  getRankingList: (forceRefresh = false) => getRanking(forceRefresh),
  getCities: (forceRefresh = false) => getCities(forceRefresh),
  getCitiesList: (forceRefresh = false) => getCities(forceRefresh),
  getCityById: (id, forceRefresh = false) => getCityById(id, forceRefresh),
  getStandings: (forceRefresh = false) => getStandings(forceRefresh),
  getStandingsByGroup: (group, forceRefresh = false) => getStandingsByGroup(group, forceRefresh),
  getRecords: (forceRefresh = false) => getRecords(forceRefresh),
  getRecordsList: (forceRefresh = false) => getRecords(forceRefresh),
  getKnockout: (forceRefresh = false) => fetchWithCache('eliminatorias', forceRefresh),
  getEvents: (forceRefresh = false) => getEvents(forceRefresh),
  getTournaments: (forceRefresh = false) => getTournaments(forceRefresh),
  getODS: () => getODS(),
  getBall: (forceRefresh = false) => getBall(forceRefresh),
  getMascots: (forceRefresh = false) => getMascots(forceRefresh),
  getSound: (forceRefresh = false) => getSound(forceRefresh),
  prefetchData: prefetchEssentialData,
  clearCache: () => {
    clearFifaCache();
    localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
  }
};


export function prefetchEssentialData() {
  const scheduler = typeof window !== 'undefined' && window.requestIdleCallback
    ? window.requestIdleCallback
    : (fn) => setTimeout(fn, 200);

  scheduler(() => {
    const endpoints = ['records', 'news', 'matches', 'standings', 'teams', 'ranking', 'cities', 'ball', 'mascots', 'sound'];
    endpoints.forEach(endpoint => {
      fetchWithCache(endpoint).catch(() => {});
    });
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(prefetchEssentialData, 300);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(prefetchEssentialData, 300));
  }
}


