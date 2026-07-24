/* ==========================================
   FIFA WORLD CUP 2026 - API CLIENT & LOCALSTORAGE CACHE
   js/api.js
   ========================================== */

const API_CONFIG = {
  BASE_URL: 'https://wc-api-u378.onrender.com/wc-api/api/v1',
  CORS_PROXY: 'https://corsproxy.io/?',
  CACHE_TTL: 15 * 60 * 1000 // 15 minutos
};

const CACHE_VERSION = '12';
const CACHE_VERSION_KEY = 'fifa_cache_version';

// Determina si se está ejecutando en servidor local
function isLocalEnvironment() {
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:'
  );
}

function clearFifaCache() {
  try {
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

// Curated high-fidelity mock fallback data to handle network failures or Render latency seamlessly
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
    {
      id: 'MX',
      code: 'MX',
      name: 'México',
      confederation: 'CONCACAF',
      group: 'Grupo A',
      rank: 15,
      appearances: 17,
      coach: 'Javier Aguirre',
      squad: [
        { number: 13, name: 'Guillermo Ochoa', pos: 'POR', club: 'Salernitana' },
        { number: 3, name: 'César Montes', pos: 'DEF', club: 'Al-Shabab' },
        { number: 4, name: 'Edson Álvarez', pos: 'MED', club: 'West Ham United' },
        { number: 9, name: 'Raúl Jiménez', pos: 'DEL', club: 'Fulham' },
        { number: 10, name: 'Alexis Vega', pos: 'DEL', club: 'Toluca' }
      ]
    },
    {
      id: 'AR',
      code: 'AR',
      name: 'Argentina',
      confederation: 'CONMEBOL',
      group: 'Grupo A',
      rank: 1,
      appearances: 18,
      coach: 'Lionel Scaloni',
      squad: [
        { number: 23, name: 'Emiliano Martínez', pos: 'POR', club: 'Aston Villa' },
        { number: 13, name: 'Cristian Romero', pos: 'DEF', club: 'Tottenham Hotspur' },
        { number: 7, name: 'Rodrigo De Paul', pos: 'MED', club: 'Atlético de Madrid' },
        { number: 10, name: 'Lionel Messi', pos: 'DEL', club: 'Inter Miami' },
        { number: 9, name: 'Julián Álvarez', pos: 'DEL', club: 'Atlético de Madrid' }
      ]
    },
    {
      id: 'BR',
      code: 'BR',
      name: 'Brasil',
      confederation: 'CONMEBOL',
      group: 'Grupo B',
      rank: 5,
      appearances: 22,
      coach: 'Dorival Júnior',
      squad: [
        { number: 1, name: 'Alisson Becker', pos: 'POR', club: 'Liverpool' },
        { number: 4, name: 'Marquinhos', pos: 'DEF', club: 'PSG' },
        { number: 5, name: 'Casemiro', pos: 'MED', club: 'Manchester United' },
        { number: 7, name: 'Vinícius Júnior', pos: 'DEL', club: 'Real Madrid' },
        { number: 11, name: 'Rodrygo Goes', pos: 'DEL', club: 'Real Madrid' }
      ]
    },
    {
      id: 'ES',
      code: 'ES',
      name: 'España',
      confederation: 'UEFA',
      group: 'Grupo C',
      rank: 3,
      appearances: 16,
      coach: 'Luis de la Fuente',
      squad: [
        { number: 1, name: 'Unai Simón', pos: 'POR', club: 'Athletic Club' },
        { number: 14, name: 'Aymeric Laporte', pos: 'DEF', club: 'Al-Nassr' },
        { number: 16, name: 'Rodri Hernández', pos: 'MED', club: 'Manchester City' },
        { number: 19, name: 'Lamine Yamal', pos: 'DEL', club: 'FC Barcelona' },
        { number: 7, name: 'Álvaro Morata', pos: 'DEL', club: 'AC Milan' }
      ]
    },
    {
      id: 'FR',
      code: 'FR',
      name: 'Francia',
      confederation: 'UEFA',
      group: 'Grupo C',
      rank: 2,
      appearances: 16,
      coach: 'Didier Deschamps',
      squad: [
        { number: 16, name: 'Mike Maignan', pos: 'POR', club: 'AC Milan' },
        { number: 4, name: 'Dayot Upamecano', pos: 'DEF', club: 'Bayern München' },
        { number: 8, name: 'Aurelien Tchouaméni', pos: 'MED', club: 'Real Madrid' },
        { number: 10, name: 'Kylian Mbappé', pos: 'DEL', club: 'Real Madrid' },
        { number: 7, name: 'Antoine Griezmann', pos: 'DEL', club: 'Atlético de Madrid' }
      ]
    },
    {
      id: 'US',
      code: 'US',
      name: 'Estados Unidos',
      confederation: 'CONCACAF',
      group: 'Grupo D',
      rank: 11,
      appearances: 11,
      coach: 'Mauricio Pochettino',
      squad: [
        { number: 1, name: 'Matt Turner', pos: 'POR', club: 'Crystal Palace' },
        { number: 3, name: 'Chris Richards', pos: 'DEF', club: 'Crystal Palace' },
        { number: 8, name: 'Weston McKennie', pos: 'MED', club: 'Juventus' },
        { number: 10, name: 'Christian Pulisic', pos: 'DEL', club: 'AC Milan' },
        { number: 21, name: 'Timothy Weah', pos: 'DEL', club: 'Juventus' }
      ]
    },
    {
      id: 'CA',
      code: 'CA',
      name: 'Canadá',
      confederation: 'CONCACAF',
      group: 'Grupo D',
      rank: 48,
      appearances: 2,
      coach: 'Jesse Marsch',
      squad: [
        { number: 16, name: 'Maxime Crépeau', pos: 'POR', club: 'Portland Timbers' },
        { number: 15, name: 'Moïse Bombito', pos: 'DEF', club: 'Nice' },
        { number: 7, name: 'Stephen Eustaquio', pos: 'MED', club: 'Porto' },
        { number: 19, name: 'Alphonso Davies', pos: 'DEL', club: 'Bayern München' },
        { number: 9, name: 'Jonathan David', pos: 'DEL', club: 'Lille' }
      ]
    },
    {
      id: 'DE',
      code: 'DE',
      name: 'Alemania',
      confederation: 'UEFA',
      group: 'Grupo B',
      rank: 9,
      appearances: 20,
      coach: 'Julian Nagelsmann',
      squad: [
        { number: 1, name: 'Manuel Neuer', pos: 'POR', club: 'Bayern München' },
        { number: 2, name: 'Antonio Rüdiger', pos: 'DEF', club: 'Real Madrid' },
        { number: 8, name: 'Toni Kroos', pos: 'MED', club: 'Real Madrid' },
        { number: 10, name: 'Jamal Musiala', pos: 'DEL', club: 'Bayern München' },
        { number: 17, name: 'Florian Wirtz', pos: 'DEL', club: 'Bayer Leverkusen' }
      ]
    }
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
  ]
};

