export default class IdentityStatus extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.date = new Date(this.getAttribute("date"));
    this.api = this.getAttribute("api");

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    this.checkRequestDuration(new Date(this.date));
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

  sendRequest = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch(this.api, options);
      const result = await response.json();

      if(!result.success) {
        throw new Error("Error sending request");
      }

      this.checkRequestDuration(new Date(result.date));
    } catch (error) {
      console.log(error);
    }
  }

  checkRequestDuration = date => {
    const content = this.shadowObj.querySelector(".content");
    const request = content.querySelector(".request-content");
    if(request) request.remove();
    const now = new Date();
    const diff = now - date;

    // console.log('diff', diff);

    // if it's more than 2 hours, show the request button
    if (diff > 2 * 60 * 60 * 1000) {
      content.insertAdjacentHTML("beforeend", this.getRequestButton(true));
      this.activateRequestButton(content);
    } else {
      content.insertAdjacentHTML("beforeend", this.getRequestButton(false));
      const seconds = diff / 1000;
      this.updateRequestDuration(content, 7200 - seconds);
    }
  }

  activateRequestButton = content => {
    const request = content.querySelector(".request");
    request.addEventListener("click", () => {
      this.sendRequest();
    });
  }

  updateRequestDuration = (content, seconds) => {
    const time = content.querySelector(".time");
    const interval = setInterval(() => {
      if (seconds <= 0) {
        clearInterval(interval);
        content.innerHTML = this.getRequestButton(true);
      } else {
        const hours = Math.floor(seconds / 3600);
        // calculate minutes remaining
        let minutes = Math.floor((seconds - (hours * 3600)) / 60);
        // calculate seconds remaining
        let secs = seconds - (hours * 3600) - (minutes * 60);
        let ho = hours < 10 ? `0${hours}` : hours;
        let mi = minutes < 10 ? `0${minutes}` : minutes;
        let se = secs < 10 ? `0${secs}` : secs;
        time.textContent = `${ho}:${mi}:${se}`;
      }
    }, 1000)
  }

  getRequestButton = request => {
    if (request) {
      return /* html */`
        <div class="request-content">
          <p class="req-desc">You can request admin to verify your identity using the button below</p>
          <div class="actions">
            <button class="request">Request</button>
          </div>
        </div>
      `;
    } else {
      return /* html */`
        <div class="request-content">
          <p class="req-desc">
            You have already requested for admin to verify your identity, you can request again in;
            <br>
            <span class="time">2 hours</span>
          </p>
        </div>
      `;
    }
  }

  getSuccess = () => {
    return /* html */`
      <div class="content">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" color="currentColor" fill="none">
            <path d="M14.2618 3.59937C13.1956 2.53312 12.6625 2 12 2C11.3375 2 10.8044 2.53312 9.73815 3.59937C9.09832 4.2392 8.46427 4.53626 7.55208 4.53626C6.7556 4.53626 5.62243 4.38178 5 5.00944C4.38249 5.63214 4.53628 6.76065 4.53628 7.55206C4.53628 8.46428 4.2392 9.09832 3.59935 9.73817C2.53312 10.8044 2.00001 11.3375 2 12C2.00002 12.6624 2.53314 13.1956 3.59938 14.2618C4.31616 14.9786 4.53628 15.4414 4.53628 16.4479C4.53628 17.2444 4.38181 18.3776 5.00949 19C5.63218 19.6175 6.76068 19.4637 7.55206 19.4637C8.52349 19.4637 8.99128 19.6537 9.68457 20.347C10.2749 20.9374 11.0663 22 12 22C12.9337 22 13.7251 20.9374 14.3154 20.347C15.0087 19.6537 15.4765 19.4637 16.4479 19.4637C17.2393 19.4637 18.3678 19.6175 18.9905 19M20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19M18.9905 19H19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 10.3077C8 10.3077 10.25 10 12 14C12 14 17.0588 4 22 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="top">
          <h4 class="title">Identity verified.</h4>
          <p class="desc">
            Dear <b>${this.getAttribute("name")}</b>, your identity has been successfully verified.
            <br>Click on the button below to start using Thealcohesion VPU.
          </p>
        </div>
        <div class="actions">
          <button class="action">Launch</button>
        </div>
      </div>
    `;
  }

  getFailed = () => {
    return /* html */`
      <div class="content">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" color="currentColor" fill="none">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 8L16 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16 8L8 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="top">
          <h4 class="title">Identity verification failed.</h4>
          <p class="desc">
            Dear <b>${this.getAttribute("name")}</b>, we were unable to verify your identity on the document you provided. Please click on the button below to retry the process.
          </p>
        </div>
        <div class="actions">
          <button class="action" id="failed">Retry</button>
        </div>
      </div>
    `;
  }

  getPending = () => {
    return /* html */`
      <div class="content">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" color="#currentColor" fill="none">
            <path d="M12 22C6.47715 22 2.00004 17.5228 2.00004 12C2.00004 6.47715 6.47719 2 12 2C16.4777 2 20.2257 4.94289 21.5 9H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 8V12L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21.9551 13C21.9848 12.6709 22 12.3373 22 12M15 22C15.3416 21.8876 15.6753 21.7564 16 21.6078M20.7906 17C20.9835 16.6284 21.1555 16.2433 21.305 15.8462M18.1925 20.2292C18.5369 19.9441 18.8631 19.6358 19.1688 19.3065" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="top">
          <h4 class="title">Identity verification pending.</h4>
          <p class="desc">
            Dear <b>${this.getAttribute("name")}</b>, your identity verification is pending.
            As soon as we have verified your identity, you will be notified via your email and SMS.
          </p>
        </div>
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

        .request-content {
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 0;
          padding: 0;
          margin: 20px 0;
          width: 100%;
        }

        .request-content > .req-desc {
          margin: 0;
          text-align: center;
          padding: 0;
          color: var(--text-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
        }

        .request-content > .time {
          color: var(--alt-color);
          font-size: 1rem;
          font-weight: 500;
          font-family: var(--font-read), sans-serif;
        }

        .request-content > .actions {
          display: flex;
          font-family: var(--font-main), sans-serif;
          width: 100%;
          flex-flow: row;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 10px 0 0;
        }

        .request-content > .actions > .request {
          border: var(--action-border);
          color: var(--text-color);
          background: transparent;
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