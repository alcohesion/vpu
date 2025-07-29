export default class RegisterSuccess extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this.render();
    this.app = this.getRootNode().host;
  }

  render() {
    this.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    const container = this.querySelector('.registered');

    this.logIn(container);
  }

  logIn = container => {
    const button = container.querySelector('.actions > .action');

    button.addEventListener('click', () => {
      this.app.navigate({ kind: 'login' });
    })
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      <div class="registered">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" color="currentColor" fill="none">
            <path d="M14.2618 3.59937C13.1956 2.53312 12.6625 2 12 2C11.3375 2 10.8044 2.53312 9.73815 3.59937C9.09832 4.2392 8.46427 4.53626 7.55208 4.53626C6.7556 4.53626 5.62243 4.38178 5 5.00944C4.38249 5.63214 4.53628 6.76065 4.53628 7.55206C4.53628 8.46428 4.2392 9.09832 3.59935 9.73817C2.53312 10.8044 2.00001 11.3375 2 12C2.00002 12.6624 2.53314 13.1956 3.59938 14.2618C4.31616 14.9786 4.53628 15.4414 4.53628 16.4479C4.53628 17.2444 4.38181 18.3776 5.00949 19C5.63218 19.6175 6.76068 19.4637 7.55206 19.4637C8.52349 19.4637 8.99128 19.6537 9.68457 20.347C10.2749 20.9374 11.0663 22 12 22C12.9337 22 13.7251 20.9374 14.3154 20.347C15.0087 19.6537 15.4765 19.4637 16.4479 19.4637C17.2393 19.4637 18.3678 19.6175 18.9905 19M20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19M18.9905 19H19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 10.3077C8 10.3077 10.25 10 12 14C12 14 17.0588 4 22 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="top">
          <h4 class="title">Registration Successful.</h4>
          <p class="desc">
            Dear <b>${this.getAttribute("name")}</b>, your registration was successful.
            To proceed with verification process, click continue to login.
          </p>
        </div>
        <div class="actions">
          <button class="action">Continue</button>
        </div>
      </div>
    `;
  }

  getLoader = () => {
    return /*html*/`
      <div id="loader" class="loader"></div>
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

        #loader.loader {
          width: 42px;
          aspect-ratio: 4;
          --c:#6e2d6e 90%,#0000;
          --c1:#d1a0d1 90%,#0000;
          --c2:#8a3d8a 90%,#0000;
          background: 
            radial-gradient(circle closest-side at left  8px top 50%,var(--c)),
            radial-gradient(circle closest-side                     ,var(--c1)),
            radial-gradient(circle closest-side at right 8px top 50%,var(--c2));
          background-size: 100% 100%;
          background-repeat: no-repeat;
          animation: l4 1s infinite alternate;
        }
        
        @keyframes l4 {
          to { width: 16px; aspect-ratio: 1 }
        }

        .registered {
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 0;
          padding: 0;
          margin: 20px 0;
          width: 100%;
        }

        .registered > .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .registered > .icon > svg {
          width: 40px;
          height: 40px;
          color: var(--alt-color);
        }

        .registered > .top {
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        .registered > .top > h4.title {
          display: flex;
          align-items: center;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
          font-size: 1.3rem;
          font-weight: 600;
          line-height: 1.5;
          margin: 5px 0 0 0;
        }

        .registered > .top > .desc {
          margin: 0;
          text-align: center;
          padding: 10px 0;
          color: var(--text-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
        }

        .registered > .actions {
          display: flex;
          font-family: var(--font-main), sans-serif;
          width: 100%;
          flex-flow: row;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 10px 0 0;
        }
        
        .registered > .actions > .action {
          border: none;
          background: var(--gray-background);
          color: var(--text-color);
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
          height: 35px;
          position: relative;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        .registered > .actions > .action {
          border: var(--action-border);
          background: none;
          background-color: none;
          color: var(--text-color);
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