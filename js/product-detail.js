document.addEventListener("DOMContentLoaded", async () => {
  const detailContainer = document.getElementById("product-detail-container");
  const urlParams = new URLSearchParams(window.location.search);
  const rawId = urlParams.get("id");

  if (!rawId) {
    renderNotFound("No product specified.");
    return;
  }

  const cleanId = String(rawId).trim().replace(/^#/, "");
  const product = await ProductAPI.getProductById(cleanId);

  if (ProductAPI.loadError) {
    detailContainer.innerHTML = Components.renderEmpty("Unable to load product data. Please try again later.");
    return;
  }

  if (!product) {
    renderNotFound(`Product code "${Utils.escapeHTML(cleanId)}" was not found in the catalog.`);
    return;
  }

  renderDetails(product);

  function renderNotFound(msg) {
    detailContainer.innerHTML = `
      <div class="state-container detail-state-wrap">
        <p class="state-message">${msg}</p>
        <a href="products.html" class="nav-link detail-state-action">Browse Catalog</a>
      </div>
    `;
  }

  function renderDetails(item) {
    document.title = `${item.name} | ${SITE_CONFIG.siteName}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", item.description && item.description.trim() ? item.description.trim() : `${item.name} on ${SITE_CONFIG.siteName}`);
    }

    const safeName = Utils.escapeHTML(item.name);
    const safeDesc = (item.description && item.description.trim()) ? Utils.escapeHTML(item.description.trim()) : "";
    const safePrice = item.price ? Utils.formatPrice(item.price, item.currency) : "";
    const safeCategory = (item.category && item.category.trim()) ? Utils.escapeHTML(item.category.trim()) : "";
    const safeAffiliateUrl = Utils.sanitizeURL(item.affiliateUrl);
    const hasImage = Array.isArray(item.images) && item.images.length > 0 && item.images[0];
    const primaryImg = hasImage ? Utils.sanitizeURL(item.images[0]) : "";

    const imageHtml = primaryImg
      ? `<img 
          src="${primaryImg}" 
          alt="${safeName}" 
          class="detail-main-img" 
          loading="eager"
          width="600"
          height="600"
          onerror="Utils.handleImgError(this)"
        />`
      : Utils.getNeutralPlaceholder();

    let specsHtml = "";
    if (Array.isArray(item.specifications) && item.specifications.length > 0) {
      const rows = item.specifications
        .filter(s => s && s.label && s.value && String(s.label).trim() && String(s.value).trim())
        .map(s => `<tr><td>${Utils.escapeHTML(s.label)}</td><td>${Utils.escapeHTML(s.value)}</td></tr>`)
        .join("");
      if (rows) {
        specsHtml = `
          <h2 class="spec-heading">Specifications</h2>
          <table class="spec-table"><tbody>${rows}</tbody></table>
        `;
      }
    }

    const ctaHtml = safeAffiliateUrl
      ? `<a 
          href="${safeAffiliateUrl}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="cta-button cta-primary"
        >
          View Product
        </a>`
      : `<button type="button" class="cta-button disabled-cta" disabled>
          Product link unavailable
        </button>`;

    detailContainer.innerHTML = `
      <article class="product-detail-layout">
        <div class="detail-gallery">
          <div class="detail-main-img-box">
            ${imageHtml}
          </div>
        </div>

        <div class="detail-meta-box">
          <span class="detail-code">Product Code: #${Utils.escapeHTML(item.id)}</span>
          ${safeCategory ? `<span class="product-category-tag">${safeCategory}</span>` : ""}
          <h1 class="detail-title">${safeName}</h1>
          ${safePrice ? `<div class="detail-price">${safePrice}</div>` : ""}
          ${safeDesc ? `<p class="detail-description">${safeDesc}</p>` : ""}
          ${specsHtml}
          
          <div class="detail-btn-action">
            ${ctaHtml}
          </div>
        </div>
      </article>
    `;
  }
});
