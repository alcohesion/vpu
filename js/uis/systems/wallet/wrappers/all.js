export default class AllAccounts extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.mql = window.matchMedia('(max-width: 700px)');
    this.app = window.app;
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
    this.watchMql();
  }

  connectedCallback() {
    this.initializeWallet();
    // Set the header based on media query
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
        sectionTitle: 'Wallet',
        description: 'Wallet info and quick actions',
      });
    }
  }

  initializeWallet = () => {
    // Initialize visibility toggles
    const balanceToggle = this.shadowObj.querySelector('.visibility-toggle');
    const accountsToggle = this.shadowObj.querySelector('.toggle-visibility');

    if (balanceToggle) {
      balanceToggle.addEventListener('click', this.toggleBalanceVisibility);
    }

    if (accountsToggle) {
      accountsToggle.addEventListener('click', this.toggleAccountsVisibility);
    }

    // Initialize action buttons
    this.initializeActionButtons();
  }

  initializeActionButtons = () => {
    const actionButtons = this.shadowObj.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleQuickAction(action);
      });
    });
  }

  handleQuickAction = (action) => {
    console.log(`Executing ${action} action`);
    // Add your action handling logic here
  }

  toggleBalanceVisibility = () => {
    const toggle = this.shadowObj.querySelector('.visibility-toggle');
    const isVisible = toggle.dataset.balanceVisible === 'true';
    const balances = this.shadowObj.querySelectorAll('.main-balance, .balance-amount');

    balances.forEach(balance => {
      if (isVisible) {
        balance.style.filter = 'blur(8px)';
      } else {
        balance.style.filter = 'none';
      }
    });

    toggle.dataset.balanceVisible = !isVisible;
    toggle.querySelector('svg').innerHTML = isVisible ? this.getHideIcon() : this.getViewIcon();
  }

  toggleAccountsVisibility = () => {
    const toggle = this.shadowObj.querySelector('.toggle-visibility');
    const isVisible = toggle.dataset.accountsVisible === 'true';
    const balances = this.shadowObj.querySelectorAll('.balance-amount');

    balances.forEach(balance => {
      if (isVisible) {
        balance.style.filter = 'blur(8px)';
      } else {
        balance.style.filter = 'none';
      }
    });

    toggle.dataset.accountsVisible = !isVisible;
    toggle.querySelector('span').textContent = isVisible ? 'Show Balances' : 'Hide Balances';
    toggle.querySelector('svg').innerHTML = isVisible ? this.getHideIcon() : this.getViewIcon();
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
      ${this.getWalletOverview()}
      ${this.getQuickActions()}
      ${this.getAccountsGrid()}
      ${this.getRecentActivity()}
    `;
  }

  getWalletOverview = () => {
    const totalBalance = 78649.23 + 87354.01 + 5364.0 + 234.65;
    return /* html */`
      <div class="wallet-overview">
        <div class="balance-card">
          <div class="balance-header">
            <div class="balance-info">
              <span class="label">Total Balance</span>
              <div class="amount-container">
                <span class="currency">THA</span>
                <span class="main-balance">${this.app.utils.number.balanceWithCommas(totalBalance)}</span>
              </div>
            </div>
            <button class="visibility-toggle" data-balance-visible="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none">
                ${this.getViewIcon()}
              </svg>
            </button>
          </div>
          <div class="balance-trend">
            <div class="growth-indicator">
              <div class="growth-content">
                <span class="growth-value">+12.5%</span>
                <span class="growth-period">vs last month</span>
              </div>
            </div>
            <div class="growth-indicator change-indicator">
              <div class="growth-content">
                <span class="growth-value">+${this.app.utils.format(78545)}</span>
                <span class="growth-period">monthly change</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getQuickActions = () => {
    return /* html */`
      <div class="quick-actions-section">
        <h3 class="section-title">Quick Actions</h3>
        <div class="actions-grid">
          <button class="action-btn primary" data-action="deposit">
            <div class="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M3.09477 10.0002C3.03217 10.4572 2.99976 10.9247 2.99976 11.4002C2.99976 16.7021 7.02919 21.0002 11.9998 21.0002C16.9703 21.0002 20.9998 16.7021 20.9998 11.4002C20.9998 10.9247 20.9673 10.4572 20.9047 10.0002" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M11.9998 13.0002L11.9998 3.0002M11.9998 13.0002C11.2995 13.0002 9.99129 11.0059 9.49976 10.5002M11.9998 13.0002C12.7 13.0002 14.0082 11.0059 14.4998 10.5002" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="action-content">
              <span class="action-text">Deposit</span>
              <span class="action-desc">${this.mql.matches ? "Add funds" : "Top up account"}</span>
            </div>
          </button>
          
          <button class="action-btn secondary" data-action="withdraw">
            <div class="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M3.09502 10C3.03242 10.457 3 10.9245 3 11.4C3 16.7019 7.02944 21 12 21C16.9706 21 21 16.7019 21 11.4C21 10.9245 20.9676 10.457 20.905 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M12 3L12 13M12 3C11.2998 3 9.99153 4.9943 9.5 5.5M12 3C12.7002 3 14.0085 4.9943 14.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="action-content">
              <span class="action-text">Withdraw</span>
              <span class="action-desc">${this.mql.matches ? "Get money" : "Take money out"}</span>
            </div>
          </button>
          
          <button class="action-btn accent" data-action="pay">
            <div class="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M2 4.5H8.75736C9.55301 4.5 10.3161 4.81607 10.8787 5.37868L14 8.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5 13.5H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.5 7.5L10.5 9.5C11.0523 10.0523 11.0523 10.9477 10.5 11.5C9.94772 12.0523 9.05229 12.0523 8.5 11.5L7 10C6.13931 10.8607 4.77671 10.9575 3.80294 10.2272L3.5 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5 11V15.5C5 17.3856 5 18.3284 5.58579 18.9142C6.17157 19.5 7.11438 19.5 9 19.5H18C19.8856 19.5 20.8284 19.5 21.4142 18.9142C22 18.3284 22 17.3856 22 15.5V12.5C22 10.6144 22 9.67157 21.4142 9.08579C20.8284 8.5 19.8856 8.5 18 8.5H9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.25 14C15.25 14.9665 14.4665 15.75 13.5 15.75C12.5335 15.75 11.75 14.9665 11.75 14C11.75 13.0335 12.5335 12.25 13.5 12.25C14.4665 12.25 15.25 13.0335 15.25 14Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="action-content">
              <span class="action-text">Pay</span>
              <span class="action-desc">${this.mql.matches ? "Bills/Services" : "Pay bills and services"}</span>
            </div>
          </button>
          
          <button class="action-btn success" data-action="send">
            <div class="action-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M11.922 4.79004C16.6963 3.16245 19.0834 2.34866 20.3674 3.63261C21.6513 4.91656 20.8375 7.30371 19.21 12.078L18.1016 15.3292C16.8517 18.9958 16.2267 20.8291 15.1964 20.9808C14.9195 21.0216 14.6328 20.9971 14.3587 20.9091C13.3395 20.5819 12.8007 18.6489 11.7231 14.783C11.4841 13.9255 11.3646 13.4967 11.0924 13.1692C11.0134 13.0742 10.9258 12.9866 10.8308 12.9076C10.5033 12.6354 10.0745 12.5159 9.21705 12.2769C5.35111 11.1993 3.41814 10.6605 3.0909 9.64127C3.00292 9.36724 2.97837 9.08053 3.01916 8.80355C3.17088 7.77332 5.00419 7.14834 8.6708 5.89838L11.922 4.79004Z" stroke="currentColor" stroke-width="1.8" />
              </svg>
            </div>
            <div class="action-content">
              <span class="action-text">Send</span>
              <span class="action-desc">${this.mql.matches ? "Transfer" : "Transfer money"}</span>
            </div>
          </button>
        </div>
      </div>
    `;
  }

  getAccountsGrid = () => {
    return /* html */`
      <div class="accounts-section">
        <div class="section-header">
          <h3 class="section-title">My Accounts</h3>
          <button class="toggle-visibility" data-accounts-visible="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="currentColor" fill="none">
              ${this.getViewIcon()}
            </svg>
            <span>Hide Balances</span>
          </button>
        </div>
        <div class="accounts-grid">
          <div class="account-card holding-account" data-account="holding">
            <div class="account-header">
              <div class="account-type">
                <div class="type-indicator holding"></div>
                <span class="type-name">Holding</span>
              </div>
            </div>
            <div class="account-balance">
              <span class="balance-amount">${this.app.utils.number.balanceWithCommas(78649.23)}</span>
              <span class="balance-currency">THA</span>
            </div>
            <div class="account-info">
              <span class="account-holder">John Doe</span>
              <span class="account-number">****7890</span>
            </div>
            <div class="account-actions">
              <button class="account-action">View Details</button>
            </div>
          </div>

          <div class="account-card investment-account" data-account="investment">
            <div class="account-header">
              <div class="account-type">
                <div class="type-indicator investment"></div>
                <span class="type-name">Investment</span>
              </div>
            </div>
            <div class="account-balance">
              <span class="balance-amount">${this.app.utils.number.balanceWithCommas(87354.01)}</span>
              <span class="balance-currency">THA</span>
            </div>
            <div class="account-info">
              <span class="account-holder">John Doe</span>
              <span class="account-number">****4521</span>
            </div>
            <div class="account-actions">
              <button class="account-action">View Details</button>
            </div>
          </div>

          <div class="account-card loan-account" data-account="loan">
            <div class="account-header">
              <div class="account-type">
                <div class="type-indicator loan"></div>
                <span class="type-name">Loan</span>
              </div>
            </div>
            <div class="account-balance loan-balance">
              <span class="balance-amount">${this.app.utils.number.balanceWithCommas(5364.0)}</span>
              <span class="balance-currency">THA</span>
            </div>
            <div class="account-info">
              <span class="account-holder">Outstanding</span>
              <span class="account-number">Due: Mar 2025</span>
            </div>
            <div class="account-actions">
              <button class="account-action">Make Payment</button>
            </div>
          </div>

          <div class="account-card revenue-account" data-account="revenue">
            <div class="account-header">
              <div class="account-type">
                <div class="type-indicator revenue"></div>
                <span class="type-name">Revenue</span>
              </div>
            </div>
            <div class="account-balance">
              <span class="balance-amount">${this.app.utils.number.balanceWithCommas(234.65)}</span>
              <span class="balance-currency">THA</span>
            </div>
            <div class="account-info">
              <span class="account-holder">John Doe</span>
              <span class="account-number">****9876</span>
            </div>
            <div class="account-actions">
              <button class="account-action">View Details</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getRecentActivity = () => {
    return /* html */`
      <div class="activity-section">
        <div class="section-header">
          <h3 class="section-title">Recent Activity</h3>
          <button class="view-all-btn">
            <span>View All</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="activity-list">
          ${this.getTransactions()}
        </div>
      </div>
    `;
  }

  getViewIcon = () => {
    return /* html */`
      <path d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z" stroke="currentColor" stroke-width="1.8" />
      <path d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z" stroke="currentColor" stroke-width="1.8" />
    `;
  }

  getHideIcon = () => {
    return /* html */`
      <path d="M19.439 15.439C20.3636 14.5212 21.0775 13.6091 21.544 12.955C21.848 12.5287 22 12.3155 22 12C22 11.6845 21.848 11.4713 21.544 11.045C20.1779 9.12944 16.6892 5 12 5C11.0922 5 10.2294 5.15476 9.41827 5.41827M6.74742 6.74742C4.73118 8.1072 3.24215 9.94266 2.45604 11.045C2.15201 11.4713 2 11.6845 2 12C2 12.3155 2.15201 12.5287 2.45604 12.955C3.8221 14.8706 7.31078 19 12 19C13.9908 19 15.7651 18.2557 17.2526 17.2526" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9.85786 10C9.32783 10.53 9 11.2623 9 12.0711C9 13.6887 10.3113 15 11.9289 15C12.7377 15 13.47 14.6722 14 14.1421" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <path d="M3 3L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    `;
  }

  getAccountIcon = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="var(--background)">
        <path d="M21.9999 12C21.9999 17.5228 17.5228 22 11.9999 22C6.47709 22 1.99994 17.5228 1.99994 12C1.99994 6.47715 6.47709 2 11.9999 2C17.5228 2 21.9999 6.47715 21.9999 12Z" stroke="var(--background)" stroke-width="2" stroke-linejoin="round" />
        <path d="M14.9999 9L7.99994 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <path d="M9.99994 8.11274C9.99994 8.11274 14.8287 7.70569 15.5615 8.43847C16.2943 9.17125 15.8872 14 15.8872 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  getHistory = () => {
    return /* html */`
      <div class="section quick-history">
        <div class="header">
          <h2 class="title">Recent</h2>
        </div>
        <div class="transactions">
         <!--${this.getError()}-->
          ${this.getTransactions()}
        </div>
        <!--<div class="info">
          <p class="text">The above are the summary of your most recent transactions, made on all your accounts.</p>
        </div>-->
      </div>
    `;
  }

  getTransactions = () => {
    return /* html */`
      <div is="transaction-item" id="TAC534436534" name="Fredrick Ochieng" account="THA763442H" account-kind="Holding"
        amount="2734.65" datetime="2021-09-12T12:00:00Z" image="https://randomuser.me/api/portraits/men/1.jpg"
        kind="received" status="completed" note="Payment for services rendered" in="true">
      </div>
      <div is="transaction-item" id="TAC534436535" name="Loan Account" account="THA763442H"
        amount="950.43" datetime="2021-09-13T14:00:00Z" account-kind="Loan"
        kind="repay" status="completed" note="Loan repayment" in="false">
      </div>
      <div is="transaction-item" id="TAC534436536" name="Alice Johnson" account="THA763442H" account-kind="Investment"
        amount="9816.81" datetime="2021-09-14T16:00:00Z" image="https://randomuser.me/api/portraits/women/15.jpg"
        kind="deposit" status="completed" note="Deposit from client" in="true">
      </div>
      <div is="transaction-item" id="TAC534436537" name="Bob Brown" account="THA763442H"
        amount="755.65" datetime="2021-09-15T18:00:00Z" account-kind="Holding"
        kind="send" status="completed" note="Payment for services rendered" in="false">
      </div>
      <div is="transaction-item" id="TAC534436542" name="Grace Harris" account="THA763442H" account-kind="Investment"
        amount="700.00" datetime="2021-09-20T16:00:00Z" image="https://randomuser.me/api/portraits/men/1.jpg"
        kind="apply" status="completed" note="Applied for loan" in="true">
      </div>
      <div is="transaction-item" id="TAC534436543" name="Henry Irving" account="THA763442H" account-kind="Investment"
        amount="800.00" datetime="2024-09-21T18:00:00Z" image="https://randomuser.me/api/portraits/men/11.jpg"
        kind="pay" status="completed" note="Payment for services rendered" in="false">
      </div>
      <div is="transaction-item" id="TAC534436544" name="Ivy Johnson" account="THA763442H"
        amount="900.00" datetime="2021-09-22T20:00:00Z" account-kind="Revenue"
        kind="withdraw" status="completed" note="Withdrawal from account" in="false"> 
      </div>
      <div is="transaction-item" id="TAC534436544" name="Mpesa Deposit" account="THA763442H"
        amount="2358.00" datetime="2024-10-13T20:45:00Z" account-kind="Holding"
        kind="Deposit" status="completed" note="Deposit from MPESA" in="true"> 
      </div>
    `;
  }

  getEmpty = () => {
    return /* html */`
      <div class="empty">
        <h2 class="text">No recent transactions</h2>
        <p class="text">You have not made any transactions yet.</p>
      </div>
    `;
  }

  getError = () => {
    return /* html */`
      <div class="empty error">
        <h2 class="text">Error loading transactions</h2>
        <p class="text">There was an error loading your transactions.</p>
        <button class="retry">Retry</button>
      </div>
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

        h1, h2, h3, h4, h5, h6 {
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
          flex-direction: column;
          gap: 32px;
          width: 100%;
          min-height: 100vh;
          background: var(--background);
        }

        /* Wallet Overview Section */
        .wallet-overview {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          padding: 0;
          margin: 24px 0 0;
          background: var(--background);
          border-radius: 24px;
        }

        .balance-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 16px;
          padding: 20px 20px;
          background: var(--accent-linear);
          border-radius: 20px;
          color: var(--white-color);
          position: relative;
          overflow: hidden;
        }

        .balance-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          z-index: 2;
        }

        .balance-info .label {
          font-size: 0.9rem;
          font-family: var(--font-text), sans-serif;
          opacity: 0.8;
          display: block;
          margin-bottom: 8px;
        }

        .amount-container {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .currency {
          font-size: 1.1rem;
          font-family: var(--font-mono), monospace;
          font-weight: 600;
          opacity: 0.9;
        }

        .main-balance {
          font-size: 2.8rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 700;
          line-height: 1;
          transition: filter 0.3s ease;
        }

        .visibility-toggle {
          background: var(--action-background);
          border:  2px solid var(--alt-color);
          border-radius: 12px;
          padding: 8px;
          color: var(--white-color);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .visibility-toggle:hover {
          transform: scale(1.05);
        }

        .visibility-toggle svg {
          width: 20px;
          height: 20px;
          color: currentColor;
        }

        .balance-trend {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          position: relative;
          z-index: 2;
        }

        .growth-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 14px;
          backdrop-filter: blur(12px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideInUp 0.6s ease-out 0.3s both;
        }

        .growth-indicator:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        }

        .growth-indicator.positive {
          border-color: rgba(16, 185, 129, 0.3);
        }

        .growth-indicator.negative {
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.1);
        }

        .growth-indicator.negative:hover {
          background: rgba(239, 68, 68, 0.15);
        }

        .growth-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: var(--anchor-linear);
          border-radius: 10px;
          color: var(--white-color);
          animation: pulse 2s infinite;
          transition: all 0.3s ease;
        }

        .growth-icon.positive {
          background: var(--anchor-linear);
        }

        .growth-icon.negative {
          background: var(--warn-linear);
        }

        .growth-icon svg {
          animation: bounce 1.2s ease-in-out infinite alternate;
          transition: transform 0.3s ease;
        }

        .growth-icon.negative svg {
          transform: rotate(180deg);
        }

        .growth-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .growth-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--white-color);
          line-height: 1.2;
          transition: color 0.3s ease;
        }

        .growth-value.positive {
          color: var(--white-color);
        }

        .growth-value.negative {
          color: var(--warn-color);
        }

        .growth-period {
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.2;
        }

        .change-indicator {
          animation-delay: 0.4s;
        }

        .change-indicator.positive {
          border-color: rgba(52, 211, 153, 0.3);
        }

        .change-indicator.negative {
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.1);
        }

        .change-icon {
          background: var(--light-linear);
        }

        .change-icon.positive {
          background: var(--light-linear);
        }

        .change-icon.negative {
          background: var(--warn-linear);
        }

        .change-icon.negative svg {
          transform: rotate(180deg);
        }

        .change-indicator .growth-value {
          font-size: 1.05rem;
          color: var(--white-color);
        }

        .change-indicator .growth-value.positive {
          color: var(--white-color);
        }

        .change-indicator .growth-value.negative {
          color: var(--warn-color);
        }

        .change-indicator .growth-period {
          font-size: 0.75rem;
        }

        .trend-comparison {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 18px 24px;
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.25) 0%,
            rgba(255, 255, 255, 0.15) 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideInUp 0.6s ease-out;
        }

        .trend-comparison:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.35) 0%,
            rgba(255, 255, 255, 0.25) 100%);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .trend-indicator {
          display: flex;
          align-items: center;
          gap: 16px;
          color: var(--white-color);
        }

        .trend-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 12px;
          animation: pulse 2s infinite;
        }

        .trend-icon-wrapper svg {
          animation: bounce 1s ease-in-out infinite alternate;
        }

        .percentage {
          font-size: 1.3rem;
          font-weight: 700;
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          line-height: 1.2;
        }

        .trend-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-left: 8px;
        }

        .trend-text {
          font-size: 0.95rem;
          font-weight: 500;
          opacity: 0.9;
          color: var(--white-color);
          line-height: 1.3;
        }

        .trend-subtext {
          font-size: 0.85rem;
          opacity: 0.75;
          color: var(--white-color);
          font-weight: 400;
          line-height: 1.2;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
        }

        @keyframes pulseNegative {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
          }
        }

        .growth-icon.negative {
          animation: pulseNegative 2s infinite;
        }

        .change-icon.negative {
          animation: pulseNegative 2s infinite;
        }

        @keyframes bounce {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-2px);
          }
        }

        .stats-grid {
          width: 250px;
          display: flex;
          flex-flow: column;
          gap: 16px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--gray-background);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          color: var(--white-color);
        }

        .stat-icon.income {
          background: var(--light-linear);
        }

        .stat-icon.expense {
          background: var(--warn-linear);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-size: 1.25rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 700;
          color: var(--text-color);
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--gray-color);
          font-weight: 500;
        }

        /* Quick Actions Section */
        .quick-actions-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .section-title {
          font-size: 1.5rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 700;
          color: var(--text-color);
          margin: 0;
          position: relative;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .action-btn {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 20px;
          background: var(--background);
          border: 2px solid transparent;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          min-height: 70px;
        }

        .action-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          opacity: 0.05;
          transition: left 0.3s ease;
          z-index: 0;
        }

        .action-btn.primary {
          border-color: var(--accent-color);
        }

        .action-btn.primary::before {
          background: var(--accent-linear);
        }

        .action-btn.secondary {
          border-color: var(--gray-color);
        }

        .action-btn.secondary::before {
          background: var(--button-linear);
        }

        .action-btn.accent {
          border-color: var(--alt-color);
        }

        .action-btn.accent::before {
          background: var(--light-linear);
        }

        .action-btn.success {
          border-color: var(--anchor-color);
        }

        .action-btn.success::before {
          background: var(--tab-linear);
        }

        .action-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
          border-color: var(--accent-color);
        }

        .action-btn:hover::before {
          left: 0;
        }

        .action-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          min-width: 48px;
          min-height: 48px;
          background: var(--accent-linear);
          border-radius: 12px;
          color: var(--white-color);
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .action-btn:hover .action-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .action-text {
          text-align: left;
          font-size: 1.1rem;
          line-height: 1.4;
          font-family: var(--font-main), sans-serif;
          font-weight: 600;
          color: var(--text-color);
          position: relative;
          z-index: 1;
        }

        .action-desc {
          font-size: 0.85rem;
          color: var(--gray-color);
          font-weight: 400;
          text-align: left;
          position: relative;
          z-index: 1;

          /* add elipsis for long text */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Accounts Section */
        .accounts-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .toggle-visibility {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--background);
          border: var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          color: var(--gray-color);
        }

        .toggle-visibility:hover {
          background: var(--nav-background);
          border-color: var(--accent-color);
          color: var(--accent-color);
        }

        .accounts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .account-card {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 28px;
          background: var(--background);
          border-radius: 24px;
          border: 2px solid transparent;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .account-card.holding-account {
          background: var(--holding-background);
          border-color: rgba(var(--accent-color-rgb, 59, 130, 246), 0.2);
        }

        .account-card.holding-account::before {
          background: var(--accent-linear);
        }

        .account-card.holding-account:hover {
          border-color: var(--accent-color);
          box-shadow: 0 16px 40px rgba(59, 130, 246, 0.15);
        }

        .account-card.investment-account {
          background: var(--investment-background);
          border-color: rgba(var(--alt-color-rgb, 16, 185, 129), 0.2);
        }

        .account-card.investment-account::before {
          background: var(--second-linear);
        }

        .account-card.investment-account:hover {
          border-color: var(--alt-color);
          box-shadow: 0 16px 40px rgba(16, 185, 129, 0.15);
        }

        .account-card.loan-account {
          background: var(--loan-background);
          border-color: rgba(var(--warn-color-rgb, 239, 68, 68), 0.2);
        }

        .account-card.loan-account::before {
          background: var(--warn-linear);
        }

        .account-card.loan-account:hover {
          border-color: var(--warn-color);
          box-shadow: 0 16px 40px rgba(239, 68, 68, 0.15);
        }

        .account-card.revenue-account {
          background: var(--revenue-background);
          border-color: rgba(var(--anchor-color-rgb, 168, 85, 247), 0.2);
        }

        .account-card.revenue-account::before {
          background: var(--light-linear);
        }

        .account-card.revenue-account:hover {
          border-color: var(--anchor-color);
          box-shadow: 0 16px 40px rgba(168, 85, 247, 0.15);
        }

        .account-card:hover {
          transform: translateY(-6px);
        }

        .account-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .account-type {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 14px;
          background: var(--background);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .type-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .type-indicator.holding {
          background: var(--accent-linear);
        }

        .type-indicator.investment {
          background: var(--second-linear);
        }

        .type-indicator.loan {
          background: var(--warn-linear);
        }

        .type-indicator.revenue {
          background: var(--light-linear);
        }

        .type-name {
          font-size: 0.85rem;
          font-weight: 600;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .account-balance {
          display: flex;
          align-items: baseline;
          gap: 12px;
          font-family: var(--font-text), sans-serif;
          font-weight: 600;
          font-size: 1.2rem;
          color: var(--text-color);
          margin: 16px 0;
        }

        .balance-amount {
          font-size: 2.2rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 800;
          color: var(--text-color);
          transition: all 0.3s ease;
          line-height: 1;
          color: var(--accent-color);
        }

        .holding-account .balance-amount {
          color: var(--accent-color);
        }

        .investment-account .balance-amount {
          color: var(--alt-color);
        }

        .loan-account .balance-amount {
          color: var(--warn-color);
        }

        .revenue-account .balance-amount {
          color: var(--anchor-color);
        }
        }

        .balance-currency {
          font-size: 1.1rem;
          font-family: var(--font-mono), monospace;
          font-weight: 700;
          color: var(--gray-color);
          opacity: 0.8;
        }

        .account-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .account-holder {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-color);
        }

        .account-number {
          font-size: 0.85rem;
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
        }

        .account-actions {
          margin-top: auto;
        }

        .account-action {
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: 1px solid var(--accent-color);
          border-radius: 12px;
          color: var(--accent-color);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .account-action:hover {
          background: var(--accent-color);
          color: var(--white-color);
          transform: translateY(-1px);
        }

        /* Activity Section */
        .activity-section {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: transparent;
          border: 1px solid var(--accent-color);
          border-radius: 12px;
          color: var(--accent-color);
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .view-all-btn:hover {
          background: var(--accent-color);
          color: var(--white-color);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Animations */
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .wallet-overview {
          animation: fadeInUp 0.6s ease-out;
        }

        .quick-actions-section {
          animation: fadeInUp 0.6s ease-out 0.1s both;
        }

        .accounts-section {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .activity-section {
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }

        .account-card:nth-child(1) {
          animation: slideInLeft 0.6s ease-out 0.4s both;
        }

        .account-card:nth-child(2) {
          animation: slideInLeft 0.6s ease-out 0.5s both;
        }

        .account-card:nth-child(3) {
          animation: slideInLeft 0.6s ease-out 0.6s both;
        }

        .account-card:nth-child(4) {
          animation: slideInLeft 0.6s ease-out 0.7s both;
        }

        .action-btn:nth-child(1) {
          animation: slideInLeft 0.6s ease-out 0.2s both;
        }

        .action-btn:nth-child(2) {
          animation: slideInLeft 0.6s ease-out 0.3s both;
        }

        .action-btn:nth-child(3) {
          animation: slideInLeft 0.6s ease-out 0.4s both;
        }

        .action-btn:nth-child(4) {
          animation: slideInLeft 0.6s ease-out 0.5s both;
        }

        /* Responsive Design */
        @media screen and (max-width: 700px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          :host {
            gap: 30px;
            padding: 60px 10px 70px;
          }

          /* Wallet Overview Section */
          .wallet-overview {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;
            gap: 24px;
            padding: 0;
            margin: 20px 0 10px;
            background: var(--background);
            border-radius: 24px;
          }

          .balance-card {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 16px;
            padding: 20px 20px;
            background: var(--accent-linear);
            border-radius: 20px;
            color: var(--white-color);
            position: relative;
            overflow: hidden;
          }

          .balance-card {
            padding: 24px;
          }

          .main-balance {
            font-size: 2.2rem;
          }

          .actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .accounts-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .action-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            min-width: 40px;
            min-height: 40px;
            background: var(--accent-linear);
            border-radius: 12px;
            color: var(--white-color);
            position: relative;
            z-index: 1;
            transition: all 0.3s ease;
          }

          .action-btn:hover .action-icon {
            transform: scale(1.1) rotate(5deg);
          }

          .action-text {
            text-align: left;
            font-size: 1rem;
            line-height: 1.2;
            font-family: var(--font-main), sans-serif;
            font-weight: 600;
            color: var(--text-color);
            position: relative;
            z-index: 1;
          }

          .action-desc {
            font-size: 0.75rem;
            color: var(--gray-color);
            font-weight: 400;
            position: relative;
            z-index: 1;
            width: 100%;

            /* add elipsis for long text */
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .action-btn,
          .account-card,
          .toggle-visibility,
          .view-all-btn,
          .account-action {
            cursor: default !important;
          }

          .section-title {
            font-size: 1.3rem;
          }

          .action-btn,
          .account-card {
            padding: 10px;
          }
          .account-card {
            padding: 10px;
          }

          .account-balance {
            display: flex;
            align-items: baseline;
            gap: 10px;
            color: var(--text-color);
            margin: 0;
          }
        }

        @media screen and (max-width: 480px) {
          .wallet-overview {
            gap: 16px;
          }

          .main-balance {
            font-size: 2.1rem;
          }
        }
      </style>
    `;
  }
}