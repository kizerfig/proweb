/* ==========================================
   FIFA WORLD CUP 2026 - IDENTITY & BRAND MODULE
   js/identity.js
   ========================================== */

import { initNavbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('FIFA World Cup 2026 - Identidad y Marca Initialized');

  // 1. Initialize Navbar logic
  initNavbar();

  // 2. Smooth Scroll handling for hash navigation
  handleHashScroll();
});

window.addEventListener('hashchange', handleHashScroll);

function handleHashScroll() {
  const hash = window.location.hash;
  if (hash) {
    const targetElement = document.querySelector(hash);
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }
}
