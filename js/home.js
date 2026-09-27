document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("search-clear");
  const searchForm = document.getElementById("search-form");
  const categoriesContainer = document.getElementById("category-container");
  const productGrid = document.getElementById("product-grid");

  const allProducts = await ProductAPI.getProducts();

  if (ProductAPI.loadError) {
    productGrid.innerHTML = Components.renderEmpty("The product catalog could not be loaded. Please try again later.");
    return;
  }

  const categories = await ProductAPI.getCategories();

  if (categoriesContainer) {
    categoriesContainer.innerHTML = Components.renderCategoryButtons(categories);
    categoriesContainer.addEventListener("click", (e) => {
      if (e.target.matches(".category-btn")) {
        const selected = e.target.getAttribute("data-category");
        window.location.href = selected ? `products.html?category=${encodeURIComponent(selected)}` : `products.html`;
      }
    });
  }

  function renderInitialShowcase() {
    const limit = SITE_CONFIG.homepageProductLimit || 10;
    const displayProducts = allProducts.slice(0, limit);
    if (displayProducts.length === 0) {
      productGrid.innerHTML = Components.renderEmpty();
    } else {
      productGrid.innerHTML = displayProducts.map(Components.renderProductCard).join("");
    }
  }

  renderInitialShowcase();

  function handleHomeSearch() {
    const val = searchInput.value.trim();
    if (!val) {
      renderInitialShowcase();
      return;
    }
    const filtered = SearchEngine.filter(allProducts, val);
    if (filtered.length === 0) {
      productGrid.innerHTML = Components.renderEmpty(`No products matching "${val}"`);
    } else {
      productGrid.innerHTML = filtered.map(Components.renderProductCard).join("");
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearBtn.style.display = e.target.value.length > 0 ? "block" : "none";
      handleHomeSearch();
    });

    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearBtn.style.display = "none";
      renderInitialShowcase();
      searchInput.focus();
    });

    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const term = searchInput.value.trim();
        if (term) {
          window.location.href = `products.html?search=${encodeURIComponent(term)}`;
        }
      });
    }
  }
});
