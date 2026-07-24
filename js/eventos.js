/* js/eventos.js */
import { FIFA_API } from './api.js';
import { initLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout('eventos');
  loadEvents();
});

async function loadEvents() {
  const container = document.getElementById('events-container');
  if (!container) return;

  try {
    const eventsList = await FIFA_API.getEvents();
    if (!Array.isArray(eventsList) || eventsList.length === 0) {
      container.innerHTML = `<p class="empty-message">No hay eventos disponibles.</p>`;
      return;
    }

    container.innerHTML = eventsList.map(event => `
      <div class="event-card">
        <div class="event-top">
          <span class="org-tag">${event.org}</span>
          <span class="status-badge ${event.status === 'Próximo' ? 'live' : 'scheduled'}">${event.status}</span>
        </div>
        <h3 class="event-title">${event.title}</h3>
        <div class="event-details">
          <span>${event.date}</span>
          <span>${event.location}</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error cargando eventos:', error);
  }
}
