export default class LandingPage extends HTMLElement {
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
    // Select form
  }

  disableScroll() {
    // Get the current page scroll position
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    let scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    document.body.classList.add("stop-scrolling");

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  enableScroll() {
    document.body.classList.remove("stop-scrolling");
    window.onscroll = function () { };
  }

  getButtonLoader() {
    return /*html*/`
      <span id="btn-loader">
				<span class="loader"></span>
			</span>
    `
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    const status = this.getAttribute("status");
    if (status === "success") {
      return this.getSuccess();
    } else if (status === "failed") {
      return this.getFailed();
    } else {
      return this.getPending();
    }
  }

  getLoading = () => {
    return /* html */`
      <div class="loading">
        <div class="loader-bar">0%</div>
        <p class="desc">Loading Thealcohesion VPU Subsystems and services</p>
      </div>
    `;
  }

  loadingPoints = percentage => {
    const bar = document.querySelector(".loader-bar");
    const desc = document.querySelector(".loading > .desc");
    
    if (!bar || !desc) return;

    // check for 0-20%
    if (percentage <= 20) {
      bar.style.width = `${percentage}%`;
      desc.innerHTML = "Loading Thealcohesion VPU Subsystems and services";
    } else if(percentage <= 40) {
      bar.style.width = `${percentage}%`;
      desc.innerHTML = "Fetching Thealcohesion VPU data";
    } else if(percentage <= 60) {
      bar.style.width = `${percentage}%`;
      desc.innerHTML = "Optimizing Thealcohesion VPU data, Subsystems and services for you";
    } else if(percentage <= 80) {
      bar.style.width = `${percentage}%`;
      desc.innerHTML = "Securing your session at Thealcohesion VPU System";
    } else {
      bar.style.width = `${percentage}%`;
      desc.innerHTML = "Almost done, please wait...";
    }
  }

  getFailed = () => {
    return /* html */`
      <div class="info">
        <p class="desc">
          Process terminated, please check your internet connection and refresh the page.
        </p>
        <div class="actions">
          <button class="action" id="failed">Retry</button>
        </div>
      </div>
    `;
  }

  getSupport = () => {
    return /* html */`
      <div class="supports">
        <a href="mailto:info@vpu.africa.com?subject=Support Request&body=Hello team, Am stuck back at the landing page, the process is terminating yet I have a stable internet connection." class="action">Email</a>
        <a href="tel:+254703538027" class="action">Call</a>
        <a href="https://wa.me/254703538027?text=Hello team, Am stuck back at the landing page, the process is terminating yet I have a stable internet connection." class="action">WhatsApp</a>
        // add sms
        <a href="sms:+254703538027?body=Hello team, Am stuck back at the landing page, the process is terminating yet I have a stable internet connection." class="action">SMS</a>
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
          -webkit-appearance: none;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          padding: 0;
          margin: 0;
          font-family: inherit;
        }

        p,
        ul,
        ol {
          padding: 0;
          margin: 0;
        }

        a {
          text-decoration: none;
        }

        :host {
          font-size: 16px;
          display: flex;
          flex-flow: column;
          gap: 10px;
          padding: 0;
          width: 100%;
        }

        .content {
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 0;
          padding: 0;
          margin: 20px 0;
          width: 100%;
        }

        .content > .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .content > .icon > svg {
          width: 40px;
          height: 40px;
          color: var(--alt-color);
        }

        .top {
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        .top > h4.title {
          display: flex;
          align-items: center;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
          font-size: 1.3rem;
          font-weight: 600;
          line-height: 1.5;
          margin: 5px 0 0 0;
        }

        .top > .desc {
          margin: 0;
          text-align: center;
          padding: 10px 0;
          color: var(--text-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
        }

        .actions {
          display: flex;
          font-family: var(--font-main), sans-serif;
          width: 100%;
          flex-flow: row;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 10px 0 0;
        }
        
        .actions > .action {
          border: none;
          background: var(--gray-background);
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          text-transform: capitalize;
          justify-content: center;
          padding: 7px 15px 7px;
          min-width: 100px;
          width: 100px;
          position: relative;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        .actions > .action:hover {
          color: var(--text-color);
        }

        .actions > .action {
          border: var(--action-border);
          background: none;
          background-color: none;
          color: var(--gray-color);
          padding: 6px 15px 6px;
        }

        @media screen and (max-width:600px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          a,
          .actions > .action {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}