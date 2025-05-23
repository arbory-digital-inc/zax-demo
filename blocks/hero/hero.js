import {
    createVideo,
    throttle,
    useContentMeta,
  } from '../../scripts/utils.js';
  
  const SCROLL_FACTOR = 0.5;
  const THROTTLE_DELAY = 16; // ~60fps
  const CAROUSEL_INTERVAL = 5000; // 5 seconds between slides
  
  /**
   * Displays an error message in the hero block when video decoration fails
   * @param {HTMLElement} block - The hero block element
   * @param {string} [errMessage] - Optional custom error message
   */
  function decorateVideoError(block, errMessage = null) {
    const message = errMessage ?? 'Problem rendering video, please check the authored link.';
    const error = document.createElement('div');
    error.className = 'video-error-message';
    error.innerHTML = `<strong>Hero Error:</strong> ${message}`;
    block.prepend(error);
  }
  
  /**
   * Decorates the hero block with a video background
   * @param {HTMLElement} block - The hero block element
   */
  function decorateBackgroundVideo(block) {
    try {
      const bg = block.querySelector(':scope > div');
      const link = bg?.querySelector('a');
      if (!link) return;
      const videoEl = createVideo(link.href, (e) => decorateVideoError(block, e.target.error));
      videoEl.className = 'video-bg';
      block.prepend(videoEl);
    } catch {
      decorateVideoError(block);
    }
  }
  
  /**
   * Decorates the hero block with appropriate background (video, image, or color)
   * @param {HTMLElement} block - The hero block element
   */
  function decorateBackground(block) {
    const bg = block.querySelector(':scope > div');
    if (!bg) return;
    const pic = bg.querySelector('picture');
    const fixed = block.classList.contains('fixed-bg');
    if (bg.querySelector('a')?.href.endsWith('.mp4')) {
      decorateBackgroundVideo(block);
    } else if (pic && !fixed) {
      pic.classList.add('img-bg');
      block.prepend(pic);
    } else {
      const bgValue = pic ? `url(${pic.querySelector('img')?.src})` : bg.textContent;
      if (bgValue) block.style.setProperty('--hero-background', bgValue);
    }
    bg.remove();
  }
  
  /**
   * Applies custom column widths to child elements based on class names
   * @param {HTMLElement} block - The hero block element
   */
  function decorateCustomColumns(block) {
    const customCols = block.className.split(' ').find((cls) => cls.includes('columns'));
    if (!customCols) return;
    const cols = customCols.split('-').slice(1);
    const children = [...block.firstElementChild?.children || []];
    children.forEach((child, index) => {
      if (cols[index]) {
        child.classList.add('custom-col');
        child.style.setProperty('--custom-col-width', `${cols[index]}%`);
      }
    });
  }
  
  /**
   * Creates a throttled scroll handler for parallax effect
   * @param {HTMLElement} block - The hero block element
   * @returns {Function|null} Throttled scroll handler or null if block has no children
   */
  function parallaxHandler(block) {
    if (!block.firstChild) return null;
    return throttle(() => {
      const offset = window.scrollY * SCROLL_FACTOR;
      block.firstChild.style.inset = `calc(1px - ${offset}px) 50%`;
    }, THROTTLE_DELAY);
  }
  
  /**
   * Sets up parallax scrolling effect for the hero block
   * @param {HTMLElement} block - The hero block element
   */
  function decorateBackgroundParallax(block) {
    if (!block.classList.contains('parallax')) return;
    const handler = parallaxHandler(block);
    if (handler) window.addEventListener('scroll', handler, { passive: true });
  }
  
  /**
   * Creates carousel structure for the hero-carousel variant
   * @param {HTMLElement} block - The hero block element
   */
  function decorateCarousel(block) {
    if (!block.classList.contains('hero-carousel')) return;
    
    // Create slides container
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'slides-container';
    
    // Get all the image containers (divs that contain pictures)
    // We need to check if these pictures are wrapped in links
    const imageContainers = Array.from(block.querySelectorAll(':scope > div > div'));
    
    // Filter to only those that contain pictures
    const slideContainers = imageContainers.filter(container => 
      container.querySelector('picture') !== null
    );
    
    if (slideContainers.length < 2) return; // Need at least 2 images for a carousel
    
    // Create slides from the containers
    slideContainers.forEach((container, index) => {
      const slide = document.createElement('div');
      slide.className = `slide ${index === 0 ? 'active' : ''}`;
      
      // Check if the picture is wrapped in a link
      const picture = container.querySelector('picture');
      const link = container.querySelector('a');
      
      if (link && link.contains(picture)) {
        // If the picture is inside a link, preserve the link
        slide.appendChild(link.cloneNode(true));
        
        // Add cursor pointer to indicate it's clickable
        slide.style.cursor = 'pointer';
      } else if (picture) {
        // Otherwise just move the picture
        slide.appendChild(picture.cloneNode(true));
      }
      
      slidesContainer.appendChild(slide);
    });
    
    // Save any content wrapper
    const contentWrapper = block.querySelector('.content-wrapper');
    
    // Clear the block and add the new structure
    block.innerHTML = '';
    block.appendChild(slidesContainer);
    
    // Add content wrapper back if it exists
    if (contentWrapper) {
      block.appendChild(contentWrapper);
    }
    
    // Add carousel controls
    addCarouselControls(block, slideContainers.length);
    
    // Set up autoplay
    setupCarouselAutoplay(block);
    
    // Add swipe support
    addCarouselSwipeSupport(block);
  }
  
  /**
   * Adds navigation controls to the carousel
   * @param {HTMLElement} block - The hero block element
   * @param {number} slideCount - Number of slides in the carousel
   */
  function addCarouselControls(block, slideCount) {
    // Create indicators
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    
    for (let i = 0; i < slideCount; i++) {
      const indicator = document.createElement('button');
      indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
      indicator.dataset.slide = i;
      if (i === 0) indicator.classList.add('active');
      
      indicator.addEventListener('click', () => {
        goToCarouselSlide(block, i);
      });
      
      indicators.appendChild(indicator);
    }
    
    // Create prev/next buttons
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    
    const prevButton = document.createElement('button');
    prevButton.setAttribute('aria-label', 'Previous slide');
    prevButton.classList.add('prev');
    prevButton.innerHTML = '<img src="/icons/chevron-rounded-left-red.svg" alt="Previous">';
    prevButton.addEventListener('click', () => {
      goToPrevCarouselSlide(block);
    });
    
    const nextButton = document.createElement('button');
    nextButton.setAttribute('aria-label', 'Next slide');
    nextButton.classList.add('next');
    nextButton.innerHTML = '<img src="/icons/chevron-rounded-right-red.svg" alt="Next">';
    nextButton.addEventListener('click', () => {
      goToNextCarouselSlide(block);
    });
    
    controls.appendChild(prevButton);
    controls.appendChild(nextButton);
    
    // Add controls to block
    block.appendChild(indicators);
    block.appendChild(controls);
  }
  
  /**
   * Gets the current active slide index
   * @param {HTMLElement} block - The hero block element
   * @returns {number} The index of the active slide
   */
  function getCurrentCarouselSlideIndex(block) {
    const activeSlide = block.querySelector('.slide.active');
    const slides = Array.from(block.querySelectorAll('.slide'));
    return slides.indexOf(activeSlide);
  }
  
  /**
   * Navigate to a specific carousel slide
   * @param {HTMLElement} block - The hero block element
   * @param {number} index - The index of the slide to go to
   */
  function goToCarouselSlide(block, index) {
    const slides = block.querySelectorAll('.slide');
    const indicators = block.querySelectorAll('.carousel-indicators button');
    
    // Validate index
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    // Update slides
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    
    // Update indicators
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
    
    // Reset autoplay timer
    resetCarouselAutoplay(block);
  }
  
  /**
   * Navigate to the next carousel slide
   * @param {HTMLElement} block - The hero block element
   */
  function goToNextCarouselSlide(block) {
    const currentIndex = getCurrentCarouselSlideIndex(block);
    const nextIndex = currentIndex + 1;
    goToCarouselSlide(block, nextIndex);
  }
  
  /**
   * Navigate to the previous carousel slide
   * @param {HTMLElement} block - The hero block element
   */
  function goToPrevCarouselSlide(block) {
    const currentIndex = getCurrentCarouselSlideIndex(block);
    const prevIndex = currentIndex - 1;
    goToCarouselSlide(block, prevIndex);
  }
  
  /**
   * Sets up autoplay for the carousel
   * @param {HTMLElement} block - The hero block element
   */
  function setupCarouselAutoplay(block) {
    // Store interval ID on the block element
    block.autoplayInterval = setInterval(() => {
      goToNextCarouselSlide(block);
    }, CAROUSEL_INTERVAL);
    
    // Pause on hover
    block.addEventListener('mouseenter', () => {
      clearInterval(block.autoplayInterval);
    });
    
    // Resume on mouse leave
    block.addEventListener('mouseleave', () => {
      resetCarouselAutoplay(block);
    });
  }
  
  /**
   * Resets the autoplay timer
   * @param {HTMLElement} block - The hero block element
   */
  function resetCarouselAutoplay(block) {
    if (block.autoplayInterval) {
      clearInterval(block.autoplayInterval);
    }
    
    block.autoplayInterval = setInterval(() => {
      goToNextCarouselSlide(block);
    }, CAROUSEL_INTERVAL);
  }
  
  /**
   * Adds swipe gesture support for touch devices
   * @param {HTMLElement} block - The hero block element
   */
  function addCarouselSwipeSupport(block) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    block.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    block.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleCarouselSwipe();
    }, { passive: true });
    
    function handleCarouselSwipe() {
      const swipeThreshold = 50; // Minimum distance for a swipe
      
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left, go to next slide
        goToNextCarouselSlide(block);
      }
      
      if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right, go to previous slide
        goToPrevCarouselSlide(block);
      }
    }
  }

  /**
   * Main decoration function that orchestrates all hero block enhancements
   * @param {HTMLElement} block - The hero block element
   */
  export default async function decorate(block) {
    if (!block) return;
    
    // Check if this is a carousel variant
    if (block.classList.contains('hero-carousel')) {
      decorateCarousel(block);
    } else {
      // Standard hero decoration
      if (block.children.length > 1) decorateBackground(block);
      const content = block.querySelector(':scope > div');
      if (content) content.className = 'content-wrapper';
      decorateBackgroundParallax(block);
      decorateCustomColumns(block);
    }
    
    useContentMeta(block);
  }
  