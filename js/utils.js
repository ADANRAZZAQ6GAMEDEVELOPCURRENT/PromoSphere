const Utils = {
  escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  sanitizeURL(url) {
    if (!url || typeof url !== "string") return "";
    try {
      const parsed = new URL(url.trim());
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.href;
      }
    } catch (e) {
      return "";
    }
    return "";
  },

  formatPrice(price, currency = "USD") {
    if (!price || isNaN(price)) return "";
    return `${currency === "USD" ? "$" : currency + " "}${parseFloat(price).toFixed(2)}`;
  },

  getNeutralPlaceholder() {
    return `
      <div class="img-fallback" aria-hidden="true">
        <svg class="img-fallback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <path d="M21 15l-5-5L5 21"></path>
        </svg>
      </div>
    `;
  },

  handleImgError(imgElement) {
    if (!imgElement || !imgElement.parentElement) return;
    const parent = imgElement.parentElement;
    parent.innerHTML = Utils.getNeutralPlaceholder();
  }
};
