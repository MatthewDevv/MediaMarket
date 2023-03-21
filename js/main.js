window.onload = () => {
  let currentProducts = products;
  let categories = new Set();
  let basket = [];
  let addToBasketBtns;
  const productsSection = document.querySelector(".products");

  const renderProducts = (items) => {
    productsSection.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
      let el = items[i];
      const newProduct = document.createElement("div");
      newProduct.className = `product-item ${el.sale ? "on-sale" : ""}`;
      newProduct.innerHTML = `
        <img src="${el.image}" alt="product-image" />
          <p class="product-name">${el.name}</p>
          <p class="product-desc">
            ${el.description}
          </p>
          <div class="product-price">
            <span class="price">${el.price.toFixed(2)}</span>
            <span class="price-sale">${(el.price - el.saleAmount).toFixed(
              2
            )}</span>
          </div>
          <button data-id="${
            el.id
          }" class="product-add-to-basket-btn">Dodaj do koszyka</button>
          <p class="product-item-sale-info">Promocja</p>`;
      productsSection.appendChild(newProduct);
    }
    addToBasketBtns = document.querySelectorAll(".product-add-to-basket-btn");
    addToBasketBtns.forEach(
      (btn) =>
        (btn.onclick = (e) => {
          const selectedId = parseInt(e.target.dataset.id);
          const key = currentProducts.findIndex(
            (product) => product.id === selectedId
          );

          basket.push(currentProducts.at(key));
          const basketTotal = basket.reduce((sum, product) => {
            return (sum +=
              product.price - (product.saleAmount ? product.saleAmount : 0));
          }, 0);

          basketAmount.innerHTML = `${basketTotal.toFixed(2)} zł `;
          basketTotal > 0
            ? basketClear.classList.add("active")
            : basketClear.classList.remove("active");
        })
    );
  };

  const renderCategories = (items) => {
    const categoriesItems = document.querySelector(".categories-items");

    items.forEach((element) => categories.add(element.category));

    // Set to Array
    categories = ["Wszystko", ...categories];
    categories.forEach((category, index) => {
      const newCategory = document.createElement("button");
      newCategory.innerHTML = category;
      newCategory.dataset.category = category; // data-category
      index == 0 ? newCategory.classList.add("active") : "";
      categoriesItems.appendChild(newCategory);
    });
  };

  renderProducts(currentProducts);
  renderCategories(currentProducts);

  // Categories Listeners start
  const categoriesButtons = document.querySelectorAll(
    ".categories-items button"
  );

  categoriesButtons.forEach(
    (btn) =>
      (btn.onclick = (e) => {
        categoriesButtons.forEach((btn) => btn.classList.remove("active"));
        e.target.classList.add("active");
        const category = e.target.dataset.category;
        currentProducts = products;

        if (category === "Wszystko") currentProducts = products;
        else {
          currentProducts = currentProducts.filter(
            (product) => product.category === category
          );
        }
        renderProducts(currentProducts);
      })
  );
  // Categories Listeners end

  // Searching start
  const noResults = document.querySelector(".no-results");
  const searchBarInput = document.querySelector(".search-bar-input");

  searchBarInput.addEventListener("input", (e) => {
    const search = e.target.value;
    const foundedProducts = currentProducts.filter((product) => {
      if (product.name.toLowerCase().includes(search.toLowerCase()))
        return product;
    });

    foundedProducts.length === 0
      ? noResults.classList.add("active")
      : noResults.classList.remove("active");
    renderProducts(foundedProducts);
  });
  // Searching end

  // Basket start
  const basketAmount = document.querySelector(".basket-amount");
  const basketClear = document.querySelector(".basket-clear");

  basketClear.onclick = () => {
    basketAmount.innerHTML = "Koszyk";
    basketClear.classList.remove("active");
    basket = [];
  };

  // Basket end
};
