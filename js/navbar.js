/* ==========================================
   FIFA WORLD CUP 2026 - NAVBAR & MOBILE MENU MODULE
   js/navbar.js
   ========================================== */

export function initNavbar() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const subLinks = document.querySelectorAll('.sub-link');

  // Enforce Brand Logo click redirecting to index.html
  const brandLogos = document.querySelectorAll('.brand-logo, .navbar-brand');
  brandLogos.forEach(logo => {
    logo.setAttribute('href', 'index.html');
  });

  // Highlight Active Sub-link based on current pathname
  highlightActiveSubLink(subLinks);

  if (!menuToggle || !mainNav) return;

  function toggleMenu() {
    const isExpanded = menuToggle.classList.contains('active');
    
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    menuToggle.classList.add('active');
    mainNav.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling when mobile menu is open
  }

  function closeMenu() {
    menuToggle.classList.remove('active');
    mainNav.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking on any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 767) {
        closeMenu();
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Reset menu state on window resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      closeMenu();
    }
  });
}

/**
 * Automatically sets '.active' class on sub-header links matching the current page
 */
function highlightActiveSubLink(subLinks) {
  if (!subLinks || subLinks.length === 0) return;

  const currentPath = window.location.pathname.toLowerCase();

  subLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const hrefClean = href.toLowerCase();

    if (currentPath.endsWith(hrefClean) || (hrefClean !== '#' && currentPath.includes(hrefClean.replace('.html', '')))) {
      link.classList.add('active');
    }
  });
}
