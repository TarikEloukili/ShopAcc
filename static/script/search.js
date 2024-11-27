document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const products = document.querySelectorAll('.product');
        
        products.forEach(product => {
            const title = product.querySelector('.bottom a').textContent.toLowerCase();
            const details = product.querySelector('.bottom .price span').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || details.includes(searchTerm)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
});