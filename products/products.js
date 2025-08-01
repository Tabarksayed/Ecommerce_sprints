const apiURL = 'https://fakestoreapi.com/products';
const container = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
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
