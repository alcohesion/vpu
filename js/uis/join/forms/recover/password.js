export default class RecoverPassword extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this._url = this.getAttribute('api');

    this.render();
  }

  render() {
    this.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // Select form
    const form = this.querySelector('#name-form');

    // add event listeners
    this.inputListeners(form);
  }

  fetchWithTimeout = async (url, options = {}, timeout = 9500) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
  
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw new Error(`Network error: ${error.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
  };

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
      ${this.getHeader()}
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      <form class="fields initial" id="name-form">
        <div class="field bio">
          <div class="input-group" password>
            <label for="password" class="center">Your Password</label>
            <input data-name="password" type="password" name="password" id="password" placeholder="Your password" required>
            <span class="status">Password is required</span>
          </div>
          <div class="input-group repeat">
            <label for="repeat" class="center">Repeat Password</label>
            <input data-name="repeat" type="password" name="repeat" id="repeat" placeholder="Repeat password" required>
            <span class="status">Repeat password is required</span>
          </div>
        </div>
        ${this.getButtons()}
      </form>
    `;
  }

  getButtons = () => {
    return /*html*/`
      <div class="buttons">
        <!--<button type="button" class="button prev">
          ${this.getButtonPrev()}
        </button> -->
        <button type="submit" class="button next">
          ${this.getButtonNext()}
        </button>
      </div>
    `
  }

  getButtonPrev = () => {
    return /*html*/`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
        <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="text">Back</span>
    `;
  }

  getButtonNext = () => {
    return /*html*/`
      <span class="text">Next</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
        <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  inputListeners = form => {
    const password = form.querySelector('input[name="password"]');
    const repeat = form.querySelector('input[name="repeat"]');

    password.addEventListener('input', e => {
      const parent = password.parentElement;
      const status = parent.querySelector('.status');
      const value = e.target.value.trim();

      // check for a capital letter
      if (!/[A-Z]/.test(value)) {
        status.textContent = 'Password must contain at least one capital letter';
        parent.classList.remove('success');
        parent.classList.add('failed');
      }
      // check for a number
      else if (!/\d/.test(value)) {
        status.textContent = 'Password must contain at least one number';
        parent.classList.remove('success');
        parent.classList.add('failed');
      }
      // check for a special character
      else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)) {
        status.textContent = 'Password must contain at least one special character';
        parent.classList.remove('success');
        parent.classList.add('failed');
      }
      // check if value is empty or less than 8 characters
      else if (!value || value.length < 8) {
        status.textContent = 'Password must be at least 8 characters long';
        parent.classList.remove('success');
        parent.classList.add('failed');
      }
      else {
        parent.classList.remove('failed');
        parent.classList.add('success');
      }
    })

    repeat.addEventListener('input', e => {
      const parent = repeat.parentElement;
      const status = parent.querySelector('.status');
      const value = e.target.value.trim();

      if (value !== password.value.trim()) {
        status.textContent = 'Passwords do not match';
        parent.classList.remove('success');
        parent.classList.add('failed');
      } else {
        parent.classList.remove('failed');
        parent.classList.add('success');
      }
    })
  }

  getHeader = () => {
    return /* html */`
      <div class="top">
        <h4 class="title">Reset Your Password</h4>
        <p class="desc">
          Your password must be at least 8 characters long and contain at least one capital letter, one number, and one special character.
        </p>
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

        .top {
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 5px;
          padding: 0;
          margin: 15px 0 20px 0;
          width: 100%;
        }

        .top > h4.title {
          display: flex;
          align-items: center;
          color: var(--title-color);
          font-size: 1.3rem;
          font-weight: 500;
          margin: 0;
          padding: 0 0 6px 0;
        }

        .top > .desc {
          padding: 0;
          text-align: center;
          margin: 0;
          color: var(--text-color);
          font-size: 0.95rem;
          font-family: var(--font-main), sans-serif;
        }

        form.fields {
          margin: 0 0 10px;
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        form.fields > .field {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 20px;
        }

        form.fields.center > .field {
          align-items: center;
        }

        form.fields .field .input-group {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          color: var(--text-color);
          gap: 5px;
          position: relative;
          transition: border-color 0.3s ease-in-out;
        }

        form.fields .field .input-group > .wrapper {
          display: flex;
          align-items: center;
          gap: 0;
          width: 100%;
        }

        form.fields .field .input-group > svg {
          position: absolute;
          right: 10px;
          top: 38px;
          width: 20px;
          height: 20px;
        }

        form.fields .field .input-group > svg {
          display: none;
        }

        form.fields .field .input-group.success > svg {
          display: inline-block;
        }

        form.fields .field .input-group.failed > svg {
          display: inline-block;
        }

        form.fields .field .input-group.success > svg {
          color: var(--accent-color);
        }

        form.fields .field .input-group.failed > svg {
          color: var(--error-color);
        }

        form.fields label {
          padding: 0 0 5px 0;
          color: var(--text-color);
        }

        form.fields .field.bio label {
          padding: 0 0 0 5px;
        }

        form.fields label {
          color: var(--label-color);
          font-size: 1.1rem;
          font-family: var(--font-main), sans-serif;
          transition: all 0.3s ease-in-out;
          pointer-events: none;
        }

        form.fields .field input {
          border: var(--input-border);
          background-color: var(--background) !important;
          font-size: 1rem;
          width: 100%;
          height: 40px;
          outline: none;
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--text-color);
        }

        form.fields .field .input-group > .wrapper > input {
          border-left: none;
          font-size: 1rem;
          width: 100%;
          height: 40px;
          min-height: 40px;
          width: calc(100% - 50px);
          min-width: calc(100% - 50px);
          outline: none;
          padding: 10px 12px 10px 5px;
          border-radius: 0 12px 12px 0;
          color: var(--text-color);
        }

        form.fields .field .input-group > .wrapper > span.code {
          background-color: var(--background);
          color: var(--text-color);
          font-size: 1rem;
          padding: 10px 0 10px 10px;
          max-height: 40px;
          font-weight: 500;
          width: 50px;
          border-radius: 12px 0 0 12px;
          border: var(--input-border);
          border-right: none;
        }

        form.fields .field .input-group.focused > .wrapper > span.code {
          border: var(--input-border-focus);
          border-right: none;
        }
        
        form.fields .field input:-webkit-autofill,
        form.fields .field input:-webkit-autofill:hover, 
        form.fields .field input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px var(--background) inset;
          -webkit-text-fill-color: var(--text-color) !important;
          transition: background-color 5000s ease-in-out 0s;
          color: var(--text-color) !important;
        }
        
        form.fields .field input:autofill {
          filter: none;
          color: var(--text-color) !important;
        }

        form.fields .field input:focus {
          border: var(--input-border-focus);
        }

        form.fields .field .input-group.success input,
        form.fields .field .input-group.success input:focus {
          border: var(--input-border-focus);
        }

        form.fields .field .input-group.focused.success > .wrapper > span.code,
        form.fields .field .input-group.success > .wrapper > span.code {
          border: var(--input-border-focus);
          border-right: none;
        }

        form.fields .field .input-group.success > .wrapper input,
        form.fields .field .input-group.success > .wrapper input:focus {
          border: var(--input-border-focus);
          border-left: none;
        }

        form.fields .field .input-group.failed input,
        form.fields .field .input-group.failed input:focus {
          border: var(--input-border-error);
        }

        form.fields .field .input-group.failed > .wrapper input,
        form.fields .field .input-group.failed > .wrapper input:focus {
          border: var(--input-border-error);
          border-left: none;
        }

        form.fields .field .input-group.focused.failed > .wrapper > span.code,
        form.fields .field .input-group.failed > .wrapper > span.code {
          border: var(--input-border-error);
          border-right: none;
        }

        form.fields .field .input-group.success input {
          color: var(--accent-color);
        }

        form.fields .field .input-group.failed input {
          color: var(--error-color);
        }

        form.fields label.focused {
          top: -10px;
          font-size: 0.9rem;
          background-color: var(--label-focus-background);
          padding: 0 5px;
        }

        form.fields .field span.status {
          color: var(--error-color);
          font-size: 0.95rem;
          display: none;
          padding: 0 0 0 5px;
        }

        form.fields .field .input-group.failed span.status {
          color: var(--error-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        form.fields .field .input-group.success span.status {
          color: var(--accent-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        form.fields .field .input-group.success span.status {
          display: none;
        }

        .buttons {
          display: flex;
          align-items: center;
          justify-content: end;
          width: 100%;
          margin: 10px 0;
        }

        .buttons.disabled {
          display: none;
          visibility: hidden;
        }

        .buttons > .button {
          border: none;
          position: relative;
          background: var(--gray-background);
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          text-transform: capitalize;
          justify-content: center;
          padding: 7px 15px 7px;
          height: 35px;
          min-width: 90px;
          width: 90px;
          position: relative;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        .buttons > .button.prev {
          border: var(--action-border);
          background: none;
          background-color: none;
          color: var(--text-color);
          padding: 6px 15px 6px 13px;
        }

        .buttons > .button.next {
          color: var(--text-color);
          padding: 7px 13px 7px 15px;
        }

        .buttons > .button.next:hover {
          color: var(--text-color);
        }

        .buttons > .button svg {
          width: 18px;
          height: 18px;
          color: inherit;
          margin: 0 0 -2px 0;
        }

        .buttons > .button.next {
          color: var(--text-color);
          background: var(--gray-background);
        }

        .buttons > .button.prev.disabled,
        .buttons > .button.next.disabled {
          pointer-events: none;
          opacity: 0.5;
          cursor: not-allowed !important;
        }

        @media screen and (max-width:600px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          a,
          form.fields .buttons > .button,
          form.fields .actions > .action {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}