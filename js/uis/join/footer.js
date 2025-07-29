export default class LogonFooter extends HTMLElement {
  constructor() {
    super();

    this.render();
  }

  render() {
    this.innerHTML = this.getTemplate();
  }

  getFooter() {
    const newDate = new Date(Date.now());
    return /*html*/`
      <ul class="footer">
				<li>
					<span class="dot"></span>
					<a href="" class="copyright">
						<span class="copy">&copy;</span>
						<span class="year">${newDate.getFullYear()}</span>
						aduki Inc.
					</a>
				</li>
				<li>
					<span class="dot"></span>
					<a href="">About</a>
				</li>
				<li>
					<span class="dot"></span>
					<a href="">Community</a>
				</li>
				<li>
					<span class="dot"></span>
					<a href="">What's new</a>
				</li>
				<li>
					<span class="dot"></span>
					<a href="">Terms</a>
				</li>
			</ul>
    `
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

        /* Logon Footer */
        .footer {
          border-top: var(--story-border);
          margin: 10px 0 0 0;
          width: 100%;
          padding: 10px 0 10px 0;
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 15px;
        }

        .footer > li {
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 5px;
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
          cursor: pointer;
        }

        .footer > li span.dot {
          display: inline-block;
          margin: 2px 0 0 0;
          width: 5px;
          height: 5px;
          background-color: var(--gray-color);
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .footer > li a {
          color: inherit;
          line-height: 1.4;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 400;
        }

        .footer > li:hover {
          color: var(--anchor-color);
          text-decoration: underline;
        }

        .footer > li:hover span.dot {
          background-color: var(--anchor-color);
        }

        .footer > li a.copyright {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          font-family: var(--font-read), sans-serif;
        }

        .footer > li a.copyright .year {
          font-family: var(--font-read), sans-serif;
          font-size: 1em;
          padding: 0 5px 0 2px;
          font-weight: 400;
        }

        @media screen and (max-width:700px) {
          .footer {
            margin: 10px 0 0 0;
            display: flex;
            flex-flow: row;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 0;
          }

          .footer > li {
            display: flex;
            margin: 5px 10px 0 0;
            cursor: default;
          }

           .footer > li a {
            color: inherit;
            line-height: 1.4;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 400;
          }

          .footer > li:first-of-type {
            order: 5;
          }
        }
      </style>
    `;
  }
}