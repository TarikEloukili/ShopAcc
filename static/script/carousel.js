document.addEventListener('DOMContentLoaded', function() {
    const swiper = new Swiper('.slider-1', {
      // Enable loop mode
      loop: true,
      
      // Enable autoplay
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      
      // Transition effect
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev',
      },
      
      // Pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      
      // Additional features
      grabCursor: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      
      // Transition speed
      speed: 1000,
      
      // Responsive breakpoints
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 1,
        },
        1024: {
          slidesPerView: 1,
        },
      },
    });
  });