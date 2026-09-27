document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("search-clear");
  const categoriesContainer = document.getElementById("category-container");
  const productGrid = document.getElementById("product-grid");
  const productCount = document.getElementById("product-count");

  const allProducts = await ProductAPI.getProducts();

  if (ProductAPI.loadError) {
    productGrid.innerHTML = Components.renderEmpty("The product catalog could not be loaded. Please try again later.");
    return;
  }

  const categories = await ProductAPI.getCategories();

  const urlParams = new URLSearchParams(window.location.search);
  let activeSearch = urlParams.get("search") || "";
  let activeCategory = urlParams.get("category") || "";

  if (searchInput && activeSearch) {
    searchInput.value = activeSearch;
    clearBtn.style.display = "block";
  }

  function updateUrlParams() {
    const params = new URLSearchParams();
    if (activeSearch.trim()) params.set("search", activeSearch.trim());
    if (activeCategory.trim()) params.set("category", activeCategory.trim());

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }

  function syncAndRender() {
    const filtered = SearchEngine.filter(allProducts, activeSearch, activeCategory);

    if (productCount) {
      productCount.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"}`;
    }

    if (filtered.length === 0) {
      productGrid.innerHTML = Components.renderEmpty("No matching products found.");
    } else {
      productGrid.innerHTML = filtered.map(Components.renderProductCard).join("");
    }

    if (categoriesContainer) {
      categoriesContainer.innerHTML = Components.renderCategoryButtons(categories, activeCategory);
    }
  }

  syncAndRender();

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeSearch = e.target.value;
      clearBtn.style.display = activeSearch.length > 0 ? "block" : "none";
      updateUrlParams();
      syncAndRender();
    });

    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      activeSearch = "";
      clearBtn.style.display = "none";
      updateUrlParams();
      syncAndRender();
      searchInput.focus();
    });
  }

  if (categoriesContainer) {
    categoriesContainer.addEventListener("click", (e) => {
      if (e.target.matches(".category-btn")) {
        activeCategory = e.target.getAttribute("data-category") || "";
        updateUrlParams();
        syncAndRender();
      }
    });
  }

  window.addEventListener("popstate", () => {
    const stateParams = new URLSearchParams(window.location.search);
    activeSearch = stateParams.get("search") || "";
    activeCategory = stateParams.get("category") || "";
    if (searchInput) {
      searchInput.value = activeSearch;
      clearBtn.style.display = activeSearch.length > 0 ? "block" : "none";
    }
    syncAndRender();
  });
});
