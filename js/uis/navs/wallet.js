export default class WalletNav extends HTMLElement {
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

    if (main && sub && nav) {
      this.getOrSetActive(nav, main, sub);

      //activate main nav
      this.activateMainNav(nav);
    }
  }

  activateMainNav = nav => {
    const tabs = nav.querySelectorAll('li.nav-item');

    // add event listener to each tab
    tabs.forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        // check if tab is not active
        if (this.active_tab.dataset.nav !== tab.dataset.nav) {
          // remove active icon
          this.removeActiveIcon(this.active_tab);

          // remove active class from the active tab
          this.active_tab.classList.remove('active');

          // add active class to the tab
          tab.classList.add('active');

          // activate: sub first child
          const sub = tab.querySelector('ol > li:first-child');
          if (sub) {
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

    if (mainTab) {
      const subTab = mainTab.querySelector(`ol > li.${sub}`);

      // add active class to the active tab
      if (subTab) {
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
    if (activeLink) {
      activeLink.innerHTML = this.getActiveIcon();
    }
  }

  removeActiveIcon = activeTab => {
    const activeLink = activeTab.querySelector('.link > svg');
    if (activeLink) {
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
        ${this.getAccounts()}
        ${this.getTransactions()}
        ${this.getStatements()}
        ${this.getCards()}
        ${this.getOffices()}
        ${this.getAgents()}
        ${this.getInquire()}
      </ul>
    `;
  }

  getOverview = () => {
    return /* html */`
      <li class="nav-item overview" data-nav="overview">
        <div class="link">
          <a href="/wallet/stats">
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
          <li class="stats current" data-nav="stats">
            <a href="/wallet/stats">
              <span class="text">Stats</span>
            </a>
          </li>
          <li class="transactions" data-nav="transactions">
            <a href="/wallet/transactions">
              <span class="text">Transactions</span>
            </a>
          </li>
          <li class="statements" data-nav="statements">
            <a href="/wallet/withdraw">
              <span class="text">Withdraw</span>
            </a>
          </li>
          <li class="deposit" data-nav="deposit">
            <a href="/wallet/deposit">
              <span class="text">Deposit</span>
            </a>
          </li>
          <li class="transfer" data-nav="transfer">
            <a href="/wallet/transfer">
              <span class="text">Transfer</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getAccounts = () => {
    return /* html */`
      <li class="nav-item accounts" data-nav="accounts">
      <div class="link">
        <a href="/wallet/accounts">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M16 14C16 14.8284 16.6716 15.5 17.5 15.5C18.3284 15.5 19 14.8284 19 14C19 13.1716 18.3284 12.5 17.5 12.5C16.6716 12.5 16 13.1716 16 14Z" stroke="currentColor" stroke-width="1.8" />
            <path d="M18.9 8C18.9656 7.67689 19 7.34247 19 7C19 4.23858 16.7614 2 14 2C11.2386 2 9 4.23858 9 7C9 7.34247 9.03443 7.67689 9.10002 8" stroke="currentColor" stroke-width="1.8" />
            <path d="M7 7.99324H16C18.8284 7.99324 20.2426 7.99324 21.1213 8.87234C22 9.75145 22 11.1663 22 13.9961V15.9971C22 18.8269 22 20.2418 21.1213 21.1209C20.2426 22 18.8284 22 16 22H10C6.22876 22 4.34315 22 3.17157 20.8279C2 19.6557 2 17.7692 2 13.9961V11.9952C2 8.22211 2 6.33558 3.17157 5.16344C4.11466 4.2199 5.52043 4.03589 8 4H10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <span class="text">Accounts</span>
        </a>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
          <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <ol class="sub-nav">
        <li class="all" data-nav="all">
          <a href="/wallet/accounts/all">
            <span class="text">All</span>
          </a>
        </li>
        <li class="holding" data-nav="holding">
          <a href="/wallet/holding">
            <span class="text">Holding</span>
          </a>
        </li>
        <li class="investment" data-nav="investment">
          <a href="/wallet/investment">
            <span class="text">Investment</span>
          </a>
        </li>
        <li class="revenue" data-nav="revenue">
          <a href="/wallet/revenue">
            <span class="text">Revenue</span>
          </a>
        </li>
        <li class="loan" data-nav="loan">
          <a href="/wallet/loan">
            <span class="text">Loan</span>
          </a>
        </li>
      </ol>
    </li>
  `;
  }

  getTransactions = () => {
    return /* html */`
      <li class="nav-item transactions" data-nav="transactions">
        <div class="link">
          <a href="/wallet/transactions">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M8.64298 3.14559L6.93816 3.93362C4.31272 5.14719 3 5.75397 3 6.75C3 7.74603 4.31272 8.35281 6.93817 9.56638L8.64298 10.3544C10.2952 11.1181 11.1214 11.5 12 11.5C12.8786 11.5 13.7048 11.1181 15.357 10.3544L17.0618 9.56638C19.6873 8.35281 21 7.74603 21 6.75C21 5.75397 19.6873 5.14719 17.0618 3.93362L15.357 3.14559C13.7048 2.38186 12.8786 2 12 2C11.1214 2 10.2952 2.38186 8.64298 3.14559Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M20.788 11.0972C20.9293 11.2959 21 11.5031 21 11.7309C21 12.7127 19.6873 13.3109 17.0618 14.5072L15.357 15.284C13.7048 16.0368 12.8786 16.4133 12 16.4133C11.1214 16.4133 10.2952 16.0368 8.64298 15.284L6.93817 14.5072C4.31272 13.3109 3 12.7127 3 11.7309C3 11.5031 3.07067 11.2959 3.212 11.0972" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M20.3767 16.2661C 20.7922 16.5971 21 16.927 21 17.3176C21 18.2995 19.6873 18.8976 17.0618 20.0939L15.357 20.8707C 13.7048 21.6236 12.8786 22 12 22C 11.1214 22 10.2952 21.6236 8.64298 20.8707L6.93817 20.0939C 4.31272 18.8976 3 18.2995 3 17.3176C 3 16.927 3.20778 16.5971 3.62334 16.2661" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span class="text">Transactions</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="all" data-nav="all">
            <a href="/wallet/transactions/all">
              <span class="text">All</span>
            </a>
          </li>
          <li class="failed" data-nav="failed">
            <a href="/wallet/transactions/failed">
              <span class="text">Failed</span>
            </a>
          </li>
          <li class="pending" data-nav="pending">
            <a href="/wallet/transactions/pending">
              <span class="text">Pending</span>
            </a>
          </li>
          <li class="deposits" data-nav="deposits">
            <a href="/wallet/transactions/deposits">
              <span class="text">Deposits</span>
            </a>
          </li>
          <li class="withdrawals" data-nav="withdrawals">
            <a href="/wallet/transactions/withdrawals">
              <span class="text">Withdrawals</span>
            </a>
          </li>
          <li class="transfer" data-nav="transfers">
            <a href="/wallet/transactions/transfers">
              <span class="text">Transfers</span>
            </a>
          </li>
          <li class="sent" data-nav="sent">
            <a href="/wallet/transactions/sent">
              <span class="text">Pay & Sent</span>
            </a>
          </li>
          <li class="repayments" data-nav="repayments">
            <a href="/wallet/transactions/repayments">
              <span class="text">Repayments</span>
            </a>
          </li>
          <li class="applications" data-nav="applications">
            <a href="/wallet/transactions/applications">
              <span class="text">Applications</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getStatements = () => {
    return /* html */`
      <li class="nav-item statements" data-nav="statements">
        <div class="link">
          <a href="/wallet/statements">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M20.4999 10.5V10C20.4999 6.22876 20.4999 4.34315 19.3284 3.17157C18.1568 2 16.2712 2 12.4999 2H11.5C7.72883 2 5.84323 2 4.67166 3.17156C3.50009 4.34312 3.50007 6.22872 3.50004 9.99993L3.5 14.5C3.49997 17.7874 3.49996 19.4312 4.40788 20.5375C4.57412 20.7401 4.75986 20.9258 4.96242 21.0921C6.06877 22 7.71249 22 10.9999 22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7.5 7H16.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7.5 12H13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M20.5 20L20.5 17C20.5 15.5706 19.1569 14 17.5 14C15.8431 14 14.5 15.5706 14.5 17L14.5 20.5C14.5 21.3284 15.1716 22 16 22C16.8284 22 17.5 21.3284 17.5 20.5V17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Statements</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="yearly" data-nav="yearly">
            <a href="/wallet/statements/yearly">
              <span class="text">Yearly</span>
            </a>
          </li>
          <li class="six-months" data-nav="six-months">
            <a href="/wallet/statements/six-months">
              <span class="text">Six Months</span>
            </a>
          </li>
          <li class="three-months" data-nav="three-months">
            <a href="/wallet/statements/three-months">
              <span class="text">Three Months</span>
            </a>
          </li>
          <li class="monthly" data-nav="monthly">
            <a href="/wallet/statements/monthly">
              <span class="text">Monthly</span>
            </a>
          </li>
          <li class="weekly" data-nav="weekly">
            <a href="/wallet/statements/weekly">
              <span class="text">Weekly</span>
            </a>
          </li>
          <li class="daily" data-nav="daily">
            <a href="/wallet/statements/daily">
              <span class="text">Daily</span>
            </a>
          </li>
        </ol>
      </li>
    `;
  }

  getCards = () => {
    return /* html */`
      <li class="nav-item cards" data-nav="cards">
        <div class="link">
          <a href="/wallet/cards">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M3.3457 16.1976L16.1747 3.36866M18.6316 11.0556L16.4321 13.2551M14.5549 15.1099L13.5762 16.0886" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M3.17467 16.1411C1.60844 14.5749 1.60844 12.0355 3.17467 10.4693L10.4693 3.17467C12.0355 1.60844 14.5749 1.60844 16.1411 3.17467L20.8253 7.85891C22.3916 9.42514 22.3916 11.9645 20.8253 13.5307L13.5307 20.8253C11.9645 22.3916 9.42514 22.3916 7.85891 20.8253L3.17467 16.1411Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M4 22H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span class="text">Cards</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="all" data-nav="all">
            <a href="/wallet/cards/all">
              <span class="text">All</span>
            </a>
          </li>
          <li class="create" data-nav="create">
            <a href="/wallet/cards/create">
              <span class="text">Create</span>
            </a>
          </li>
          <li class="active" data-nav="active">
            <a href="/wallet/cards/active">
              <span class="text">Active</span>
            </a>
          </li>
          <li class="suspended" data-nav="suspended">
            <a href="/wallet/cards/suspended">
              <span class="text">Suspended</span>
            </a>
          </li>
          <li class="expired" data-nav="expired">
            <a href="/wallet/cards/expired">
              <span class="text">Expired</span>
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

  getAgents = () => {
    return /* html */`
      <li class="nav-item agents" data-nav="agents">
        <div class="link">
          <a href="/wallet/agents">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="1.8"/>
              <path d="M3.5 22C3.5 17.5817 7.08172 14 11.5 14H12.5C16.9183 14 20.5 17.5817 20.5 22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <span class="text">Agents</span>
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
            <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <ol class="sub-nav">
          <li class="status" data-nav="status">
            <a href="/wallet/agents/status">
              <span class="text">Status</span>
            </a>
          </li>
          <li class="apply" data-nav="apply">
            <a href="/wallet/agents/apply">
              <span class="text">Apply</span>
            </a>
          </li>
          <li class="locations" data-nav="locations">
            <a href="/wallet/agents/locations">
              <span class="text">My Locations</span>
            </a>
          </li>
          <li class="earnings" data-nav="earnings">
            <a href="/wallet/agents/earnings">
              <span class="text">Earnings</span>
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
          padding: 0 0 3px 0;
          font-family: var(--font-text), sans-serif;
          color: var(--text-color);
        }

        ul.nav > li > .link {
          /* border: 1px solid red; */
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 0;
          margin:  0;
          width: 100%;
          cursor: pointer;
          color: inherit;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(0);
        }

        ul.nav > li > .link:hover,
        ul.nav > li.active > .link {
          /* background: var(--gray-background); */
          color: var(--accent-color);
          /* transform: translateX(3px); */
        }

        ul.nav > li > .link > svg {
          width: 16px;
          height: 16px;
          color: var(--text-color);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        ul.nav > li:hover > .link > svg,
        ul.nav > li.active > .link > svg {
          transform: rotate(180deg);
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        ul.nav > li:hover > .link > a > svg {
          transform: scale(1.1);
        }

        ul.nav > li > .link > a > span.text {
          font-size: 1rem;
          color: inherit;
        }

        ul.nav > li.active > .link > a > span.text {
          font-weight: 500;
          font-family: var(--font-text), sans-serif;
        }

        ul.nav > li > .sub-nav {
          list-style: none;
          padding: 0;
          margin: 0;
          display: none;
          flex-direction: column;
          gap: 0;
          width: 100%;
          max-height: 0;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(-10px);
        }

        ul.nav > li.active > .sub-nav {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 5px 0;
          max-height: 500px;
          opacity: 1;
          transform: translateY(0);
          animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
          transition: all 0.2s ease-in-out;
          transform: translateX(0);
          opacity: 0.8;
        }

        ul.nav > li > .sub-nav > li:hover,
        ul.nav > li > .sub-nav > li.current {
          color: var(--text-color);
          background: var(--gray-background);
          transform: translateX(8px);
          opacity: 1;
        }

        ul.nav > li > .sub-nav > li > a {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 0 0 5px;
          width: 100%;
          cursor: pointer;
          color: inherit;
          position: relative;
        }

        ul.nav > li > .sub-nav > li > a > span.text {
          font-size: 1rem;
          font-family: inherit;
          color: inherit;
        }

        /* add a hyphen before the text in the anchor tag */
        ul.nav > li > .sub-nav > li > a::before {
          content: "- ";
          color: inherit;
          font-weight: 500;
          font-family: var(--font-text), sans-serif;
          position: absolute;
          left: -8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
        }

        ul.nav > li > .sub-nav > li > a > svg {
          width: 16px;
          height: 16px;
          color: var(--text-color);
        }

				@keyframes slideDown {
          0% {
            max-height: 0;
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            max-height: 500px;
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateX(-5px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        ul.nav > li > .sub-nav > li.current {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
          }
        }

        ul.nav > li.active > .sub-nav > li {
          animation: fadeIn 0.3s ease-out forwards;
        }

        ul.nav > li.active > .sub-nav > li:nth-child(1) { animation-delay: 0.1s; }
        ul.nav > li.active > .sub-nav > li:nth-child(2) { animation-delay: 0.15s; }
        ul.nav > li.active > .sub-nav > li:nth-child(3) { animation-delay: 0.2s; }
        ul.nav > li.active > .sub-nav > li:nth-child(4) { animation-delay: 0.25s; }
        ul.nav > li.active > .sub-nav > li:nth-child(5) { animation-delay: 0.3s; }
        ul.nav > li.active > .sub-nav > li:nth-child(6) { animation-delay: 0.35s; }
        ul.nav > li.active > .sub-nav > li:nth-child(7) { animation-delay: 0.4s; }
        ul.nav > li.active > .sub-nav > li:nth-child(8) { animation-delay: 0.45s; }

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