export default class ProductDetail extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // lets create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.mql = window.matchMedia('(max-width: 700px)');
    this.app = window.app;
    this.utils = this.app.utils;
    this.quantity = this.utils.number.parseInteger(this.getAttribute('quantity'));
    this.inCart = this.utils.number.parseInteger(this.getAttribute('in-cart'));
    this.price = this.utils.number.parse(this.getAttribute('current-price'));
    this.lastPrice = this.utils.number.parse(this.getAttribute('previous-price'));
    this.totalReviews = this.utils.number.parseInteger(this.getAttribute('reviews'));
    this.averageReview = this.utils.number.parse(this.getAttribute('average-review'));
    this.storeCountry = this.getAttribute('store-country');
    this.userCountry = this.getCountryCode();
    this.render();
  }

  getCountryCode = () => {
    // get country from local storage
    const country = localStorage.getItem('country');
    if (!country) return 'KE';

    // get the country code
    return country.countryCode;
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
    this.watchMql();
  }

  connectedCallback() {
    // add event listener to the wish button
    this.activateWishButton();
    // add event listener to the cart button
    this.initializeCart();
    // activate the images
    this.activateImages();
    this.setHeader(this.mql);
  }

  watchMql() {
    this.mql.addEventListener('change', () => {
      this.render();
      this.setHeader(this.mql);
    });
  }

  setHeader = mql => {
    if (mql.matches) {
      this.app.setHeader({
        sectionTitle: 'Product Detail',
        description: 'Thealcoholic T-Shirt is a high-quality, stylish t-shirt made from 100% cotton. It features a classic crew neck design and is available in a range of sizes and colors. Thealcoholic T-Shirt is perfect for casual wear or as a gift for any occasion.',
      });
    }
  }

  calculateDiscount = (current, last) => {
    if (current === last || current > last) return 0;

    // if current is less than last > calculate discount: 2 decimal places if available
    const discount = ((last - current) / last) * 100;

    // if discount is a whole number return it
    if (discount % 1 === 0) return discount;

    // if discount is not a whole number return it with 2 decimal places
    return discount.toFixed(2);
  }

  activateImages = () => {
    const mainImage = this.shadowObj.querySelector('.current-image img');
    const images = this.shadowObj.querySelectorAll('.image-options .image');

    if (mainImage && images && images.length > 0) {
      images.forEach(image => {
        image.addEventListener('click', () => {
          mainImage.src = image.querySelector('img').src;
          images.forEach(img => img.classList.remove('active'));
          image.classList.add('active');
        });
      });
    }
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `
  }

  getBody() {
    return `
      ${this.getQuickInfo()}
      ${this.getStore()}
      ${this.getRelatedProducts()}
      ${this.getFullInfo()}
    `
  }

  getQuickInfo() {
    let offer = this.calculateDiscount(this.price, this.lastPrice);
    return /* html */`
      <div class="quick-info">
        <div class="name-info">
          <div class="title">
            <h2 class="name">${this.getAttribute('name')}</h2>
            <span class="line"></span>
          </div>
          ${this.checkCountry()}
          <span class="review">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="number">${this.getAttribute('average-review')}</span>
            <span class="sp">•</span>
            <span class="people">
              <span class="no">${this.utils.number.withCommas(this.getAttribute('reviews'))}</span>
              <span class="text">${this.getReviewsPlural()}</span>
            </span>
          </span>
        </div>
        ${this.getImages()}
        <div class="details">
          <div class="top">
            <div class="price">
              ${this.getCurrentPrice()}
              <span class="line"></span>
              ${this.getWasPrice()}
              <span class="line"></span>
              <div class="save">
                <span class="percent">${offer}%</span>
                <span class="text">Off</span>
              </div>
            </div>
            ${this.getColors(this.getAttribute('colors'))}
            ${this.getSizes(this.getAttribute('sizes'))}
          </div>
          ${this.getButtons()}
        </div>
      </div>
    `
  };

  // check if store and user are within the same country
  checkCountry = () => {
    const isSameCoutry = this.storeCountry.toLowerCase() === this.userCountry.toLowerCase();

    if (isSameCoutry) {
      return /* html */`
        <span class="country-info">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Local dispatch, normal charges apply</span>
        </span>
      `;
    } else {
      return /* html */`
        <span class="country-info">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M10 9.50003L5.27531 4.47565C4.85705 4.0245 4.92403 3.69496 5.41729 3.40965C6.34454 2.8733 7.06689 2.85873 8.04428 3.39511L12.949 6.08675C13.2982 6.27836 13.6406 6.47259 14 6.57855" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.5 13.6632L14.6103 20.4697C14.7826 21.0255 15.086 21.1263 15.556 20.8568C16.4396 20.3501 16.7958 19.765 16.8197 18.7107L16.9395 13.4198C16.9555 12.7131 16.9526 12.0215 17.5 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.32846 10.9843L10.2154 9.60557L14.6377 6.38136L14.6416 6.37851L14.6491 6.37301C14.7535 6.29661 16.3094 5.16238 17.1919 4.77581C18.2765 4.30067 19.2869 4.52156 20.3739 4.82515C20.9362 4.98218 21.2173 5.06069 21.4202 5.20717C21.742 5.43958 21.9513 5.79728 21.9943 6.18852C22.0215 6.4351 21.9498 6.71459 21.8065 7.27356L21.8065 7.27358C21.5294 8.35431 21.2181 9.32819 20.2588 10.0175C19.4782 10.5784 17.7045 11.341 17.5856 11.3919L17.5771 11.3955L17.5726 11.3974L12.5317 13.5645L10.3782 14.4876L10.3782 14.4876C9.5974 14.8223 9.207 14.9896 8.94139 15.3002C8.31933 16.0275 8.23148 17.3438 7.99931 18.2494C7.87101 18.7498 7.16748 19.6171 6.54058 19.4869C6.15355 19.4065 6.14613 18.922 6.09796 18.6131L5.6342 15.6389C5.5233 14.9276 5.51479 14.9131 4.94599 14.4627L2.56757 12.5793C2.32053 12.3836 1.89903 12.135 2.022 11.7641C2.22119 11.1633 3.33408 10.9957 3.83747 11.1363C4.74834 11.3907 5.94747 11.9738 6.89684 11.8058C7.3022 11.7341 7.64428 11.4842 8.32844 10.9843L8.32846 10.9843Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Global dispatch, additional charges apply</span>
        </span>
      `;
    }
  }

  getColors = colors => {
    // if colors is not available return empty string
    if (!colors || colors === '' || colors === 'null') return '';

    // if colors is available return the colors
    try {
      // parse to json
      const colorsArray = JSON.parse(colors);

      // loop keys in the colors
      const keys = Object.keys(colorsArray);

      // loop through the keys and return the colors
      const items = keys.map((key, index) => {
        const color = colorsArray[key];
        const checked = index === 0 ? 'checked' : '';
        const outOfStock = color.quantity === 0 ? 'disabled' : '';
        return /* html */`
          <div class="color">
            <label class="label" for="${key}">
              <img src="${color.image}" alt="Color">
              <span class="name">${color.name}</span>
            </label>
            <input type="radio" name="color" id="${key}" value="${color.name}" ${checked}
             ${outOfStock}>
          </div>
        `;
      }).join('');

      return /* html */`
        <div class="colors">
          <h3 class="title">Color</h3>
          <div class="color-options">
            ${items}
          </div>
        </div>
      `;

    } catch (error) {
      return '';
    }
  }

  getSizes = sizes => {
    // if sizes is not available return empty string
    if (!sizes || sizes === '' || sizes === 'null') return '';

    // if sizes is available return the sizes
    try {
      // parse to json
      const sizesObjects = JSON.parse(sizes);

      // loop keys in the sizes
      const keys = Object.keys(sizesObjects);

      // loop through the keys and return the sizes
      const items = keys.map((key, index) => {
        const size = sizesObjects[key]
        const checked = index === 0 ? 'checked' : '';
        const out = size.quantity < 1 ? 'disabled' : '';
        return /* html */`
          <div class="size">
            <label class="label" for="${key}">
              <span class="name">${size.name}</span>
            </label>
            <input type="radio" name="size" id="${key}" value="${key}" ${checked} ${out}>
          </div>
        `;
      }).join('');

      return /* html */`
        <div class="sizes">
          <h3 class="title">Size</h3>
          <div class="size-options">
            ${items}
          </div>
        </div>
      `;

    } catch (error) {
      console.error(error);
      return '';
    }
  }

  getWasPrice = () => {
    if (this.price === this.lastPrice || this.price > this.lastPrice) return '';
    return /* html */`
      <span class="was">
        <span class="text">Was</span>
        <span class="contain">
          <span class="strike"></span>
          <span class="currency">乇</span>
          <span class="price">${this.utils.number.balanceWithCommas(this.lastPrice)}</span>
        </span>
      </span>
    `;
  }

  getCurrentPrice = () => {
    return /* html */`
      <span class="value">
        <span class="text">Price</span>
        <span class="contain">
          <span class="currency">乇</span>
          <span class="price">${this.utils.number.balanceWithCommas(this.price)}</span>
        </span>
      </span>
    `;
  }

  getImages = () => {
    const images = this.getAttribute('images');
    const mainImage = this.getAttribute('main-image');

    let htmlImages = '';
    if (images !== null && images !== '') {
      let imagesArray = images.split(",");

      // push the main image to the first index
      imagesArray.unshift(mainImage);

      imagesArray.forEach((image, index) => {
        if (index === 0) {
          htmlImages += /* html */`
            <span class="image active">
              <img src="${image}" alt="Product">
            </span>
          `
        } else {
          htmlImages += /* html */`
            <span class="image">
              <img src="${image}" alt="Product">
            </span>
          `
        }
      })
    }
    return /* html */`
      <div class="images">
        <div class="current-image">
          <img src="${mainImage}" alt="Product Image">
        </div>
        <div class="image-options">
          <div id="left-nav" class="nav">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
            </svg>
          </div>
          <div id="right-nav" class="nav">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
          <div class="images">
            ${htmlImages}
          </div>
        </div>
      </div>
    `;
  }

  getReviewsPlural() {
    if (parseInt(this.getAttribute('reviews')) === 1) {
      return ' Review'
    }
    else {
      return ' Reviews'
    }
  }

  getButtons = () => {
    const { html, class: className } = this.getAddedToCartButton(this.getAttribute('in-cart'));
    const { html: wishHtml, class: wishClass } = this.getWishedButton(this.getAttribute('wished'));
    return /* html */`
      <div class="buttons">
        <button class="button add ${className}">${html}</button>
        <button class="button buy">Buy Now</button>
        <button class="button wish ${wishClass}">${wishHtml}</button>
			</div>
    `;
  }

  getAddedToCartButton = () => {
    let added = this.inCart > 0;

    // if quantity is 0 return out of stock
    if (this.quantity === 0 || this.quantity < 1) {
      return {
        html: /* html */`
          <span class="text">Out of Stock</span>
        `,
        class: 'out'
      };
    }

    if (added) {
      return {
        html: /* html */`
          <span class="icon remove">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M20 12L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="quantity">${this.inCart}</span>
          <span class="icon add">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        `,
        class: 'added'
      };
    } else {
      return {
        html: /* html */`
          <span class="text">Add to Cart</span>
        `,
        class: ''
      };
    }
  }

  initializeCart = () => {
    const content = this.shadowObj.querySelector('.buttons > button.add');
    if (!content) return;

    // add event listener to add button
    content.addEventListener('click', e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      // if quantity is 0 return
      if (this.quantity === 0 || this.quantity < 1) return;

      // if added to cart
      if (this.quantity > 0) {
        // update the cart
        this.inCart += 1;

        // add the added button and remove the add button
        content.innerHTML = this.getAddedToCartButton(true).html;

        //add class to the button
        content.classList.add('added');

        // increment cart
        this.incrementCart(content);
        return;
      }
    }, { once: true });
  }

  incrementCart = (content) => {
    const quantity = this.quantity;

    // select plus and minus buttons
    const plusBtn = content.querySelector('.icon.add');
    const minusBtn = content.querySelector('.icon.remove');
    const quantityText = content.querySelector('.quantity');

    // add event listener to plus button
    plusBtn.addEventListener('click', e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      const current = parseInt(quantityText.textContent);
      if (current >= quantity) return;
      quantityText.textContent = current + 1;

      this.inCart += 1;
    });

    // add event listener to minus button
    minusBtn.addEventListener('click', e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      const current = parseInt(quantityText.textContent);
      if (this.inCart === 0 || current <= 1) {
        this.inCart = 0;
        // remove the added button and add add button
        content.innerHTML = this.getAddedToCartButton(false).html;

        // remove class from the button
        content.classList.remove('added');

        // activate the add button
        this.initializeCart();
        return;
      } else {
        quantityText.textContent = current - 1;
        this.inCart -= 1;
      }
    });
  }

  getWishedButton = wished => {
    wished = wished === 'true';
    if (wished) {
      return {
        html: /* html */`
          <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"  color="currentColor">
          <path d="M11.9553 3.70845L11.9997 3.7438L12.044 3.70846C12.4134 3.41639 12.9531 3.05089 13.636 2.75875C15.0217 2.16591 16.9799 1.88758 19.2119 3.08156C21.9945 4.57002 23.3601 8.13311 22.4862 11.8026C21.6023 15.5144 18.4614 19.3368 12.2626 21.6518L11.9997 21.75L11.7367 21.6518C5.53788 19.3368 2.39701 15.5144 1.51304 11.8026C0.639129 8.13311 2.00471 4.57002 4.78724 3.08155C7.01925 1.88756 8.97747 2.16591 10.3632 2.75874C11.0461 3.05088 11.5858 3.41638 11.9553 3.70845Z" fill="currentColor"></path>
          </svg>
          </div>
        `,
        class: 'wished'
      };
    } else {
      return {
        html: /* html */`
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </div>
        `,
        class: ''
      };
    }
  }

  activateWishButton = () => {
    const content = this.shadowObj.querySelector('.buttons > button.wish');
    if (!content) return;

    // add event listener to wish button
    content.addEventListener('click', e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      // if wished
      if (content.classList.contains('wished')) {
        // remove the wished button and add wish button
        content.innerHTML = this.getWishedButton('false').html;

        // remove class from the button
        content.classList.remove('wished');
        return;
      } else {
        // add the wished button and remove the wish button
        content.innerHTML = this.getWishedButton('true').html;

        //add class to the button
        content.classList.add('wished');
        return;
      }
    });
  }

  getRelatedProducts = () => {
    return /* html */`
      <div class="related-products">
        <div class="title">
          <h2 class="name">Related Products</h2>
          <span class="line"></span>
        </div>
        <div class="products">
          ${this.getProducts()}
        </div>
      </div>
    `;
  }

  getFullInfo() {
    return /* html */`
      <div class="full-info">
        ${this.getSpecs()}
        ${this.getDescription()}
        ${this.getReviews()}
      </div>
    `
  }

  getSpecs() {
    const specifications = this.getAttribute('specifications')
    if (specifications) {
      try {
        let specs = JSON.parse(specifications);
        let html = '';

        for (const key in specs) {
          if (Object.hasOwnProperty.call(specs, key)) {
            const value = specs[key];
            html += `
              <li class="list">
                <span class="key">${key}</span>
                <span class="value">${value}</span>
              </li>
            `
          }
        }

        return /* html */`
          <div class="specifications">
            <div class="title">
              <h2 class="name">Specifications</h2>
              <span class="line"></span>
            </div>
            <ul class="spec-lists">
              ${html}
            </ul>
          </div> 
        `;

      } catch (error) {
        return '';
      }
    }
    else {
      return '';
    }

  }

  getProducts = () => {
    return /* html */`
      <div is="product-wrapper" product-image="/images/product/product-8.webp" name="Fresh Tea and is a very long name" last="33.25" store="The Vines Inn" reviews="120" average-review="4.5" wished="true" in-cart="0" quantity="45" price="33.25" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/product-1.webp" name="Apple Fresh" last="25.00" store="Wendy's" reviews="85" average-review="3.8" wished="false" in-cart="2" quantity="32" price="25.00" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/product-2.webp" name="Banana Fresh" last="15.50" store="Trader Joe's" reviews="200" average-review="4.8" wished="true" in-cart="0" quantity="50" price="10.25" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/product-4.webp" name="Orange Fresh" last="20.75" store="Whole Foods" reviews="150" average-review="4.3" wished="false" in-cart="1" quantity="65" price="20.75" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/product-5.webp" name="Grapes Fresh" last="18.00" store="Safeway" reviews="6987" average-review="4.1" wished="true" in-cart="0" quantity="73" price="32.50" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/product-6.webp" name="Mango Fresh" last="22.50" store="Kroger" reviews="110" average-review="4.6" wished="false" in-cart="0" quantity="48" price="19.25" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/10.jpg" name="Strawberry Fresh" last="30.00" store="Publix" reviews="130" average-review="4.7" wished="true" in-cart="0" quantity="32" price="55.40" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/11.jpg" name="Blueberry Fresh" last="28.00" store="Albertsons" reviews="95" average-review="4.2" wished="false" in-cart="0" quantity="0" price="13.80" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/12.jpg" name="Watermelon Fresh" last="35.00" store="Sprouts" reviews="140" average-review="4.4" wished="true" in-cart="0" quantity="38" price="45.00" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/product-7.webp" name="Peach Fresh" last="27.00" store="H-E-B" reviews="105" average-review="4.3" wished="false" in-cart="0" quantity="15" price="14.25" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/14.jpg" name="Cherry Fresh" last="32.00" store="Aldi" reviews="115" average-review="3.5" wished="true" in-cart="3" quantity="44" price="19.60" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/15.jpg" name="Pomegranate Fresh" last="40.00" store="Costco" reviews="125" average-review="4.6" wished="false" in-cart="1" quantity="36" price="28.75" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/product-8.webp" name="Kiwi Fresh" last="24.00" store="Sam's Club" reviews="100" average-review="4.2" wished="true" in-cart="0" quantity="29" price="12.80" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/17.jpg" name="Papaya Fresh" last="26.00" store="Meijer" reviews="80" average-review="2.0" wished="false" in-cart="0" quantity="41" price="9.20" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/22.jpg" name="Guava Fresh" last="19.00" store="Wegmans" reviews="70" average-review="3.9" wished="true" in-cart="0" quantity="0" price="7.90" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/19.jpg" name="Lychee Fresh" last="29.00" store="Hy-Vee" reviews="60" average-review="3.1" wished="false" in-cart="0" quantity="13" price="17.30" store-country="KE"></div>
    `;
  }

  getDescription() {
    return /* html */`
      <div class="desc">
        <div class="title">
          <h2 class="name">Description</h2>
          <span class="line"></span>
        </div>

        <div class="desc-lists">
          ${this.innerHTML}
        </div>
      </div>
    `;
  }

  getStore = () => {
    return /* html */`
      <div class="store">
        <div class="left">
          <div class="image">
            <img src="${this.getAttribute('store-image')}" alt="Store">
          </div>
          <div class="name">
            <h3 class="store-name">${this.getAttribute('store-name')}</h3>
            <span class="location">${this.getAttribute('store-location')}</span>
          </div>
        </div>
        <button class="button">Visit Store</button>
      </div>
    `;
  }

  getDate(seconds) {
    const new_date = new Date((seconds * 1000));

    let formattedDate = new Intl.DateTimeFormat("en-US", {
      day: '2-digit', month: "short", year: 'numeric'
    }).format(new_date)

    return formattedDate
  }

  getReviews() {
    let distribution = this.getAttribute('reviews-distribution');
    try {
      distribution = JSON.parse(distribution);
    } catch (error) {
      console.error(error);
    }

    return /* html */`
      <div class="reviews">
        <div class="title">
          <h2 class="name">Reviews</h2>
          <span class="line"></span>
        </div>
        <div id="reviews-container" class="reviews-container">
          <div class="stats">
            ${this.reviewsStats(distribution)}
          </div>
          <div class="user-reviews">
            ${this.getReviewsItems()}
          </div>
          ${this.getPagination({ current: 17, total: 63 })}
        </div>
      </div>
    `
  }

  reviewsStats(totals) {
    const percantageAverage = (this.averageReview / 5) * 100;
    return /* html */`
      <div class="total">
        <span class="of">
          <span class="score">${this.getAttribute('average-review')}</span>
          <span class="slash"></span>
          <span class="of-total">5.0</span>
        </span>
        <span class="stars" style="width: ${percantageAverage}%;">
          ${this.getStars(5)}
        </span>
        <p class="text">${this.utils.number.withCommas(this.totalReviews)} Reviews</p>
      </div>
      <div class="individual-scores">
        <span class="score five">
        <span class="no">5</span>
        <span class="bar">
          <span class="progress" style="width: ${this.getRatingPercentage(totals.five)}%;"></span>
        </span>
      </span>
      <span class="score four">
        <span class="no">4</span>
        <span class="bar">
          <span class="progress" style="width: ${this.getRatingPercentage(totals.four)}%;"></span>
        </span>
      </span>
      <span class="score three">
        <span class="no">3</span>
        <span class="bar">
          <span class="progress" style="width: ${this.getRatingPercentage(totals.three)}%;"></span>
        </span>
      </span>
      <span class="score two">
          <span class="no">2</span>
          <span class="bar">
            <span class="progress" style="width: ${this.getRatingPercentage(totals.two)}%;"></span> 
        </span>
      </span>
      <span class="score one">
        <span class="no">1</span>
        <span class="bar">
          <span class="progress" style="width: ${this.getRatingPercentage(totals.one)}%;"></span>
        </span>
      </span>
    </div>
    `
  }

  getStars = number => {
    // if number is not a number return empty string or less than 1 or greater than 5
    if (isNaN(number) || number < 1 || number > 5) return '';

    let stars = '';
    for (let i = 0; i < number; i++) {
      stars += this.getStarIcon();
    }
    return stars;
  }

  getStarIcon = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
        <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  getRatingPercentage(no) {
    return ((no / parseFloat(this.totalReviews)) * 100).toFixed(2);
  }

  getReviewsItems = () => {
    return /* html */`
    <div is="product-review" user-name="John Smith" user-picture="https://randomuser.me/api/portraits/men/11.jpg" number="5" date="2024-11-15T00:00:00Z" verified="true">
      <p>Excellent product! Exceeded my expectations. Highly recommended.</p>
      <p>Will definitely purchase again.</p>
    </div>
    <div is="product-review" user-name="Emily Johnson" user-picture="https://randomuser.me/api/portraits/women/12.jpg" number="4" date="2024-10-20T00:00:00Z" verified="true">
      <p>Very satisfied with this product. Great quality and value for money.</p>
      <p>Would recommend to others.</p>
    </div>
    <div is="product-review" user-name="Michael Brown" user-picture="https://randomuser.me/api/portraits/men/13.jpg" number="3" date="2024-09-25T00:00:00Z" verified="true">
      <p>Good product but had some issues with delivery. Overall, happy with the purchase.</p>
      <p>May consider buying again.</p>
    </div>
    <div is="product-review" user-name="Jessica Davis" user-picture="https://randomuser.me/api/portraits/women/14.jpg" number="5" date="2024-08-30T00:00:00Z" verified="true">
      <p>Amazing product! Works perfectly and as described. Highly recommend.</p>
      <p>Will definitely buy again.</p>
    </div>
    <div is="product-review" user-name="David Wilson" user-picture="https://randomuser.me/api/portraits/men/15.jpg" number="4" date="2024-07-05T00:00:00Z" verified="true">
      <p>Very good product. Met all my expectations. Would recommend.</p>
      <p>Happy with the purchase.</p>
    </div>
    <div is="product-review" user-name="Sarah Miller" user-picture="https://randomuser.me/api/portraits/women/16.jpg" number="5" date="2024-06-10T00:00:00Z" verified="true">
      <p>Outstanding product! Great quality and performance. Highly recommend.</p>
      <p>Will buy again for sure.</p>
    </div>
    <div is="product-review" user-name="James Martinez" user-picture="https://randomuser.me/api/portraits/men/17.jpg" number="4" date="2024-05-15T00:00:00Z" verified="true">
      <p>Good product overall. Had a minor issue but customer service resolved it quickly.</p>
      <p>Would consider buying again.</p>
    </div>
    <div is="product-review" user-name="Linda Anderson" user-picture="https://randomuser.me/api/portraits/women/18.jpg" number="5" date="2024-04-20T00:00:00Z" verified="true">
      <p>Excellent quality product. Very happy with the purchase. Highly recommend.</p>
      <p>Will definitely buy again.</p>
    </div>
    <div is="product-review" user-name="Robert Thomas" user-picture="https://randomuser.me/api/portraits/men/19.jpg" number="4" date="2024-03-25T00:00:00Z" verified="true">
      <p>Very good product. Met my expectations. Would recommend to others.</p>
      <p>Happy with the purchase.</p>
    </div>
    <div is="product-review" user-name="Patricia Jackson" user-picture="https://randomuser.me/api/portraits/women/20.jpg" number="5" date="2024-02-28T00:00:00Z" verified="false">
      <p>Outstanding product! Great value for money. Highly recommend.</p>
      <p>Will buy again for sure.</p>
    </div>
    `;
  }

  getPagination = data => {
    const { current, total } = data;

    // if total is 1, return empty string
    if (total < 2) return "";

    const prev = this.createPrevNavigation(current);
    const currentPage = /*html*/`<button class="page current ${current > 99 ? "large" : ""}">${current}</button>`;
    const next = this.createNextNavigation(current, total);

    return /* html */`
      <div class="pagination">
        ${prev}
        ${currentPage}
        ${next}
      </div>
    `;
  }

  createPrevNavigation = current => {
    // if both current and total are not numbers, return empty string
    if (isNaN(current)) return "";

    /* if current page is 1, return empty string */
    if (current === 1) return "";

    /* if current page is less than 6, return 1 to 4 */
    if (current < 6) {
      let prev = "";
      for (let i = 1; i < current; i++) {
        prev += /* html */`<button class="page prev ${i > 99 ? "large" : ""}">${i}</button>`;
      }
      return /* html */`
        <div class="previous">
          ${prev}
        </div>
      `;
    }

    // anything greater than 6, return the last 3 pages and start page: 1
    if (current >= 6) {
      // loop to create the previous pages
      let prev = /* html */`<button class="page prev start">1</button>`;
      for (let i = current - 3; i < current; i++) {
        prev += /* html */`<button class="page prev ${i > 99 ? "large" : ""}">${i}</button>`;
      }

      return /* html */`
        <div class="previous">
          ${prev}
        </div>
      `;
    }
  }

  createNextNavigation = (current, total) => {
    // if both current and total are not numbers, return empty string
    if (isNaN(current) || isNaN(total)) return "";

    /* if current page is the last page, return empty string */
    if (current === total) return "";

    /* if current page is less than 6, and total is less than 6, return all pages */
    if (current < 6 && total < 6) {
      let next = "";
      for (let i = current + 1; i <= total; i++) {
        next += /* html */`<button class="page next ${i > 99 ? "large" : ""}">${i}</button>`;
      }

      // return the next pages
      return /* html */`
        <div class="nexts">
          ${next}
        </div>
      `;
    }

    /* if current page is less than 6, return after current: three after */
    if (current < 6 && (total - current) > 3) {
      let next = "";
      for (let i = current + 1; i <= current + 3; i++) {
        next += /* html */`<button class="page next ${i > 99 ? "large" : ""}">${i}</button>`;
      }

      // add last page
      next += /* html */`<button class="page next end ${total > 99 ? "large" : ""}">${total}</button>`;

      // return the next pages
      return /* html */`
        <div class="nexts">
          ${next}
        </div>
      `;
    }

    // if page is 6 or greater, and is less than the total by 3,2,1: return the last 3 pages
    if (current >= 6 && (total - current) <= 3) {
      let next = "";
      for (let i = current + 1; i <= total; i++) {
        next += /* html */`<button class="page next">${i}</button>`;
      }

      // return the next pages
      return /* html */`
        <div class="nexts">
          ${next}
        </div>
      `;
    }

    // if current page is 6 or greater, and is less the total by a value more than 3, return the next 3 pages and the last page
    if (current >= 6 && (total - current) > 3) {
      let next = "";
      for (let i = current + 1; i < current + 4; i++) {
        next += /* html */`<button class="page next ${i > 99 ? "large" : ""}">${i}</button>`;
      }

      // add the last page
      next += /* html */`<button class="page next end ${total > 99 ? "large" : ""}">${total}</button>`;

      // return the next pages
      return /* html */`
        <div class="nexts">
          ${next}
        </div>
      `;
    }
  }

  getStyles() {
    return /* css */ `
      <style>
        * {
          box-sizing: border-box !important;
        }

        :host {
          padding: 0;
          display: flex;
          flex-flow: column;
          gap: 0px;
        }

        .quick-info {
          margin: 15px 0 0 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
          justify-content: center;
        }

        .quick-info > .name-info {
          width: 100%;
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: start;
          gap: 0;
          padding: 0 0 0 12px;
          margin: 0 0 20px 0;
          position: relative;
        }

        .quick-info > .name-info::before {
          content: '';
          width: 2px;
          height: 80%;
          position: absolute;
          background: var(--accent-linear);
          left: 1px;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 10px;
        }

        .quick-info > .name-info > .title h2.name {
          font-size: 1.5rem;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-weight: 600;
          margin: 0;
          padding: 0;
          line-height: 1.4;
          font-weight: 570;
        }

        .quick-info > .name-info > span.country-info {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 3px;
          margin: 0;
          padding: 5px 0;
          color: var(--gray-color);
          width: 100%;
        }

        .quick-info > .name-info > span.country-info svg {
          width: 17px;
          height: 17px;
          color: var(--accent-color);
        }

        .quick-info > .name-info > span.country-info .text {
          color: var(--gray-color);
          font-size: 0.97rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 400;
        }

        .quick-info > .name-info > .review {
          width: 100%;
          padding: 0;
          margin: 0;
          color: var(--gray-color);
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 5px;
        }

        .quick-info > .name-info > .review .sp {
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 1.5rem;
          font-weight: 500;
          display: inline-block;
          margin-top: 2px;
        }

        .quick-info > .name-info > .review .number {
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          font-weight: 500;
        }

        .quick-info > .name-info > .review svg {
          color: var(--rating-color);
          margin: -2.2px 0 0 0;
          width: 18px;
          height: 18px;
        }

        .quick-info > .name-info > .review .people {
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          font-weight: 500;
        }

        .quick-info > .name-info > .review .people > span.no {
          color: var(--main-color);
          font-weight: 600;
        }

        .quick-info > .name-info > .review .people > span.text {
          color: var(--gray-color);
          font-weight: 400;
        }

        .quick-info > .images {
          padding: 0 0 30px 0;
          width: 100%;
          max-width: 100%;
          height: auto;
          max-height: 700px;
          display: flex;
          flex-flow: row-reverse;
          gap: 20px;
          border-bottom: var(--border);
        }

        .quick-info > .images > .current-image {
          min-width: calc(100% - 100px);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 10px;
        }

        .quick-info > .images > .current-image img {
          width: 100%;
          max-width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          object-fit: cover;
          border-radius: 10px;
        }

        .quick-info > .images > .image-options {
          position: relative;
          padding: 0;
          max-width: 100%;
          width: 100px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: start;
        }

        .quick-info > .images > .image-options .images {
          max-width: 100%;
          padding: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 10px;
          overflow-x: scroll;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .quick-info > .images > .image-options .images::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        .quick-info > .images >.image-options .images > .image {
          width: 80px;
          height: 80px;
          min-width: 80px;
          min-height: 80px;
          padding: 3px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: var(--border);
          border-radius: 12px;
        }

        .quick-info >.images >.image-options .images >.image.active {
          border: var(--action-border);
        }

        .quick-info > .images > .image-options .images > .image img {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          object-fit: cover;
          border-radius: 9px;
        }

        .quick-info > .images > .image-options > .nav {
          position: absolute;
          top: 10px;
          width: 26px;
          height: 26px;
          display: none;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          transform: translate(-50%);
          color: var(--white-color);
          cursor: pointer;
          rotate: 90deg;
          border-radius: 50px;
          background: var(--button-linear);
        }

        .quick-info > .images > .image-options:hover > .nav {
          display: flex;
        }

        .quick-info > .images > .image-options > .nav#right-nav {
          position: absolute;
          top: unset;
          bottom: 10px;
        }

        .quick-info > .images > .image-options > .nav > svg {
          width: 16px;
          height: 16px;
          stroke-width: 1.8;
        }

        /*Details*/
        .quick-info > .details {
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
          justify-content: space-between;
        }

        .quick-info > .details > .top {
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .quick-info > .details > .top div.price {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin: 0;
          padding: 20px 0;
        }

        .details > .top div.price span.line {
          display: inline-block;
          width: 2px;
          height: 30px;
          background-color: var(--accent-color);
          border-radius: 10px;
        }

        .quick-info > .details > .top div.price span.value,
        .quick-info > .details > .top div.price span.was,
        .quick-info > .details > .top .price .save {
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 10px;
        }

        .details > .top div.price span.value > span.contain,
        .details > .top div.price span.was > span.contain {
          display: flex;
          gap: 5px;
          align-items: center;
          justify-content: start;
        }

        .details > .top div.price span.value > span.text,
        .details > .top div.price span.was > span.text {
          color: var(--gray-color);
          font-size: 1rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 400;
        }

        .quick-info > .details > .top div.price span.value span.currency {
          color: var(--anchor-color);
          display: inline-block;
          margin: -2px 0 0 -1px;
          font-size: 1.12rem;
          font-family: var(--font-text), sans-serif;
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .quick-info > .details > .top div.price span.value span.price {
          color: var(--anchor-color);
          font-size: 1.32rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        .quick-info > .details > .top .price > .was {
          display: flex;
          width: max-content;
          align-items: center;
          justify-content: start;
          gap: 4px;
          margin: 0;
          padding: 0;
          position: relative;
        }

        .quick-info > .details > .top .price .was span.currency {
          color: var(--gray-color);
          font-size: 1rem;
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
          display: inline-block;
          margin: -2px 0 0 -5px;
        }

        .quick-info > .details > .top .price .was span.price {
          color: var(--gray-color);
          font-size: 1.1rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
          padding: 0;
          margin: 0;
        }

        .quick-info > .details > .top .price .save {
          padding: 10px 15px;
          height: 100%;
          display: flex;
          flex-flow: column;
          color: var(--gray-color);
          font-weight: 500;
        }

        .quick-info > .details > .top .price .save span.text {
          color: var(--gray-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
        }

        .quick-info > .details > .top .price .save span.percent {
          color: var(--main-color);
          font-size: 1.1rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 600;
        }

        .quick-info > .details .colors,
        .quick-info > .details .sizes {
          padding: 0;
          margin: 0 0 20px 0;
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: start;
          gap: 10px;
        }

        .quick-info > .details .colors h3.title,
        .quick-info > .details .sizes h3.title {
          line-height: 1.3;
          margin: 0;
          font-size: 1.2rem;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
          font-weight: 600;
        }

        .quick-info > .details .colors > .color-options,
        .quick-info > .details .sizes > .size-options {
          display: flex;
          flex-flow: row;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .color-options > .color {
          display: flex;
          align-items: center;
          flex-flow: row-reverse;
          justify-content: center;
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          gap: 10px;
        }

        .size-options > .size {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-flow: row-reverse;
          cursor: pointer;
          gap: 10px;
        }

        /* combine input and label */
        .color-options > .color > input {
          width: 20px;
          height: 20px;
          display: inline-block;
          margin: -2px 0 0 0;
        }

        .size-options > .size > input {
          width: 17px;
          height: 17px;
          display: inline-block;
          margin: 0 0 0 0;
        }

        .color-options > .color > label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border: var(--border);
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          padding: 0 10px 0 0;
        }
        
        .size-options > .size > label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
        }

        .color-options > .color > label img {
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          object-fit: cover;
        }

        .color-options > .color label span,
        .size-options > .size label span {
          display: text;
          font-size: 1rem;
          color: var(--text-color);
          font-family: var(--font-read), sans-serif;
          font-weight: 500;
        }

        .quick-info > .details > .buttons {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          gap: 15px;
          margin: 7px 0 20px 0;
          padding: 0;
        }

        .buttons.disabled {
          display: none;
          visibility: hidden;
        }

        .buttons > .button {
          border: none;
          position: relative;
          background: var(--accent-linear);
          color: var(--white-color);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 5px;
          height: 35px;
          text-transform: capitalize;
          justify-content: center;
          padding: 5px 12px 6px;
          width: max-content;
          border-radius: 12px;
        }

        .buttons > .button.add {
          display: flex;
          padding: 8px 20px;
          width: cal(40% - 5px);
          min-width: calc(40% - 5px);
          border-radius: 12px;
        }

        .buttons > .button.buy {
          padding: 7px 15px;
          width: calc(33% - 5px);
          min-width: calc(33% - 5px);
          border: var(--action-border);
          background: none;
          color: var(--gray-color);
        }

        .buttons > .button.wish {
          border: var(--action-border);
          background: none;
          color: var(--gray-color);
          padding: 5px 15px 4px;
        }

        .buttons > .button.wish.wished {
          color: var(--rating-color);
          border: var(--rating-border);
          /* background: var(--rating-background); */
        }

        .buttons > .button > .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .buttons > .button > .icon svg {
          width: 22px;
          height: 22px;
        }
      
        .buttons > .button.add.out {
          pointer-events: none;
          opacity: 0.5;
          cursor: not-allowed !important;
        }

        .buttons > .button.added {
          background: none;
          padding: 8px 20px;
          width: cal(40% - 5px);
          min-width: calc(40% - 5px);
          color: var(--accent-color);
          border: var(--action-border);
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 5px;
        }

        .buttons > .button.added > .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
        }

        .buttons > .button.added > .icon.remove  {
          color: var(--warn-color);
        }

        .buttons > .button.added > .icon svg {
          width: 20px;
          height: 20px;
        }

        .buttons > .button.added > .quantity {
          color: inherit;
          font-size: 1.15rem;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
        }

        /* Store */
        .store {
          padding: 18px 0;
          border-top: var(--border);
          border-bottom: var(--border);
          width: 100%;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin: 0;
        }

        .store > .left {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 15px;
          padding: 0;
          width: calc(100% - 120px);
          min-width: calc(100% - 120px);
        }

        .store > .left > .image {
          border: var(--border);
          width: 50px;
          height: 50px;
          min-width: 50px;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          overflow: hidden;
        }

        .store > .left > .image img {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          object-fit: cover;
        }

        .store > .left > .name {
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: center;
          gap: 0;
          width: calc(100% - 65px);
          max-width: calc(100% - 65px);
        }

        .store > .left > .name h3 {
          font-size: 1.02rem;
          color: var(--text-color);
          margin: 0;
          padding: 0;
          font-family: var(--font-main), sans-serif;
          line-height: 1.4;
          font-weight: 500;
          width: 100%;
          /* add ellipsis to the name */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .store > .left > .name span {
          font-size: .9rem;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          font-weight: 400;
          width: 100%;
          /* add ellipsis to the name */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .store > .right {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .store > button {
          border: var(--action-border);
          position: relative;
          background: var(--background);
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 5px;
          height: 35px;
          text-transform: capitalize;
          justify-content: center;
          padding: 5px 12px;
          width: 100px;
          min-width: 100px;
          border-radius: 12px;
        }

        /* Related */
        .related-products {
          padding: 0 0 18px 0;
          border-bottom: var(--border);
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 10px;
          margin: 10px 0 10px 0;
        }

        .related-products > .title h2.name {
          font-size: 1.3rem;
          color: var(--text-color);
          margin: 0;
          padding: 0;
          line-height: 1.4;
          font-weight: 570;
        }

        .related-products > .products {
          width: 100%;
          display: flex;
          flex-flow: row;
          gap: 20px;
          justify-content: start;
          overflow-x: scroll;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .related-products > .products::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        /* Full Inf0 */
        .full-info {
          padding: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
          align-items: start;
          justify-content: space-between;
        }

        .full-info > .specifications {
          width: 100%;
          padding: 0 0 18px 0;
          display: flex;
          flex-flow: column;
          gap: 30px;
          border-bottom: var(--border);
        }

        .full-info .title {
          position: relative;
          width: 100%;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: start;
          gap: 10px;
        }

        .full-info .title h2.name {
          font-size: 1.3rem;
          color: var(--text-color);
          margin: 0;
          padding: 0;
          line-height: 1.4;
          font-weight: 570;
        }

        .full-info .title span.line {
          position: absolute;
          bottom: -10px;
          display: inline-block;
          height: 4px;
          width: 25px;
          background: var(--accent-linear);
          opacity: .7;
          border-radius: 5px;
        }

        .full-info .specifications ul.spec-lists {
          margin: 5px 0 0 0;
          padding: 0;
          list-style-type: none;
          display: flex;
          flex-flow: column;
          justify-content: center;
        }

        .full-info .specifications ul.spec-lists li.list {
          border-top: var(--border);
          list-style-type: none;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .full-info .specifications ul.spec-lists li.list:last-of-type {
          border-bottom: var(--border);
        }

        .full-info .specifications ul.spec-lists li.list .key {
          border-right: var(--border);
          padding: 10px 10px;
          width: 150px;
          min-width: 150px;
          text-transform: capitalize;
          color: var(--title-color);
          height: 100%;
        }

        .full-info .specifications ul.spec-lists li.list .value {
          padding: 10px 10px;
        }

        .full-info .desc {
          display: flex;
          padding: 10px 0;
          border-bottom: var(--border);
          flex-flow: column;
          gap: 20px;
        }

        .full-info  .desc > .desc-lists {
          display: flex;
          flex-flow: column;
          justify-content: center;
          gap: 0;
        }

        .full-info  .desc > .desc-lists p {
          color: var(--text-color);
          margin: 5px 0;
          padding: 0;
          line-height: 1.4;
          font-size: 1rem;
        }

        .full-info  .reviews {
          display: flex;
          flex-flow: column;
          padding: 15px 0 0;
          gap: 35px;
          width: 100%;
        }

        #reviews-container {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
        }

        #reviews-container .stats {
          width: 100%;
          padding: 0;
          display: flex;
          gap: 20px;
        }

        #reviews-container .stats > .total {
          background-color: var(--review-background);
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 180px;
          padding: 20px 20px;
          border-radius: 10px;
        }

        #reviews-container .stats > .total .of {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        #reviews-container .stats > .total > .of .score {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--rating-color);
        }

        #reviews-container .stats > .total > .of .of-total {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text-color);
        }

        #reviews-container .stats > .total > .of .slash {
          display: inline-block;
          width: 3px;
          height: 22px;
          border-radius: 5px;
          background-color: var(--text-color);
          rotate: 15deg;
        }

        #reviews-container .stats > .total .stars {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 5px;
          overflow: hidden;
        }

        #reviews-container .stats > .total .stars svg {
          width: 23px;
          height: 23px;
          min-width: 23px;
          min-height: 23px;
          color: var(--rating-color);
          fill: var(--rating-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #reviews-container .stats > .total > p.text {
          font-size: 1rem;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          margin: 10px 0 0 0;
          font-weight: 500;
          line-height: 1.4;
        }

        #reviews-container .stats > .individual-scores {
          display: flex;
          flex-flow: column;
          gap: 2px;
          width: calc(100% - 200px);
          padding: 5px 0;
          justify-content: space-between;
        }

        #reviews-container .stats > .individual-scores span.score {
          color: var(--text-color);
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        #reviews-container .stats > .individual-scores span.score .no {
          display: inline-block;
          width: 20px;
          font-weight: 600;
          margin: 0;
        }

        #reviews-container .stats > .individual-scores span.score .bar {
          background-color: var(--gray-background);
          display: inline-block;
          width: calc(100% - 30px);
          height: 8px;
          margin: 0;
          border-radius: 50px;
          display: flex;
        }

        #reviews-container .stats > .individual-scores span.score .bar .progress {
          display: inline-block;
          width: 45%;
          height: 100%;
          border-radius: 50px;
          background: var(--rating-linear);
        }

        #reviews-container .stats > .individual-scores span.score.five .bar .progress {
          display: inline-block;
          width: 55%;
        }

        #reviews-container .stats > .individual-scores span.score.four .bar .progress {
          display: inline-block;
          width: 30%;
        }

        #reviews-container .stats > .individual-scores span.score.three .bar .progress {
          display: inline-block;
          width: 20%;
        }

        #reviews-container .stats > .individual-scores span.score.two .bar .progress {
          display: inline-block;
          width: 15%;
        }

        #reviews-container .stats > .individual-scores span.score.one .bar .progress {
          display: inline-block;
          width: 5%;
        }

        #reviews-container .user-reviews {
          padding: 20px 0 0;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .pagination {
          z-index: 0;
          display: flex;
          flex-flow: row;
          gap: 10px;
          justify-content: center;
          padding: 15px 0 20px;
          margin: 0;
          width: 100%;
        }

        .pagination > .previous {
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
        }

        .pagination > .nexts {
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
        }

        .pagination button {
          font-size: 0.9rem;
          outline: none;
          border: none;
          background: none;
          font-family: var(--font-text), sans-serif;
        }

        .pagination > button.current,
        .pagination > .nexts > .page,
        .pagination > .previous > .page {
          padding: 0;
          height: 30px;
          width: 30px;
          min-width: 30px;
          min-height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50px;
          color: var(--text-color);
          border: var(--action-border);
          cursor: pointer;
          transition: 0.3s;
        }

        .pagination > .nexts > button.large,
        .pagination > .previous > button.large,
        .pagination > button.large {
          padding: 0;
          height: 30px;
          width: max-content;
          padding: 0 10px;
        }

        .pagination > button.current {
          color: var(--white-color);
          background: var(--accent-linear);
          cursor: default;
        }

        .pagination > .previous > .prev:hover,
        .pagination > .nexts > .next:hover {
          background: var(--tab-background);
          border: none;
        }

        .pagination > .previous > .start {
          margin-right: 10px;
          border: none;
          background: var(--tab-background);
        }

        .pagination > .nexts > .end {
          margin-left: 10px;
          border: none;
          background: var(--tab-background);
        }

        .pagination > .previous > .page.current,
        .pagination > .nexts > .page.current {
          background: var(--accent-linear);
          color: var(--white-color);
        }

        @media screen and (max-width: 700px) {
          :host {
            padding: 65px 10px;
            margin: 0;
            max-width: 100%;
          }

          /* reset all cursor: pointer  to default */
          a,
          .buttons > .button ,
          .buttons > .button.add,
          .buttons > .button.buy,
          .buttons > .button.wish,
          .buttons > .button.added,
          .store > button,
          .quick-info > .images >.image-options .images > .image,
          .buttons > .button.added > .icon,
          .buttons > .button.added > .quantity,
          .color-options > .color,
          .size-options > .size,
          .color-options > .color > label,
          .size-options > .size > label,
          .quick-info > .images > .image-options > .nav,
          .quick-info > .images > .image-options > .nav > svg,
          .quick-info > .details > .buttons,
          .quick-info > .details > .buttons > .button,
          .quick-info > .details > .buttons > .button > .icon,
          .pagination > button,
          .pagination > .previous > .prev,
          .pagination > .nexts > .next,
          .pagination > .previous > .start,
          .pagination > .nexts > .end,
          .pagination > .previous > .page,
          .pagination > .nexts > .page {
            cursor: default !important;
          }

          .quick-info > .images {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 400px;
            display: flex;
            flex-flow: column;
            gap: 20px;
            border: none;
          }

          .quick-info > .images > .current-image {
            min-width: unset;
            display: flex;
            height: 400px;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border: none;
            border-radius: 0;
          }

          .quick-info > .images > .image-options {
            position: relative;
            padding: 0;
            max-width: 100%;
            width: 100%;
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: start;
          }
  
          .quick-info > .images > .image-options .images {
            width: 100%;
            padding: 0;
            width: 100%;
            height: max-content;
            display: flex;
            flex-flow: row;
            align-items: start;
            gap: 10px;
            overflow-x: scroll;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .quick-info >.images >.image-options .images > .image {
            width: 80px;
            height: 80px;
            min-width: 80px;
            min-height: 80px;
            cursor: default !important;
          }
  
          .quick-info > .images > .image-options > .nav {
            top: unset;
            left: 10px;
            display: none;
            flex-wrap: nowrap;
            transform: unset;
            cursor: default !important;
            rotate: unset;
            background: var(--button-linear);
          }
  
          .quick-info > .images > .image-options:hover > .nav {
            display: none;
          }
  
          .quick-info > .images > .image-options > .nav#right-nav {
            position: absolute;
            bottom: unset;
            left: unset;
            right: 10px;
          }

          .full-info .specifications ul.spec-lists {
            margin: 5px 0 0 0;
            padding: 0;
            list-style-type: none;
            display: flex;
            flex-flow: column;
            justify-content: center;
            gap: 10px;
          }
  
          .full-info .specifications ul.spec-lists li.list {
            border: none;
            list-style-type: none;
            color: var(--text-color);
            display: flex;
            flex-flow: column;
            align-items: start;
            gap: 0;
          }
  
          .full-info .specifications ul.spec-lists li.list:last-of-type {
            border: none;
          }
  
          .full-info .specifications ul.spec-lists li.list .key {
            border: none;
            padding: 0;
            width: 100%;
            text-transform: capitalize;
            color: var(--title-color);
            font-size: 1.15rem;
            font-weight: 500;
            height: 100%;
          }
  
          .full-info .specifications ul.spec-lists li.list .value {
            padding: 0;
            line-height: 1.4;
            font-family: var(--font-main), sans-serif;
          }

          #reviews-container .stats {
            width: 100%;
            padding: 0;
            display: flex;
            gap: 20px;
          }
  
          #reviews-container .stats > .total {
            background-color: var(--review-background);
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 160px;
            padding: 20px 20px;
            border-radius: 10px;
          }
  
          #reviews-container .stats > .total .of {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
  
          #reviews-container .stats > .total > .of .score {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--rating-color);
          }
  
          #reviews-container .stats > .total > .of .of-total {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--text-color);
          }
  
          #reviews-container .stats > .total > .of .slash {
            display: inline-block;
            width: 3px;
            height: 22px;
            border-radius: 5px;
            background-color: var(--text-color);
            rotate: 15deg;
          }
  
          #reviews-container .stats > .total .stars {
            display: flex;
            align-items: center;
            justify-content: start;
            gap: 5px;
            overflow: hidden;
          }
  
          #reviews-container .stats > .total .stars svg {
            width: 20px;
            height: 20px;
            min-width: 20px;
            min-height: 20px;
            color: var(--rating-color);
            fill: var(--rating-color);
            display: flex;
            align-items: center;
            justify-content: center;
          }
  
          #reviews-container .stats > .total > p.text {
            font-size: 1rem;
            color: var(--gray-color);
            font-family: var(--font-main), sans-serif;
            margin: 10px 0 0 0;
            font-weight: 500;
            line-height: 1.4;
          }
  
          #reviews-container .stats > .individual-scores {
            display: flex;
            flex-flow: column;
            gap: 2px;
            width: calc(100% - 170px);
            padding: 5px 0;
            justify-content: space-between;
          }

          .pagination {
            padding: 5px 0 25px;
            max-width: 100%;
            overflow-x: scroll;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .pagination::-webkit-scrollbar {
            display: none !important;
            visibility: hidden;
          }
        }
        
      </style>
    `;
  }
}
