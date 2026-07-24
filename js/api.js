/* ==========================================
 FIFA WORLD CUP 2026 - API CLIENT & LOCALSTORAGE CACHE
 js/api.js
 ========================================== */

const API_BASE_URL = 'https://wc-api-u378.onrender.com/wc-api/api/';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos en milisegundos

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
 { id: 'c1', name: 'Ciudad de México', stadium: 'Estadio Azteca', country: 'México', countryCode: 'MEX', capacity: '87,523 personas', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80' },
 { id: 'c2', name: 'Nueva York', stadium: 'MetLife Stadium', country: 'Estados Unidos', countryCode: 'USA', capacity: '82,500 personas', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80' },
 { id: 'c3', name: 'Toronto', stadium: 'BMO Field', country: 'Canadá', countryCode: 'CAN', capacity: '45,500 personas', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80' },
 { id: 'c4', name: 'Los Ángeles', stadium: 'SoFi Stadium', country: 'Estados Unidos', countryCode: 'USA', capacity: '70,240 personas', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80' },
 { id: 'c5', name: 'Guadalajara', stadium: 'Estadio Akron', country: 'México', countryCode: 'MEX', capacity: '48,000 personas', image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80' },
 { id: 'c6', name: 'Monterrey', stadium: 'Estadio BBVA', country: 'México', countryCode: 'MEX', capacity: '53,500 personas', image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=600&q=80' },
 { id: 'c7', name: 'Vancouver', stadium: 'BC Place', country: 'Canadá', countryCode: 'CAN', capacity: '54,500 personas', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80' },
 { id: 'c8', name: 'Dallas', stadium: 'AT&T Stadium', country: 'Estados Unidos', countryCode: 'USA', capacity: '80,000 personas', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80' },
 { id: 'c9', name: 'Miami', stadium: 'Hard Rock Stadium', country: 'Estados Unidos', countryCode: 'USA', capacity: '64,767 personas', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80' },
 { id: 'c10', name: 'Atlanta', stadium: 'Mercedes-Benz Stadium', country: 'Estados Unidos', countryCode: 'USA', capacity: '71,000 personas', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80' },
 { id: 'c11', name: 'Seattle', stadium: 'Lumen Field', country: 'Estados Unidos', countryCode: 'USA', capacity: '69,000 personas', image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80' },
 { id: 'c12', name: 'Houston', stadium: 'NRG Stadium', country: 'Estados Unidos', countryCode: 'USA', capacity: '72,220 personas', image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=600&q=80' },
 { id: 'c13', name: 'San Francisco', stadium: 'Levi\'s Stadium', country: 'Estados Unidos', countryCode: 'USA', capacity: '68,500 personas', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80' },
 { id: 'c14', name: 'Filadelfia', stadium: 'Lincoln Financial Field', country: 'Estados Unidos', countryCode: 'USA', capacity: '67,594 personas', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80' },
 { id: 'c15', name: 'Boston', stadium: 'Gillette Stadium', country: 'Estados Unidos', countryCode: 'USA', capacity: '65,878 personas', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80' },
 { id: 'c16', name: 'Kansas City', stadium: 'Arrowhead Stadium', country: 'Estados Unidos', countryCode: 'USA', capacity: '76,416 personas', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80' }
 ],

 ranking: [
 { pos: 1, code: 'AR', name: 'Argentina', conf: 'CONMEBOL', rank: 1, titles: 3, dt: 'Scaloni' },
 { pos: 2, code: 'FR', name: 'Francia', conf: 'UEFA', rank: 2, titles: 2, dt: 'Deschamps' },
 { pos: 3, code: 'BR', name: 'Brasil', conf: 'CONMEBOL', rank: 3, titles: 5, dt: 'Dorival Júnior' },
 { pos: 4, code: 'GB', name: 'Inglaterra', conf: 'UEFA', rank: 4, titles: 1, dt: 'Southgate' },
 { pos: 5, code: 'BE', name: 'Bélgica', conf: 'UEFA', rank: 5, titles: 0, dt: 'Tedesco' },
 { pos: 6, code: 'PT', name: 'Portugal', conf: 'UEFA', rank: 6, titles: 0, dt: 'Martínez' },
 { pos: 7, code: 'NL', name: 'Países Bajos', conf: 'UEFA', rank: 7, titles: 0, dt: 'Koeman' },
 { pos: 8, code: 'ES', name: 'España', conf: 'UEFA', rank: 8, titles: 1, dt: 'Fuente' },
 { pos: 9, code: 'IT', name: 'Italia', conf: 'UEFA', rank: 9, titles: 4, dt: 'Spalletti' },
 { pos: 10, code: 'CO', name: 'Colombia', conf: 'CONMEBOL', rank: 10, titles: 0, dt: 'Lorenzo' },
 { pos: 10, code: 'HR', name: 'Croacia', conf: 'UEFA', rank: 10, titles: 0, dt: 'Dalić' },
 { pos: 11, code: 'DE', name: 'Alemania', conf: 'UEFA', rank: 11, titles: 4, dt: 'Nagelsmann' },
 { pos: 12, code: 'MX', name: 'México', conf: 'CONCACAF', rank: 12, titles: 0, dt: 'Aguirre' },
 { pos: 13, code: 'US', name: 'Estados Unidos', conf: 'CONCACAF', rank: 13, titles: 0, dt: 'Pochettino' },
 { pos: 14, code: 'UY', name: 'Uruguay', conf: 'CONMEBOL', rank: 14, titles: 2, dt: 'Bielsa' },
 { pos: 15, code: 'JP', name: 'Japón', conf: 'AFC', rank: 15, titles: 0, dt: 'Moriyasu' },
 { pos: 16, code: 'MA', name: 'Marruecos', conf: 'CAF', rank: 16, titles: 0, dt: 'Regragui' }
 ],

 ods: [
 {
 id: 'ods1',
 number: '13',
 title: 'Acción por el Clima',
 desc: 'Compromiso de huella de carbono neutral con estadios operados 100% por energía renovable y redes de transporte electrificado.',
 stat: '-50% Emisiones CO₂'
 },
 {
 id: 'ods2',
 number: '08',
 title: 'Trabajo Decente y Crecimiento',
 desc: 'Generación de más de 180,000 empleos directos e indirectos durante la preparación y desarrollo del torneo.',
 stat: '+180k Empleos'
 },
 {
 id: 'ods3',
 number: '12',
 title: 'Consumo Responsable',
 desc: 'Programa de cero desperdicios plásticos de un solo uso y reciclaje integral de residuos en todas las sedes oficial de la FIFA.',
 stat: '100% Reciclaje'
 },
 {
 id: 'ods4',
 number: '10',
 title: 'Reducción de Desigualdades',
 desc: 'Garantía de accesibilidad total para personas con movilidad reducida y entradas subsidiadas para comunidades locales.',
 stat: 'Acceso Inclusivo'
 },
 {
 id: 'ods5',
 number: '17',
 title: 'Alianzas para los Objetivos',
 desc: 'Cooperación trinacional inédita entre Canadá, Estados Unidos y México para infraestructura sostenible.',
 stat: '3 Naciones Unidas'
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
 return parsed.data;
 } else {
 console.log(`[Cache EXPIRED] Expiró la caché para '${cacheKey}'. Consultando servidor...`);
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

 // Store in LocalStorage with timestamp
 const cacheObject = {
 timestamp: Date.now(),
 data: data
 };
 localStorage.setItem(cacheKey, JSON.stringify(cacheObject));
 console.log(`[Cache STORED] Guardado en localStorage para '${cacheKey}'`);

 return data;

 } catch (error) {
 console.warn(`[Fetch API Fallback] No se pudo conectar a Render API (${endpoint}). Usando mock data estructurado:`, error.message);
 
 // Map mock fallback
 let fallbackKey = cacheKey.replace('fifa_2026_', '').replace('fifa_', '').replace('_data', '');
 if (fallbackKey === 'news') fallbackKey = 'news';
 if (fallbackKey === 'matches') fallbackKey = 'matches';
 if (fallbackKey === 'standings' || fallbackKey === 'clasificacion') fallbackKey = 'standings';
 if (fallbackKey === 'ranking') fallbackKey = 'ranking';
 if (fallbackKey === 'tournaments' || fallbackKey === 'torneos') fallbackKey = 'tournaments';
 
 const fallbackData = MOCK_DATA[fallbackKey] || MOCK_DATA.tournaments || [];
 
 // Save fallback to cache temporarily
 localStorage.setItem(cacheKey, JSON.stringify({
 timestamp: Date.now(),
 data: fallbackData
 }));

 return fallbackData;
 }
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
 * Fetch detailed match by ID using LocalStorage strategy with 15 minutes TTL check
 * @param {string} id - Match ID
 * @param {boolean} forceRefresh - If true, bypasses valid cache to force network request
 */
export async function getMatchById(id = 'm1', forceRefresh = false) {
 const cacheKey = `fifa_match_detail_${id}`;
 const cachedItem = localStorage.getItem(cacheKey);

 if (cachedItem && !forceRefresh) {
 try {
 const parsed = JSON.parse(cachedItem);
 const now = Date.now();
 const age = now - parsed.timestamp;

 if (age < CACHE_TTL_MS) {
 console.log(`[Cache HIT] Cargando '${cacheKey}' desde localStorage (Edad: ${Math.round(age / 1000)}s)`);
 return parsed.data;
 }
 } catch (e) {
 console.warn(`[Cache Error] Error al leer localStorage para '${cacheKey}':`, e);
 localStorage.removeItem(cacheKey);
 }
 }

 // Network Fetch attempt
 try {
 const response = await fetch(`${API_BASE_URL}partidos/${id}`, {
 headers: { 'Accept': 'application/json' }
 });

 if (response.ok) {
 const data = await response.json();
 const cacheObject = { timestamp: Date.now(), data };
 localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
 console.log(`[Cache STORED] Guardado en localStorage para '${cacheKey}'`);
 return data;
 }
 } catch (error) {
 console.warn(`[Fetch API Fallback] No se pudo obtener detalle del partido ${id} de API:`, error.message);
 }

 // Fallback match details
 let detail = MATCH_DETAILS_MOCK[id];
 if (!detail) {
 const matchesList = await FIFA_API.getMatches();
 const basicMatch = matchesList.find(m => m.id === id) || matchesList[0];
 detail = {
 ...MATCH_DETAILS_MOCK['m1'],
 id: basicMatch.id || id,
 city: basicMatch.city,
 stadium: basicMatch.stadium || 'Estadio FIFA',
 status: basicMatch.status,
 round: basicMatch.round || 'Fase de Grupos',
 group: basicMatch.group || 'Grupo A',
 team1: basicMatch.team1,
 team2: basicMatch.team2,
 datetime: basicMatch.datetime
 };
 if (basicMatch.status === 'Programado') {
 detail.timeline = [];
 detail.stats = null;
 detail.lineups = null; // Triggers unavailable message
 }
 }

 localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: detail }));
 return detail;
}

// Public API Methods
export const FIFA_API = {
 getNews: (forceRefresh = false) => fetchWithCache('news', 'fifa_news_data', forceRefresh),
 getMatches: (forceRefresh = false) => fetchWithCache('partidos', 'fifa_matches_data', forceRefresh),
 getMatchById: (id, forceRefresh = false) => getMatchById(id, forceRefresh),
 getStandings: (forceRefresh = false) => fetchWithCache('clasificacion', 'fifa_standings_data', forceRefresh),
 getRanking: (forceRefresh = false) => fetchWithCache('ranking', 'fifa_ranking_data', forceRefresh),
 getEvents: () => fetchWithCache('events', 'fifa_2026_events'),
 getTournaments: (forceRefresh = false) => fetchWithCache('torneos', 'fifa_tournaments_data', forceRefresh),
 getTeams: () => fetchWithCache('teams', 'fifa_2026_teams'),
 getCities: () => fetchWithCache('cities', 'fifa_2026_cities'),
 getODS: () => fetchWithCache('ods', 'fifa_2026_ods')
};


