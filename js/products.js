const apiURL = 'https://fakestoreapi.com/products';
const container = document.getElementById('productsContainer');
const productShowcase = document.getElementById('productShowcase');
const filterProducts = document.getElementById('filter');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');


const productNameElement = document.getElementById('productName');
const productCategoryElement = document.getElementById('productCategory');
const productPriceElement = document.getElementById('productPrice');
const productRatingElement = document.getElementById('productRating');
const productDescriptionElement = document.getElementById('productDescription');
const productImageElement = document.getElementById('productImage');

const usernameElement = document.getElementById('username');


let allProducts = [];

async function fetchProducts() {
  const res = await fetch(apiURL);
  const data = await res.json();
  allProducts = data;
  renderProducts(allProducts);
  populateCategories(data);
}

function renderProducts(products) {
  container.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p class="price">$${product.price}</p>
      <p>${product.category}</p>
    `;
    card.addEventListener('click',() => {getProduct(product.id)})
    container.appendChild(card);
  });
}

function populateCategories(products) {
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.title.toLowerCase().includes(term)
  );
  renderProducts(filtered);
});

categoryFilter.addEventListener('change', () => {
  const category = categoryFilter.value;
  const filtered = category === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === category);
  renderProducts(filtered);
});

fetchProducts();



async function getProduct(id = 0) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const data = await res.json();
  switchPages();
  loadProduct(data);
}

function switchPages(toProduct = true) {
  if (toProduct) {
    productShowcase.classList.remove('d-none');
    container.classList.add('d-none');
    filterProducts.classList.add('d-none');
  }
  else {
    filterProducts.classList.remove('d-none');
    container.classList.remove('d-none');
    productShowcase.classList.add('d-none');
  }
}

function loadProduct(data) {
  productNameElement.textContent = data.title;
  productPriceElement.textContent = '$' + data.price;
  productCategoryElement.textContent = data.category;
  productDescriptionElement.textContent = data.description;
  productImageElement.setAttribute('src',data.image);
  const addToCartBtn = document.querySelector('#productShowcase .btn-success');

  addToCartBtn.addEventListener('click', () => {
      addToCart(data.id); // Call the function from cart.js
  });
}

function loadName(){
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const username = user.username;
  usernameElement.textContent = username;
}

loadName();