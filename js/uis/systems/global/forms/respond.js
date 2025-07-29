export default class ResponseEditor extends HTMLDivElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this.content = null;
    this.editor = null;

    this.hash = this.getAttribute('hash');

    this.render();
  }

  render() {
    // this.shadowObj.innerHTML = this.getTemplate();
    this.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // select the form
    const form = this.querySelector('form');

    // select the section
    const section = this.querySelector('section#content');

    if (form) {
      this.growTextarea(form);
    }

  }

  growTextarea = form => {
    const input = form.querySelector('textarea#editor');
    const actions = form.querySelector('.actions');
    
    if (form && actions) {
      const adjustRows = () => {
        const maxRows = 7;
        const style = window.getComputedStyle(input);
        const lineHeight = parseInt(style.lineHeight, 10);
        
        // Calculate the height offset (padding + border)
        const paddingHeight = parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);
        const borderHeight = parseInt(style.borderTopWidth, 10) + parseInt(style.borderBottomWidth, 10);
        const offset = paddingHeight + borderHeight;
  
        // Reset the rows to 1 to calculate the new height
        input.rows = 1;
  
        // Calculate the number of rows based on scrollHeight minus the offset
        const newRows = Math.ceil((input.scrollHeight - offset) / lineHeight);
        input.rows = Math.min(maxRows, Math.max(newRows, 1)); // Ensure at least 1 row
  
        // Toggle actions visibility based on input
        if (input.value.trim().length > 0) {
          actions.classList.add('active');
        } else {
          actions.classList.remove('active');
        }
      };
  
      input.addEventListener('input', adjustRows);
      input.addEventListener('paste', adjustRows);
      
      // Initial adjustment on page load
      adjustRows();
    }
  };    

  disconnectedCallback() {
    this.enableScroll();
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

  processTextAreaInput = input => {
    return input
      .split('\n') // Split the input by new lines
      .map(line => line.trim()) // Trim each line to remove spaces
      .filter(line => line.length > 0) // Remove empty lines
      .map(line => `<p>${this.escapeHtml(line)}</p>`)  // Surround each line with <p> tags
      .join(''); // Join the array back into a single string
  }

  escapeHtml = html => {
    const text = document.createTextNode(html);
    const div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML; // Return the escaped HTML
  }

  getTemplate() {
    // Show HTML Here
    return /*html*/`
    <section id="content" class="content">
      ${this.getBody()}
    </section>
    ${this.getStyles()}`
  }

  getBody = () => {
    return /* html */`
      <form class="fields" id="topic-form">
        <div class="fields-container">
          ${this.getReplyEditor()}
        </div>
        <div class="actions">
          ${this.getImagesEditor()}
          <div class="action-buttons">
            <button type="submit" class="action submit">
              <span class="text">Post</span>
            </button>
          </div>
        </div>
      </form>
    `;
  }

  getReplyEditor = () => {
    return /* html */`
      <textarea name="editor" id="editor" cols="30" rows="2" placeholder="Type your response here!" required></textarea>
    `;
  }

  getImagesEditor = () => {
    return /* html */`
      <div is="images-editor" class="images-editor" hash="${this.hash}"></div>
    `;
  }

  getButtonLoader() {
    return /*html*/`
      <span id="btn-loader">
				<span class="loader"></span>
			</span>
    `
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

        #content {
          z-index: 1;
          border: var(--border);
          background-color: var(--background);
          padding: 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: start;
          gap: 0;
          width: 100%;
          padding: 5px 10px 10px;
          height: max-content;
          border-radius: 15px;
          position: relative;
          overflow-y: auto;
        }


        #btn-loader {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
        }

        #btn-loader > .loader {
          width: 20px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #18A565 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #21D029 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
        }

        @keyframes l38 {
          100% {
            background-position: 100% 0, 100% 100%, 0 100%, 0 0
          }
        }

        .top {
          display: flex;
          flex-flow: column;
          gap: 5px;
          padding: 0;
          width: 100%;
        }

        .top > .desc {
          margin: 0;
          padding: 10px 0 20px;
          color: var(--text-color);
          font-size: 0.95rem;
          font-family: var(--font-main), sans-serif;
        }

        .top > .desc > span {
          display: inline-block;
          margin: 10px 0 5px;
          color: var(--gray-color);
          font-size: 0.85rem;
          font-style: italic;
          font-family: var(--font-read), sans-serif;
        }

        form.fields {
          margin: 5px 0 0 0;
          position: relative;
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 0;
        }

        form.fields > .fields-container {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 0;
        }

        form.fields > .fields-container > .field {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 5px;
        }

        form.fields label {
          padding: 0 0 1px 5px;
          color: var(--text-color);
        }

        form.fields label {
          color: var(--label-color);
          margin: 20px 0 0 0;
          font-size: 1.1rem;
          font-family: var(--font-read), sans-serif;
          transition: all 0.3s ease-in-out;
          pointer-events: none;
        }

        form.fields .field input {
          border: none;
          background: var(--background);
          font-family: var(--font-read), sans-serif;
          font-size: 1rem;
          width: 100%;
          height: 40px;
          outline: none;
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--text-color);
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
          -ms-border-radius: 12px;
          -o-border-radius: 12px;
        }

        form.fields .field input {
          border: none;
          font-family: var(--font-read), sans-serif;
          background-color: var(--background) !important;
          font-size: 1rem;
          width: 100%;
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
         /* border: var(--input-border-focus);*/
        }

        form.fields textarea {
          font-family: var(--font-main), sans-serif;
          background: var(--background);
          font-size: 1rem;
          padding: 0 0 7px 0;
          margin: 5px 0 0 0;
          width: 100%;
          resize: none;
          height: auto;
          min-height: 30px;
          line-height: 1.5;
          scroll-padding-top: 7px;
          scroll-padding-bottom: 7px;
          gap: 5px;
          font-weight: 400;
          color: var(--text-color);
          scrollbar-width: 3px;
          border-radius: 0;
          border: none;
        }

        form.fields textarea::-webkit-scrollbar {
          width: 3px;
          -webkit-appearance: auto;
        }

        form.fields textarea:focus {
          border: none;
        }

        form.fields .field span.wrapper {
          display: flex;
          align-items: center;
          align-items: center;
          gap: 0;
          width: 100%;
        }

        form.fields .field.success span.wrapper > input,
        form.fields .field.success input {
          color: var(--accent-color);
        }

        form.fields .field.failed span.wrapper > input,
        form.fields .field.failed input {
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

        form.fields .field.failed span.status {
          color: var(--error-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        form.fields .field.success span.status {
          color: var(--accent-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        form.fields .field.success span.status {
          display: none;
        }

        form.fields .actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 20px;
          margin: 0;
          padding: 10px 0 0;
        }

        form.fields .actions > span.hash {
          color: transparent;
          background: var(--action-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--font-mono), monospace;
          font-size: 0.95rem;
          line-height: 1.5;
          font-weight: 500;
        }

        form.fields .actions > .action-buttons {
          display: flex;
          align-items: center;
          justify-content: end;
          gap: 20px;
          margin: 0;
        }

        form.fields .actions .action {
          background: var(--gray-background);
          color: var(--gray-color);
          border: none;
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
          padding: 7px 15px;
          min-width: 60px;
          width: max-content;
          position: relative;
          border-radius: 15px;
          -webkit-border-radius: 15px;
          -moz-border-radius: 15px;
        }

        form.fields .actions .action.cancel-btn {
          background: var(--gray-background);
          color: var(--gray-color);
        }

        form.fields .actions.active .action.submit {
          border: none;
          background: var(--accent-linear);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          color: var(--white-color);
        }

        form.fields .actions > .action.disabled {
          pointer-events: none;
        }

        @media screen and (max-width:600px) {
          div.finish > button.finish,
          form.fields .actions .action {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}