export default class InvestmentNav extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
    this.active_tab = null;
    this.active_sub = null;
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // select main and sub attributes
    const main = this.getAttribute('main');
    const sub = this.getAttribute('sub');

    // select the nav
    const nav = this.shadowObj.querySelector('ul.nav');

    if(main && sub && nav) {
      this.getOrSetActive(nav, main, sub);

      //activate main nav
      this.activateMainNav(nav);
    }
  }

  disconnectedCallback() {
    this.enableScroll();
    // clear window.home
    window.home = null;
  }

  activateMainNav = nav => {
    const tabs = nav.querySelectorAll('li.nav-item');

    // add event listener to each tab
    tabs.forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        // check if tab is not active
        if(this.active_tab.dataset.nav !== tab.dataset.nav) {
          // remove active icon
          this.removeActiveIcon(this.active_tab);

          // remove active class from the active tab
          this.active_tab.classList.remove('active');

          // add active class to the tab
          tab.classList.add('active');

          // activate: sub first child
          const sub = tab.querySelector('ol > li:first-child');
          if(sub) {
            // remove active class from the active sub
            this.active_sub.classList.remove('current');

            // add active class to the sub
            sub.classList.add('current');

            // set the active sub
            this.active_sub = sub;
          }

          // set the active tab
          this.active_tab = tab;

          // set the active icon
          this.setActiveIcon(tab);
        }
      });
    });
  }

  getOrSetActive = (nav, main, sub) => {
    const activeTab = nav.querySelector('li.nav-item.active');

    // check if activeTab is not null
    if (activeTab) {
      // select the inner link: active
      const activeLink = activeTab.querySelector('ol > li.current');

      // check if activeLink is not null
      if (activeLink) {
        // set the active tab
        this.active_tab = activeTab;
        this.active_sub = activeLink;

        // set the active icon
        this.setActiveIcon(activeTab);

        return;
      }
    }

    // set the active tab
    this.setActiveTab(nav, main, sub);
  }

  setActiveTab = (nav, main, sub) => {
    // set the active tab
    const mainTab = nav.querySelector(`li.nav-item.${main}`);
    
    if(mainTab) {
      const subTab = mainTab.querySelector(`ol > li.${sub}`);

      // add active class to the active tab
      if(subTab) {
        mainTab.classList.add('active');
        subTab.classList.add('current');

        // set the active tab
        this.active_tab = mainTab;
        this.active_sub = subTab;

        // set the active icon
        this.setActiveIcon(mainTab);
      }
    }
  }

  setActiveIcon = activeTab => {
    const activeLink = activeTab.querySelector('.link > svg');
    if(activeLink) {
      activeLink.innerHTML = this.getActiveIcon();
    }
  }

  removeActiveIcon = activeTab => {
    const activeLink = activeTab.querySelector('.link > svg');
    if(activeLink) {
      activeLink.innerHTML = this.getInactiveIcon();
    }
  }

  getActiveIcon = () => {
    return /* html */`
      <path d="M20 12L4 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    `;
  }

  getInactiveIcon = () => {
    return /* html */`
      <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    `;
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      ${this.getWalletNav()}
    `;
  }

  getWalletNav = () => {
    return /* html */`
      <ul class="nav">
        ${this.getOverview()}
        ${this.getMyInvestments()}
        ${this.getExplore()}
        ${this.getListings()}
        ${this.getOffices()}
        ${this.getInquire()}
      </ul>
    `;
  }

  getOverview = () => {
    return /* html */`
      <li class="nav-item overview" data-nav="overview">
        <div class="link">
          <a href="/investment">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M6.5 17.5L6.5 14.5M11.5 17.5L11.5 8.5M16.5 17.5V13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M21.5 5.5C21.5 7.15685 20.1569 8.5 18.5 8.5C16.8431 8.5 15.5 7.15685 15.5 5.5C15.5 3.84315 16.8431 2.5 18.5 2.5C20.1569 2.5 21.5 3.84315 21.5 5.5Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M21.4955 11C21.4955 11 21.5 11.3395 21.5 12C21.5 16.4784 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4784 2.5 12C2.5 7.52169 2.5 5.28252 3.89124 3.89127C5.28249 2.50003 7.52166 2.50003 12 2.50003L13 2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text">Overview</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="info" data-nav="info">
            <a href="/investment/info">
              <span class="text">Info</span>
            </a>
          </li>
          <li class="accounting" data-nav="accounting">
            <a href="/investment/accounting">
              <span class="text">Accounting</span>
            </a>
          </li>
          <li class="reports" data-nav="reports">
            <a href="/investment/reports">
              <span class="text">Reports</span>
            </a>
          </li>
          <li class="updates" data-nav="updates">
            <a href="/investment/updates">
              <span class="text">Updates</span>
            </a>
          </li>
          <li class="announcement" data-nav="announcement">
            <a href="/investment/announcement">
              <span class="text">Announcement</span>
            </a>
          </li>
          <li class="staff" data-nav="staff">
            <a href="/investment/staff">
              <span class="text">Staff</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getMyInvestments = () => {
    return /* html */`
      <li class="nav-item my" data-nav="my">
        <div class="link">
          <a href="/investment/my">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M21 21C20.7284 21.2035 20.4288 21.3807 20.1062 21.5273C19.0659 22 17.6917 22 14.9432 22H9.05683C6.30834 22 4.9341 22 3.89382 21.5273C3.57124 21.3807 3.27158 21.2035 3 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M2 10C2 6.46252 2 4.69377 3.0528 3.5129C3.22119 3.32403 3.40678 3.14935 3.60746 2.99087C4.86213 2 6.74142 2 10.5 2H13.5C17.2586 2 19.1379 2 20.3925 2.99087C20.5932 3.14935 20.7788 3.32403 20.9472 3.5129C22 4.69377 22 6.46252 22 10C22 13.5375 22 15.3062 20.9472 16.4871C20.7788 16.676 20.5932 16.8506 20.3925 17.0091C19.1379 18 17.2586 18 13.5 18H10.5C6.74142 18 4.86213 18 3.60746 17.0091C3.40678 16.8506 3.22119 16.676 3.0528 16.4871C2 15.3062 2 13.5375 2 10Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M18.5 10H18.491" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M5.5 10H5.49102" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M14.551 10C14.551 11.3807 13.4317 12.5 12.051 12.5C10.6703 12.5 9.55099 11.3807 9.55099 10C9.55099 8.61929 10.6703 7.5 12.051 7.5C13.4317 7.5 14.551 8.61929 14.551 10Z" stroke="currentColor" stroke-width="1.8" />
            </svg>
            <span class="text">My Investments</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="all" data-nav="all">
            <a href="/investment/my/all">
              <span class="text">All</span>
            </a>
          </li>
          <li class="settled" data-nav="settled">
            <a href="/investment/my/settled">
              <span class="text">Settled</span>
            </a>
          </li>
          <li class="pending" data-nav="pending">
            <a href="/investment/my/pending">
              <span class="text">Pending</span>
            </a>
          </li>
          <li class="rejected" data-nav="rejected">
            <a href="/investment/my/rejected">
              <span class="text">Rejected</span>
            </a>
          </li>
          <li class="voted" data-nav="voted">
            <a href="/investment/my/voted">
              <span class="text">Voted</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getExplore = () => {
    return /* html */`
      <li class="nav-item listings" data-nav="listings">
      <div class="link">
        <a href="/investment/filter">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.8" />
            <path d="M12.4014 8.29796L15.3213 7.32465C16.2075 7.02924 16.6507 6.88153 16.8846 7.11544C17.1185 7.34935 16.9708 7.79247 16.6753 8.67871L15.702 11.5986C15.1986 13.1088 14.9469 13.8639 14.4054 14.4054C13.8639 14.9469 13.1088 15.1986 11.5986 15.702L8.67871 16.6753C7.79247 16.9708 7.34935 17.1185 7.11544 16.8846C6.88153 16.6507 7.02924 16.2075 7.32465 15.3213L8.29796 12.4014C8.80136 10.8912 9.05306 10.1361 9.59457 9.59457C10.1361 9.05306 10.8912 8.80136 12.4014 8.29796Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 12L11.9936 12.0064" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Explore</span>
        </a>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
          <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <ol class="sub-nav">
        <li class="all" data-nav="all">
          <a href="/investment/all">
            <span class="text">All</span>
          </a>
        </li>
        <li class="approved" data-nav="approved">
          <a href="/investment/approved">
            <span class="text">Approved</span>
          </a>
        </li>
        <li class="pending" data-nav="pending">
          <a href="/investment/pending">
            <span class="text">Pending</span>
          </a>
        </li>
        <li class="rejected" data-nav="rejected">
          <a href="/investment/rejected">
            <span class="text">Rejected</span>
          </a>
        </li>
        <li class="popular" data-nav="popular">
          <a href="/investment/popular">
            <span class="text">Popular</span>
          </a>
        </li>
        <li class="largest" data-nav="largest">
          <a href="/investment/largest">
            <span class="text">Largest</span>
          </a>
        </li>
        <li class="recent" data-nav="recent">
          <a href="/investment/recent">
            <span class="text">Recent</span>
          </a>
        </li>
      </ol>
    </li>
  `;
  }

  getListings = () => {
    return /* html */`
      <li class="nav-item explore" data-nav="explore">
      <div class="link">
        <a href="/listings">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M12 22C16.4183 22 20 18.4183 20 14C20 8 12 2 12 2C11.6117 4.48692 11.2315 5.82158 10 8C8.79908 7.4449 8.5 7 8 5.75C6 8 4 11 4 14C4 18.4183 7.58172 22 12 22Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
            <path d="M10 17L14 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10 13H10.009M13.991 17H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Listings</span>
        </a>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
          <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <ol class="sub-nav">
        <li class="all" data-nav="all">
          <a href="/listings/all">
            <span class="text">All</span>
          </a>
        </li>
        <li class="available" data-nav="available">
          <a href="/listings/available">
            <span class="text">Available</span>
          </a>
        </li>
        <li class="sold" data-nav="sold">
          <a href="/listings/sold">
            <span class="text">Sold out</span>
          </a>
        </li>
        <li class="popular" data-nav="popular">
          <a href="/investment/popular">
            <span class="text">Popular</span>
          </a>
        </li>
        <li class="recent" data-nav="recent">
          <a href="/investment/recent">
            <span class="text">Recent</span>
          </a>
        </li>
      </ol>
    </li>
  `;
  }

  getOffices = () => {
    return /* html */`
      <li class="nav-item manage" data-nav="manage">
        <div class="link">
          <a href="/wallet/manage">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M12 2H6C3.518 2 3 2.518 3 5V22H15V5C15 2.518 14.482 2 12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M18 8H15V22H21V11C21 8.518 20.482 8 18 8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M8 6L10 6M8 9L10 9M8 12L10 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11.5 22V18C11.5 17.0572 11.5 16.5858 11.2071 16.2929C10.9142 16 10.4428 16 9.5 16H8.5C7.55719 16 7.08579 16 6.79289 16.2929C6.5 16.5858 6.5 17.0572 6.5 18V22" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
            </svg>
            <span class="text">Offices</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="holding" data-nav="holding">
            <a href="/wallet/manage/holding">
              <span class="text">Holding</span>
            </a>
          </li>
          <li class="loan" data-nav="loan">
            <a href="/wallet/manage/loan">
              <span class="text">Loan</span>
            </a>
          </li>
          <li class="investment" data-nav="investment">
            <a href="/wallet/manage/investment">
              <span class="text">Investment</span>
            </a>
          </li>
          <li class="revenue" data-nav="revenue">
            <a href="/wallet/manage/revenue">
              <span class="text">Revenue</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getInquire = () => {
    return /* html */ `
      <li class="nav-item inquire" data-nav="inquire">
        <div class="link">
          <a href="/wallet/inquire">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M21.0477 3.05293C18.8697 0.707363 2.48648 6.4532 2.50001 8.551C2.51535 10.9299 8.89809 11.6617 10.6672 12.1581C11.7311 12.4565 12.016 12.7625 12.2613 13.8781C13.3723 18.9305 13.9301 21.4435 15.2014 21.4996C17.2278 21.5892 23.1733 5.342 21.0477 3.05293Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M11.5 12.5L15 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text">Inquire</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="contact" data-nav="contact">
            <a href="/wallet/inquire/contact">
              <span class="text">Contact</span>
            </a>
          </li>
          <li class="support" data-nav="support">
            <a href="/wallet/inquire/support">
              <span class="text">Support</span>
            </a>
          </li>
          <li class="faq" data-nav="faq">
            <a href="/wallet/inquire/faq">
              <span class="text">FAQ</span>
            </a>
          </li>
        </ol>
      </li>
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
          padding: 0;
          margin: 0;
          display: flex;
          height: max-content;
          gap: 0;
          width: 100%;
        }

        ul.nav {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
          width: 100%;
        }

        ul.nav > li {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 0 0 3px 5px;
          font-family: var(--font-text), sans-serif;
          color: var(--text-color);
        }

        ul.nav > li > .link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 10px;
          margin: 0 0 3px 0;
          width: 100%;
          cursor: pointer;
          color: inherit;
          border-radius: 8px;
        }

        ul.nav > li > .link:hover,
        ul.nav > li.active > .link {
          background: var(--gray-background);
        }

        ul.nav > li > .link:hover > svg,
        ul.nav > li.active > .link > svg {
          color: var(--text-color);
        }

        ul.nav > li > .link > svg {
          width: 16px;
          height: 16px;
          color: var(--text-color);
        }

        ul.nav > li > .link > a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
          gap: 5px;
          color: inherit;
        }

        ul.nav > li > .link > a > svg {
          width: 18px;
          height: 18px;
          color: var(--text-color);
        }

        ul.nav > li > .link > a > span.text {
          font-size: 1rem;
          color: inherit;
        }

        ul.nav > li > .sub-nav {
          list-style: none;
          padding: 0;
          margin: 0;
          display: none;
          flex-direction: column;
          gap: 0;
          width: 100%;
        }

        ul.nav > li.active > .sub-nav {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        ul.nav > li > .sub-nav > li {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 3px 10px 3px 15px;
          color: var(--nav-color);
          font-family: var(--font-text), sans-serif;
          border-radius: 8px;
        }

        ul.nav > li > .sub-nav > li:hover,
        ul.nav > li > .sub-nav > li.current {
          color: var(--text-color);
        }

        ul.nav > li > .sub-nav > li > a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
          width: 100%;
          cursor: pointer;
          color: inherit;
        }

        ul.nav > li > .sub-nav > li > a > span.text {
          font-size: 1rem;
          font-family: inherit;
          color: inherit;
        }

        ul.nav > li > .sub-nav > li > a > svg {
          width: 16px;
          height: 16px;
          color: var(--text-color);
        }

				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

          ul.nav > li > .link,
					a {
						cursor: default !important;
          }
				}
	    </style>
    `;
  }
}