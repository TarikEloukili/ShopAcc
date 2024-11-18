const openNav = document.querySelector(".open-btn");
const closeNav = document.querySelector(".close-btn");
const menu = document.querySelector(".nav-list");

openNav.addEventListener("click", () => {
  menu.classList.add("show");
});

closeNav.addEventListener("click", () => {
  menu.classList.remove("show");
});

// Fixed Nav
const navBar = document.querySelector(".nav");
const navHeight = navBar.getBoundingClientRect().height;
window.addEventListener("scroll", () => {
  const scrollHeight = window.pageYOffset;
  if (scrollHeight > navHeight) {
    navBar.classList.add("fix-nav");
  } else {
    navBar.classList.remove("fix-nav");
  }
});

// Scroll To
const links = [...document.querySelectorAll(".scroll-link")];
links.map((link) => {
  if (!link) return;
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const id = e.target.getAttribute("href").slice(1);

    const element = document.getElementById(id);
    const fixNav = navBar.classList.contains("fix-nav");
    let position = element.offsetTop - navHeight;

    window.scrollTo({
      top: position,
      left: 0,
    });

    navBar.classList.remove("show");
    menu.classList.remove("show");
    document.body.classList.remove("show");
  });
});


//Products

document.addEventListener('DOMContentLoaded', () => {
  const products = document.querySelectorAll('.product');

  products.forEach(product => {
    product.addEventListener('click', (e) => {
      if (e.target.classList.contains('product-link') || e.target.closest('.product-link')) {
        const productId = product.getAttribute('data-id');
        const productDetails = {
          id: productId,
          name: product.querySelector('.bottom a').textContent,
          price: product.querySelector('.price span').textContent,
          image: product.querySelector('.img-container img').src
        };
        localStorage.setItem('selectedProduct', JSON.stringify(productDetails));
      }
    });
  });
});