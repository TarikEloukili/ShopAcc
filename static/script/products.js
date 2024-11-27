const games = [
    {
        id: 1,
        title: 'CALL of DUTY',
        image: 'https://images.unsplash.com/photo-1602673221577-0b56d7ce446b?w=800&q=80',
        level: 30,
        price: 150,
        detailsUrl: 'productDetails1'
    },
    {
        id: 2,
        title: 'Destiny 2',
        image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80',
        level: 30,
        price: 150
    },
    {
        id: 3,
        title: 'League of Legends',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
        level: 30,
        price: 150,
        detailsUrl: 'productDetails3'
    },
    {
        id: 4,
        title: 'Genshin Impact',
        image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
        level: 30,
        price: 150
    },
    {
        id: 5,
        title: 'Minecraft',
        image: 'https://images.unsplash.com/photo-1587573089734-599c5e6aacd7?w=800&q=80',
        level: 30,
        price: 150,
        detailsUrl: 'productDetails2'
    },
    {
        id: 6,
        title: 'Roblox',
        image: 'https://images.unsplash.com/photo-1616499370260-485b3e5ed653?w=800&q=80',
        level: 30,
        price: 150
    }
];

const ITEMS_PER_PAGE = 6;
let currentPage = 1;

function createProductCard(game) {
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${game.image}" alt="${game.title}">
                <div class="product-overlay">
                    <div class="action-buttons">
                        <button class="action-button" title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="action-button" title="Add to Wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                        ${game.detailsUrl ? `
                            <a href="${game.detailsUrl}" class="action-button" title="View Details">
                                <i class="fas fa-search"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${game.title}</h3>
                <div class="product-details">
                    <span class="product-level">Level: ${game.level}</span>
                    <span class="product-price">$${game.price}</span>
                </div>
            </div>
        </div>
    `;
}

function displayProducts() {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const productsToShow = games.slice(startIndex, endIndex);
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = productsToShow.map(createProductCard).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(games.length / ITEMS_PER_PAGE);
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement('span');
        pageNumber.classList.add('page-number');
        if (i === currentPage) pageNumber.classList.add('active');
        pageNumber.textContent = i;
        pageNumber.addEventListener('click', () => {
            currentPage = i;
            displayProducts();
            updatePagination();
        });
        pageNumbers.appendChild(pageNumber);
    }
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayProducts();
        updatePagination();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(games.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        displayProducts();
        updatePagination();
    }
});

// Initialize the display
displayProducts();
updatePagination();

// Add hover effects for action buttons
document.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('action-button')) {
        e.target.style.transform = 'scale(1.1)';
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('action-button')) {
        e.target.style.transform = 'scale(1)';
    }
});