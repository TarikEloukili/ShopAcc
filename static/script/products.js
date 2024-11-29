// Search functionality
const searchInput = document.querySelector('.search-input');
const productCards = document.querySelectorAll('.product-card');

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  
  productCards.forEach(card => {
    const title = card.querySelector('.product-title').textContent.toLowerCase();
    if (title.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const productCard = e.target.closest('.product-card');
    const productTitle = productCard.querySelector('.product-title').textContent;
    
    // Add animation
    button.classList.add('added');
    setTimeout(() => button.classList.remove('added'), 1500);
    
    // Here you can add the actual cart functionality
    console.log(`Added ${productTitle} to cart`);
  });
});

// Favorite functionality
const favoriteButtons = document.querySelectorAll('.favorite-button');

favoriteButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    button.classList.toggle('active');
  });
});