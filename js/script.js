const products = [
  { name: "Wireless Headphones", price: 59.99, category: "Electronics", image: "Images/headphones.jpg" },
  { name: "Smartwatch Pro", price: 129.00, category: "Electronics", image: "Images/Smartwatch_Pro.avif" },
  { name: "Running Shoes", price: 75.50, category: "Fashion", image: "Images/Running_Shoes.webp" },
  { name: "Leather Backpack", price: 89.90, category: "Accessories", image: "Images/Leather_Backpack.jpg" },
  { name: "Bluetooth Speaker", price: 45.00, category: "Electronics", image: "Images/Bluetooth_Speaker.jpg" },
  { name: "Sunglasses Classic", price: 29.99, category: "Accessories", image: "Images/Sunglasses_Classic.jpg" },
  { name: "Casual T-Shirt", price: 19.95, category: "Fashion", image: "Images/Casual_T-Shirt.jpg" },
  { name: "Office Chair", price: 149.00, category: "Furniture", image: "Images/Office_Chair.webp" },
  { name: "Coffee Maker", price: 99.00, category: "Home Appliances", image: "Images/Coffee_Maker.webp" }
];

const grid = document.getElementById("productGrid");
const cartIcon = document.getElementById("cart-icon");
const cartPopup = document.getElementById("cart-popup");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

const authArea = document.getElementById("auth-area");
const userArea = document.getElementById("user-area");
const welcomeText = document.getElementById("welcome-text");
const logoutBtn = document.getElementById("logout-btn");

const searchType = document.getElementById("search-type");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

let cart = [];

// --- Produkte rendern ---
function renderProducts(productList) {
  grid.innerHTML = "";
  productList.forEach((product, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">€${product.price.toFixed(2)}</p>
      <p>${product.category}</p>
      <i class="fa-solid fa-heart"></i>
      <button class="btn" data-index="${index}">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}
renderProducts(products);

// --- Add to Cart ---
document.addEventListener("click", (e) => {
  if(e.target.classList.contains("btn") && e.target.hasAttribute("data-index")) {
    if(!localStorage.getItem('currentUser') && !sessionStorage.getItem('currentUser')) {
      alert("Please log in first to purchase products!!");
      window.location.href = "login.html";
      return;
    }
    const index = e.target.getAttribute("data-index");
    addToCart(products[index]);
  }
});

function addToCart(product) {
  cart.push(product);
  updateCart();
}

// function updateCart() {
//   cartItems.innerHTML = "";
//   let total = 0;
//   cart.forEach(item => {
//     const li = document.createElement("li");
//     li.textContent = `${item.name} - €${item.price.toFixed(2)}`;
//     cartItems.appendChild(li);
//     total += item.price;
//   });
//   cartCount.textContent = cart.length;
//   cartTotal.textContent = "€" + total.toFixed(2);
// }
// eeeeeeeeeeeeeeee-------------
cartItems.addEventListener("click", (e) => {
  const index = e.target.getAttribute("data-index");
  if (e.target.classList.contains("increase")) {
    cart[index].quantity++;
  } else if (e.target.classList.contains("decrease")) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1); // remove item
    }
  }
  updateCart();
});



// eeeeeeee--------------------
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="item-info">
        <strong>${item.name}</strong><br>
        Price: €${item.price.toFixed(2)}
      </div>
      <div class="quantity-controls">
        <button class="decrease" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="increase" data-index="${index}">+</button>
      </div>
    `;
    cartItems.appendChild(li);

    total += item.price * item.quantity;
  });

  cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
  cartTotal.textContent = "€" + total.toFixed(2);
}
// eeeeeeeeeeeeeeeeee-------------------------------
cartIcon.addEventListener("click", () => {
  cartPopup.style.display = cartPopup.style.display === "block" ? "none" : "block";
});

// --- Suche ---
function searchProducts() {
  const type = searchType.value;
  const query = searchInput.value.toLowerCase().trim();
  const filtered = products.filter(product => {
    if(type === "name") return product.name.toLowerCase().includes(query);
    if(type === "category") return product.category.toLowerCase().includes(query);
  });
  renderProducts(filtered);
}
searchButton.addEventListener("click", searchProducts);
searchInput.addEventListener("input", searchProducts);

// --- Auth ---
function checkLogin() {
  let currentUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  if(currentUser) {
    currentUser = JSON.parse(currentUser);
    showUser(currentUser);
  } else {
    showAuth();
  }
}

function showUser(user) {
  authArea.style.display = "none";
  userArea.style.display = "flex";
  welcomeText.textContent = `Hallo, ${user.firstname} ${user.lastname}`;
  document.getElementById("cart-icon").style.display = "flex";
}

function showAuth() {
  authArea.style.display = "flex";
  userArea.style.display = "none";
  document.getElementById("cart-icon").style.display = "none";
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  sessionStorage.removeItem("currentUser");
  showAuth();
});

checkLogin();
