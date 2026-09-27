const Components = {
  renderProductCard(product) {
    const safeName = Utils.escapeHTML(product.name);
    const safeCategory = (product.category && product.category.trim()) ? Utils.escapeHTML(product.category.trim()) : "";
    const safeCode = Utils.escapeHTML(product.id);
    const priceText = product.price ? Utils.formatPrice(product.price, product.currency) : "";
    const hasImage = Array.isArray(product.images) && product.images.length > 0 && product.images[0];
    const primaryImg = hasImage ? Utils.sanitizeURL(product.images[0]) : "";

    const imageHtml = primaryImg
      ? `<img 
          class="product-image" 
          src="${primaryImg}" 
          alt="${safeName}" 
          loading="lazy"
          width="400"
          height="400"
          onerror="Utils.handleImgError(this)"
        />`
      : Utils.getNeutralPlaceholder();

    return `
      <article class="product-card">
        <div class="product-image-container">
          ${imageHtml}
        </div>
        <div class="product-info">
          ${safeCategory ? `<span class="product-category-tag">${safeCategory}</span>` : ""}
          <h2 class="product-title" title="${safeName}">${safeName}</h2>
          <div class="product-meta-row">
            ${priceText ? `<span class="product-price">${priceText}</span>` : `<span class="product-meta-placeholder"></span>`}
            <span class="product-code-badge">#${safeCode}</span>
          </div>
          <a href="product.html?id=${encodeURIComponent(product.id)}" class="cta-button product-card-action">
            View Product
          </a>
        </div>
      </article>
    `;
  },

  renderEmpty(msg = "No products found.") {
    return `
      <div class="state-container">
        <p class="state-message">${Utils.escapeHTML(msg)}</p>
      </div>
    `;
  },

  renderCategoryButtons(categories, activeCategory = "") {
    let html = `<button type="button" class="category-btn ${activeCategory === "" ? "active" : ""}" data-category="">All Products</button>`;
    categories.forEach(cat => {
      const activeClass = activeCategory.toLowerCase() === cat.toLowerCase() ? "active" : "";
      html += `<button type="button" class="category-btn ${activeClass}" data-category="${Utils.escapeHTML(cat)}">${Utils.escapeHTML(cat)}</button>`;
    });
    return html;
  }
};
