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

      <!-- Transparency & Affiliate Disclaimer -->
      <section class="product-disclaimer-card" aria-label="Transparency &amp; Affiliate Disclaimer">
        <h2 class="product-disclaimer-title">Transparency &amp; Affiliate Disclaimer</h2>
        <div class="product-disclaimer-body">
          <p>PromoSphere is an affiliate-based product discovery platform. We may earn a commission when you visit a third-party marketplace through an affiliate link and complete a qualifying purchase, at no additional cost to you.</p>
          <p>Our goal is to present products and information honestly and transparently. We do not knowingly make false claims, conceal material information, or intentionally mislead visitors.</p>
          <p><strong>Product information:</strong> Product names, descriptions, specifications, features, seller information, availability, shipping details, and other information may come from or be provided by third-party marketplaces and sellers. Such information may change over time, and we cannot independently guarantee its accuracy, quality, authenticity, safety, legality, suitability, or availability.</p>
          <p><strong>Images:</strong> Images displayed on PromoSphere are provided for product discovery and illustration. Images may originate from or represent a particular third-party listing and may not always correspond exactly to the product, variant, color, size, packaging, seller, or version available when you visit the marketplace. Different sellers or listings may use similar or identical images while offering different products or variations. Please verify the actual product images, description, specifications, seller, and selected variant on the marketplace before purchasing.</p>
          <p><strong>Links:</strong> Some affiliate links may open a marketplace homepage, search/results page, category page, collection, or a page containing the featured product and/or similar products rather than the exact listing originally viewed on PromoSphere. We do not guarantee that the exact featured product will be available, displayed first, or offered under the same conditions when you visit the marketplace.</p>
          <p><strong>Third-party responsibility:</strong> PromoSphere does not manufacture, stock, inspect, package, ship, or directly sell products offered through third-party marketplaces unless explicitly stated otherwise. The actual purchase is made through the relevant third-party marketplace or seller and is subject to its terms, policies, and conditions.</p>
          <p>We do not knowingly intend to promote prohibited, fraudulent, counterfeit, unsafe, or otherwise inappropriate products. However, because we do not control third-party marketplaces or every product listing, we cannot guarantee that every external listing will remain unchanged or that every detail will always be accurate. If we become aware of an error, misleading information, or an inappropriate listing, we may review, correct, or remove it where reasonably possible.</p>
          <p>Before making a purchase, please independently review the current marketplace listing, product images, specifications, seller information, selected variant, reviews, shipping information, return/refund policy, warranty information, and other relevant details.</p>
          <p>By following an external link, you acknowledge that the third-party marketplace or seller controls the final listing and transaction.</p>
          <p>If you notice an inaccurate, misleading, inappropriate, or materially changed product listing on PromoSphere, please contact us so that we can review it.</p>
        </div>
      </section>
    `;
  }
});
