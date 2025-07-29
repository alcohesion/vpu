export default class VerifyPhone extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this.generate = this.getAttribute('generate');
    this.verify = this.getAttribute('verify');
    this.phone = this.getAttribute('phone');

    this.render();
    this.app = this.getRootNode().host;
  }

  render() {
    this.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // Select form
    const form = this.querySelector('#name-form');

    // Add input listeners
    this.inputListeners(form);
    this.submitForm(form);
    this.generateCode();
  }

  submitForm = form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const submitButton = form.querySelector('.button.next');

      // add loading state & disable button
      submitButton.innerHTML = this.getLoader()
      submitButton.disabled = true;
      
      // validate form
      const result = this.validateForm(form);

      if (result.validated && result.values) {
        //verify code
        const data = await this.verifyCode(result.values);

        if(data.verified) {
          // navigate to next form
          this.app.navigate({ kind: 'verification', no: 2 , email: data.user.email });
        }
      } else {
        // remove loading state & enable button
        submitButton.innerHTML = this.getButtonNext();
        submitButton.disabled = false;
      }
    });
  }

  verifyCode = async data => {
    const form = this.querySelector('#name-form');
    const submitButton = form.querySelector('.button.next');

    // add loading state & disable button
    submitButton.innerHTML = this.getLoader()
    submitButton.disabled = true;

    try {
      const response = await this.fetchWithTimeout(this.verify, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          kind: 'phone',
          code: data.code
        })
      });

      const result = await response.json();

      if(!result.success) {
        // add server message
        this.addSeverMessage(form, result.message, 'error');

        // remove loading state & enable button
        submitButton.innerHTML = this.getButtonNext();
        submitButton.disabled = false;

        return {
          verified: false,
          user: null
        }
      }

      console.log(result);

      return {
        verified: true,
        user: result.user
      }
    } catch (error) {
      // add server message
      this.addSeverMessage(form, error.message);

      // remove loading state & enable button
      submitButton.innerHTML = this.getButtonNext();
      submitButton.disabled = false;

      return {
        verified: false,
        user: null
      }
    }
  }

  generateCode = async () => {
    const generateButton = this.querySelector('.phone-header > .actions > .action');
    const form = this.querySelector('#name-form');

    const options = {
      kind: 'phone',
      phone: this.phone
    }

    // add event listener to button
    generateButton.addEventListener('click', async e => {
      e.preventDefault();

      // add loading state & disable button
      generateButton.innerHTML = this.getLoader()
      generateButton.disabled = true;

      try {
        const response = await this.fetchWithTimeout(this.generate, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(options)
        });
  
        const result = await response.json();
  
        if(!result.success) {
          // add server message
          this.addSeverMessage(form, result.message, 'error');
  
          // remove loading state & enable button
          generateButton.innerHTML = 'Send code';
          generateButton.disabled = false;
  
          return;
        }

        // add countdown
        this.addCountDown(generateButton, 60);
  
        // add success message
        this.addSeverMessage(form, 'Code sent successfully, check your phone for the code', 'success');
      } catch (error) {
        // add server message
        this.addSeverMessage(form, error.message);
  
        // remove loading state & enable button
        generateButton.innerHTML = 'Send code';
        generateButton.disabled = false;
      }
    });
  }

  addCountDown = (button, seconds) => {
    let count = seconds;
    const interval = setInterval(() => {
      count--;
      button.textContent = `Resend in (${count}) ${count > 1 ? 'seconds' : 'second'}`;

      if(count <= 0) {
        clearInterval(interval);
        button.textContent = 'Resend Code';
        button.disabled = false;
      }
    }, 1000);
  }

  addSeverMessage = (form, message, type = 'error') => {
    const actions = form.querySelector('.buttons');
    actions.insertAdjacentHTML('beforebegin', this.serverMessage(message, type));

    setTimeout(() => {
      const message = form.querySelector('.server-message');
      if(message) message.remove();
    }, 5000);
  }

  serverMessage = (message, type = 'error') => {
    return /*html*/`
      <div class="server-message ${type}">
        <h4 class="title">${message}</h4>
      </div>
    `;
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
  }

  inputListeners = from => {
    const code  = from.querySelector('#code');

    code.addEventListener('input', () => {
      const value = code.value.trim();
      const status = code.nextElementSibling;
      const parent = code.parentElement;

      // capitalize code
      code.value = value.toUpperCase();

      // check code length should be 6
      if(value.length < 6 || value.length > 6) {
        parent.classList.remove('success');
        parent.classList.add('failed');
        status.textContent = 'Code should be 6 characters';
      } else {
        parent.classList.remove('failed');
        parent.classList.add('success');
        status.textContent = 'Code is valid';
      }
    })
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
        <div class="field">
          <div class="input-group code">
            <label for="code">Verification Code</label>
            <input type="text" id="code" name="code" placeholder="Code e.g N5XF6U" required>
            <span class="status">Code is required</span>
          </div>
        </div>
        ${this.getButtons()}
      </form>
    `;
  }

  getHeader = () => {
    return /* html */`
      <div class="phone-header">
        <div class="top">
          <h4 class="title">Verify Phone Number</h4>
          <p class="desc">
            Click send code button to generate a code for  <b>${this.getAttribute('phone')}</b>.
            Verification code will be sent to your phone number via SMS.
          </p>
        </div>
        <div class="actions">
          <button class="action" id="verify-phone">Send code</button>
        </div>
      </div>
    `;
  }
  
  getButtons = () => {
    return /*html*/`
      <div class="buttons">
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

  validateForm = form => {
    const code = form.querySelector('input[name="code"]');

    // validate code
    const codeParent = code.parentElement;
    const codeStatus = codeParent.querySelector('.status');
    const codeValue = code.value.trim();


    // check if code is valid
    if (!codeValue || codeValue.length < 6 || codeValue.length > 6) {
      codeStatus.textContent = 'Code should be 6 characters long'
      codeParent.classList.remove('success');
      codeParent.classList.add('failed');

      return {
        validated: false,
        values: null
      }
    } else {
      codeParent.classList.remove('failed');
      codeParent.classList.add('success');
    }

    return {
      validated: true,
      values: {
        code: codeValue
      }
    }
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

        .server-message {
          display: flex;
          flex-flow: column;
          gap: 0px;
          padding: 10px;
          border-radius: 12px;
          border: var(--border);
        }

        .server-message.error {
          border: var(--error-border);
          color: var(--error-color);
        }

        .server-message.success {
          border: var(--success-border);
          color: var(--accent-color);
        }

        .server-message > h4.title {
          display: flex;
          align-items: center;
          text-align: center;
          color: inherit;
          font-size: 1.1rem;
          font-weight: 500;
          margin: 0;
          padding: 0 0 6px 0;
        }

        .server-message > p {
          padding: 0;
          margin: 0;
          text-align: center;
          color: inherit;
          font-size: 0.9rem;
        }

        .phone-header {
          display: flex;
          flex-flow: column;
          gap: 0;
          margin: 15px 0 18px 0;
          padding: 0;
        }

        .phone-header > .top {
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        .phone-header > .top > h4.title {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--title-color);
          font-size: 1.3rem;
          font-weight: 500;
          margin: 0;
          padding: 0 0;
        }

        .phone-header > .top > .desc {
          margin: 0;
          padding: 5px 0;
          text-align: center;
          color: var(--text-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
        }

        .phone-header > .top > .desc > b {
          color: var(--gary-color);
          font-family: var(--font-read), sans-serif;
          font-weight: 500;
        }

        .phone-header > .actions {
          display: flex;
          font-family: var(--font-main), sans-serif;
          width: 100%;
          flex-flow: row;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 7px 0 10px;
        }
        
        .phone-header > .actions > .action {
          border: none;
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
          justify-content: center;
          padding: 7px 15px 7px;
          height: 35px;
          min-width: 100px;
          width: max-content;
          max-width: max-content;
          position: relative;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        .phone-header > .actions > .action.sent {
          border: var(--action-border);
          background: none;
          background-color: none;
          color: var(--text-color);
          padding: 6px 15px 6px;
        }

        form.fields {
          margin: 0 0 5px;
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
          align-items: center;
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
          width: max-content;
          height: 40px;
          outline: none;
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--text-color);
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
          justify-content: center;
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
          form.fields .buttons > .button {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}