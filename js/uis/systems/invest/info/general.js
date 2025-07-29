export default class InvestmentInfo extends HTMLElement {
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
    // select main and sub attributes
    
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
      ${this.getInfo()}
    `;
  }

  getInfo = () => {
    return /* html */`
      <div class="info">
        ${this.getOverview()}
        ${this.getMyInvestments()}
        ${this.getExplore()}
        ${this.getOffices()}
        ${this.getInquire()}
      </div>
    `;
  }

  getOverview = () => {
    return /* html */`
      <div class="overview">
        <h4>Investment Overview</h4>
        <p>Investment Overview is a summary of your investment. It shows the total amount of money you have invested, the total amount of money you have earned, the total amount of money you have withdrawn, and the total amount of money you have lost.</p>
      </div>
    `;
  }

  getMyInvestments = () => {
    return /* html */`
      
    `;
  }

  getExplore = () => {
    return /* html */`
     
  `;
  }

  getOffices = () => {
    return /* html */`
      
    `;
  }

  getInquire = () => {
    return /* html */ `
      
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