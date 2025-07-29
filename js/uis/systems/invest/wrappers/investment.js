export default class InvestmentWrapper extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.voted = this.getAttribute("voted");
    this.utils = window.app.utils;
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
        <div class="data">
          ${this.getDesc()}
          ${this.getShares()}
          ${this.getActions()}
        </div>
      </div>
    `;
  }

  getHead = () => {
    return /* html */`
      <div class="head">
        <img class="background" src="${this.getAttribute("background")}" alt="background" />
        <div class="info">
          <span class="category">${this.capitalize(this.getAttribute("category"))}</span>
          <span class="name">${this.getAttribute("name")}</span>
          <span class="details">
            <span class="date">${this.utils.date.lapseTime(this.getAttribute("date"))}</span>
            <span class="sp">•</span>
            <span class="views"><span class="number">${this.utils.number.shortenNumber(this.getAttribute("views"))}</span> views</span>
          </span>
        </div>
      </div>
    `;
  }

  getDesc = () => {
    const mql = window.matchMedia("(max-width: 660px)");
    return /* html */`
      <div class="desc">
        ${this.summarizeDesc(mql, this.getAttribute("desc"))}
      </div>
    `;
  }

  summarizeDesc = (mql, str) => {
    // remove <> tags from string
    str = str.replace(/<[^>]*>?/gm, '');

    if (mql.matches) {
      return str.length > 150 ? str.slice(0, 150) + "..." : str;
    }
    return str.length > 99 ? str.slice(0, 99) + "..." : str;
  }

  getShares = () => {
    return /* html */`
      <div class="shares">
      <span class="price share">
        <span class="container">
          <span class="amount">${this.getAttribute("price")}</span>
          <span class="currency">EAC</span>
        </span>
        <span class="text">Per share</span>
      </span>
      <span class="line"></span>
      <span class="sold share">
        <span class="number">347</span>
        <span class="text">Sold Shares</span>
      </span>
      <span class="line"></span>
      <span class="available share">
        <span class="number">216</span>
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
          <a class="button view" href="${this.getAttribute("link")}">View</a>
        </div>
      </div>
    `;
  }

  votedText = voted => {
    if (voted === "up") {
      return /* html */`
        <span class="voted-text up">You upvoted this</span>
      `;
    } else if (voted === "down") {
      return /* html */`
        <span class="voted-text down">You downvoted this</span>
      `;
    } else {
      return /* html */`
        <span class="voted-text">You haven't voted</span>
      `;
    }
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

  getStyles() {
    return /* css */`
	    <style>
	      *,
	      *:after,
	      *:before {
	        box-sizing: border-box !important;
	        font-family: inherit;
	        -webkit-box-sizing: border-box !important;

          /* disable user select */
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -khtml-user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
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

        .content {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 7px 10px;
          align-items: end;
          justify-content: end;
          width: 100%;
          min-width: 100%;
          height: 100%;
          transition: 0.3s;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
          background: var(--investment-background);
          overflow: hidden;
        }

        .head {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
          height: 200px;
          align-items: center;
          justify-content: end;
          overflow: hidden;
          position: relative;
          border-radius: 12px;
        }

        .head > img.background {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
        }

        .head > .top {
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--title-color);
          color: var(--white-color);
          font-family: var(--font-text), sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 5px 10px;
          width: 100%;
          height: 30px;
        }

        .head > .info {
          z-index: 1;
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 10px;
          width: 100%;
          background: var(--title-color);
          color: var(--white-color);
          font-family: var(--font-text), sans-serif;
          background: linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,0.7));
          font-size: 0.9rem;
          font-weight: 500;
        }

        .head > .info > .category {
          font-size: 0.9rem;
          padding: 5px 10px;
          width: max-content;
          font-family: var(--font-text), sans-serif;
          font-weight: 400;
          color: var(--white-color);
          background: var(--accent-linear);
          border-radius: 12px;
        }

        .head > .info > .name {
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--white-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.5;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .head > .info > .details {
          display: flex;
          gap: 5px;
          align-items: center;
          justify-content: start;
          font-family: var(--font-small), sans-serif;
          font-size: 0.9rem;
          color: var(--dark-white);
          font-weight: 400;
        }

        .head > .info > .details > .date {
          font-family: var(--font-text), sans-serif;
          font-weight: 400;
          font-size: 0.9rem;
        }

        .head > .info > .details > .sp {
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
          font-size: 0.9rem;
          margin-top: 2px;
        }

        .head > .info > .details > .views {
          display: flex;
          gap: 5px;
          align-items: center;
          justify-content: center;
        }

        .head > .info > .details > .views > .number {
          font-family: var(--font-text), sans-serif;
          font-size: 0.85rem;
          font-weight: 400;
        }

        .head > .info > .details > .views > .text {
          font-family: var(--font-text), sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--dark-white);
        }

        .desc {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 10px 0;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          line-height: 1.5;
          max-height: 100px;
        }

        .shares {
          display: flex;
          flex-flow: row;
          gap: 10px;
          padding: 10px 0;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-text), sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-color);
        }

        .shares > .share {
          border: none;
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0
          align-items: center;
          justify-content: center;
        }

        .shares > .share > .number {
          font-family: var(--font-text), sans-serif;
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--text-color);
        }

        .shares > span.line {
          display: flex;
          width: 1px;
          border-right: var(--border);
          height: 30px;
        }

        .shares > .share.price > .container {
          display: flex;
          gap: 5px;
          align-items: center;
          justify-content: center;
        }

        .shares > .share.price > .container > .amount {
          font-family: var(--font-text), sans-serif;
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--text-color);
        }

        .shares > .share.price > .container > .currency {
          font-family: var(--font-text), sans-serif;
          font-size: 1.3em;
          font-weight: 500;
          color: var(--text-color);
        }

        .shares > .share.price > .text {
          font-family: var(--font-read), sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--gray-color);
        }

        .shares > .share.sold > .number {
          color: var(--gray-color);
        }

        .shares > .share.available > .number {
          color: var(--gray-color);
        }

        .shares > .share > .text {
          font-family: var(--font-read), sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--gray-color);
        }

        span.voted-text {
          font-family: var(--font-read), sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          width: 100%;
          color: var(--gray-color);
          text-align: start;
          padding: 0;
        }

        span.voted-text.up {
          color: var(--accent-color);
        }

        span.voted-text.down {
          color: var(--warn-color);
        }

        .actions {
          display: flex;
          flex-flow: row;
          gap: 0;
          padding: 5px 0;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-text), sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-color);
        }

        .actions > .votes {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: start;
        }

        .actions > .votes > .vote {
          border: var(--border);
          display: flex;
          flex-flow: row;
          gap: 5px;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 12px;
          align-items: center;
          justify-content: center;
        }

        .actions > .votes > .vote.up {
          border: none;
          background: var(--upvote-background);
          color: var(--accent-color);
        }

        .actions > .votes > .vote.down {
          border: none;
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

        .buttons {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 20px;
          margin: 0;
        }

        .buttons.disabled {
          display: none;
          visibility: hidden;
        }

        .buttons > .button {
          border: none;
          position: relative;
          background: var(--button-background);
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          text-transform: capitalize;
          justify-content: center;
          padding: 5px 15px 5px;
          height: max-content;
          min-width: max-content;
          width: max-content;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        .buttons > .button.view {
          padding: 4px 15px;
          border: var(--action-border);
          background: none;
          color: var(--gray-color);
        }
      
        .buttons > .button.view.disabled,
        .buttons > .button.download.disabled {
          pointer-events: none;
          opacity: 0.5;
          cursor: not-allowed !important;
        }

        .buttons > .plain.views {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-family: var(--font-main), sans-serif;
          font-size: 0.9rem;
          color: var(--gray-color);
        }

        .buttons > .plain.views > .count {
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
          font-size: 1rem;
          color: var(--gray-color);
        }

        .buttons > .plain.views > .text {
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--gray-color);
        }

        

				@media all and (max-width: 700px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

          :host {
            margin: 0;
            border-bottom: var(--action-border);
            padding: 70px 10px;
          }

					a,
          a:visited,
          .actions > .votes > .vote,
          .buttons > .button {
						cursor: default !important;
          }

          .content {
            padding: 0;
            margin: 0;
            background: var(--background);
            border-radius: 0;
          }

          .content > .head {
            border-radius: 5px;
            margin: 0;
            padding: 0;
            height: 220px;
          }

          .actions {
            padding: 10px 0 0;
          }
				}
	    </style>
    `;
  }
}