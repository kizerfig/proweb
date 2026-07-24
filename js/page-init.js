/* js/page-init.js - páginas estáticas con layout */
import { initLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page) initLayout(page);
});
