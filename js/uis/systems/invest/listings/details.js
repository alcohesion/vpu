export default class ListingDetails extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.utils = window.app.utils;
    this.soldPercentage = this.getPercentageSold(this.getAttribute("sold"), this.getAttribute("shares"));
    this.available = this.getRemainingShares(this.getAttribute("sold"), this.getAttribute("shares"));
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  // noinspection JSUnusedGlobalSymbols
  connectedCallback() {
    const form = this.shadowObj.querySelector(".form");

    // add event listeners
    this.inputListener(form);
  }

  getPercentageSold = (sold, total) => {
    const parsedSold = this.utils.number.parse(sold);
    const parsedTotal = this.utils.number.parse(total);
    return this.calculatePercentage(parsedSold, parsedTotal);
  }

  getRemainingShares = (sold, total) => {
    const parsedSold = this.utils.number.parse(sold);
    const parsedTotal = this.utils.number.parse(total);
    return parsedTotal - parsedSold;
  }

  calculatePercentage = (num, total) => {
    if (total === 0) return 0;
    if (num >= total) return 100;
    return ((num / total) * 100).toFixed(2);
  }

  capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
      <div class="content">
        ${this.getHead()}
        ${this.getInfo()}
        ${this.getForm(this.available, this.utils.number.parse(this.getAttribute("price")))}
      </div>
    `;
  }

  getHead = () => {
    return /* html */`
      <div class="head">
        <div class="avatar">
          <img class="image" src="${this.getAttribute("user-picture")}" alt="User Image" />
        </div>
        <span class="name">
          <span class="username">${this.getAttribute("user-name")}</span>
          <span class="time">${this.utils.date.formatDateTime(this.getAttribute("datetime"))}</span>
        </span>
      </div>
    `;
  }

  getInfo = () => {
    return /* html */`
      <div class="desc">
        <div class="investment">
          <h2 class="name">${this.getAttribute("shares-name")}</h2>
          <span class="category">${this.capitalize(this.getAttribute("category"))}</span>
        </div>
        ${this.getDesc()}
        ${this.getPrice()}
        ${this.getDetails()}
        ${this.getShares()}
      </div>
    `;
  }

  getDetails = () => {
    return /* html */`
      <div class="info">
        <div class="initial">
          <span class="label">IPO Price</span>
          <span class="value">${this.getAttribute("share-price")} EAC</span>
        </div>
        <span class="line"></span>
        <div class="roi">
          <span class="label">ROI</span>
          <span class="value">${this.getAttribute("roi")}%</span>
        </div>
        <span class="line"></span>
        <div class="sold">
          <span class="value">${this.soldPercentage}%</span>
          <span class="label">Sold</span>
        </div>
      </div>
    `;
  }

  getPrice = () => {
    return /* html */`
      <div class="info">
        <div class="price">
          <span class="value">${this.getAttribute("price")} EAC</span>
          <span class="label">Listing Price</span>
        </div>
      </div>
    `;
  }

  getShares = () => {
    return /* html */`
      <div class="listed">
        <div class="shares">
          <span class="value">${this.utils.number.withCommas(this.getAttribute("shares"))}</span>
          <span class="label">Offered Shares</span>
        </div>
        <span class="sp">•</span>
        ${this.getAvailable(this.available)}
      </div>
    `;
  }

  getDesc = () => {
    return /* html */`
      <div class="description">
        ${this.innerHTML}
      </div>
    `;
  }

  getAvailable = available => {
    const availableValue = available <= 0 ? 0 : this.utils.number.withCommas(available);
    return /* html */`
      <div class="available">
        <span class="value">${availableValue}</span>
        <span class="label">Available</span>
      </div>
    `;
  }

  getForm = (available, price) => {
    const total = available * price;
    return /* html */`
      <form class="form">
        <div class="head">
          <h2 class="title">Quote what you want to buy</h2>
          <p class="description">You can buy up to <b>${this.utils.number.withCommas(available)}</b> shares at <b>${this.utils.number.withCommas(price)} EAC</b> each.</p>
        </div>
        <div class="input-group pay">
          <span class="label">You pay</span>
          <div class="input">
            <div class="one">
              <input type="text" step="0.01" class="no-spinner" name="pay" placeholder="${this.utils.number.withCommas(total)} EAC" />
              <span class="warning">You can only pay up to <span>${this.calculateMaxPay(available, price)} EAC</span></span>
            </div>
          </div>
        </div>
        <div class="input-group receive">
          <span class="label">You receive</span>
          <div class="input">
            <div class="one">
              <input type="text" step="0.0001" class="no-spinner" name="receive" placeholder="${this.calculateReceive(total, price)} Shares" />
              <span class="warning">You can only buy up to <span>${this.utils.number.withCommas(available)}</span> shares</span>
            </div>
            <span class="actions">
              <button type="button" class="all">All</button>
            </span>
          </div>
        </div>
        <div class="consent">
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>By clicking <b>Buy shares,</b> you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</span>
          </p>
        </div>
        <div class="actions">
          <button type="button" class="action cancel">Cancel order</button>
          <button type="submit" class="action buy disabled">Buy shares</button>
        </div>
      </form>
    `;
  }

  calculateReceive = (pay, price) => {
    const receive = (pay / price).toFixed(4);
    return parseFloat(receive);
  }

  calculateMaxPay = (shares, price) => {
    return shares * price;
  }

  inputListener = form => {
    const pay = form.querySelector("input[name=pay]");
    const receive = form.querySelector("input[name=receive]");
    const all = form.querySelector("button.all");
    const warn = form.querySelector(".input-group.pay .warning");
    const receiveWarning = form.querySelector(".input-group.receive .warning");
    const buy = form.querySelector(".actions > button.buy");
    let maxShares = this.available;
    let maxPay = this.calculateMaxPay(maxShares, this.utils.number.parse(this.getAttribute("price")));

    maxPay = isNaN(maxPay) ? 0 : maxPay;
    maxShares = isNaN(maxShares) ? 0 : maxShares;

    const handlePayInput = () => {
      receiveWarning.style.display = "none";
      pay.value = pay.value
        .replace(/[^\d.]/g, '')
        .replace(/^\./, '')
        .replace(/(\..*)\./g, '$1')
        .replace(/^0+(?=\d)/, '')
        .replace(/(\.\d{4})\d+/g, '$1');

      const total = this.utils.number.parse(pay.value);
      const price = this.utils.number.parse(this.getAttribute("price"));
      const receiveValue = this.calculateReceive(total, price);

      if (total > maxPay) {
        warn.classList.add("failed");
        warn.classList.remove("success");
        warn.innerHTML = `You can only pay up to <span>${this.utils.number.withCommas(maxPay)} EAC</span>`;
        warn.style.display = "inline-block";
        buy.classList.add("disabled");

        // update receives warning
        receiveWarning.classList.add("failed");
        receiveWarning.classList.remove("success");
        receiveWarning.innerHTML = `You can only buy up to <span>${this.utils.number.withCommas(maxShares)}</span> shares`;
        receiveWarning.style.display = "inline-block";
      } else if (total === 0 || isNaN(total) || total < (price * 0.01)) {
        buy.classList.add("disabled");

        // update receives warning
        receiveWarning.classList.add("failed");
        receiveWarning.classList.remove("success");
        receiveWarning.innerHTML = `You should buy at least <span>0.01 Shares</span>`;
        receiveWarning.style.display = "inline-block";

        // update pay warning
        warn.classList.add("failed");
        warn.classList.remove("success");
        warn.innerHTML = `You should pay at least <span>${this.utils.number.withCommas(price * 0.01)} EAC</span>`;
        warn.style.display = "inline-block";
      } else {
        warn.classList.remove("failed");
        warn.classList.add("success");
        warn.innerHTML = `You will spend <span>${this.utils.number.withCommas(total)} EAC</span>`;
        warn.style.display = "inline-block";
        buy.classList.remove("disabled");

        // update receives warning
        receiveWarning.classList.remove("failed");
        receiveWarning.classList.add("success");
        receiveWarning.innerHTML = `You will buy <span>${this.utils.number.withCommas(receiveValue)} Shares</span>`;
        receiveWarning.style.display = "inline-block";
      }

      receive.value = total <= maxPay ? receiveValue : "";
    };

    const handleAllClick = () => {
      const available = this.available;
      const price = this.utils.number.parse(this.getAttribute("price"));
      const totalPay = this.calculateMaxPay(available, price);

      form.querySelector(".input-group.pay .warning").style.display = "none";
      form.querySelector(".input-group.receive .warning").style.display = "none";

      pay.value = totalPay;
      receive.value = this.available;
      buy.classList.remove("disabled");

      // update receives warning and pay warning
      receiveWarning.classList.remove("failed");
      receiveWarning.classList.add("success");
      receiveWarning.innerHTML = `You will buy <span>${this.utils.number.withCommas(available)} Shares</span>`;
      receiveWarning.style.display = "inline-block";

      warn.classList.remove("failed");
      warn.classList.add("success");
      warn.innerHTML = `You will spend <span>${this.utils.number.withCommas(totalPay)} EAC</span>`;
      warn.style.display = "inline-block";
    };

    const handleReceiveInput = () => {
      warn.style.display = "none";
      receive.value = receive.value
        .replace(/[^\d.]/g, '')
        .replace(/^\./, '')
        .replace(/(\..*)\./g, '$1')
        .replace(/^0+(?=\d)/, '')
        .replace(/(\.\d{4})\d+/g, '$1');

      const total = this.utils.number.parse(receive.value);
      const price = this.utils.number.parse(this.getAttribute("price"));
      let receiveValue = total * price;

      // if receive value has more than 4 decimal places round it off to four
      receiveValue = parseFloat(receiveValue.toFixed(4));

      if (total > maxShares) {
        receiveWarning.classList.add("failed");
        receiveWarning.classList.remove("success");
        receiveWarning.innerHTML = `You can only buy up to <span>${this.utils.number.withCommas(maxShares)}</span> shares`;
        receiveWarning.style.display = "inline-block";
        buy.classList.add("disabled");

        // update pay warning
        warn.classList.add("failed");
        warn.classList.remove("success");
        warn.innerHTML = `You can only pay up to <span>${this.utils.number.withCommas(receiveValue)} EAC</span>`;
        warn.style.display = "inline-block";
      } else if (total === 0 || isNaN(total) || total < 0.01) {
        buy.classList.add("disabled");

        // update pay warning
        warn.classList.add("failed");
        warn.classList.remove("success");
        warn.innerHTML = `You should pay at least 0.0001 EAC`;
        warn.style.display = "inline-block";

        // update receives warning
        receiveWarning.classList.add("failed");
        receiveWarning.classList.remove("success");
        receiveWarning.innerHTML = `You should buy at least 0.01 Shares`;
        receiveWarning.style.display = "inline-block";
      } else {
        receiveWarning.classList.remove("failed");
        receiveWarning.classList.add("success");
        receiveWarning.innerHTML = `You will buy <span>${this.utils.number.withCommas(total)} Shares</span>`;
        receiveWarning.style.display = "inline-block";
        buy.classList.remove("disabled");

        // update pay warning
        warn.classList.remove("failed");
        warn.classList.add("success");
        warn.innerHTML = `You will spend <span>${this.utils.number.withCommas(receiveValue)} EAC</span>`;
        warn.style.display = "inline-block";
      }

      pay.value = total <= maxShares ? receiveValue : "";
    };

    pay.addEventListener("input", handlePayInput);
    all.addEventListener("click", handleAllClick);
    receive.addEventListener("input", handleReceiveInput);
  };

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
          padding: 15px 0 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          height: max-content;
          align-items: start;
          justify-content: space-between;
          gap: 0;
          width: 100%;
        }

        .content {
          display: flex;
          flex-flow: column;
          gap: 2px;
          padding: 0;
          align-items: start;
          justify-content: space-between;
          transition: 0.3s;
          overflow: hidden;
        }

        .head {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0;
          width: 100%;
          min-width: 100%;
          height: max-content;
        }

        .head > .avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          overflow: hidden;
        }

        .head > .avatar > .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .head > .name {
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .head > .name > .username {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-color);
        }

        .head > .name > .time {
          font-size: 0.9rem;
          color: var(--gray-color);
        }

        /* Description: Create a container for the description */
        .description {
          width: 100%;
          padding: 0;
          height: max-content;
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
        }

        .description * {
          margin: 0;
          padding: 0;
        }

        .description p {
          margin: 4px 0 10px;
          line-height: 1.4;
        }

        .description a {
          color: var(--anchor-color);
        }

        .desc {
          display: flex;
          flex-flow: column;
          gap: 5px;
          padding: 10px 0 0 0;
          width: 100%;
          min-width: 100%;
          height: max-content;
        }

        .desc > .investment {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
          width: 100%;
          height: max-content;
        }

        .desc > .investment > .name {
          margin: 0;
          padding: 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-color);
        }

        .desc > .investment > .category {
          font-size: 0.9rem;
          font-weight: 500;
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
        }

        .desc > .listed {
          display: flex;
          flex-flow: row;
          gap: 6px;
          color: var(--gray-color);
          padding: 10px 0;
          width: 100%;
          align-items: center;
          height: max-content;
        }

        .desc > .listed > .shares {
          display: flex;
          flex-flow: row;
          gap: 5px;
          padding: 0;
          height: max-content;
        }

        .desc > .listed > .shares > .value {
          font-size: 1rem;
          font-weight: 600;
          padding: 0;
          font-family: var(--font-text), sans-serif;
          color: var(--text-color);
        }

        .desc > .listed > .shares > .label {
          font-size: 1rem;
          font-weight: 500;
          padding: 0;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }

        .info {
          display: flex;
          flex-flow: row;
          gap: 40px;
          width: 100%;
          height: max-content;
          align-items: center;
          padding: 7px 0;
        }

        .info > span.line {
          display: flex;
          width: 2px;
          border-radius: 2px;
          height: 20px;
          background: var(--gray-background);
        }

        .info > div {
          display: flex;
          flex-flow: column;
          gap: 5px;
          width: max-content;
          height: max-content;
        }

        .info > div > .value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--gray-color);
        }

        .info > div.price > .value {
          font-size: 1.2rem;
          font-weight: 600;
          font-family: var(--font-text), sans-serif;
          color: var(--accent-color);
        }

        .info > div.price > .label {
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }

        .info > div > .label {
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }

        .listed > .available {
          display: flex;
          flex-flow: row;
          gap: 5px;
          padding: 0;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }

        .listed > .available > .value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-color);
        }

        .listed > .available > .label {
          font-size: 1rem;
          font-weight: 400;
          color: var(--gray-color);
        }

        /* For Chrome, Safari, Edge, and Opera */
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* For Firefox */
        .no-spinner[type=number] {
          -moz-appearance: textfield;
        }

        .form {
          /* border-top: var(--border); */
          display: flex;
          flex-flow: column;
          gap: 15px;
          width: 100%;
          padding: 10px 0;
          margin: 0 0 10px;
        }

        .form > .head {
          display: none;
          flex-flow: column;
          align-content: start;
          align-items: start;
          gap: 0;
          width: 100%;
          padding: 0;
        }

        .form > .head > .title {
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          margin: 0;
          line-height: 1.4;
        }

        .form > .head > .description {
          display: flex;
          gap: 5px;
          margin: 0;
          font-size: .9rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }

        .form > .head > .description > b {
          font-weight: 600;
          color: var(--gray-color);
          font-family: var(--font-text), sans-serif;
        }

        .form > .input-group {
          border: var(--border);
          display: flex;
          flex-flow: column;
          gap: 10px;
          width: 100%;
          padding: 10px;
          border-radius: 12px;
        }

        .form > .input-group > .label {
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }

        .form > .input-group > .input {
          display: flex;
          flex-flow: row;
          gap: 5px;
          width: 100%;
          align-items: center;
          justify-content: space-between;
        }

        .form > .input-group > .input > .one {
          display: flex;
          flex-flow: column;
          gap: 5px;
          width: calc(100% - 50px);
        }

        .form > .input-group > .input > .one > input {
          width: 100%;
          padding: 10px 0;
          border: none;
          outline: none;
          font-size: 1.35rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
        }

        .form > .input-group > .input > .one > .warning {
          display: none;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-main), sans serif;
        }

        .form > .input-group > .input > .one > .warning.failed {
          color: var(--warn-color);
        }

        .form > .input-group > .input > .one > .warning.success {
          color: var(--alt-color);
        }

        .form > .input-group > .input > .one > .warning > span {
          font-weight: 600;
          color: var(--accent-color);
        }

        .form > .input-group > .input > .actions {
          display: flex;
          flex-flow: row;
          gap: 5px;
          width: max-content;
        }

        .form > .input-group > .input > .actions > button {
          padding: 6px 10px;
          border: none;
          outline: none;
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-color);
          background: var(--gray-background);
          border-radius: 12px;
          cursor: pointer;
        }

        .form > .input-group > .input > .actions > button:hover {
          color: var(--text-color);
        }

        .form > .consent {
          display: flex;
          flex-flow: row;
          gap: 5px;
          width: 100%;
          padding: 0;
        }

        .form > .consent > p {
          margin: 5px 0 0;
          display: flex;
          gap: 5px;
          font-size: 1rem;
          font-weight: 400;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }

        .form > .consent > p b {
          font-weight: 500;
          color: var(--text-color);
        }

        .form > .consent > p > svg {
          min-width: 18px;
          max-width: 18px;
          min-height: 18px;
          margin: -2px 0 0 0;
          color: var(--accent-color);
        }

        .form > .consent > p a {
          color: var(--anchor-color);
        }

        .form > .consent > p a:hover {
          text-decoration: underline;
        }

        .form > .actions {
          display: flex;
          flex-flow: row;
          padding: 10px 0;
          gap: 10px;
          width: 100%;
          justify-content: space-between;
          align-items: center;
        }

        .form > .actions > button.action {
          width: calc(50% - 10px);
          padding: 12px 0;
          border: none;
          outline: none;
          cursor: pointer;
          background: var(--gray-background);
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          border-radius: 15px;
        }

        .form > .actions > button.action.buy {
          background: var(--accent-linear);
          color: var(--white-color);
        }

        .form > .actions > button.action.buy.disabled {
          background: var(--gray-background);
          color: var(--gray-color);
          border: none;
          opacity: 0.8;
          pointer-events: none;
        }

				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a {
						cursor: default !important;
          }

          .form > .consent > p {
            font-size: .8rem;
          }

          .form > .consent > p > svg {
            min-width: 14px;
            min-height: 14px;
            color: var(--accent-color);
          }
				}
        /* at 700px */
        @media all and (max-width: 700px) {
          :host {
            padding: 70px 10px;
          }
          /* reset all cursor: pointer */
          a,
          .actions > .btn,
          ul.tabs > li.tab,
          .pagination > button,
          .pagination > .previous > .prev,
          .pagination > .nexts > .next,
          .pagination > .previous > .start,
          .pagination > .nexts > .end,
          .pagination > .previous > .page,
          .pagination > .nexts > .page {
            cursor: default !important;
          }
        }
	    </style>
    `;
  }
}