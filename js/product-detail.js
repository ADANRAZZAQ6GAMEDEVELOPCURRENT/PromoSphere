document.addEventListener("DOMContentLoaded", async () => {
  const detailContainer = document.getElementById("product-detail-container");
  if (!detailContainer) return;

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
    document.title = `${item.name} | ${typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.siteName : 'PromoSphere'}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", item.description && item.description.trim() ? item.description.trim() : item.name);
    }

    const safeName = Utils.escapeHTML(item.name);
    const safeDesc = (item.description && item.description.trim()) ? Utils.escapeHTML(item.description.trim()) : "";
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
          ${safeDesc ? `<p class="detail-description">${safeDesc}</p>` : ""}

          <div class="detail-btn-action">
            ${ctaHtml}
          </div>
        </div>
      </article>

      <!-- Affiliate & Transparency Disclaimer -->
      <section class="product-disclaimer-card" aria-label="Affiliate &amp; Transparency Disclaimer">
        <h2 class="product-disclaimer-title">Affiliate &amp; Transparency Disclaimer</h2>
        <div class="product-disclaimer-body">
          <p>PromoSphere may participate in affiliate programs. When you click a product link and make a qualifying purchase, PromoSphere may receive a commission at no additional cost to you.</p>
          <p>Product availability, descriptions, and other details are managed and controlled by the respective third-party seller or retailer and may change at any time without notice.</p>
        </div>
      </section>
    `;
  }
});
