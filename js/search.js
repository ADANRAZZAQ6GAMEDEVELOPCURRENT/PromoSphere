const SearchEngine = {
  normalizeInput(term) {
    if (!term) return "";
    return term.trim();
  },

  isProductCode(term) {
    const clean = this.normalizeInput(term).replace(/^#/, "");
    return new RegExp(`^\\d{${SITE_CONFIG.productCodeLength}}$`).test(clean);
  },

  filter(products, query = "", category = "") {
    const rawQuery = this.normalizeInput(query);
    const normalizedCategory = category.trim().toLowerCase();

    return products.filter(product => {
      // 1. Category Filter
      if (normalizedCategory) {
        if (!product.category || product.category.trim().toLowerCase() !== normalizedCategory) {
          return false;
        }
      }

      // 2. Query Search
      if (!rawQuery) {
        return true;
      }

      // Mode A: Exact 6-Digit Product Code Search
      if (this.isProductCode(rawQuery)) {
        const targetCode = rawQuery.replace(/^#/, "");
        return String(product.id) === targetCode;
      }

      // Mode B: Partial multi-word Name Search
      const searchTerms = rawQuery.toLowerCase().split(/\s+/).filter(Boolean);
      const productName = (product.name || "").toLowerCase();

      return searchTerms.every(term => productName.includes(term));
    });
  }
};
