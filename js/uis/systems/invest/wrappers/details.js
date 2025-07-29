export default class InvestmentDetails extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.utils = window.app.utils;
    this.voted = this.getAttribute("voted");
    this.images = this.getAttribute("images").split(",");
    this.background = this.getAttribute("background");
    this.shares = this.toNumber(this.getAttribute("shares"));
    this.sold = this.toNumber(this.getAttribute("sold"));
    this.available = this.calculateRemaining(this.shares, this.sold);
    this.users = this.utils.number.shortenNumber(this.getAttribute("users"));
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  // noinspection JSUnusedGlobalSymbols
  connectedCallback() {
    // console.log("Connected");
  }

  capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  toNumber = (str) => {
    try {
      return parseFloat(str);
    } catch (error) {
      return 0;
    }
  }


  calculateRemaining = (shares, sold) => {

    const remaining = shares - sold;

    // return to 2 decimal places
    return remaining.toFixed(2);
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
        ${this.getPriceAndROI()}
        ${this.getDesc()}
        ${this.getShares()}
        ${this.getActions()}
        ${this.getResponses()}
        ${this.getPagination({ current: 13, total: 24 })}
      </div>
    `;
  }

  getHead = () => {
    return /* html */`
      <div class="images-container">
        <div class="main-image">
          <img src="${this.background}" alt="Investment Image" />
        </div>
        <div class="images">
          ${this.images.map(image => /* html */`
            <div class="image">
              <img src="${image}" alt="Investment Image" />
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  getInfo = () => {
    return /* html */`
      <div class="info">
        <h2 class="name">${this.getAttribute("name")}</h2>
        <span class="facts">
          <span class="category">${this.capitalize(this.getAttribute("category"))}</span>
          <span class="span">•</span>
          <span class="time">${this.utils.date.formatDateTime(this.getAttribute("datetime"))}</span>
        </span>
      </div>
    `;
  }

  getDesc = () => {
    return /* html */`
      <div class="desc">
        ${this.innerHTML}
      </div>
    `;
  }

  getPriceAndROI = () => {
    return /* html */`
      <div class="price-roi">
        <span class="price p-roi">
          <span class="container">
            <span class="amount">${this.getAttribute("price")}</span>
            <span class="currency">EAC</span>
          </span>
          <span class="text">Price per share</span>
        </span>
        <span class="line"></span>
        <span class="roi p-roi">
          <span class="container">
            <span class="amount">${this.getAttribute("roi")}%</span>
            <span class="currency">ROI</span>
          </span>
          <span class="text">Returns</span>
        </span>
        <span class="line"></span>
        <span class="users p-roi">
          <span class="container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M15 11C17.2091 11 19 9.20914 19 7C19 4.79086 17.2091 3 15 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11 14H7C4.23858 14 2 16.2386 2 19C2 20.1046 2.89543 21 4 21H14C15.1046 21 16 20.1046 16 19C16 16.2386 13.7614 14 11 14Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M17 14C19.7614 14 22 16.2386 22 19C22 20.1046 21.1046 21 20 21H18.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="amount">${this.users}</span>
          </span>
          <span class="text">Investors</span>
        </span>
      </div>
    `;
  }

  getShares = () => {
    return /* html */`
      <div class="shares">
        <span class="total share">
          <span class="number">${this.shares}</span>
          <span class="text">Total Shares</span>
        </span>
        <span class="line"></span> 
        <span class="sold share">
          <span class="number">${this.sold}</span>
          <span class="text">Sold Shares</span>
        </span>
        <span class="line"></span>
        <span class="available share">
        <span class="number">${this.available}</span>
          <span class="text">Available</span>
        </span>
      </div>
    `;
  }

  getActions = () => {
    return /* html */`
      ${this.votedText(this.voted)}
      <div class="actions">
        <div class="votes">
          <span class="vote ${this.checkUpVoted(this.voted)}">
            <span class="icon">
            <svg rpl="" fill="currentColor" height="16" icon-name="upvote-fill" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
              ${this.getVoted(this.voted, "up")}
            </svg>
            </span>
            <span class="count">${this.utils.number.shortenNumber(this.getAttribute("upvotes"))}</span>
          </span>
          <span class="vote ${this.checkDownVoted(this.voted)}">
            <span class="icon">
              <svg rpl="" fill="currentColor" height="16" icon-name="downvote-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                ${this.getVoted(this.voted, "down")}
              </svg>
            </span>
            <span class="count">${this.utils.number.shortenNumber(this.getAttribute("downvotes"))}</span>
          </span>
        </div>
        <div class="buttons">
          <button class="button disabled">Invest</button>
        </div>
      </div>
    `;
  }

  votedText = voted => {
    const voteMessages = {
      up: "You upvoted this",
      down: "You downvoted this",
      none: "You haven't voted yet"
    };

    const voteClass = voted === "up" ? "up" : voted === "down" ? "down" : "";

    return /* html */`
      <span class="voted-text ${voteClass}">${voteMessages[voted] || voteMessages.none}</span>
    `;
  }

  checkUpVoted = voted => {
    if (voted === "up") return "up";

    return "none";
  }

  checkDownVoted = voted => {
    if (voted === "down") return "down";

    return "none";
  }

  getVoted = (voted, kind) => {
    const voteMap = {
      up: { up: this.upFilled, down: this.downUnfilled },
      down: { up: this.upUnfilled, down: this.downFilled },
      none: { up: this.upUnfilled, down: this.downUnfilled }
    };

    return voteMap[voted]?.[kind]?.() || '';
  }

  upFilled = () => {
    return /* html */`
      <path d="M10 19c-.072 0-.145 0-.218-.006A4.1 4.1 0 0 1 6 14.816V11H2.862a1.751 1.751 0 0 1-1.234-2.993L9.41.28a.836.836 0 0 1 1.18 0l7.782 7.727A1.751 1.751 0 0 1 17.139 11H14v3.882a4.134 4.134 0 0 1-.854 2.592A3.99 3.99 0 0 1 10 19Z"></path>
    `;
  }

  upUnfilled = () => {
    return /* html */`
      <path d="M10 19c-.072 0-.145 0-.218-.006A4.1 4.1 0 0 1 6 14.816V11H2.862a1.751 1.751 0 0 1-1.234-2.993L9.41.28a.836.836 0 0 1 1.18 0l7.782 7.727A1.751 1.751 0 0 1 17.139 11H14v3.882a4.134 4.134 0 0 1-.854 2.592A3.99 3.99 0 0 1 10 19Zm0-17.193L2.685 9.071a.251.251 0 0 0 .177.429H7.5v5.316A2.63 2.63 0 0 0 9.864 17.5a2.441 2.441 0 0 0 1.856-.682A2.478 2.478 0 0 0 12.5 15V9.5h4.639a.25.25 0 0 0 .176-.429L10 1.807Z"></path>
    `;
  }

  downFilled = () => {
    return /* html */`
      <path d="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Z"></path>
    `;
  }

  downUnfilled = () => {
    return /* html */`
      <path d="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Zm0 17.193l7.315-7.264a.251.251 0 0 0-.177-.429H12.5V6.5a2.63 2.63 0 0 0-2.364-2.5 2.441 2.441 0 0 0-1.856.682A2.478 2.478 0 0 0 7.5 5V10.5H2.861a.25.25 0 0 0-.176.429L10 18.193Z"></path>
    `;
  }

  getResponses = () => {
    return /* html */`
      <div class="responses">
        <div class="responses-header">
          <h3 class="title">Responses</h3>
        </div>
        ${this.getForm()}
        <div class="responses-list">
          ${this.listResponses()}
        </div>
      </div>
    `;
  }

  getForm = () => {
    return /* html */`
      <div is="response-editor" class="response-editor"></div>
    `;
  }

  listResponses = () => {
    return /* html */`
      <div is="response-wrapper" user-name="Fredrick Adenuga" datetime="2024-09-12T12:25:00Z"
      user-image="https://randomuser.me/api/portraits/men/1.jpg"
      replies="3" views="120" likes="53">
      <p>This is a placeholder response. I have been following this investment for a while and I believe it has great potential.</p>
      <p> The team behind it is very experienced and the market conditions are favorable. Looking forward to seeing how it performs.</p>
      </div>
      <div is="response-wrapper" user-name="Grace Johnson" datetime="2024-09-20T10:15:00Z"
      user-image="https://randomuser.me/api/portraits/men/6.jpg"
      replies="5" views="200" likes="70">
      <p>Great investment, I'm in for 100 shares. The projected ROI looks promising and the risk factors have been well mitigated. </p>
      <p> I have done my due diligence, and I am confident in the growth prospects of this venture. Excited to be a part of this!</p>
      </div>
      <div is="response-wrapper" user-name="Jane Doe" datetime="2024-10-12T14:30:00Z"
      user-image="https://randomuser.me/api/portraits/women/1.jpg"
      replies="2" views="150" likes="60">
      <p>I have been watching this investment closely, and I am impressed with the consistent growth. The team is doing a fantastic job.</p>
      </div>
      <div is="response-wrapper" user-name="John Smith" datetime="2024-11-15T09:45:00Z"
      user-image="https://randomuser.me/api/portraits/men/2.jpg"
      images="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      views="709" likes="120" replies="63978">
      <p>Invested 50 shares. The market analysis looks promising and I believe this will yield good returns in the long run.</p>
      </div>
      <div is="response-wrapper" user-name="Alice Johnson" datetime="2024-12-01T16:20:00Z"
      user-image="https://randomuser.me/api/portraits/women/2.jpg"
      replies="31" views="183" likes="88">
      <p>Excited about this investment. The ROI projections are very attractive and the risk seems manageable.</p>
      </div>
      <div is="response-wrapper" user-name="Bob Brown" datetime="2024-12-05T11:10:00Z"
      user-image="https://randomuser.me/api/portraits/men/3.jpg"
      replies="4" views="253" likes="91">
      <p>Great opportunity! I have invested 200 shares. Looking forward to seeing the growth in the coming months.</p>
      </div>
      <div is="response-wrapper" user-name="Catherine Green" datetime="2024-12-10T08:50:00Z"
      user-image="https://randomuser.me/api/portraits/women/3.jpg"
      replies="2" views="137" likes="65">
      <p>This investment has a lot of potential. The team is experienced and the market conditions are favorable. I'm in!</p>
      </div>
      <div is="response-wrapper" user-name="David White" datetime="2024-12-15T13:35:00Z"
      user-image="https://randomuser.me/api/portraits/men/4.jpg"
      replies="3" views="190" likes="75">
      <p>Invested 150 shares. The projected ROI is very promising and the risk factors have been well mitigated.</p>
      </div>
      <div is="response-wrapper" user-name="Emily Black" datetime="2024-12-20T10:25:00Z"
      user-image="https://randomuser.me/api/portraits/women/4.jpg"
      replies="4" views="220" likes="85">
      <p>I've done my research and this investment looks solid. The team behind it is very capable and the market conditions are right.</p>
      </div>
      <div is="response-wrapper" user-name="Frank Wilson" datetime="2024-12-25T15:40:00Z"
      user-image="https://randomuser.me/api/portraits/men/5.jpg"
      replies="11" views="241" likes="93">
      <p>Invested 300 shares. The growth potential is huge and the team is doing a great job. Excited to be a part of this!</p>
      </div>
      <div is="response-wrapper" user-name="Grace Lee" datetime="2024-12-30T12:15:00Z"
      user-image="https://randomuser.me/api/portraits/women/5.jpg"
      replies="21" views="169" likes="78">
      <p>This investment is very promising. The ROI projections are attractive and the risk is manageable. Looking forward to the returns.</p>
      </div>
      <div is="response-wrapper" user-name="Henry Kim" datetime="2025-01-05T14:55:00Z"
      user-image="https://randomuser.me/api/portraits/men/6.jpg"
      replies="15" views="107" likes="89">
      <p>Invested 100 shares. The market analysis looks good and the team is experienced. Confident in the growth prospects of this venture.</p>
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
          flex-flow: column;
          height: max-content;
          gap: 0;
          width: 100%;
        }

        .content {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 7px 10px;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-width: 100%;
          height: 100%;
          transition: 0.3s;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
          overflow: hidden;
        }

        /* Images: Create an image container with main on the large side and the rest on the small side aligned vertically */
        .images-container {
          display: flex;
          flex-flow: row;
          gap: 20px;
          width: 100%;
          height: 400px;
          margin-bottom: 10px;
        }

        .images-container > .main-image {
          display: flex;
          width: calc(70% - 15px);
          min-width: calc(70% - 15px);
          height: 400px;
          overflow: hidden;
          border-radius: 15px;
          -webkit-border-radius: 15px;
          -moz-border-radius: 15px;
        }

        .images-container > .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 15px;
          -webkit-border-radius: 15px;
          -moz-border-radius: 15px;
        }

        .images-container > .images {
          display: flex;
          flex-flow: column;
          gap: 20px;
          width: calc(30% - 5px);
          min-width: calc(30% - 5px);
          height: 100%;
        }

        .images-container > .images > .image {
          width: 100%;
          height: calc(100% / 3);
          overflow: hidden;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        .images-container > .images > .image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Info: Create a container for the name and other information */
        .info {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
          height: max-content;
        }

        .info > .name {
          margin: 0;
          padding: 0;
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text-color);
        }

        .info > .facts {
          display: flex;
          flex-flow: row;
          gap: 5px;
          font-size: 0.8rem;
          font-family: var(--font-main), sans-serif;
          color: var(--gray-color);
        }

        .info > .facts > .category {
          font-weight: 500;
        }

        .info > .facts > .span {
          font-weight: 500;
        }

        .info > .facts > .time {
          font-weight: 500;
        }

        /* Price and ROI: Create a container for the price and ROI */
        .price-roi {
          display: flex;
          flex-flow: row;
          gap: 50px;
          width: 100%;
          height: max-content;
          align-items: center;
          padding: 20px 0 5px 0;
        }

        .price-roi > span.line {
          display: flex;
          width: 2px;
          border-radius: 2px;
          height: 20px;
          background: var(--gray-background);
        }

        .price-roi > .p-roi {
          display: flex;
          flex-flow: column;
          gap: 5px;
          width: max-content;
          height: max-content;
        }

        .price-roi > .p-roi > .container {
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
        }

        .price-roi > .p-roi > .container > .amount {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--accent-color);
        }

        .price-roi > .p-roi.users > .container > .amount {
          color: var(--text-color);
        }

        .price-roi > .p-roi.users > .container > svg {
          height: 22px;
          width: 22px;
          color: var(--text-color);
        }

        .price-roi > .p-roi.roi > .container > .amount {
          color: var(--alt-color);
        }

        .price-roi > .p-roi > .container > .currency {
          font-size: 1rem;
          font-weight: 600;
          color: var(--gray-color);
        }

        .price-roi > .p-roi > .text {
          font-size: 0.8rem;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }

        .price-roi > .p-roi > .number {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-color);
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

        /* Shares: Create a container for the shares */
        .shares {
          display: flex;
          flex-flow: row;
          gap: 20px;
          width: 100%;
          height: max-content;
          align-items: center;
          padding: 10px 0;
        }

        .shares > span.line {
          display: flex;
          width: 2px;
          border-radius: 2px;
          height: 20px;
          background: var(--gray-background);
        }

        .shares > .share {
          display: flex;
          flex-flow: column;
          gap: 5px;
          width: calc(calc(100% - 25px) / 3);
          height: max-content;
        }

        .shares > .share > .container {
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
        }

        .shares > .share > .container > .amount {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-color);
        }

        .shares > .share > .container > .currency {
          font-size: 0.8rem;
          color: var(--gray-color);
        }

        .shares > .share > .text {
          font-size: 0.8rem;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }

        .shares > .share > .number {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-color);
        }

        /* Actions: Create a container for the actions */
        .actions {
          display: flex;
          flex-flow: row;
          gap: 20px;
          padding: 5px 0;
          width: 100%;
          align-items: center;
          justify-content: start;
          font-family: var(--font-text), sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-color);
        }

        .actions > .votes {
          display: flex;
          gap: 20px;
          align-items: center;
          justify-content: start;
        }

        .actions > .votes > .vote {
          border: var(--border);
          display: flex;
          flex-flow: row;
          gap: 5px;
          min-width: 80px;
          cursor: pointer;
          padding: 7px 15px;
          border-radius: 12px;
          align-items: center;
          justify-content: center;
        }

        .actions > .votes > .vote.up {
          border: none;
          padding: 8px 15px;
          background: var(--upvote-background);
          color: var(--anchor-color);
        }

        .actions > .votes > .vote.down {
          border: none;
          padding: 8px 15px;
          background: var(--downvote-background);
          color: var(--warn-color);
        }

        .actions > .votes > .vote > .icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .actions > .votes > .vote > .icon > svg {
          fill: currentColor;
          height: 16px;
          width: 16px;
        }

        .actions > .votes > .vote > .count {
          font-family: var(--font-text), sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: inherit;
        }

        .actions > .roi {
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
          justify-content: end;
        }

        .actions > .roi > .text {
          font-size: 0.9rem;
          color: var(--gray-color);
        }

        .actions > .roi > .number {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-color);
        }

        .voted-text {
          width: 100%;
          display: flex;
          padding: 10px 0 8px 0;
          font-size: 0.9rem;
          line-height: 1.2;
          color: var(--gray-color);
        }

        .voted-text.up {
          color: var(--anchor-color);
        }

        .voted-text.down {
          color: var(--warn-color);
        }

        .buttons {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 25px;
          margin: 0;
        }

        .buttons > .button {
          border: none;
          position: relative;
          background: var(--button-background);
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          text-transform: capitalize;
          justify-content: center;
          padding: 7px 15px;
          height: max-content;
          min-width: max-content;
          width: max-content;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        .buttons > .button {
          border: var(--action-border);
          background: none;
          color: var(--text-color);
        }
      
        .buttons > .button.disabled,
        .buttons > .button.disabled {
          pointer-events: none;
          opacity: 0.5;
          cursor: not-allowed !important;
        }

        div.responses {
          margin: 20px 0 0 0;
          padding: 10px 0;
          display: flex;
          flex-flow: column;
          gap: 10px;
          width: 100%;
          height: max-content;
        }

        div.responses > div.responses-header {
          display: flex;
          flex-flow: row;
          gap: 10px;
          width: 100%;
          height: max-content;
          align-items: center;
          justify-content: start;
        }

        div.responses > div.responses-header > h3 {
          font-size: 1.2rem;
          line-height: 1.5;
          font-family: var(--font-main), sans-serif;
          font-weight: 600;
          color: var(--text-color);
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
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a,
          .pagination > .nexts > .page,
          .pagination > .previous > .page,
          .pagination > button {
						cursor: default !important;
          }

          :host {
            padding: 70px 10px;
          }

          .content {
            padding: 20px 0 0;
          }

          .images-container {
            flex-flow: column;
            gap: 10px;
            height: max-content;
          }

          .images-container > .main-image {
            width: 100%;
            height: 300px;
            border-radius: 5px;
          }

          .images-container > .main-image img {
            border-radius: 5px;
          }

          .images-container > .images {
            width: 100%;
            display: flex;
            flex-flow: row;
            gap: 10px;
          }

          .images-container > .images > .image {
            width: unset;
            height: 100px;
          }

          .images-container > .images > .image img {
            height: 100%;
            width: auto;
          }

          .info > .name {
            padding: 0;
            margin: 20px 0 0 0;
            font-size: 1.2rem;
          }

          .info > .facts {
            font-size: 0.9rem;
          }

          .info > .facts > .category {
            font-size: 0.9rem;
          }

          .info > .facts > .span {
            font-size: 0.9rem;
          }

          .info > .facts > .time {
            font-size: 0.9rem;
          }

          .price-roi {
            padding: 25px 5px 10px 0;
            display: flex;
            gap: 10px;
            flex-flow: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            max-width: 100%;
            overflow: unset;
          }

          .price-roi > span.line {
            display: flex;
          }

          .price-roi > .p-roi {
            padding: 0;
            margin: 0;
            display: flex;
            flex-flow: column;
            gap: 5px;
          }

          .shares {
            padding: 10px 0;
            display: flex;
            flex-flow: row;
            gap: 10px;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }

          .shares > span.line {
            display: inline-block;
            height: 40px;
            background: var(--tab-background);
          }
				}
	    </style>
    `;
  }
}