/**
 * Petición con Timeout utilizando AbortController para prevenir bloqueos infinitos (1.5s max)
 */
async function fetchWithTimeout(url, timeoutMs = 25000) {
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

/**
 * Petición asíncrona con gestión de caché localStorage, timeout estricto y fallback instantáneo
 */
export async function fetchWithCache(endpoint, forceRefresh = false) {
  const cacheKey = `fifa_cache_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData && !forceRefresh) {
    try {
      const { timestamp, data } = JSON.parse(cachedData);
      const isNotEmpty = Array.isArray(data) ? data.length > 0 : Boolean(data);
      if (Date.now() - timestamp < API_CONFIG.CACHE_TTL && isNotEmpty) {
        console.log(`[Caché Local HIT] Cargado desde localStorage: ${endpoint}`);
        return data;
      }
    } catch (e) {
      console.warn('Error al parsear caché local', e);
    }
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const directUrl = `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;

  let data = null;
  let fetchSuccess = false;

  // Intento 1: Fetch directo (Render cold start puede tardar)
  try {
    const response = await fetchWithTimeout(directUrl, 25000);
    if (response.ok) {
      data = await response.json();
      if (data && (Array.isArray(data) ? data.length > 0 : true)) {
        fetchSuccess = true;
      }
    }
  } catch (err) {
    console.warn(`[Fetch Directo] Endpoint '${endpoint}' no respondió a tiempo (${err.message})`);
  }

  // Intento 2: Si estamos en local y falló directo, intentar Proxy CORS
  if (!fetchSuccess && isLocalEnvironment()) {
    try {
      const proxyUrl = `${API_CONFIG.CORS_PROXY}${encodeURIComponent(directUrl)}`;
      const response = await fetchWithTimeout(proxyUrl, 25000);
      if (response.ok) {
        data = await response.json();
        if (data && (Array.isArray(data) ? data.length > 0 : true)) {
          fetchSuccess = true;
        }
      }
    } catch (err) {
      console.warn(`[Fetch Proxy] Proxy para '${endpoint}' tampoco respondió (${err.message})`);
    }
  }

  if (fetchSuccess && data) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
    } catch (e) {}
    return data;
  }

  // Fallback 1: Servir datos de la caché local anterior si era válida y no vacía
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      const isNotEmpty = Array.isArray(parsed.data) ? parsed.data.length > 0 : Boolean(parsed.data);
      if (isNotEmpty) {
        console.warn(`[Fallback Caché] Sirviendo datos previos para ${endpoint}`);
        return parsed.data;
      }
    } catch (e) {}
  }

  // Fallback 2: Servir MOCK_DATA instantáneamente
  let rootEndpoint = cleanEndpoint.split('?')[0].split('/')[0];
  if (rootEndpoint === 'noticias') rootEndpoint = 'news';
  if (rootEndpoint === 'partidos') rootEndpoint = 'matches';
  if (rootEndpoint === 'clasificacion') rootEndpoint = 'standings';
  if (rootEndpoint === 'eliminatorias') rootEndpoint = 'knockout';
  if (rootEndpoint === 'torneos') rootEndpoint = 'tournaments';

  const mockFallback = MOCK_DATA[rootEndpoint] || MOCK_DATA.news || [];
  console.warn(`[Fallback Mock Instantáneo] Cargando MOCK_DATA para '${rootEndpoint}'`);
  // No guardar mock en localStorage: evita envenenar la caché con datos sin imágenes válidas
  return mockFallback;
}

