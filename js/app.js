// import Router from "./router.js";
import uis from "./uis/index.js";
import utils from "./utils/index.js";

export default class AppMain extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();
    uis();
    this.setTitle();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.utils = utils();
    this.initTheme();
    this.mql = window.matchMedia('(max-width: 700px)');
    window.app = this;
    this.render();
  }

  setTitle = () => {
    // update the title of the document
    document.title = 'Thealcohesion | Home';
  }

  getCurrentCountry = () => {
    // get the current country using location API
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          .then(response => response.json())
          .then(data => {
            const country = data.countryName;
            /* set the country code in local storage */
            localStorage.setItem('country', country);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      });
    }
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
    this.watchMql();
  }

  connectedCallback() {
    // Todo: Initialize the app
  }

  watchMql() {
    this.mql.addEventListener('change', () => {
      this.render();
      this.setHeader(this.mql);
    });
  }

  setHeader = data => {
    const header = this.shadowObj.querySelector('header-section');
    if (header) {
      header.setAttribute('section-title', data.sectionTitle);
      header.setAttribute('description', data.description);
    }
  }

  disconnectedCallback() {
    this.enableScroll();
  }


  initTheme() {
    // Get saved theme from localStorage, default to light
    const savedTheme = localStorage.getItem('user-theme') || 'light';

    // Set the theme on document
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  showToast = (success, message) => {
    // check if the toast is already open
    const toastEl = document.querySelector('#toast');
    if (toastEl) toastEl.remove();

    // create the toast element
    const toast = this.getToast(success, message);

    // append the toast to the body
    document.body.insertAdjacentHTML('beforeend', toast);

    // add the show class to the toast
    const addedToast = document.querySelector('#toast');
    addedToast.classList.add('show');

    // remove the toast after 5 seconds
    setTimeout(() => {
      addedToast.classList.remove('show');
      setTimeout(() => {
        addedToast.remove();
      }, 300);
    }, 5000);
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    if (this.mql.matches) {
      return /* html */`
        ${this.getMobileHeader()}
        <section class="flow">
         <!-- ${this.getSidebar()}-->
          ${this.getCartContainer()}
        </section>
        <section class="nav">
          ${this.getMobileNav()}
        </section>
      `;
    }
    else {
      // Only show navigation if authenticated
      return /* html */`
        <section class="nav">
          ${this.getMainNav()}
        </section>
        <section class="flow">
          <div id="content-container" class="content-container">
            <!--${this.getLoader()}-->
            ${this.getShots()}
          </div>
          ${this.getFooter()}
        </section>
        ${this.getSidebar()}
      `;
    }
  }

  getMainNav = () => {
    return /* html */`
      <div class="icons-nav">
        <div class="top">
          <div class="logo">
            <a href="/">${this.utils.logo}</a>
          </div>
          <ul class="main nav">
            <li class="home">
              <a href="/">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                  <path d="M12 17H12.009" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M20 8.5V13.5C20 17.2712 20 19.1569 18.8284 20.3284C17.6569 21.5 15.7712 21.5 12 21.5C8.22876 21.5 6.34315 21.5 5.17157 20.3284C4 19.1569 4 17.2712 4 13.5V8.5" stroke="currentColor" stroke-width="1.8" />
                  <path d="M22 10.5L17.6569 6.33548C14.9902 3.77849 13.6569 2.5 12 2.5C10.3431 2.5 9.00981 3.77849 6.34315 6.33548L2 10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </a>
              <span class="tooltip">
                <span class="arrow"></span>
                <span class="text">Home</span>
              </span>
            </li>
            <li class="active wallet">
              <a href="/wallet">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
                  <rect width="24" height="24" fill="none" />
                  <path d="M3 8.5H15C17.8284 8.5 19.2426 8.5 20.1213 9.37868C21 10.2574 21 11.6716 21 14.5V15.5C21 18.3284 21 19.7426 20.1213 20.6213C19.2426 21.5 17.8284 21.5 15 21.5H9C6.17157 21.5 4.75736 21.5 3.87868 20.6213C3 19.7426 3 18.3284 3 15.5V8.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="round" />
                  <path d="M15 8.49833V4.1103C15 3.22096 14.279 2.5 13.3897 2.5C13.1336 2.5 12.8812 2.56108 12.6534 2.67818L3.7623 7.24927C3.29424 7.48991 3 7.97203 3 8.49833" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
              <span class="tooltip">
                <span class="arrow"></span>
                <span class="text">Wallet</span>
              </span>
            </li>
            <li class="investment">
              <a href="/investment">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
                  <path d="M14 18C18.4183 18 22 14.4183 22 10C22 5.58172 18.4183 2 14 2C9.58172 2 6 5.58172 6 10C6 14.4183 9.58172 18 14 18Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <path d="M13.1669 20.9689C12.063 21.6239 10.7742 22 9.3975 22C5.31197 22 2 18.688 2 14.6025C2 13.2258 2.37607 11.937 3.03107 10.8331" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </a>
              <span class="tooltip">
                <span class="arrow"></span>
                <span class="text">Investment</span>
              </span>
            <li class="funding">
              <a href="/funding">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
                  <path d="M20.9427 16.8354C20.2864 12.8866 18.2432 9.94613 16.467 8.219C15.9501 7.71642 15.6917 7.46513 15.1208 7.23257C14.5499 7 14.0592 7 13.0778 7H10.9222C9.94081 7 9.4501 7 8.87922 7.23257C8.30834 7.46513 8.04991 7.71642 7.53304 8.219C5.75682 9.94613 3.71361 12.8866 3.05727 16.8354C2.56893 19.7734 5.27927 22 8.30832 22H15.6917C18.7207 22 21.4311 19.7734 20.9427 16.8354Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M7.25662 4.44287C7.05031 4.14258 6.75128 3.73499 7.36899 3.64205C8.00392 3.54651 8.66321 3.98114 9.30855 3.97221C9.89237 3.96413 10.1898 3.70519 10.5089 3.33548C10.8449 2.94617 11.3652 2 12 2C12.6348 2 13.1551 2.94617 13.4911 3.33548C13.8102 3.70519 14.1076 3.96413 14.6914 3.97221C15.3368 3.98114 15.9961 3.54651 16.631 3.64205C17.2487 3.73499 16.9497 4.14258 16.7434 4.44287L15.8105 5.80064C15.4115 6.38146 15.212 6.67187 14.7944 6.83594C14.3769 7 13.8373 7 12.7582 7H11.2418C10.1627 7 9.6231 7 9.20556 6.83594C8.78802 6.67187 8.5885 6.38146 8.18945 5.80064L7.25662 4.44287Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M13.6267 12.9186C13.4105 12.1205 12.3101 11.4003 10.9892 11.9391C9.66829 12.4778 9.45847 14.2113 11.4565 14.3955C12.3595 14.4787 12.9483 14.2989 13.4873 14.8076C14.0264 15.3162 14.1265 16.7308 12.7485 17.112C11.3705 17.4932 10.006 16.8976 9.85742 16.0517M11.8417 10.9927V11.7531M11.8417 17.2293V17.9927" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
              <span class="tooltip">
                <span class="arrow"></span>
                <span class="text">Funding</span>
              </span>
            </li>
            <li class="action">
              <a href="/action-centers">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
                  <path d="M3 11C3 7.25027 3 5.3754 3.95491 4.06107C4.26331 3.6366 4.6366 3.26331 5.06107 2.95491C6.3754 2 8.25027 2 12 2C15.7497 2 17.6246 2 18.9389 2.95491C19.3634 3.26331 19.7367 3.6366 20.0451 4.06107C21 5.3754 21 7.25027 21 11V13C21 16.7497 21 18.6246 20.0451 19.9389C19.7367 20.3634 19.3634 20.7367 18.9389 21.0451C17.6246 22 15.7497 22 12 22C8.25027 22 6.3754 22 5.06107 21.0451C4.6366 20.7367 4.26331 20.3634 3.95491 19.9389C3 18.6246 3 16.7497 3 13V11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M16 9.5L8 9.5M13.5 14.5H10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
              <span class="tooltip">
                <span class="arrow"></span>
                <span class="text">Action Centers</span>
              </span>
            </li>
            <li class="formation">
              <a href="/formation">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
                  <rect width="24" height="24" fill="none" />
                  <path d="M2 14C2 11.1911 2 9.78661 2.67412 8.77772C2.96596 8.34096 3.34096 7.96596 3.77772 7.67412C4.78661 7 6.19108 7 9 7H15C17.8089 7 19.2134 7 20.2223 7.67412C20.659 7.96596 21.034 8.34096 21.3259 8.77772C22 9.78661 22 11.1911 22 14C22 16.8089 22 18.2134 21.3259 19.2223C21.034 19.659 20.659 20.034 20.2223 20.3259C19.2134 21 17.8089 21 15 21H9C6.19108 21 4.78661 21 3.77772 20.3259C3.34096 20.034 2.96596 19.659 2.67412 19.2223C2 18.2134 2 16.8089 2 14Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M16 7C16 5.11438 16 4.17157 15.4142 3.58579C14.8284 3 13.8856 3 12 3C10.1144 3 9.17157 3 8.58579 3.58579C8 4.17157 8 5.11438 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M6 11L6.65197 11.202C10.0851 12.266 13.9149 12.266 17.348 11.202L18 11M12 12V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
              <span class="tooltip">
                <span class="arrow"></span>
                <span class="text">Formation</span>
              </span>
            </li>
            <li class="offices">
              <a href="/offices">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
                  <path d="M14 22V8C14 5.17157 14 3.75736 13.1213 2.87868C12.2426 2 10.8284 2 8 2C5.17157 2 3.75736 2 2.87868 2.87868C2 3.75736 2 5.17157 2 8V16C2 18.8284 2 20.2426 2.87868 21.1213C3.75736 22 5.17157 22 8 22H14Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <path d="M6.5 11H5.5M10.5 11H9.5M6.5 7H5.5M6.5 15H5.5M10.5 7H9.5M10.5 15H9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <path d="M18.5 15H17.5M18.5 11H17.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <path d="M18 8H14V22H18C19.8856 22 20.8284 22 21.4142 21.4142C22 20.8284 22 19.8856 22 18V12C22 10.1144 22 9.17157 21.4142 8.58579C20.8284 8 19.8856 8 18 8Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </a>
              <span class="tooltip">
                <span class="arrow"></span>
                <span class="text">Offices</span>
              </span>
            </li>
            <li class="market">
              <a href="/market">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
                  <path d="M5 20L7.41286 17.5871M7.41286 17.5871C8.21715 18.3914 9.32826 18.8889 10.5556 18.8889C13.0102 18.8889 15 16.899 15 14.4444C15 11.9898 13.0102 10 10.5556 10C8.10096 10 6.11111 11.9898 6.11111 14.4444C6.11111 15.6717 6.60857 16.7829 7.41286 17.5871Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <path d="M3 15.1877C2.36394 14.0914 2 12.8191 2 11.4623C2 7.34099 5.35786 4 9.5 4H14.5C18.6421 4 22 7.34099 22 11.4623C22 14.7114 19.913 17.4756 17 18.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </a>
              <span class="tooltip">
                <span class="arrow"></span>
                <span class="text">Market</span>
              </span>
            </li>
            <li class="tools">
              <a href="/tools">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
                  <circle cx="6.25" cy="6.25" r="4.25" stroke="currentColor" stroke-width="1.8" />
                  <path d="M18 9.35714V10.5M18 9.35714C16.9878 9.35714 16.0961 8.85207 15.573 8.08517M18 9.35714C19.0122 9.35714 19.9039 8.85207 20.427 8.08517M18 3.64286C19.0123 3.64286 19.9041 4.148 20.4271 4.915M18 3.64286C16.9877 3.64286 16.0959 4.148 15.5729 4.915M18 3.64286V2.5M21.5 4.21429L20.4271 4.915M14.5004 8.78571L15.573 8.08517M14.5 4.21429L15.5729 4.915M21.4996 8.78571L20.427 8.08517M20.4271 4.915C20.7364 5.36854 20.9167 5.91364 20.9167 6.5C20.9167 7.08643 20.7363 7.63159 20.427 8.08517M15.5729 4.915C15.2636 5.36854 15.0833 5.91364 15.0833 6.5C15.0833 7.08643 15.2637 7.63159 15.573 8.08517" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <circle cx="17.75" cy="17.75" r="4.25" stroke="currentColor" stroke-width="1.8" />
                  <circle cx="6.25" cy="17.75" r="4.25" stroke="currentColor" stroke-width="1.8" />
                </svg>
              </a>
              <span class="tooltip">
                <span class="arrow"></span>
                <span class="text">Tools</span>
              </span>
            </li>
          </ul>
        </div>
        <div class="bottom">
          <ul class="user nav">
            <li class="updates">
              <a href="/updates">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
                  <path d="M22 5.5C22 7.433 20.433 9 18.5 9C16.567 9 15 7.433 15 5.5C15 3.567 16.567 2 18.5 2C20.433 2 22 3.567 22 5.5Z" stroke="currentColor" stroke-width="1.8" />
                  <path d="M21.9506 11C21.9833 11.3289 22 11.6625 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.3375 2 12.6711 2.01672 13 2.04938" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <path d="M8 10H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M8 15H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
              <span class="tooltip">
                <span class="arrow"></span>
                <span class="text">Updates</span>
              </span>
            </li>
            <li class="appearance">
              <a href="/appearance">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
                  <path d="M14 19L11.1069 10.7479C9.76348 6.91597 9.09177 5 8 5C6.90823 5 6.23652 6.91597 4.89309 10.7479L2 19M4.5 12H11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M21.9692 13.9392V18.4392M21.9692 13.9392C22.0164 13.1161 22.0182 12.4891 21.9194 11.9773C21.6864 10.7709 20.4258 10.0439 19.206 9.89599C18.0385 9.75447 17.1015 10.055 16.1535 11.4363M21.9692 13.9392L19.1256 13.9392C18.6887 13.9392 18.2481 13.9603 17.8272 14.0773C15.2545 14.7925 15.4431 18.4003 18.0233 18.845C18.3099 18.8944 18.6025 18.9156 18.8927 18.9026C19.5703 18.8724 20.1955 18.545 20.7321 18.1301C21.3605 17.644 21.9692 16.9655 21.9692 15.9392V13.9392Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
              <span class="tooltip">
                <span class="arrow"></span>
                <span class="text">Appearance</span>
              </span>
            </li>
            <li class="settings">
              <a href="/settings">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
                  <path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="currentColor" stroke-width="1.8" />
                  <path d="M21.011 14.0965C21.5329 13.9558 21.7939 13.8854 21.8969 13.7508C22 13.6163 22 13.3998 22 12.9669V11.0332C22 10.6003 22 10.3838 21.8969 10.2493C21.7938 10.1147 21.5329 10.0443 21.011 9.90358C19.0606 9.37759 17.8399 7.33851 18.3433 5.40087C18.4817 4.86799 18.5509 4.60156 18.4848 4.44529C18.4187 4.28902 18.2291 4.18134 17.8497 3.96596L16.125 2.98673C15.7528 2.77539 15.5667 2.66972 15.3997 2.69222C15.2326 2.71472 15.0442 2.90273 14.6672 3.27873C13.208 4.73448 10.7936 4.73442 9.33434 3.27864C8.95743 2.90263 8.76898 2.71463 8.60193 2.69212C8.43489 2.66962 8.24877 2.77529 7.87653 2.98663L6.15184 3.96587C5.77253 4.18123 5.58287 4.28891 5.51678 4.44515C5.45068 4.6014 5.51987 4.86787 5.65825 5.4008C6.16137 7.3385 4.93972 9.37763 2.98902 9.9036C2.46712 10.0443 2.20617 10.1147 2.10308 10.2492C2 10.3838 2 10.6003 2 11.0332V12.9669C2 13.3998 2 13.6163 2.10308 13.7508C2.20615 13.8854 2.46711 13.9558 2.98902 14.0965C4.9394 14.6225 6.16008 16.6616 5.65672 18.5992C5.51829 19.1321 5.44907 19.3985 5.51516 19.5548C5.58126 19.7111 5.77092 19.8188 6.15025 20.0341L7.87495 21.0134C8.24721 21.2247 8.43334 21.3304 8.6004 21.3079C8.76746 21.2854 8.95588 21.0973 9.33271 20.7213C10.7927 19.2644 13.2088 19.2643 14.6689 20.7212C15.0457 21.0973 15.2341 21.2853 15.4012 21.3078C15.5682 21.3303 15.7544 21.2246 16.1266 21.0133L17.8513 20.034C18.2307 19.8187 18.4204 19.711 18.4864 19.5547C18.5525 19.3984 18.4833 19.132 18.3448 18.5991C17.8412 16.6616 19.0609 14.6226 21.011 14.0965Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </a>
              <span class="tooltip">
                <span class="arrow"></span>
                <span class="text">Settings</span>
              </span>
            </li>
            <li class="avatar account">
              <a href="/account">
                <img src="https://a03-static.s3.eu-north-1.amazonaws.com/u0258103538917264.webp" alt="avatar" />
              </a>
              <span class="tooltip">
                <span class="arrow"></span>
                <span class="text">Logout</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="details-nav">
        <div class="title">
          <span class="text">Formation</span>
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M15.1528 4.28405C13.9789 3.84839 13.4577 2.10473 12.1198 2.00447C12.0403 1.99851 11.9603 1.99851 11.8808 2.00447C10.5429 2.10474 10.0217 3.84829 8.8478 4.28405C7.60482 4.74524 5.90521 3.79988 4.85272 4.85239C3.83967 5.86542 4.73613 7.62993 4.28438 8.84747C3.82256 10.0915 1.89134 10.6061 2.0048 12.1195C2.10506 13.4574 3.84872 13.9786 4.28438 15.1525C4.73615 16.37 3.83962 18.1346 4.85272 19.1476C5.90506 20.2001 7.60478 19.2551 8.8478 19.7159C10.0214 20.1522 10.5431 21.8954 11.8808 21.9955C11.9603 22.0015 12.0403 22.0015 12.1198 21.9955C13.4575 21.8954 13.9793 20.1521 15.1528 19.7159C16.3704 19.2645 18.1351 20.1607 19.1479 19.1476C20.2352 18.0605 19.1876 16.2981 19.762 15.042C20.2929 13.8855 22.1063 13.3439 21.9958 11.8805C21.8957 10.5428 20.1525 10.021 19.7162 8.84747C19.2554 7.60445 20.2004 5.90473 19.1479 4.85239C18.0955 3.79983 16.3958 4.74527 15.1528 4.28405Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M12.2422 16V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11.9922 8H12.0012" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </div>
        <div class="container">
          ${this.getFormationNav()}
        </div>
      </div>
    `;
  }

  getMobileNav = () => {
    return /* html */`
      <div class="mobile-nav">
        <div class="icons">
          <span class="icon home active">
            <span class="bar"></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M12 17H12.009" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20 8.5V13.5C20 17.2712 20 19.1569 18.8284 20.3284C17.6569 21.5 15.7712 21.5 12 21.5C8.22876 21.5 6.34315 21.5 5.17157 20.3284C4 19.1569 4 17.2712 4 13.5V8.5" stroke="currentColor" stroke-width="1.8" />
              <path d="M22 10.5L17.6569 6.33548C14.9902 3.77849 13.6569 2.5 12 2.5C10.3431 2.5 9.00981 3.77849 6.34315 6.33548L2 10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span class="text">Home</span>
          </span>
          <span class="icon wallet">
            <span class="bar"></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <rect width="24" height="24" fill="none" />
              <path d="M3 8.5H15C17.8284 8.5 19.2426 8.5 20.1213 9.37868C21 10.2574 21 11.6716 21 14.5V15.5C21 18.3284 21 19.7426 20.1213 20.6213C19.2426 21.5 17.8284 21.5 15 21.5H9C6.17157 21.5 4.75736 21.5 3.87868 20.6213C3 19.7426 3 18.3284 3 15.5V8.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="round" />
              <path d="M15 8.49833V4.1103C15 3.22096 14.279 2.5 13.3897 2.5C13.1336 2.5 12.8812 2.56108 12.6534 2.67818L3.7623 7.24927C3.29424 7.48991 3 7.97203 3 8.49833" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
           <span class="text">Wallet</span>
          </span>
          <span class="icon investment">
            <span class="bar"></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M14 18C18.4183 18 22 14.4183 22 10C22 5.58172 18.4183 2 14 2C9.58172 2 6 5.58172 6 10C6 14.4183 9.58172 18 14 18Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M13.1669 20.9689C12.063 21.6239 10.7742 22 9.3975 22C5.31197 22 2 18.688 2 14.6025C2 13.2258 2.37607 11.937 3.03107 10.8331" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span class="text">Invest</span>
          </span>
          <span class="icon offices">
            <span class="bar"></span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
							<path d="M14 22V8C14 5.17157 14 3.75736 13.1213 2.87868C12.2426 2 10.8284 2 8 2C5.17157 2 3.75736 2 2.87868 2.87868C2 3.75736 2 5.17157 2 8V16C2 18.8284 2 20.2426 2.87868 21.1213C3.75736 22 5.17157 22 8 22H14Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
							<path d="M6.5 11H5.5M10.5 11H9.5M6.5 7H5.5M6.5 15H5.5M10.5 7H9.5M10.5 15H9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
							<path d="M18.5 15H17.5M18.5 11H17.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
							<path d="M18 8H14V22H18C19.8856 22 20.8284 22 21.4142 21.4142C22 20.8284 22 19.8856 22 18V12C22 10.1144 22 9.17157 21.4142 8.58579C20.8284 8 19.8856 8 18 8Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
						</svg>
            <span class="text">Offices</span>
          </span>
					<span class="icon settings">
						<span class="bar"></span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M5 20L7.41286 17.5871M7.41286 17.5871C8.21715 18.3914 9.32826 18.8889 10.5556 18.8889C13.0102 18.8889 15 16.899 15 14.4444C15 11.9898 13.0102 10 10.5556 10C8.10096 10 6.11111 11.9898 6.11111 14.4444C6.11111 15.6717 6.60857 16.7829 7.41286 17.5871Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M3 15.1877C2.36394 14.0914 2 12.8191 2 11.4623C2 7.34099 5.35786 4 9.5 4H14.5C18.6421 4 22 7.34099 22 11.4623C22 14.7114 19.913 17.4756 17 18.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
						<span class="text">Market</span>
					</span>
					<span class="icon more">
				    <span class="bar"></span>
				    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
							<path d="M22 17.5C22 19.433 20.433 21 18.5 21C16.567 21 15 19.433 15 17.5C15 15.567 16.567 14 18.5 14C20.433 14 22 15.567 22 17.5Z" stroke="currentColor" stroke-width="1.8" />
							<path d="M9 17.5C9 19.433 7.433 21 5.5 21C3.567 21 2 19.433 2 17.5C2 15.567 3.567 14 5.5 14C7.433 14 9 15.567 9 17.5Z" stroke="currentColor" stroke-width="1.8" />
						</svg>
						<span class="text">More</span>
					</span>
        </div>
      </div>
    `;
  }

  getMobileHeader = () => {
    return /* html */`
      <header-section section-title="Chats" description="Your chats and updates."></header-section>
    `;
  }

  getWalletNav = () => {
    return /* html */`
      <wallet-nav main="transactions" sub="all"></wallet-nav>
    `;
  }

  getFormationNav = () => {
    return /* html */`
      <formation-nav main="meetings" sub="all"></formation-nav>
    `;
  }

  getInvestmentNav = () => {
    return /* html */`
      <investment-nav main="my" sub="pending"></investment-nav>
    `;
  }

  getSidebar = () => {
    return /* html */`
      <section class="sidebar">
       <sidebar-section section-title="Updates" description="Your chats and updates."></sidebar-section>
      </section>
    `;
  }

  getLoader = () => {
    return /* html */`
      <div class="loader-container">
        <div id="loader" class="loader"></div>
      </div>
    `;
  }

  getInvestmentFeed = () => {
    return /* html */`
      <investment-feed name="Settled Investments" kind="settled"
        all="457">
        <p>This section provides a detailed overview of your settled investments. </p>
        <p>You can track the performance of your investments, view historical data, and analyze trends to make informed decisions.</p>
        </p>
      </investment-feed>
    `;
  }

  getInvestmentDetails = () => {
    return /* html */`
      <investment-details kind="settled" roi="12.5" users="73"
        name="Ganders Inn Ltd" price="14.53" shares="563" sold="211"
        datetime="2024-10-30T10:58:36+00:00" voted="up"
        background="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        images="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        views="709" category="Restaurant" upvotes="1357" downvotes="12">
        <p>This investment opportunity is designed to provide significant returns over a period of time. Our team of experts has carefully analyzed the market trends and identified key areas for growth.</p>
        <p>By investing with us, you are not only securing your financial future but also contributing to the development of innovative solutions that drive progress in various industries. </p>
        <p>We prioritize transparency and provide regular updates on the performance of your investments. Join us on this journey towards financial success and make the most of your capital with our strategic investment plans.</p>
      </investment-details>
    `;
  }

  getListingDetails = () => {
    return /* html */`
      <listing-details user-name="Janet Doe" user-picture="https://randomuser.me/api/portraits/men/10.jpg"
        price="14.5" roi="12.5" datetime="2021-09-12T12:00:00Z" shares="1342" share-price="15.0"
        category="Real Estate" sold="234"
        shares-name="The Hilton Hotel">
        <p>This investment opportunity is designed to provide significant returns over a period of time. Our team of experts has carefully analyzed the market trends and identified key areas for growth.</p>
        <p>We prioritize transparency and provide regular updates on the performance of your investments. Join us on this journey towards financial success and make the most of your capital with our strategic investment plans.</p>
      </listing-details>
    `;
  }

  getListingsFeed = () => {
    return /* html */`
      <listing-feed name="User Listings" kind="user" all="457">
        <p>Users can track the performance of their shares, view historical data, and analyze trends to make informed decisions.</p> 
        <p> This section is designed to help users manage their investment portfolio effectively and stay updated with the latest market insights.</p>
        <p>By keeping an eye on their listings, users can ensure their investments are on the right track and make strategic decisions to maximize their returns.</p>
      </listing-feed>
    `;
  }

  getAllAccounts = () => {
    return /* html */`
      <all-accounts></all-accounts>
    `;
  }

  getHoldingAccount = () => {
    return /* html */`
      <holding-account
        account="EAC65376462H" balance="54672.1" status="active" since="2021-09-12T12:00:00Z"
        last-spent="894.65" last-gain="5212.5" current-spent="854.5" current-gain="7512.5"
        out-mon="62.5" out-tue="178.5" out-wed="235.98" out-thu="136.5" out-fri="133.5" out-sat="58.5" out-sun="49.5"
        in-mon="120.5" in-tue="150.75" in-wed="120.1" in-thu="180.3" in-fri="210.4" in-sat="190.6" in-sun="175.2">
      </holding-account>
    `;
  }

  getInvestmentAccount = () => {
    return /* html */`
      <investment-account
        account="EAC65376462I" balance="9354672.1" status="active" since="2021-09-12T12:00:00Z"
        last-invested="47894.65" last-deposited="695212.5" current-invested="98854.5" current-deposited="737512.5">
      </investment-account>
    `;
  }

  getRevenueAccount = () => {
    return /* html */`
      <revenue-account
        account="EAC65376462R" balance="54672.1" status="active" since="2021-09-12T12:00:00Z"
        last-earned="894.65" last-transferred="5212.5" current-earned="854.5" current-transferred="7512.5">
      </revenue-account>
    `;
  }

  getLoanAccount = () => {
    return /* html */`
      <loan-account
        account="EAC65376462L" status="active" since="2021-09-12T12:00:00Z"
        borrowed="9894.65" balance="5212.5" limit="63800"
        last-borrowed="8154.5" current-borrowed="7412.5" last-repaid="10354.5" current-repaid="7512.5">
      </loan-account>
    `;
  }

  geTransactionsFeed = () => {
    return /* html */`
    <transactions-feed name="All Transactions" kind="user" all="457" holding="123" investments="234" revenue="98" loan="42">
      <p>This section provides a comprehensive overview of all user transactions across different accounts. It includes detailed information about each transaction, allowing users to track their financial activities effectively.</p>
      <p>By monitoring their transactions, users can ensure their financial activities are on the right track and make strategic decisions to optimize their financial health.</p>
    </transactions-feed>
  `;
  }

  getStatementForm = () => {
    return /* html */`
    <statement-form name="Platform Statements" cost="0.15" kind="week">
      <p>This section allows you to generate detailed statements for all your financial activities within the platform. You can track your earnings, investments, and expenditures over a specified period.</p>
    </statement-form>
  `;
  }

  getDepositForm = () => {
    return /* html */`
      <deposit-form name="Deposit Funds" kind="holding" min="0.01" max="10000" currency="USD" user-phone="+25413253018"></deposit-form>
    `;
  }

  getWithdrawForm = () => {
    return /* html */`
      <withdraw-form name="Withdraw Funds" kind="holding" balance="20.3" min="1" max="200" currency="eac" user-email="isfescii@gmail.com" user-phone="+25413253018"></withdraw-form>
    `;
  }

  getProductFeed = () => {
    return /* html */`
      <products-feed name="Market Products" kind="all" all="457">
        <p>Users can track the performance of their shares, view historical data, and analyze trends to make informed decisions.</p> 
        <p> This section is designed to help users manage their investment portfolio effectively and stay updated with the latest market insights.</p>
      </products-feed>
    `;
  }

  /* store */
  getStoreContainer = () => {
    return /* html */`
      <store-container name="Marketplace" desc="This section provides a detailed overview of all the products available in the marketplace.">
      </store-container>
    `;
  }

  getProductDetail = () => {
    return /* html */`
      <product-detail 
        url="/product/PDT2345L"
        hex="PDT2346Y5L" last="33.25"
        store="The Vines Inn" average-review="4.3" wished="true" 
        in-cart="3" quantity="45"
        main-image="/images/product/bananas.webp"
        images="/images/product/product-8.webp, /images/product/product-1.webp, /images/product/product-2.webp, /images/product/product-3.webp, /images/product/product-4.webp, /images/product/product-5.webp, /images/product/product-6.webp, /images/product/product-7.webp, /images/product/product-8.webp"
        previous-price="25.53"
        current-price="20.53"
        discount="19.6"
        name="Thealcohesion T-Shirt"
        sizes='{ 
          "small": {
            "quantity": 15,
            "name": "Small"
          },
          "medium": {
            "quantity": 25,
            "name": "Medium"
          },
          "large": {
            "quantity": 0,
            "name": "Large"
          },
          "extra-large": {
            "quantity": 10,
            "name": "Extra Large"
          },
          "xxx-large": {
            "quantity": 5,
            "name": "XXX Large"
          }
        }'
        colors='{
          "black":{
            "quantity": 10,
            "name": "Black",
            "image": "/images/product/product-1.webp"
          },
          "white":{
            "quantity": 20,
            "name": "White",
            "image": "/images/product/product-2.webp"
          },
          "blue":{
            "quantity": 0,
            "name": "Blue",
            "image": "/images/product/product-3.webp"
          },
          "red":{
            "quantity": 5,
            "name": "Red",
            "image": "/images/product/product-4.webp"
          }
        }'
        tags="t-shirt, clothing, fashion, man",
        specifications='{ 
          "color": "black", 
          "material": "cotton", 
          "size": "medium",
          "longer": "This is realy longer description of the product. It is made from high-quality cotton material, it offers a perfect fit and a trendy look. Whether you are heading out for a casual outing or a special event, this t-shirt is a versatile addition to your wardrobe. With its classic design and durable construction, it is sure to become your go-to choice for everyday wear."
        }',
        reviews="6336",
        reviews-distribution='{
          "one": 659,
          "two": 1123,
          "three": 758,
          "four": 2735,
          "five": 761
        }'
        store-name="The Vines Inn & Co. very long name for the store"
        store-image="/images/product/product-7.webp"
        store-url="/store/sto2345lhgd7"
        store-location="Nairobi, Kenya"
        store-country="US"
        store-hash="STO2345LHGD7">
        <p>This product is designed to provide maximum comfort and style. Made from high-quality cotton material, it offers a perfect fit and a trendy look. </p>
        <p>Whether you are heading out for a casual outing or a special event, this t-shirt is a versatile addition to your wardrobe. </p>
        <p>With its classic design and durable construction, it is sure to become your go-to choice for everyday wear. </p>
      </product-detail>
    `;
  }

  getCartContainer = () => {
    return /* html */`
      <cart-container empty="false" name="Shopping Cart" kind="all" desc="This section provides a detailed overview of all the items in your shopping cart.">
      </cart-container>
    `;
  }

  getPickupContainer = () => {
    return /* html */`
      <pickup-container name="Pickup Station" kind="all" desc="This section provides a detailed overview of all the pickup stations available.">
      </pickup-container>
    `;
  }

  getShots = () => {
    return /* html */`
      <shots-videos api="/shots/fyp" name="For You" type="fyp"></shots-videos>
    `;
  }

  getFooter = () => {
    const year = new Date().getFullYear();
    return /*html*/`
      <footer class="footer">
        <p class="copyright">Copyright &copy;<span class="year">${year}</span><span class="company"> Thealcohesion</span>. All rights reserved.</p>
        <ul class="links">
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="/white-paper">White Paper</a></li>
          <li><a href="/privacy">Privacy</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </footer>
    `;
  }

  getToast = (status, text) => {
    return /* html */`
      <div id="toast" class="${status === true ? 'success' : 'error'}">
        <div id="img">${status === true ? this.getSuccesToast() : this.getErrorToast()}</div>
        <div id="desc">${text}</div>
      </div>
    `;
  }

  getSuccesToast = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/checkmark-circle-02-solid-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.75 22.5C5.81294 22.5 1 17.6871 1 11.75C1 5.81294 5.81294 1 11.75 1C17.6871 1 22.5 5.81294 22.5 11.75C22.5 17.6871 17.6871 22.5 11.75 22.5ZM16.5182 9.39018C16.8718 8.9659 16.8145 8.33534 16.3902 7.98177C15.9659 7.62821 15.3353 7.68553 14.9818 8.10981L10.6828 13.2686L8.45711 11.0429C8.06658 10.6524 7.43342 10.6524 7.04289 11.0429C6.65237 11.4334 6.65237 12.0666 7.04289 12.4571L10.0429 15.4571C10.2416 15.6558 10.5146 15.7617 10.7953 15.749C11.076 15.7362 11.3384 15.606 11.5182 15.3902L16.5182 9.39018Z" fill="currentColor"></path>
      </svg>
    `;
  }

  getErrorToast = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/cancel-circle-solid-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25C6.06294 1.25 1.25 6.06294 1.25 12ZM8.29293 8.29286C8.68348 7.90235 9.31664 7.90239 9.70714 8.29293L12 10.586L14.2929 8.29293C14.6834 7.90239 15.3165 7.90235 15.7071 8.29286C16.0976 8.68336 16.0976 9.31652 15.7071 9.70707L13.4141 12.0003L15.7065 14.2929C16.097 14.6835 16.097 15.3166 15.7064 15.7071C15.3159 16.0976 14.6827 16.0976 14.2922 15.7071L12 13.4146L9.70779 15.7071C9.31728 16.0976 8.68412 16.0976 8.29357 15.7071C7.90303 15.3166 7.90299 14.6835 8.2935 14.2929L10.5859 12.0003L8.29286 9.70707C7.90235 9.31652 7.90239 8.68336 8.29293 8.29286Z" fill="currentColor"></path>
      </svg>
    `;
  }

  getStyles() {
    return /* css */`
	    <style>
	      *,
	      *:after,
	      *:before {
	        box-sizing: border-box !important;
	        font-family: inherit;
	        -webkit-box-sizing: border-box !important;
	      }

	      *:focus {
	        outline: inherit !important;
	      }

	      *::-webkit-scrollbar {
	        width: 3px;
	      }

	      *::-webkit-scrollbar-track {
	        background: var(--scroll-bar-background);
	      }

	      *::-webkit-scrollbar-thumb {
	        width: 3px;
	        background: var(--scroll-bar-linear);
	        border-radius: 50px;
	      }

	      h1,
	      h2,
	      h3,
	      h4,
	      h5,
	      h6 {
	        font-family: inherit;
	      }

	      a {
	        text-decoration: none;
	      }

	      :host {
          font-size: 16px;
          padding: 0 10px;
          margin: 0;
          display: flex;
          gap: 20px;
        }

        div.loader-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          min-width: 100%;
        }

        div.loader-container > .loader {
          width: 20px;
          aspect-ratio: 1;
          border-radius: 50%;
          background: var(--accent-linear);
          display: grid;
          animation: l22-0 2s infinite linear;
        }

        div.loader-container > .loader:before {
          content: "";
          grid-area: 1/1;
          margin: 15%;
          border-radius: 50%;
          background: var(--second-linear);
          transform: rotate(0deg) translate(150%);
          animation: l22 1s infinite;
        }

        div.loader-container > .loader:after {
          content: "";
          grid-area: 1/1;
          margin: 15%;
          border-radius: 50%;
          background: var(--accent-linear);
          transform: rotate(0deg) translate(150%);
          animation: l22 1s infinite;
        }

        div.loader-container > .loader:after {
          animation-delay: -.5s
        }

        @keyframes l22-0 {
          100% {transform: rotate(1turn)}
        }

        @keyframes l22 {
          100% {transform: rotate(1turn) translate(150%)}
        }

        section.nav {
          width: 250px;
          display: flex;
          flex-flow: row;
          gap: 15px;
          padding: 5px 0;
          height: 100dvh;
          max-height: 100dvh;
          overflow-y: scroll;
          scrollbar-width: none;
          position: sticky;
          top: 0;
        }

        section.nav::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        section.nav > div.icons-nav {
          padding: 0;
          display: flex;
          height: 100%;
          gap: 50px;
          flex-flow: column;
          justify-content: space-between;
          align-items: center;
          width: 40px;
        }

        section.nav > div.icons-nav > div.top,
        section.nav > div.icons-nav > div.bottom {
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 0;
          width: 100%;
          min-width: 100%;
        }

        section.nav > div.icons-nav > div.top > div.logo {
          padding: 5px 0 0;
        }

        section.nav > div.icons-nav > div.top > div.logo > a {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 5px;
        }

        section.nav > div.icons-nav > div.top > div.logo > a > svg {
          width: 24px;
          height: 24px;
        }

        section.nav > div.icons-nav  ul.nav {
          padding: 0;
          margin: 10px 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          width: 100%;
          gap: 5px;
        }

        section.nav > div.icons-nav  ul.nav > li {
          padding: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 5px;
          position: relative;
          color: var(--icon-color);
          transition: all 0.3s ease;
        }

        section.nav > div.icons-nav  ul.nav > li:hover,
        section.nav > div.icons-nav  ul.nav > li.active {
          color: var(--action-color);
        }

        section.nav > div.icons-nav ul.nav > li > a {
          padding: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0;
          color: inherit;
          border-radius: 7px;
        }

        section.nav > div.icons-nav ul.nav > li.active > a {
          background: var(--nav-background);
        }

        section.nav > div.icons-nav ul.nav > li > a > svg {
          width: 22px;
          height: 22px;
        }

        section.nav > div.icons-nav ul.nav > li.avatar > a {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          padding: 0;
          overflow: hidden;
          border: var(--input-border);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        section.nav > div.icons-nav ul.nav > li.avatar > a > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        section.nav > div.icons-nav ul.nav > li > span.tooltip {
          position: absolute;
          background: var(--background);
          z-index: 10;
          top: calc(50% - 10px);
          left: calc(100% + 5px);
          color: var(--gray-color);
          display: none;
          max-width: 150px;
          align-items: center;
          justify-content: center;
          padding: 2px 7px 3px 5px;
          box-shadow: var(--box-shadow);
          height: 26px;
          border: var(--border);
          border-radius: 7px;
          transition: all 0.3s ease;
        }

        section.nav > div.icons-nav ul.nav > li:hover > span.tooltip {
          display: flex;
        }

        section.nav > div.icons-nav ul.nav > li.active > span.tooltip {
          color: var(--action-color);
        }

        section.nav > div.icons-nav ul.nav > li > span.tooltip > span.arrow {
          position: absolute;
          background: var(--background);
          display: inline-block;
          width: 10px;
          height: 10px;
          top: calc(50% - 5px);
          left: -5px;
          border-left: var(--border);
          border-top: var(--border);
          rotate: -45deg;
          clip-path: polygon(0 0, 100% 0, 0 100%);
        }

        section.nav > div.icons-nav ul.nav > li > span.tooltip > span.text {
          color: inherit;
          font-family: var(--font-text), sans-serif;
          font-size: 0.95rem;

          /* add ellipsis */
          white-space: nowrap;
          overflow: hidden;
        }

        section.nav > div.details-nav {
          padding: 0;
          margin: 0;
          width: calc(100% - 40px);
          height: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
          overflow-y: scroll;
          scrollbar-width: none;
        }

        section.nav > div.details-nav::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        section.nav > div.details-nav > div.title {
          padding: 5px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        section.nav > div.details-nav > div.title > span.text {
          font-family: var(--font-main), sans-serif;
          font-size: 1.2rem;
          line-height: 1.5;
          color: var(--text-color);
          font-weight: 600;
        }

        section.nav > div.details-nav > div.title > span.icon {
          padding: 0;
          display: none;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          color: var(--icon-color);
        }

        section.nav > div.details-nav > div.title > span.icon:hover {
          color: var(--action-color);
        }

        section.nav > div.details-nav > div.title > span.icon > svg {
          width: 20px;
          height: 20px;
        }

        section.nav > div.details-nav > div.container {
          padding: 0;
          display: flex;
          flex-flow: column;
          gap: 10px;
          width: 100%;
        }

        section.flow {
          width: calc(100% - (250px + 500px + 20px));
          display: flex;
          flex-flow: column;
          max-height: max-content;
          gap: 0;
          padding: 0;
        }

        /* Latency Panel Styles */
        section.sidebar {
          width: 500px;
          height: 100dvh;
          padding: 0;
          background: var(--background);
          /* border-left: var(--border); */
          display: flex;
          flex-flow: column;
          max-height: 100dvh;
          gap: 0;
          z-index: 10;
          overflow-y: auto;
          scrollbar-width: none;
          position: sticky;
          top: 0;
        }

        section.sidebar::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        section.flow > div#content-container {
          width: 100%;
          min-height: calc(100dvh - 140px);
          max-height: max-content;
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0 20px;
        }

        section.flow > div.feeds {
          padding: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
          align-items: center;
          justify-content: start;
        }

        footer.footer {
          border-top: var(--border);
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: start;
          gap: 5px;
          width: 100%;
          padding: 10px 0 20px 0;
        }

        footer.footer > p {
          margin: 0;
          padding: 0;
          font-family: var(--font-read), sans-serif;
          font-size: 1rem;
          color: var(--gray-color);
        }

        footer.footer > p > span.year,
        footer.footer > p > span.company {
          font-size: 0.9rem;
          font-family: var(--font-text), sans-serif;
        }

        footer.footer > ul.links {
          padding: 0;
          margin: 0;
          display: flex;
          flex-flow: row;
          gap: 10px;
        }

        footer.footer > ul.links > li {
          padding: 0;
          margin: 0;
          list-style-type: none;
        }

        footer.footer > ul.links > li > a {
          font-family: var(--font-read), sans-serif;
          font-size: 0.9rem;
          color: var(--gray-color);
        }

        footer.footer > ul.links > li > a:hover {
          color: var(--anchor-color);
        }

        @media screen and (max-width:900px) {
         .feeds {
            width: 58%;
          }

          div.side {
            width: 40%;
          }
        }

				@media screen and (max-width: 700px) {
					:host {
            font-size: 16px;
						padding: 0;
            margin: 0;
            height: max-content;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            gap: 0;
					}

					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a {
						cursor: default !important;
          }

					section.nav {
						/*border-top: var(--border);*/
						box-shadow: var(--footer-shadow);
						width: 100%;
						display: flex;
						padding: 0;
						flex-flow: row;
						gap: 0;
						position: fixed;
						bottom: 0;
						top: unset;
						height: 55px;
						left: 0;
						right: 0;
						z-index: 10;
						background: var(--background);
					}

          section.flow > div#content-container {
            padding: 0;
          }

					section.nav > div.mobile-nav {
						width: 100%;
						display: flex;
						flex-flow: row;
						justify-content: space-between;
						align-items: center;
						padding: 0 10px;
						height: 100%;
						gap: 0;
						position: relative;
					}

					section.nav > div.mobile-nav > div.icons {
						display: flex;
						flex-flow: row;
						justify-content: space-between;
						align-items: center;
						gap: 0;
						width: 100%;
						height: 100%;
						position: relative;
					}

					section.nav > div.mobile-nav > div.icons > span.icon {
						display: flex;
						flex-flow: column;
						justify-content: center;
						align-items: center;
						gap: 0;
						width: max-content;
						height: 100%;
						color: var(--icon-color);
						position: relative;
					}

					section.nav > div.mobile-nav > div.icons > span.icon > span.bar {
						display: none;
					}

					section.nav > div.mobile-nav > div.icons > span.icon.active > span.bar {
						display: inline-block;
						width: 100%;
						height: 2px;
						border-radius: 5px;
						position: absolute;
						background: var(--accent-linear);
						top: 0;
						left: 50%;
						z-index: 11;
						transform: translateX(-50%);
					}

					section.nav > div.mobile-nav > div.icons > span.icon.active {
						color: var(--accent-color);
					}

					section.nav > div.mobile-nav > div.icons > span.icon > svg {
						width: 26px;
						height: 26px;
						color: inherit;
					}

          section.nav > div.mobile-nav > div.icons > span.icon.more {
						display: flex;
						flex-flow: column;
						justify-content: center;
						align-items: center;
						gap: 5px;
						width: max-content;
						height: 100%;
						color: var(--icon-color);
						position: relative;
					}

          section.nav > div.mobile-nav > div.icons > span.icon.more > svg {
						width: 30px;
						height: 30px;
            margin-top: -8px;
						color: inherit;
					}

					section.nav > div.mobile-nav > div.icons > span.icon > span.text {
						font-size: 0.8rem;
						font-family: var(--font-read), sans-serif;
						color: inherit;
						display: flex;
					}

					section.nav > div.mobile-nav > div.icons > span.icon.active > span.text {
						font-family: var(--font-text), sans-serif;
						font-weight: 500;
					}

					section.nav > div.mobile-nav > div.icons > span.icon.profile {
						display: flex;
						flex-flow: column;
						justify-content: center;
						align-items: center;
					}

					section.nav > div.mobile-nav > div.icons > span.icon.profile > div.avatar {
						width: 30px;
						height: 30px;
						border-radius: 50%;
						overflow: hidden;
					}

					section.nav > div.mobile-nav > div.icons > span.icon.profile > div.avatar > img {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}

					/* Feeds */
					section.flow {
						width: 100%;
						display: flex;
						flex-flow: column;
						gap: 0;
						height: max-content;
						padding: 0;
					}

          /* Latency Panel Styles */
          section.sidebar {
            width: 100dvw;
            height: 100dvh;
            padding: 0;
            background: var(--background);
            /* border-left: var(--border); */
            display: flex;
            flex-flow: column;
            max-height: 100dvh;
            gap: 0;
            z-index: 10;
            overflow-y: auto;
            scrollbar-width: none;
            position: unset;
            top: 0;
          }
				}
	    </style>
    `;
  }
}