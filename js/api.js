const ProductAPI = {
  cachedProducts: null,
  loadError: false,

  async getProducts() {
    if (this.cachedProducts) {
      return this.cachedProducts;
    }

    try {
      this.loadError = false;
      const response = await fetch(SITE_CONFIG.dataPath);
      if (!response.ok) {
        throw new Error(`Data fetch failed: ${response.status}`);
      }
      const rawData = await response.json();

      if (!Array.isArray(rawData)) {
        throw new Error("Invalid format: product data root must be an array.");
      }

      this.cachedProducts = this.validateAndFilterProducts(rawData);
      return this.cachedProducts;
    } catch (err) {
      console.error("[ProductAPI Error]", err);
      this.loadError = true;
      return [];
    }
  },

  async getProductById(id) {
    const products = await this.getProducts();
    if (!id) return null;
    const cleanId = String(id).trim().replace(/^#/, "");
    return products.find(p => p.id === cleanId) || null;
  },

  async getCategories() {
    const products = await this.getProducts();
    const categories = new Set();
    products.forEach(p => {
      if (p.category && typeof p.category === "string" && p.category.trim().length > 0) {
        categories.add(p.category.trim());
      }
    });
    return Array.from(categories).sort();
  },

  validateAndFilterProducts(products) {
    const seenIds = new Set();
    const codeRegex = new RegExp(`^\\d{${SITE_CONFIG.productCodeLength}}$`);
    const validProducts = [];

    products.forEach((item, index) => {
      if (!item || typeof item !== "object") {
        console.warn(`[Data Warning] Item at index ${index} is not a valid object.`);
        return;
      }

      const stringId = String(item.id || "").trim();

      if (!stringId || !codeRegex.test(stringId)) {
        console.warn(`[Data Warning] Product "${item.name || 'Unnamed'}" rejected: invalid ${SITE_CONFIG.productCodeLength}-digit code:`, item.id);
        return;
      }

      if (seenIds.has(stringId)) {
        console.error(`[Data Integrity Error] Duplicate product code rejected: "${stringId}". Ignoring duplicate.`);
        return;
      }

      if (!item.name || typeof item.name !== "string" || item.name.trim().length === 0) {
        console.warn(`[Data Warning] Product ID "${stringId}" rejected: missing required "name".`);
        return;
      }

      seenIds.add(stringId);
      validProducts.push(item);
    });

    return validProducts;
  }
};
