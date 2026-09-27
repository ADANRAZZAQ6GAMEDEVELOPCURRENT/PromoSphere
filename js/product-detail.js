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

          <!-- Price & Availability Notice -->
          <div class="product-notice-box" role="note">
            <h3 class="product-notice-title">Price &amp; Availability Notice</h3>
            <p class="product-notice-text">Prices, discounts, promotions, shipping costs, taxes, availability, and other purchasing conditions shown on PromoSphere are subject to change at any time without notice.</p>
            <p class="product-notice-text">The price and purchasing conditions displayed on the linked retailer or marketplace at the time of purchase are the applicable ones. Please verify the current price and other details on the retailer's product page before completing your purchase.</p>
          </div>

          <div class="detail-btn-action">
            ${ctaHtml}
          </div>
        </div>
      </article>

      <!-- Affiliate & Transparency Disclaimer -->
      <section class="product-disclaimer-card" aria-label="Affiliate &amp; Transparency Disclaimer">
        <h2 class="product-disclaimer-title">Affiliate &amp; Transparency Disclaimer</h2>
        <div class="product-disclaimer-body">
          <p>PromoSphere may participate in affiliate programs, including programs operated by third-party marketplaces and retailers. When you click a product link and make a qualifying purchase, PromoSphere may receive a commission at no additional cost to you.</p>
          <p>We aim to present products and information honestly and transparently. However, product availability, specifications, descriptions, images, reviews, seller information, shipping terms, warranties, return policies, and other details are provided or controlled by the respective third-party seller or marketplace and may change without notice.</p>
          <p>We do not manufacture, stock, inspect, ship, sell, or directly control the products listed through affiliate links unless explicitly stated otherwise. We therefore cannot independently guarantee the condition, quality, authenticity, safety, legality, suitability, availability, delivery, or performance of any third-party product.</p>
          <p>Information displayed on PromoSphere is provided for general informational and discovery purposes. We do not knowingly intend to misrepresent a product or conceal material information. If we become aware that information is inaccurate, outdated, misleading, or otherwise inappropriate, we may correct or remove it where reasonably possible.</p>
          <p>Before purchasing, please review the product's current listing, specifications, seller information, applicable terms, reviews, shipping details, return/refund policy, warranty information, and any other relevant information provided by the actual seller or marketplace.</p>
          <p>By proceeding to a third-party website or purchasing through an affiliate link, you acknowledge that the transaction is with the respective third party and is subject to that party's terms and policies.</p>
          <p>If you notice an error, misleading information, or another issue with a product listing on PromoSphere, please let us know so we can review it and make corrections where appropriate.</p>
        </div>
      </section>
    `;
  }
});
