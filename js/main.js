document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initGalleryFilters();
  initSmoothScroll();
});

/**
 * 1. Inicialización de animaciones al hacer scroll (AOS)
 */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }
}

/**
 * 2. Filtrado de galería por categorías (Hoteles, Gastronomía, Contenido)
 */
function initGalleryFilters() {
  const filterButtons = document.querySelectorAll('.project-tags .tag-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

  if (!filterButtons.length || !galleryItems.length) return;

  let selectionRequest = 0;

  const preloadCategoryImages = async (category) => {
    const images = Array.from(galleryItems)
      .filter((item) => item.dataset.category === category)
      .map((item) => item.querySelector('img'))
      .filter(Boolean);

    await Promise.all(images.map(async (img) => {
      img.loading = 'eager';

      try {
        await img.decode();
      } catch (error) {
        console.error(`No se pudo cargar una imagen de la categoría "${category}".`, error);
      }
    }));
  };

  filterButtons.forEach((button) => {
    const selectedCategory = button.getAttribute('data-filter');
    const preloadImages = () => {
      void preloadCategoryImages(selectedCategory);
    };

    button.addEventListener('mouseover', preloadImages);
    button.addEventListener('focus', preloadImages);

    button.addEventListener('click', async () => {
      const request = ++selectionRequest;
      await preloadCategoryImages(selectedCategory);
      if (request !== selectionRequest) return;

      // Actualizar botón activo y accesibilidad
      filterButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Filtrar elementos de la galería
      galleryItems.forEach((item) => {
        const matches = item.getAttribute('data-category') === selectedCategory;
        item.classList.toggle('is-hidden', !matches);
      });

      // Recalcular posiciones de AOS al cambiar la altura de la sección
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    });
  });
}

/**
 * 3. Desplazamiento suave para enlaces internos (#inicio, etc.)
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}