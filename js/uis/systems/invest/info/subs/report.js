export default class ReportWrapper extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.kind = this.getAttribute("kind");
    this.status = this.getAttribute("status");
    this.time = this.getAttribute("datetime");
    this.name = this.getAttribute("report-title");
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
      ${this.getReport()}
      ${this.getStyles()}
    `;
  }

  getReport = () => {
    return /* html */`
      <div class="content">
        ${this.getHead()}
        ${this.getBody()}
        ${this.getButtons(this.kind)}
      </div>
    `;
  }

  getHead = () => {
    return /* html */`
      <div class="head">
        <div class="status">
          <span class="category ${this.kind}">${this.capitalize(this.kind)}</span>
          <span class="sp">•</span>
          <span class="status ${this.status}">${this.capitalize(this.status)}</span>
          <span class="sp">•</span>
          <span class="time">${this.utils.date.lapseTime(this.time)}</span>
        </div>
        <h3 class="title">${this.name}</h3>
      </div>
    `;
  }

  getBody= () => {
    return /* html */`
      <div class="body">
        ${this.innerHTML}
      </div>
    `;
  }

  getButtons = kind => {
    switch (kind) {
      case "announcement":
        return this.getAnnouncementButtons();
      case "report":
        return this.getReportButtons();
      case "update":
        return this.getUpdateButtons();
      default:
        return this.getReportButtons();
    }
  }

  getReportButtons = () => {
    return /*html*/`
      <div class="buttons">
        <button type="button" class="button view">
          ${this.getButtonView()}
        </button>
        <button type="submit" class="button download">
          ${this.getButtonDownload()}
        </button>
        <span class="plain views">
          <span class="count">${this.utils.number.shortenNumber(this.getAttribute("views"))}</span>
          <span class="text">Views</span>
        </span>
      </div>
    `
  }

  getAnnouncementButtons = () => {
    return /*html*/`
      <div class="buttons">
        <button type="button" class="button view">
          ${this.getButtonView()}
        </button>
        <span class="plain views">
          <span class="count">${this.utils.number.shortenNumber(this.getAttribute("views"))}</span>
          <span class="text">Views</span>
        </span>
      </div>
    `
  }

  getUpdateButtons = () => {
    return /*html*/`
      <div class="buttons">
        <button type="button" class="button view">
          ${this.getButtonView()}
        </button>
        <span class="plain views">
          <span class="count">${this.utils.number.shortenNumber(this.getAttribute("views"))}</span>
          <span class="text">Views</span>
        </span>
      </div>
    `
  }

  getButtonView = () => {
    return /*html*/`
      <span class="text">View</span>
    `;
  }

  getButtonDownload = () => {
    return /*html*/`
      <span class="text">Download</span>
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
          padding: 10px 0 12px;
          margin: 0;
          display: flex;
          height: max-content;
          gap: 0;
          width: 100%;
          /*border-bottom: var(--border);*/
        }

        .content {
          display: flex;
          flex-flow: column;
          gap: 0;
          align-items: center;
          width: 100%;
        }

        .head {
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: center;
          gap: 2px;
          padding: 0;
          width: 100%;
        }

        .head > .status {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          font-weight: 500;
          padding: 0;
          margin: 0;
          gap: 5px;
        }

        .head > .status > .category {
          font-family: var(--font-text), sans-serif;
        }

        .head > .status > .sp {
          padding: 2px 0 0;
        }

        .head > .status > .status.unread {
          font-family: var(--font-text), sans-serif;
          color: transparent;
          background: var(--accent-linear);
          -webkit-background-clip: text;
          background-clip: text;
          font-weight: 500;
        }

        .head > h3.title {
          display: flex;
          align-items: center;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
          font-size: 1.25rem;
          font-weight: 500;
          line-height: 1.2;
          margin: 0;
          padding: 0;
        }

        .body {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
        }

        .body > p {
          font-size: 0.95rem;
          color: var(--text-color);
          padding: 0;
          margin: 0;
          line-height: 1.4;
          font-family: var(--font-main), sans-serif;
        }

        .buttons {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 20px;
          width: 100%;
          margin: 15px 0 0;
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

        .buttons > .button.download {
          padding: 4px 15px;
          border: var(--action-border);
          background: none;
          color: var(--text-color);
        }

        .buttons > .button.next:hover {
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