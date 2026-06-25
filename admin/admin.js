import { db } from "../firebase-config.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const loginScreen = document.getElementById("loginScreen");
const adminPanel = document.getElementById("adminPanel");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

const form = document.getElementById("productForm");
const list = document.getElementById("productList");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const editIdInput = document.getElementById("editId");
const nameInput = document.getElementById("productName");
const categoryInput = document.getElementById("productCategory");
const priceInput = document.getElementById("productPrice");
const imageInput = document.getElementById("productImageUrl");

const ADMIN_USER = "caldirangazino";
const ADMIN_PASS = "caldiran2026";

if (localStorage.getItem("adminLoggedIn") === "true") {
  showAdminPanel();
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    localStorage.setItem("adminLoggedIn", "true");
    showAdminPanel();
  } else {
    alert("Kullanıcı adı veya şifre hatalı.");
  }
});

logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("adminLoggedIn");
  loginScreen.style.display = "block";
  adminPanel.style.display = "none";
});

function showAdminPanel() {
  loginScreen.style.display = "none";
  adminPanel.style.display = "block";
  loadProducts();
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = editIdInput.value;
  const name = nameInput.value.trim();
  const category = categoryInput.value;
  const price = priceInput.value.trim();
  const image =
    imageInput.value.trim() ||
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800";

  if (!name || !category || !price) {
    alert("Lütfen tüm alanları doldur.");
    return;
  }

  saveBtn.disabled = true;
  saveBtn.innerText = id ? "Güncelleniyor..." : "Kaydediliyor...";

  try {
    const productData = {
      name: name,
      category: category,
      price: price + " ₺",
      image: image,
      updatedAt: serverTimestamp()
    };

    if (id) {
      await updateDoc(doc(db, "products", id), productData);
      alert("Ürün güncellendi.");
    } else {
      productData.createdAt = serverTimestamp();
      await addDoc(collection(db, "products"), productData);
      alert("Ürün eklendi.");
    }

    resetForm();
    await loadProducts();

  } catch (error) {
    alert("Firebase hatası: " + error.message);
    console.error(error);
  }

  saveBtn.disabled = false;
  saveBtn.innerText = "Kaydet";
});

cancelBtn.addEventListener("click", function () {
  resetForm();
});

async function loadProducts() {
  list.innerHTML = "Ürünler yükleniyor...";

  try {
    const snapshot = await getDocs(collection(db, "products"));

    list.innerHTML = "";

    if (snapshot.empty) {
      list.innerHTML = "Henüz ürün eklenmedi.";
      return;
    }

    snapshot.forEach(function (docItem) {
      const product = docItem.data();
      const id = docItem.id;

      list.innerHTML += `
        <div class="admin-product">
          <img 
            src="${product.image}" 
            alt="${product.name}"
            onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800';"
          >

          <div class="admin-product-content">
            <div class="admin-product-info">
              <h3>${product.name}</h3>
              <p>${getCategoryName(product.category)}</p>
              <p>${product.price}</p>
            </div>

            <div class="admin-actions">
              <div class="edit-btn" data-id="${id}">
                Düzenle
              </div>

              <div class="delete-btn" data-id="${id}">
                Sil
              </div>
            </div>
          </div>
        </div>
      `;
    });

    document.querySelectorAll(".edit-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        editProduct(btn.dataset.id);
      });
    });

    document.querySelectorAll(".delete-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        deleteProduct(btn.dataset.id);
      });
    });

  } catch (error) {
    list.innerHTML = "Ürünler yüklenemedi.";
    alert("Listeleme hatası: " + error.message);
  }
}

async function editProduct(id) {
  try {
    const snapshot = await getDocs(collection(db, "products"));

    snapshot.forEach(function (docItem) {
      if (docItem.id === id) {
        const product = docItem.data();

        editIdInput.value = id;
        nameInput.value = product.name;
        categoryInput.value = product.category;
        priceInput.value = product.price.replace(" ₺", "");
        imageInput.value = product.image;

        saveBtn.innerText = "Güncelle";

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    });

  } catch (error) {
    alert("Ürün düzenleme hatası: " + error.message);
  }
}

async function deleteProduct(id) {
  const confirmDelete = confirm("Bu ürünü silmek istediğine emin misin?");

  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "products", id));
    alert("Ürün silindi.");
    await loadProducts();

  } catch (error) {
    alert("Silme hatası: " + error.message);
  }
}

function resetForm() {
  form.reset();
  editIdInput.value = "";
  saveBtn.innerText = "Kaydet";
  saveBtn.disabled = false;
}

function getCategoryName(category) {
  const categories = {
    sicak: "Sıcak İçecekler",
    soguk: "Soğuk İçecekler",
    tatli: "Tatlılar",
    yiyecek: "Yiyecekler"
  };

  return categories[category] || category;
} 