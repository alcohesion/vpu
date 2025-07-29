export default class StaffWrapper extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log("Connected");
  }

  capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getReport()}
      ${this.getStyles()}
    `;
  }

  getReport = () => {
    return /* html */`
      <div class="content">
        ${this.getUser()}
        ${this.getRank()}
        ${this.getActions()}
      </div>
    `;
  }

  getUser = () => {
    return /* html */`
      <div class="user">
        <div class="avatar">
          <img src="${this.getAttribute("picture")}" alt="User Avatar" />
        </div>
        <div class="info">
          <span class="name">${this.getAttribute("name")}</span>
          <span class="membership">${this.getAttribute("membership")}</span>
        </div>
      </div>
    `;
  }

  getRank = () => {
    return /* html */`
      <div class="rank">
        <span class="text">${this.getAttribute("rank")}</span>
        <span class="role">${this.getAttribute("role")}</span>
      </div>
    `;
  }
  
  getActions = () => {
    return /* html */`
      <div class="buttons">
        <button class="button view">View</button>
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
          border-bottom: var(--border);
        }

        .content {
          display: flex;
          flex-flow: row;
          gap: 0;
          padding: 5px 10px;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-width: 100%;
          cursor: pointer;
          transition: 0.3s;
        }

        .content:hover {
          background: var(--gray-background);
          /*border-radius: 12px;*/
        }

        .user {
          display: flex;
          flex-flow: row;
          flex-wrap: nowrap;
          gap: 10px;
          width: calc(calc(100% / 3) + 10px);
          align-items: center;
          justify-content: start;
          padding: 0;
        }

        .user > .avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          overflow: hidden;
          border: var(--action-border);
        }

        .user > .avatar > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user > .info {
          display: flex;
          flex-flow: column;
          gap: 0;
          justify-content: center;
        }

        .user > .info > .name {
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.2;
        }

        .user > .info > .membership {
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--text-color);
          font-family: var(--font-mono), sans-serif;
          line-height: 1.2;
        }

        .rank {
          display: flex;
          flex-flow: column;
          gap: 0;
          align-items: center;
          justify-content: center;
          padding: 10px 0;
        }

        .rank > .text {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-mono), sans-serif;
          line-height: 1.2;
        }

        .rank > .role {
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--text-color);
          font-family: var(--font-read), sans-serif;
          line-height: 1.2;
        }

        .active {
          display: flex;
          flex-flow: column;
          gap: 0;
          align-items: center;
          justify-content: center;
          padding: 10px 0;
        }

        .active > .text {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-mono), sans-serif;
          line-height: 1.2;
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
          color: var(--text-color);
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
          font-family: var(--font-text), sans-serif;
          font-size: 0.9rem;
          color: var(--gray-color);
        }

        .buttons > .plain.views > .count {
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
          font-size: 1rem;
          color: var(--text-color);
        }

        .buttons > .plain.views > .text {
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--gray-color);
        }

				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a {
						cursor: default !important;
          }
				}
	    </style>
    `;
  }
}