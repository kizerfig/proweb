/* ==========================================
   FIFA WORLD CUP 2026 - NAVBAR & MOBILE MENU
   js/navbar.js
   ========================================== */

export function initNavbar() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-dropdown-toggle), .nav-dropdown-link');
  const dropdown = document.querySelector('.nav-dropdown');
  const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
  const dropdownMenu = document.querySelector('.nav-dropdown-menu');

  if (!menuToggle || !mainNav) return;

  function closeMenu() {
    menuToggle.classList.remove('active');
    mainNav.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    closeDropdown();
  }

  function openMenu() {
    menuToggle.classList.add('active');
    mainNav.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function toggleMenu() {
    if (menuToggle.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function closeDropdown() {
    if (!dropdown || !dropdownToggle || !dropdownMenu) return;
    dropdown.classList.remove('open');
    dropdownToggle.setAttribute('aria-expanded', 'false');
    dropdownMenu.hidden = true;
  }

  function openDropdown() {
    if (!dropdown || !dropdownToggle || !dropdownMenu) return;
    dropdown.classList.add('open');
    dropdownToggle.setAttribute('aria-expanded', 'true');
    dropdownMenu.hidden = false;
  }

  function toggleDropdown() {
    if (!dropdown || !dropdownMenu) return;
    if (dropdown.classList.contains('open')) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  dropdownToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 767) {
        closeMenu();
      }
      closeDropdown();
    });
  });

  document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }

    if (dropdown && !dropdown.contains(e.target)) {
      closeDropdown();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      closeMenu();
    }
  });

  closeDropdown();
}
