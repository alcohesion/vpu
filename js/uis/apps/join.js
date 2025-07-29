export default class AppJoin extends HTMLElement {
  constructor() {
    super();
    this.identity = {}
    this.registration = {}
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.base = '/api/v1/a';
    this.image = '/api/v1/i';
    this.setTitle('VPU Login - Transact with ease')
    this.render();
  }

  setTitle = text => {
    document.title = text || 'Thealcohesion VPU | Build Alkebulan, build generations';
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // fetch data
    setTimeout(() => {
      this.fetchData();
    }, 3000);
  }

  fetchData = async () => {
    const contentContainer = this.shadowObj.querySelector('section.main-container');
    const container = this.shadowObj.querySelector('div.ui > .ui-content');
    const url = `${this.base}/stage`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      // if !result.success
      if (!result.success || result.unauthorized) {
        // launch welcome page
        contentContainer.innerHTML = this.getBody();

        // get logon container
        const logonContainer = this.shadowObj.querySelector('.logon-container > .content-container');

        // add welcome page
        logonContainer.innerHTML = this.getWelcome();

        // activate welcome page
        this.activateWelcome(logonContainer, this.shadowObj.querySelector('.stages-container'));
        return;
      }

      contentContainer.innerHTML = this.getBody();

      const user = result.user;
      const stage = user.stage;

      // check user stage
      if (stage.kind === 'verify') {
        // check if name is phone
        if (stage.name === 'phone') {
          // check if phone is verified
          if (stage.verified) {
            this.navigate({ kind: 'verification', no: 2, email: user.email });
          } else {
            this.navigate({ kind: 'verification', no: 1, phone: user.phone });
          }
        }

        // check if name is email
        if (stage.name === 'email') {
          // check if email is verified
          if (stage.verified) {
            // navigate to the identity stage
            this.navigate({ kind: 'identity', no: 1, status: stage.status, name: user.name, updated_at: user.updated_at });
          } else {
            this.navigate({ kind: 'verification', no: 2, email: user.email });
          }
        }
      }

      // check if user stage is identity
      if (stage.kind === 'identity') {
        // check if identity is verified
        this.navigate({ kind: 'identity', no: 5, status: stage.status, name: user.name, updated_at: user.updated_at });
      }

    } catch (error) {
      console.error(error);
      container.innerHTML = this.getButtons();

      // activate button
      const button = container.querySelector('.buttons > .button.retry');
      this.activateButton(container, button);
    }
  }

  activateButton = (container, button) => {
    // add event listener to button
    button.addEventListener('click', (e) => {
      e.preventDefault();
      container.innerHTML = this.getLoading();

      // call fetch data
      this.fetchData();
    })
  }

  navigate = state => {
    const contentContainer = this.shadowObj.querySelector('.content-container');

    // add large loader
    contentContainer.innerHTML = this.getLargeLoader();

    // set timeout
    setTimeout(() => {
      this.navigateToStage(state, contentContainer);
    }, 3000);
  }

  setRegistrationData = data => {
    this.registration = {
      ...this.registration,
      ...data
    }
  }

  getRegistrationData = () => {
    return this.registration;
  }

  setIdentityData = data => {
    this.identity = {
      ...this.identity,
      ...data
    }
  }

  getIdentityData = () => {
    return this.identity;
  }

  navigateToStage = (state, contentContainer) => {
    if (state.kind === 'registration') {
      this.registrationNavigation(state.no, contentContainer, this.shadowObj.querySelector('.stages-container'));
    } else if (state.kind === 'verification') {
      this.verificationNavigation(state, contentContainer, this.shadowObj.querySelector('.stages-container'));
    } else if (state.kind === 'identity') {
      this.identityNavigation(state, contentContainer, this.shadowObj.querySelector('.stages-container'));
    } else if (state.kind === 'recover') {
      this.recoverNavigation(state.no, contentContainer, this.shadowObj.querySelector('.stages-container'));
    } else if (state.kind === 'login') {
      contentContainer.innerHTML = this.getLoginForm();
      this.shadowObj.querySelector('.stages-container').innerHTML = '';
    } else if (state.kind === 'landing') {
      contentContainer.innerHTML = this.getWelcome();
      const stagesContainer = this.shadowObj.querySelector('.stages-container')
      stagesContainer.innerHTML = '';
      this.activateWelcome(contentContainer, stagesContainer);
    }
  }

  registrationNavigation = (stage, contentContainer, stagesContainer) => {
    if (stage === 1) {
      contentContainer.innerHTML = this.getRegisterForm();
      this.activateRegistrationStages(stagesContainer, 1);
    } else if (stage === 2) {
      contentContainer.innerHTML = this.getRegisterBio();
      this.activateRegistrationStages(stagesContainer, 2);
    } else if (stage === 3) {
      contentContainer.innerHTML = this.getRegisterPassword();
      this.activateRegistrationStages(stagesContainer, 3);
    } else if (stage === 4) {
      contentContainer.innerHTML = this.getRegisterSuccess(this.registration.user);
      this.activateRegistrationStages(stagesContainer, 4);
    }
  }

  verificationNavigation = (stage, contentContainer, stagesContainer) => {
    if (stage.no === 1) {
      contentContainer.innerHTML = this.getVerifyPhone(stage.phone);
      this.activateVerificationStages(stagesContainer, 1);
    } else if (stage.no === 2) {
      contentContainer.innerHTML = this.getVerifyEmail(stage.email);
      this.activateVerificationStages(stagesContainer, 2);
    } else if (stage.no === 3) {
      contentContainer.innerHTML = this.getVerifySuccess(stage.name);
      this.activateVerificationStages(stagesContainer, 3);
    }
  }

  identityNavigation = (stage, contentContainer, stagesContainer) => {
    if (stage.no === 1) {
      contentContainer.innerHTML = this.getIdentityPicture();
      this.activateIdentityStages(stagesContainer, 1);
    } else if (stage.no === 2) {
      contentContainer.innerHTML = this.getIdentityKind();
      this.activateIdentityStages(stagesContainer, 2);
    } else if (stage.no === 3) {
      contentContainer.innerHTML = this.getIdentityFront();
      this.activateIdentityStages(stagesContainer, 3);
    } else if (stage.no === 4) {
      contentContainer.innerHTML = this.getIdentityBack();
      this.activateIdentityStages(stagesContainer, 4);
    } else if (stage.no === 5) {
      contentContainer.innerHTML = this.getIdentityStatus(stage.status, stage.name, stage.updated_at);
      this.activateIdentityStages(stagesContainer, 5);
    }
  }

  activateWelcome = (contentContainer, stagesContainer) => {
    const welcomeLinks = this.shadowObj.querySelectorAll('.welcome .options a');
    const check = this.shadowObj.querySelector('.welcome input[type="checkbox"]');
    welcomeLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (!this.activateCheckButton(check)) return;
        const action = link.getAttribute('data-action');

        if (action === 'register') {
          this.currentStage = {
            kind: 'registration',
            no: 1
          }
          this.activateRegistration(contentContainer, stagesContainer);
        } else if (action === 'login') {
          this.activateLogin(contentContainer, stagesContainer);
        } else {
          this.currentStage = {
            kind: 'recover',
            no: 1
          }
          this.activateRecover(contentContainer, stagesContainer);
        }
      });
    });
  }

  openDialog = () => {
    const dialog = this.getTermsDialog();

    const body = document.querySelector('body');
    body.insertAdjacentHTML('beforeend', dialog);
  }

  activateCheckButton = check => {
    // check if checkbox is checked
    const value = check.checked;

    // display warning message
    if (!value) {
      // open dialog
      this.openDialog();
      return false;
    }

    return true;
  }

  activateRegistration = (contentContainer, stagesContainer) => {
    // set title
    this.setTitle('VPU Registration - Get started with us');

    // add loader
    contentContainer.innerHTML = this.getLargeLoader();

    // set timeout
    setTimeout(() => {
      contentContainer.innerHTML = this.getRegisterForm();
      this.activateRegistrationStages(stagesContainer, 1);
    }, 3000);
  }

  activateLogin = (contentContainer, stagesContainer) => {
    // set title
    this.setTitle('VPU Login - Transact with ease');

    // clear stages container
    stagesContainer.innerHTML = '';

    // add loader
    contentContainer.innerHTML = this.getLargeLoader();

    // set timeout
    setTimeout(() => {
      contentContainer.innerHTML = this.getLoginForm();
    }, 3000);
  }

  activateRecover = (contentContainer, stagesContainer) => {
    // set title
    this.setTitle('VPU Password Recovery - Get back your account');

    // add loader
    contentContainer.innerHTML = this.getLargeLoader();

    // set timeout
    setTimeout(() => {
      contentContainer.innerHTML = this.getRecoverForm();
      this.activateRecoverStages(stagesContainer, 1);
    }, 3000);
  }

  activateRegistrationStages = (stagesContainer, no) => {
    stagesContainer.innerHTML = this.getRegistrationStages();

    const stages = stagesContainer.querySelectorAll('.stages.registration .stage');

    // set current stage
    stages.forEach((stage, index) => {
      // add current class as long as index is less than
      // the current stage number
      if (index < no) {
        stage.classList.add('current');
      }
    });
  }

  activateVerificationStages = (stagesContainer, no) => {
    stagesContainer.innerHTML = this.getVerificationStages();

    const stages = stagesContainer.querySelectorAll('.stages.verification .stage');

    // set current stage
    stages.forEach((stage, index) => {
      // add current class as long as index is less than
      // the current stage number
      if (index < no) {
        stage.classList.add('current');
      }
    });
  }

  activateIdentityStages = (stagesContainer, no) => {
    stagesContainer.innerHTML = this.getIdentityStages();

    const stages = stagesContainer.querySelectorAll('.stages.identity .stage');

    // set current stage
    stages.forEach((stage, index) => {
      // add current class as long as index is less than
      // the current stage number
      if (index < no) {
        stage.classList.add('current');
      }
    });
  }

  activateRecoverStages = (stagesContainer, no) => {
    stagesContainer.innerHTML = this.getRecoverStages();

    const stages = stagesContainer.querySelectorAll('.stages.recover .stage');

    // set current stage
    stages.forEach((stage, index) => {
      // add current class as long as index is less than
      // the current stage number
      if (index < no) {
        stage.classList.add('current');
      }
    });
  }

  getTemplate() {
    return /*html*/`
      <section class="main-container">
        ${this.initializeUI()}
      </section>
      ${this.getStyles()}
    `
  }

  getBody() {
    return /*html*/`
      <div class="logon-container">
        ${this.getHeader()}
        <div class="content-container">
        </div>
      </div>
    `
  }

  getHeader() {
    return /*html*/`
      <div class="head">
				<div class="logo">
					<h2 class="main">
            Thealcohesion VPU
          </h2>
					<span class="slogan">Build Alkebulan, build generations</span>
				</div>
			</div>
      <div class="stages-container">
      </div>
    `
  }

  initializeUI = () => {
    return /*html*/`
      <div class="ui">
        <div class="ui-header">
          <h4 class="title">
            Thealcohesion VPU
          </h4>
          <span class="desc">
            Build Alkebulan, build generations
          </span>
        </div>
        <div class="ui-content">
          ${this.getLoading()}
        </div>
      </div>
    `
  }

  getButtons = () => {
    return /*html*/`
      <p class="info">
        Something went wrong, <br>Check your internet connection and try again.
      </p>
      <div class="buttons">
        <button type="submit" class="button retry">
          <span class="text">Retry</span>
        </button>
      </div>
    `
  }

  getLoading = () => {
    return /*html*/`
      <div id="loading" class="loading"></div>
    `;
  }

  getTermsDialog = () => {
    return /*html*/`
      <confirm-dialog
        dialog-title="Confirm terms and conditions"
        dialog-message="You are required confirm you have read and agree to Thealcohesion's Terms of Service and Privacy Policy to continue.">
      </confirm-dialog>
    `
  }

  getWelcome() {
    return /*html*/`
      ${this.getInfo()}
      <div class="welcome">
        <div class="options">
          <a href="/join/register" class="register" data-action="register">
            <div class="info">
              <p class="next">New to Thealcohesion VPU?</p>
              <span class="desc">
                To get started in creating an account with Thealcohesion VPU, you need to have a valid passport or national identity card.
              </span>
            </div>
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </a>
          <a href="/join/login" class="login" data-action="login">
            <div class="info">
              <p class="next">Already have Thealcohesion VPU account?</p>
              <span class="desc">
                If you already have Thealcohesion VPU account, click here to login into your account. Registered email or phone number and password are required.
              </span>
            </div>
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </a>
          <a href="/join/recover" class="forgot" data-action="forgot">
            <div class="info">
              <p class="next">Forgot your Thealcohesion VPU password?</p>
              <span class="desc">
                Click here to reset your password. Make sure you have access to your registered email or phone number.
              </span>
            </div>
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </a>
        </div>

				<div class="info">
					<input type="checkbox" id="terms" name="terms" value="terms">
					<label for="terms">
            Check here to confirm that you have read and agree to Thealcohesion's <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.
          </label>
				</div>
			</div>
    `
  }

  getInfo = () => {
    return /* html */`
      <div class="info-header">
        <div class="top">
          <p class="desc">
            This is Thealcohesion VPU(virtual pragmatic universe). This platform is designed for Thealcohesion to execute its objectives and 
            activities at a centralized space to realize its vision on a physical universe.
          </p>
        </div>
      </div>
    `;
  }

  getRegisterForm = () => {
    return /*html*/`
      <register-form
        check="${this.base}/check"
        method="POST">
      </register-form>
    `
  }

  getRegisterBio = () => {
    return /*html*/`
      <register-bio class="form"></register-bio>
    `
  }

  getRegisterPassword = () => {
    return /*html*/`
      <register-password 
        api="${this.base}/register"
        method="PUT"
        class="form">
      </register-password>
    `
  }

  getRegisterSuccess = user => {
    return /*html*/`
      <register-success name="${user.name}">
      </register-success>
    `
  }

  getLoginForm = () => {
    return /*html*/`
      <login-form api="${this.base}/login"></login-form>
    `
  }

  getVerifyPhone = phone => {
    return /*html*/`
      <verify-phone
        generate="${this.base}/otp/generate"
        verify="${this.base}/otp/verify"
        phone="${phone}"
        class="form">
      </verify-phone>
    `
  }

  getVerifyEmail = email => {
    return /*html*/`
      <verify-email 
        generate="${this.base}/otp/generate"
        verify="${this.base}/otp/verify"
        email="${email}"
        class="form">
      </verify-email>
    `
  }

  getVerifySuccess = name => {
    return /*html*/`
      <verify-success name="${name}"></verify-success>
    `
  }

  getIdentityPicture = () => {
    return /*html*/`
      <identity-picture 
        api="${this.image}/upload"
        method="PUT"
        class="form">
      </identity-picture>
    `
  }

  getIdentityKind = () => {
    return /*html*/`
      <identity-kind
        method="PUT"
        class="form">
      </identity-kind>
    `
  }

  getIdentityFront = () => {
    return /*html*/`
      <identity-front 
        api="${this.image}/upload"
        method="PUT"
        class="form">
      </identity-front>
    `
  }

  getIdentityBack = () => {
    return /*html*/`
      <identity-back 
        api="${this.image}/upload"
        submit="${this.base}/identity/edit"
        method="PUT"
        class="form">
      </identity-back>
    `
  }

  getIdentityStatus = (status, name, date) => {
    return /*html*/`
      <identity-status status="${status}" name="${name}" date="${date}"></identity-status>
    `
  }

  getRecoverForm = () => {
    return /*html*/`
      <recover-form api="/api/v1/auth/login" method="POST" class="form"></recover-form>
    `
  }

  getRecoverVerify = () => {
    return /*html*/`
      <recover-verify api="/api/v1/auth/login" method="POST" class="form"></recover-verify>
    `
  }

  getResetPassword = () => {
    return /*html*/`
      <recover-password api="/api/v1/auth/login" method="POST" class="form"></recover-password>
    `
  }

  getRecoverSuccess = () => {
    return /*html*/`
      <recover-success name="John Doe"></recover-success>
    `
  }

  getFooter = () => {
    return /*html*/`
      <logon-footer company="VPU"></logon-footer>
    `
  }

  getRegistrationStages = () => {
    return /*html*/`
      <div class="stages registration">
        <span class="stage"></span>
        <span class="stage"></span>
        <span class="stage"></span>
        <span class="stage"></span>
      </div>
    `
  }

  getVerificationStages = () => {
    return /*html*/`
      <div class="stages verification">
        <span class="stage"></span>
        <span class="stage"></span>
        <span class="stage"></span>
      </div>
    `
  }

  getRecoverStages = () => {
    return /*html*/`
      <div class="stages recover">
        <span class="stage"></span>
        <span class="stage"></span>
        <span class="stage"></span>
      </div>
    `
  }

  getIdentityStages = () => {
    return /*html*/`
      <div class="stages identity">
        <span class="stage"></span>
        <span class="stage"></span>
        <span class="stage"></span>
        <span class="stage"></span>
        <span class="stage"></span>
      </div>
    `
  }

  getLargeLoader = () => {
    return /*html*/`
      <div id="large-loader" class="loader large"></div>
    `;
  }

  getStyles() {
    return /*css*/`
      <style>
        * {
          box-sizing: border-box !important;
        }
        *,
        *:after,
        *:before {
          box-sizing: border-box;
          font-family: var(--font-read), sans-serif;
        }

        *:focus {
          outline: inherit !important;
        }

        *::-webkit-scrollbar {
          width: 3px;
        }

        *::-webkit-scrollbar-track {
          background: #DDDDD7;
        }

        *::-webkit-scrollbar-thumb {
          width: 3px;
          background: linear-gradient(#53595f, #627ea0);
          border-radius: 50px;
        }

        :host{
          width: 100%;
          min-height: 100vh;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-position: 100%;
          background-size: 1rem 1rem;
        }

        #large-loader.loader {
          margin: 45px 0 0 0;
          width: 80px;
          aspect-ratio: 4;
          --c:#6e2d6e 90%,#0000;
          --c1:#d1a0d1 90%,#0000;
          --c2:#8a3d8a 90%,#0000;
          background: 
            radial-gradient(circle closest-side at left  10px top 50%,var(--c)),
            radial-gradient(circle closest-side                     ,var(--c1)),
            radial-gradient(circle closest-side at right 10px top 50%,var(--c2));
          background-size: 100% 100%;
          background-repeat: no-repeat;
          animation: l5 1s infinite alternate;
        }

        @keyframes l5 {
          to { width: 20px; aspect-ratio: 1}
        }

        /* HTML: <div class="loader"></div> */
        #loading.loading {
          width: 15px;
          aspect-ratio: 1;
          border-radius: 50%;
          animation: l6 1s infinite linear alternate;
        }
      
        @keyframes l6 {
          0%  {box-shadow: 20px 0 #6e2d6e, -20px 0 #0002;background: #6e2d6e }
          33% {box-shadow: 20px 0 #6e2d6e, -20px 0 #0002;background: #0002}
          66% {box-shadow: 20px 0 #0002,-20px 0 #6e2d6e; background: #0002}
          100%{box-shadow: 20px 0 #0002,-20px 0 #6e2d6e; background: #6e2d6e }
        }

        div.ui {
          width: 100%;
          min-height: 90dvh;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 10;
        }

        div.ui > .ui-header {
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin: 0 0 15px 0;
          padding: 0;
          width: 100%;
        }

        div.ui > .ui-header > h4.title {
          color: transparent;
          display: flex;
          align-items: center;
          background: var(--accent-linear);
          font-family: var(--font-main), monospace;
          background-clip: text;
          -webkit-background-clip: text;
          font-size: 1.55rem;
          font-weight: 600;
          line-height: 1.2;
          margin: 0;
          padding: 0 0;
        }

        div.ui > .ui-header > .desc {
          margin: 0;
          padding: 0;
          text-align: center;
          color: var(--gray-color);
          font-size: 0.95rem;
          font-family: var(--font-read), sans-serif;
        }

        div.ui > .ui-content {
          width: 100%;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 0;
          padding: 0;
        }

        div.ui > .ui-content .buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin: 10px 0;
        }

        div.ui > .ui-content p.info {
          color: var(--error-color);
          font-size: 0.98rem;
          text-align: center;
          font-family: var(--font-read), sans-serif;
          margin: 0;
          padding: 0;
        }

        div.ui > .ui-content .buttons.disabled {
          display: none;
          visibility: hidden;
        }

        div.ui > .ui-content .buttons > .button {
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

        div.ui > .ui-content .buttons > .button.retry {
          border: var(--action-border);
          background: none;
          background-color: none;
          color: var(--text-color);
          padding: 6px 15px 6px 15px;
        }

        .logon-container {
          z-index: 3;
          padding: 20px;
          width: 700px;
          height: max-content;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: start;
          gap: 5px;
          min-height: 90vh;
          border-radius: 10px;
          position: relative;
        }

        register-form,
        register-bio,
        register-password,
        register-success,
        login-form,
        identity-picture,
        identity-kind,
        identity-front,
        identity-back,
        identity-status,
        recover-form,
        recover-verify,
        recover-password,
        recover-success,
        verify-phone,
        verify-email,
        verify-success {
          display: flex;
          flex-flow: column;
          width: 100%;
        }

        .head {
          background-color: transparent;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          font-family: var(--font-text), sans-serif;
        }

         .head > .logo {
          max-height: max-content;
          position: relative;
          padding: 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 0;
        }

        .head>.logo h2 {
          margin: 0;
          padding: 0;
          line-height: 1.4;
          font-weight: 600;
          font-size: 1.6rem;
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--font-main), monospace;
        }

        .head > .logo span.slogan {
          margin: 0;
          width: 100%;
          color: var(--gray-color);
          line-height: 1.4;
          font-family: var(--font-read), sans-serif;
          font-weight: 400;
          font-size: 0.95rem;
          text-align: center;
        }

        .info-header {
          display: flex;
          flex-flow: column;
          gap: 0;
          margin: 0;
          padding: 0;
        }

        .info-header > .top {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        .info-header > .top > h4.title {
          display: flex;
          align-items: center;
          color: var(--title-color);
          font-size: 1.3rem;
          font-weight: 500;
          margin: 0;
          padding: 0 0;
        }

        .info-header > .top > .desc {
          margin: 0;
          padding: 5px 0;
          text-align: center;
          color: var(--text-color);
          font-size: 0.95rem;
          font-family: var(--font-main), sans-serif;
        }

        .info-header > .top > .desc > b {
          color: var(--gary-color);
          font-family: var(--font-read), sans-serif;
          font-weight: 500;
        }

        .content-container {
          width: 100%;
          min-height: 100px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .welcome {
          width: 100%;
          display: flex;
          flex-flow: column;
          align-items: center;
        }

        .welcome  p {
          margin: 0;
          text-align: center;
          font-family: var(--font-read), sans-serif;
          color: var(--text-color);
          line-height: 1.4;
          font-size: 1.15rem;
        }

        .welcome > .options {
          margin: 10px 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: start;
          gap: 10px;
        }

        .welcome > .options > a {
          border: var(--border);
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          padding: 5px 10px;
          width: 100%;
          color: var(--text-color);
          text-decoration: none;
          cursor: pointer;
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        .welcome > .options > a:hover {
          background: var(--gray-background);
        }

        .welcome > .options > a > .info {
         /* border: var(--border);*/
          padding: 0;
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 0;
        }

        .welcome > .options > a > .info > p.next {
          /*border: var(--border);*/
          margin: 0;
          font-size: 1rem;
          font-weight: 500;
          text-align: start;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
        }

        .welcome > .options > a > .info > span.desc {
          margin: 0;
          font-size: 0.85rem;
          color: var(--gray-color);
          line-height: 1.4;
        }

        .welcome > .options > a > .icon {
          padding: 0;
          display: none;
          align-items: center;
          justify-content: center;
          gap: 0;
        }

        .welcome > .options > a > .icon svg {
          width: 24px;
          height: 24px;
          color: var(--gray-color);
          margin: 0 0 -3px 0;
        }

        .welcome > .info {
          text-align: center;
          color: var(--gray-color);
          font-style: italic;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .welcome>.info a {
          color: var(--gray-color);
          font-size: 1em;
        }

        .welcome>.info a:hover {
          text-decoration: underline;
          color: var(--anchor-color);
        }

        .welcome > .info > span.warning {
          color: var(--error-color);
          display: block;
          margin: 10px 0;
          font-size: 0.85rem;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
        }

        .welcome > .info > input[type="checkbox"] {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 5px;
          margin: 4px 1px 0 5px;
          float: left;
          cursor: pointer;
        }

        div.stages {
          margin: 5px 0;
          width: 100%;
          min-width: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        div.stages > span.stage {
          width: 20px;
          height: 7px;
          background: var(--gray-background);
          border-radius: 2px;
          -webkit-border-radius: 2px;
          -moz-border-radius: 2px;
        }

        div.stages > span.stage.current {
          background: var(--stage-no-linear);
        }

        

        @media screen and (max-width:700px) {
          :host {
            width: 100%;
            min-height: 100vh;
            height: 100%;
            display: flex;
            align-items: start;
            justify-content: start;
            background-color: var(--background);
            background-position: unset;
            background-size: unset;
            background-image: unset;
          }

          .head {
            background-color: transparent;
            margin: 20px 0 0 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            font-family: var(--font-text), sans-serif;
          }

          .stages {
            background-color: transparent;
            height: max-content;
            width: max-content;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin: 0 0 20px 0;
          }

          section.main-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
          }

          .logon-container {
            box-shadow: unset;
            z-index: 3;
            padding: 10px 0;
            width: 100%;
            height: max-content;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: start;
            gap: 10px;
            border-radius: 0;
            position: relative;
          }

          a,
          .actions > .action,
          .welcome > .options > a {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}