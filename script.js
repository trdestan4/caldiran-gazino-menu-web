import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const menuData = {
  sicak: [],
  soguk: [],
  tatli: [],
  yiyecek: []
};

async function loadMenuProducts() {
  try {
    const snapshot = await getDocs(collection(db, "products"));

    if (snapshot.empty) {
      showEmptyMessage();
      return;
    }

    snapshot.forEach(function (docItem) {
      const product = docItem.data();

      if (menuData[product.category]) {
        menuData[product.category].push(product);
      }
    });

    renderProducts("sicak");
    renderProducts("soguk");
    renderProducts("tatli");
    renderProducts("yiyecek");

  } catch (error) {
    console.error(error);
    alert("Menü yüklenirken hata oluştu.");
  }
}

function createCard(product) {
  return `
    <div class="card">
      <img src="${product.image}" alt="${product.name}">

      <div class="card-body">
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
      </div>
    </div>
  `;
}

function renderProducts(category) {
  const container = document.querySelector(`#${category} .products`);

  container.innerHTML = "";

  if (menuData[category].length === 0) {
    container.innerHTML = `
      <p style="color:#D8CCB5;">Bu kategoride ürün bulunmuyor.</p>
    `;
    return;
  }

  menuData[category].forEach(function (product) {
    container.innerHTML += createCard(product);
  });
}

function showEmptyMessage() {
  renderProducts("sicak");
  renderProducts("soguk");
  renderProducts("tatli");
  renderProducts("yiyecek");
}

loadMenuProducts();