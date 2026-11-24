document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initGalleryFilters();
  initGalleryLightbox();
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

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Actualizar botón activo y accesibilidad
      filterButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Filtrar elementos de la galería
      const selectedCategory = button.getAttribute('data-filter');

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
 * 3. Visor de imágenes (Lightbox) para las fotos de la galería
 */
function initGalleryLightbox() {
  const galleryLinks = document.querySelectorAll('.gallery-grid .gallery-item');
  if (!galleryLinks.length) return;

  // Crear el modal dinámicamente una sola vez
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Vista ampliada de imagen');
  lightbox.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Cerrar imagen">&times;</button>
    <img class="lightbox-img" src="" alt="">
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  galleryLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const imgInside = link.querySelector('img');
      lightboxImg.src = link.getAttribute('href');
      lightboxImg.alt = imgInside ? imgInside.alt : 'Imagen de proyecto';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

/**
 * 4. Desplazamiento suave para enlaces internos (#inicio, etc.)
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