export function initHeroSlider() {
  const container = document.querySelector('.hero-slider-container');
  if (!container) return;

  const slides = container.querySelectorAll('.hero-slide');
  const dots = container.querySelectorAll('.dot');
  const prevBtn = container.querySelector('.slider-arrow.prev');
  const nextBtn = container.querySelector('.slider-arrow.next');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoPlayTimer = null;
  const INTERVAL_TIME = 5000;

  function showSlide(index) {
    if (index >= slides.length) currentIndex = 0;
    else if (index < 0) currentIndex = slides.length - 1;
    else currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoPlayTimer = setInterval(nextSlide, INTERVAL_TIME);
  }

  function stopAutoplay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoplay();
    });
  });
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
      startAutoplay();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
      startAutoplay();
    }
  }
  startAutoplay();
}