// Curated high-fidelity mock detailed matches data
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

/**
 * Fetch detailed match by ID using LocalStorage strategy
 */
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
      ...MATCH_DETAILS_MOCK['m1'],
      id: basicMatch?.id || id,
      city: basicMatch?.city || 'Ciudad de México',
      stadium: basicMatch?.stadium || 'Estadio Azteca',
      status: basicMatch?.status || 'Programado',
      statusLabel: basicMatch?.statusLabel || basicMatch?.status || 'Programado',
      statusClass: basicMatch?.statusClass || 'scheduled',
      round: basicMatch?.round || 'Fase de Grupos',
      group: basicMatch?.group || 'Grupo A',
      team1: basicMatch?.team1 || { code: 'MEX', name: 'México', score: '-' },
      team2: basicMatch?.team2 || { code: 'ARG', name: 'Argentina', score: '-' },
      datetime: basicMatch?.datetime || '15 jun • 18:00',
      referee: basicMatch?.referee || ''
    };
  }

  return detail;
}

/**
 * Normaliza detalle de partido (/v1/matches/{id}) reutilizando el listado
 */
function normalizeMatchDetail(raw, requestedId) {
  const item = raw?.data || raw?.match || raw;
  const base = normalizeMatch(item);
  if (!base) return null;

  return {
    ...MATCH_DETAILS_MOCK['m1'],
    ...base,
    id: base.id || requestedId,
    status: base.status,
    statusLabel: base.statusLabel,
    statusClass: base.statusClass,
    timeline: Array.isArray(item.timeline) ? item.timeline : (MATCH_DETAILS_MOCK['m1']?.timeline || []),
    stats: item.stats || MATCH_DETAILS_MOCK['m1']?.stats || null,
    lineups: item.lineups || MATCH_DETAILS_MOCK['m1']?.lineups || null,
    media: item.media || MATCH_DETAILS_MOCK['m1']?.media || null,
    gallery: item.gallery || MATCH_DETAILS_MOCK['m1']?.gallery || []
  };
}

