export default class ListingWrapper extends HTMLDivElement {
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
		// console.log("Connected");
	}
	
	getPercentageSold = (sold, total) => {
		sold = this.utils.number.parse(sold);
		total = this.utils.number.parse(total);
		
		return this.calculatePercentage(sold, total);
	}
	
	getRemainingShares = (sold, total) => {
		sold = this.utils.number.parse(sold);
		total = this.utils.number.parse(total);
		
		return total - sold;
	}
	
	calculatePercentage = (num, total) => {
		if (total === 0) return 0;
		if (num >= total) return 100;
		return ((num / total) * 100).toFixed(num % total !== 0 ? 2 : 0);
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
      </div>
      ${this.getActions()}
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
      <div class="investment">
        <h2 class="name">${this.getAttribute("shares-name")}</h2>
        <span class="category">${this.capitalize(this.getAttribute("category"))}</span>
      </div>
      ${this.getPrice()}
      ${this.getDesc()}
      ${this.getROI()}
    `;
	}

  getDesc = () => {
    return /* html */`
      <div class="desc">
        ${this.innerHTML}
      </div>
    `;
  }
	
  getPrice = () => {
    return /* html */`
      <div class="info price-info">
        <div class="price">
          <span class="value">
            <span class="currency">乇</span>
            <span class="price">${this.utils.number.balanceWithCommas(this.getAttribute("price"))}</span>
          </span>
          <span class="label">Listing Price</span>
        </div>
        <span class="line"></span>
        <div class="initial">
          <span class="value">
            <span class="currency">乇</span>
            <span class="price">${this.utils.number.balanceWithCommas(this.getAttribute("share-price"))}</span>
          </span>
          <span class="label">IPO Price</span>
        </div>
      </div>
    `;
  }

  getROI = () => {
    return /* html */`
    <div class="info back">
      <div class="roi">
        <span class="label">ROI</span>
        <span class="value">${this.getAttribute("roi")}%</span>
      </div>
      <div class="shares">
        <span class="value">${this.utils.number.shortenNumber(this.getAttribute("shares"))}</span>
        <span class="label">Shares</span>
      </div>
      <div class="sold">
        <span class="value">${this.soldPercentage}%</span>
        <span class="label">Sold</span>
      </div>
    </div>
    `;
  }
	
	getActions = () => {
		return /* html */`
      <div class="actions">
        ${this.getAvailable(this.available)}
        <div class="buttons">
          <button class="button buy ${this.available <= 0 ? "disabled" : ""}">Buy</button>
          <button class="button asses">Asses</button>
          <button class="button contact">Contact</button>
        </div>
      </div>
    `;
	}
	
	getAvailable = available => {
		if (available === 0 || available < 0) {
			return /* html */`
        <div class="available">
          <span class="label">No Shares Available for Sale</span>
        </div>
      `;
		} else {
			return /* html */`
        <div class="available">
          <span class="value">${this.utils.number.withCommas(available)}</span>
          <span class="label">Shares are still available</span>
        </div>
      `;
		}
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
          padding: 15px 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          height: max-content;
          align-items: start;
          justify-content: space-between;
          border-bottom: var(--border);
          gap: 0;
          width: 100%;
        }

        .content {
          display: flex;
          flex-flow: column;
          gap: 2px;
          width: 100%;
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

        .investment {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 10px 0 0 0;
          width: 100%;
          height: max-content;
        }

        .investment > .name {
          margin: 0;
          padding: 0;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-color);
        }

        .investment > .category {
          font-size: 0.9rem;
          font-weight: 500;
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
        }

         /* Description: Create a container for the description */
         .desc {
          width: 100%;
          padding: 10px 0;
          height: max-content;
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
        }

        .desc * {
          margin: 0;
          padding: 0;
        }

        .desc p {
          margin-bottom: 5px;
          line-height: 1.4;
        }

        .info {
          display: flex;
          flex-flow: row;
          gap: 40px;
          width: 100%;
          max-width: 100%;
          height: max-content;
          align-items: center;
          padding: 0;
        }

        .info.back {
          display: flex;
          flex-flow: row;
          gap: 20px;
          width: 100%;
          min-width: 100%;
          max-width: 100%;
          height: max-content;
          align-items: center;
          padding: 0;
        }

        .info > span.line {
          display: flex;
          width: 2px;
          border-radius: 2px;
          height: 20px;
          background: var(--gray-background);
        }

        .info.back > div {
          display: flex;
          flex-flow: column;
          gap: 5px;
          width: max-content;
          height: max-content;
          border-radius: 12px;
          padding: 10px;
          width: calc(calc(100% - 30px) / 3);
          background: var(--gray-background);
        }

        .info > div > .value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-color);
        }

        .info.price-info > div.price > .label,
        .info.price-info > div.initial > .label {
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }

        .info.back > div > .label {
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }

        .info.price-info {
          padding: 10px 0 5px 0;
        }

        .info.price-info > div.price,
        .info.price-info > div.initial {
          display: flex;
          flex-flow: column;
          gap: 5px;
          width: max-content;
          height: max-content;
        }

        .info.price-info > div.price {
          color: var(--anchor-color);
        }

        .info.price-info > div.initial {
          color: var(--text-color);
        }

        .info.price-info > div.price > .value,
        .info.price-info > div.initial > .value {
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
          color: inherit;
          margin-left: -3px;
        }

        .info.price-info > div.price > .value > .currency,
        .info.price-info > div.initial > .value > .currency {
          font-size: 1.3rem;
          font-weight: 900;
          color: inherit;
        }

        .info.price-info > div.price > .value > .price,
        .info.price-info > div.initial > .value > .price {
          font-size: 1.45rem;
          font-weight: 600;
          font-family: var(--font-text), sans-serif;
        }

        .actions {
          display: flex;
          flex-flow: column;
          gap: 10px;
          padding: 17px 0 0 0;
          width: 100%;
          align-items: start;
          justify-content: end;
        }

        .actions > .available {
          display: flex;
          flex-flow: row;
          gap: 5px;
          padding: 0;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }

        .actions > .available > .value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-color);
        }

        .actions > .available > .label {
          font-size: 1rem;
          font-weight: 400;
          color: var(--gray-color);
        }

        .actions > .price {
          display: flex;
          flex-flow: row;
          gap: 5px;
          padding: 0;
          align-items: center;
          justify-content: center;
        }

        .actions > .buttons {
          display: flex;
          gap: 20px;
          padding: 0;
          height: max-content;
        }

        .actions > .buttons > .button {
          padding: 5px 15px;
          border: none;
          background: var(--accent-linear);
          color: var(--white-color);
          font-size: 1rem;
          font-weight: 500;
          border-radius: 12px;
          cursor: pointer;
        }

        .actions > .buttons > .button.asses,
        .actions > .buttons > .button.contact {
          background: none;
          padding: 4px 15px;
          border: var(--action-border);
          color: var(--text-color);
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
        }

        .actions > .buttons > .button.disabled {
          background: var(--gray-background);
          color: var(--gray-color);
          pointer-events: none;
          cursor: not-allowed;
        }

				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

          * {
            /* disable user selection */
            user-select: none;
          }

					a ,
          .actions > .buttons > .button {
						cursor: default !important;
          }

          .info {
            display: flex;
            flex-flow: row;
            gap: 10px;
            max-width: 100%;
            width: 100%;
            height: max-content;
            align-items: center;
            justify-content: space-between;
            padding: 5px 5px 0 0;
          }

          .info > div.sold {
            min-width: calc(33.33% - 10px);
            display: flex;
            flex-flow: column;
            gap: 5px;
            width: max-content;
            height: max-content;
          }

          .info.price-info {
            display: flex;
            gap: 10px;
            width: 100%;
            height: max-content;
          }

          .info span.line {
            display: inline-block;
            height: 40px;
            background: var(--gray-background);
          }

          .info.price-info span.line {
            display: inline-block;
            height: 42px;
            background: var(--tab-background);
          }

          .info.price-info > div.initial {
            display: flex;
            flex-flow: column;
            min-width: calc(50% - 40px);
            gap: 5px;
            width: max-content;
            height: max-content;
          }

          .info.price-info > div.price > .value,
          .info.price-info > div.initial > .value {
            font-weight: 600;
          }
				}
	    </style>
    `;
	}
}