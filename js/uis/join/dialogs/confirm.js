export default class ConfirmDialog extends HTMLElement {
  constructor() {

    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({mode: 'open'});

    this.render();

  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    this.disableScroll();

    // Handle action click
    this.handleActionClick();
  }

  // Open user profile
  handleActionClick = () => {
    const outerThis = this;
    // get a.meta.link
    const actions = this.shadowObj.querySelector('.actions > .action');

    // close the modal
    actions.addEventListener('click', e => {
      e.preventDefault();
      // remove the modal
      outerThis.remove();
    });
  }

  disconnectedCallback() {
    this.enableScroll()
  }

  disableScroll() {
    // Get the current page scroll position
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    let scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    document.body.classList.add("stop-scrolling");

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function() {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  enableScroll() {
    document.body.classList.remove("stop-scrolling");
    window.onscroll = function() {};
  }

  getTemplate() {
    // Show HTML Here
    const title = this.getAttribute('dialog-title');
    const message = this.getAttribute('dialog-message');
    return /*html*/`
      <div class="overlay"></div>
      <section id="content" class="content">
        ${this.getWelcome(title, message)}
      </section>
    ${this.getStyles()}`
  }

  getWelcome(title, message) {
    return /*html*/`
      <div class="welcome">
        <h4>${title}</h4>
				<p>${message}</p>
        <div class="actions">
          <button class="action">Ok</button>
        </div>
			</div>
    `
  }

  getStyles() {
    return /*css*/`
      <style>
        * {
          box-sizing: border-box !important;
        }

        :host{
          border: none;
          padding: 0;
          justify-self: end;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          z-index: 100;
          width: 100%;
          min-width: 100vw;
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          left: 0;
        }

        div.overlay {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: var(--modal-background);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
        }

        #content {
          z-index: 1;
          background-color: var(--background);
          padding: 15px 10px 10px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          width: 700px;
          max-height: 90%;
          height: max-content;
          border-radius: 15px;
          position: relative;
        }

        .welcome {
          width: 100%;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          row-gap: 0;
        }

        .welcome > h4 {
          width: 100%;
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 10px;
          padding: 0;
          text-align: start;
          border-radius: 12px;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
          font-weight: 500;
          position: relative;
        }

        .welcome  p {
          width: 100%;
          margin: 0;
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
          text-align: start;
          line-height: 1.5;
          font-size: 0.9rem;
        }

        .welcome > .actions {
          margin: 10px 10px 5px;
          width: calc(100% - 10px);
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: end;
          gap: 30px;
        }

        .welcome > .actions button {
          text-decoration: none;
          background: none;
          border: var(--action-border);
          text-decoration: none;
          padding: 6px 12px 6px;
          font-size: 1rem;
          cursor: pointer;
          margin: 0;
          width: max-content;
          justify-self: center;
          text-align: center;
          color: var(--text-color);
          font-weight: 500;
          border-radius: 12px;
        }

        @media screen and ( max-width: 850px ){
          #content {
            width: 90%;
          }
        }
        @media screen and ( max-width: 600px ){
          :host {
            border: none;
            background-color: var(--modal-background);
            padding: 0px;
            justify-self: end;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            gap: 0;
            z-index: 20;
            position: fixed;
            right: 0;
            top: 0;
            bottom: 0;
            left: 0;
          }

          ##content {
            z-index: 1;
            background-color: var(--background);
            padding: 15px 10px 10px;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            gap: 0;
            width: calc(100% - 20px);
            max-height: 90%;
            height: max-content;
            border-radius: 25px;
            position: relative;
          }

          .welcome > h2 > span.control,
          .welcome > .actions > .action {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}