/**
 * Resuelve URL de imagen de noticia desde la API v1 u otros formatos
 */
function resolveNewsImage(item) {
  const raw = item.image_url ?? item.image ?? item.imagen ?? item.urlImagen ?? item.img ?? '';
  if (!raw || typeof raw !== 'string') return '';

  let url = raw.trim();
  if (!url) return '';

  if (url.startsWith('//')) url = `https:${url}`;
  if (url.startsWith('/')) url = `https://wc-api-u378.onrender.com${url}`;

  // Optimiza imágenes de digitalhub.fifa.com para carga más rápida y estable
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

/**
 * Resuelve URL oficial de la noticia en fifa.com
 */
function resolveNewsUrl(item) {
  const raw = item?.url ?? item?.link ?? item?.source_url ?? item?.article_url ?? item?.href ?? '';
  if (!raw || typeof raw !== 'string') return '';

  let url = raw.trim();
  if (!url) return '';

  if (url.startsWith('//')) url = `https:${url}`;
  if (url.startsWith('/')) url = `https://www.fifa.com${url}`;

  // Corrige dobles barras típicas de la API (fifa.com//es/...)
  url = url.replace(/^(https?:\/\/[^/]+)\/{2,}/i, '$1/');

  if (!/^https?:\/\//i.test(url)) return '';
  return url;
}

/**
 * Normaliza noticias desde distintos formatos de la API
 */
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

/**
 * Normaliza el detalle de una noticia por ID
 */
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

/**
 * Mapeo de códigos de países (ISO-2 y FIFA ISO-3) para normalizar partidos API
 */
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

/** Ciudades anfitrionas según /v1/cities (id API) */
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

/** Rondas numéricas de la API FIFA WC 2026 */
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

  return { status: 'Programado', statusLabel: 'Programado', statusClass: 'scheduled' };
}

/**
 * Normaliza un partido individual desde el JSON exacto de la API (/v1/matches)
 */
function normalizeMatch(match) {
  if (!match) return null;

  const isApiFormat = match.home_id !== undefined || match.home_score !== undefined || match.city_id !== undefined;

  const homeCode = String(isApiFormat ? (match.home_id || 'MEX') : (match.team1?.code || match.homeCode || 'MEX')).toUpperCase();
  const awayCode = String(isApiFormat ? (match.away_id || 'ARG') : (match.team2?.code || match.awayCode || 'ARG')).toUpperCase();

  const homeName = match.team1?.name || match.home_name || COUNTRY_NAMES[homeCode] || homeCode;
  const awayName = match.team2?.name || match.away_name || COUNTRY_NAMES[awayCode] || awayCode;

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

/**
 * Descarta partidos basura/placeholder de la API (ej. final falsa id 11111111)
 */
function isValidApiMatch(match) {
  if (!match) return false;
  const id = String(match.id ?? '');
  if (id === '11111111') return false;
  // Fuera del rango oficial del Mundial 2026 (jun–jul)
  if (match.date && (match.date < '2026-06-01' || match.date > '2026-07-31')) return false;
  return true;
}

/**
 * Resuelve URL de bandera desde la API de equipos
 */
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

/**
 * Normaliza un equipo/selección individual desde la API (/v1/teams y /v1/teams/{id})
 */
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

/**
 * Obtiene el listado completo de equipos/selecciones (/v1/teams)
 */
export async function getTeams(forceRefresh = false) {
  try {
    const data = await fetchWithCache('teams', forceRefresh);
    const list = Array.isArray(data) ? data : (data?.teams || data?.data || []);
    return list.map(normalizeTeam).filter(Boolean);
  } catch (error) {
    console.warn('[getTeams] Fallback a MOCK_DATA.teams:', error);
    return MOCK_DATA.teams.map(normalizeTeam);
  }
}

/**
 * Obtiene el detalle de un equipo por ID (/v1/teams/{id})
 */
export async function getTeamById(id, forceRefresh = false) {
  try {
    const data = await fetchWithCache(`teams/${id}`, forceRefresh);
    if (data && (data.id || data.code || data.name)) {
      return normalizeTeam(data);
    }
  } catch (error) {
    console.warn(`[getTeamById] Fallback a MOCK_DATA para id ${id}:`, error);
  }

  const mockItem = MOCK_DATA.teams.find(t => String(t.id).toLowerCase() === String(id).toLowerCase() || String(t.code).toLowerCase() === String(id).toLowerCase()) || MOCK_DATA.teams[0];
  return normalizeTeam(mockItem);
}

/**
 * Obtiene el listado completo de noticias (/v1/news)
 */
export async function getNews(forceRefresh = false) {
  try {
    const data = await fetchWithCache('news', forceRefresh);
    return normalizeNewsList(data);
  } catch (error) {
    console.warn('[getNews] Fallback final a MOCK_DATA news:', error);
    return normalizeNewsList(MOCK_DATA.news);
  }
}

/**
 * Obtiene el detalle de una noticia por ID (/v1/news/{id})
 */
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

/**
 * Obtiene la lista de partidos con opción de filtros por Query Params (/v1/matches)
 * @param {Object} filters - Objeto con filtros opcionales { city_id, round, status, group, home_id, away_id, from, to }
 * @param {boolean} forceRefresh - Forzar actualización ignorando caché
 */
export async function getMatches(filters = {}, forceRefresh = false) {
  const queryParams = new URLSearchParams();
  if (typeof filters === 'object' && filters !== null) {
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
  }

  const queryString = queryParams.toString();
  const endpoint = queryString ? `matches?${queryString}` : 'matches';

  try {
    const data = await fetchWithCache(endpoint, forceRefresh);
    return normalizeMatchesList(data);
  } catch (error) {
    console.warn('[getMatches] Fallback a MOCK_DATA matches:', error);
    return normalizeMatchesList(MOCK_DATA.matches);
  }
}

/**
 * Normaliza un ítem del Ranking FIFA Mundial (/v1/ranking)
 */
function normalizeRankingItem(item, idx) {
  if (!item) return null;
  
  // Soporte para estructura anidada de la API (`{ team: {...}, rank, points, previous_rank }`) o plana (mock)
  const rawTeam = item.team || item;

  const code = rawTeam.id || rawTeam.code || rawTeam.isoCode || 'FIFA';
  const name = rawTeam.name || rawTeam.nombre || COUNTRY_NAMES[code] || code;
  const conf = rawTeam.confederation || rawTeam.confederacion || rawTeam.conf || 'FIFA';
  const flagUri = rawTeam.flag_uri || rawTeam.flag || rawTeam.bandera || (code && code !== 'FIFA' ? `https://api.fifa.com/api/v3/picture/flags-sq-5/${code}` : '');

  const pos = item.rank !== undefined && item.rank !== null ? Number(item.rank) : (item.pos || idx + 1);
  const previousRank = item.previous_rank !== undefined && item.previous_rank !== null ? Number(item.previous_rank) : (item.previousRank ?? pos);
  
  const pointsVal = item.points !== undefined && item.points !== null ? Number(item.points) : (pos ? Math.max(1200, 2000 - pos * 15) : 0);
  const previousPointsVal = item.previous_points !== undefined && item.previous_points !== null ? Number(item.previous_points) : pointsVal;
  
  const worldRank = rawTeam.world_ranking || item.world_ranking || pos;
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

/**
 * Obtiene el Ranking FIFA Mundial (/v1/ranking)
 */
export async function getRanking(forceRefresh = false) {
  try {
    const data = await fetchWithCache('ranking', forceRefresh);
    const list = Array.isArray(data) ? data : (data?.ranking || data?.data || []);
    const normalized = list.map(normalizeRankingItem).filter(Boolean);
    return normalized.length > 0 ? normalized : MOCK_DATA.ranking.map(normalizeRankingItem);
  } catch (error) {
    console.warn('[getRanking] Fallback a MOCK_DATA.ranking:', error);
    return MOCK_DATA.ranking.map(normalizeRankingItem);
  }
}

/**
 * Normaliza una ciudad anfitriona individual (/v1/cities y /v1/cities/{id})
 */
function normalizeCity(item) {
  if (!item) return null;
  const raw = item.data || item.city || item;
  const id = String(raw.id || raw.cityId || 'c1');
  const name = raw.name || raw.nombre || 'Ciudad Anfitriona';
  const stadium = raw.stadium || raw.estadio || 'Estadio Oficial FIFA';
  const country = raw.country || raw.pais || 'Estados Unidos';
  let countryCode = raw.countryCode || raw.codigoPais || 'USA';
  if (country === 'México' || country === 'Mexico') countryCode = 'MEX';
  if (country === 'Canadá' || country === 'Canada') countryCode = 'CAN';
  if (country === 'Estados Unidos' || country === 'EE.UU.' || country === 'EEUU') countryCode = 'USA';

  const capacity = raw.capacity || raw.capacidad || '70,000 personas';
  const image = raw.image || raw.imagen || raw.img || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80';
  const description = raw.description || raw.descripcion || `${name} es una de las 16 sedes oficiales confirmadas para la Copa Mundial de la FIFA 2026.`;

  return {
    id: id,
    name: name,
    stadium: stadium,
    country: country,
    countryCode: countryCode,
    capacity: capacity,
    image: image,
    description: description,
    stadiumInfo: raw.stadiumInfo || {
      image: image,
      surface: 'Césped Híbrido Certificado FIFA',
      opened: '2015',
      coordinates: '37.7749° N, 122.4194° W',
      highlights: `Sede oficial en ${name} para la Copa Mundial de la FIFA 2026.`
    },
    matches: Array.isArray(raw.matches) ? raw.matches : [
      { id: 'm-fase', round: 'Fase de Grupos', teams: 'Partido Oficial FIFA', datetime: 'Junio 2026' }
    ]
  };
}

/**
 * Obtiene el listado completo de ciudades anfitrionas (/v1/cities)
 */
export async function getCities(forceRefresh = false) {
  try {
    const data = await fetchWithCache('cities', forceRefresh);
    const list = Array.isArray(data) ? data : (data?.cities || data?.data || []);
    const normalized = list.map(normalizeCity).filter(Boolean);
    return normalized.length > 0 ? normalized : MOCK_DATA.cities.map(normalizeCity);
  } catch (error) {
    console.warn('[getCities] Fallback a MOCK_DATA.cities:', error);
    return MOCK_DATA.cities.map(normalizeCity);
  }
}

/**
 * Obtiene el detalle de una ciudad por ID (/v1/cities/{id})
 */
export async function getCityById(id, forceRefresh = false) {
  try {
    const data = await fetchWithCache(`cities/${id}`, forceRefresh);
    if (data && (data.id || data.name || data.stadium)) {
      return normalizeCity(data);
    }
  } catch (error) {
    console.warn(`[getCityById] Fallback a MOCK_DATA para id ${id}:`, error);
  }

  const mockItem = MOCK_DATA.cities.find(c => String(c.id).toLowerCase() === String(id).toLowerCase() || String(c.name).toLowerCase().includes(String(id).toLowerCase())) || MOCK_DATA.cities[0];
  return normalizeCity(mockItem);
}

// Public API Methods
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
  getStandings: (forceRefresh = false) => fetchWithCache('clasificacion', forceRefresh),
  getKnockout: (forceRefresh = false) => fetchWithCache('eliminatorias', forceRefresh),
  getEvents: () => fetchWithCache('events'),
  getTournaments: (forceRefresh = false) => fetchWithCache('torneos', forceRefresh),
  getODS: () => fetchWithCache('ods'),
  clearCache: () => {
    clearFifaCache();
    localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
  }
};


