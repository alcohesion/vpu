export default class ResponseWrapper extends HTMLDivElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.utils = window.app.utils;
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log("Connected");
  }

  capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  formatDateTime = str => {
    const date = new Date(str);
    // FORMAT DATE TO: Oct 22 8:45 AM IF the year is the same as the current year else
    // FORMAT DATE TO: Oct 22 2021 8:45 AM mins to be two digits
    return `${date.toLocaleString("default", { month: "short" })} ${date.getDate()} ${date.getFullYear() === new Date().getFullYear() ? "" : date.getFullYear()} ${date.toLocaleString("default", { hour: "numeric", minute: "2-digit" })}`;
  }

  formatNumber = numStr => {
    try {
      const num = parseInt(numStr);

      // less than a thousand: return the number
      if (num < 1000) return num;

      // less than a 10,000: return the number with a k with two decimal places
      if (num < 10000) return `${(num / 1000).toFixed(2)}k`;

      // less than a 100,000: return the number with a k with one decimal place
      if (num < 100000) return `${(num / 1000).toFixed(1)}k`;

      // less than a million: return the number with a k with no decimal places
      if (num < 1000000) return `${Math.floor(num / 1000)}k`;

      // less than a 10 million: return the number with an m with two decimal places
      if (num < 10000000) return `${(num / 1000000).toFixed(2)}M`;

      // less than a 100 million: return the number with an m with one decimal place
      if (num < 100000000) return `${(num / 1000000).toFixed(1)}M`;

      // less than a billion: return the number with an m with no decimal places
      if (num < 1000000000) return `${Math.floor(num / 1000000)}M`;

      // a billion or more: return the number with a B+
      if (num >= 1000000000) return `${Math.floor(num / 1000000000)}B+`;

      // else return the zero
      return '0';
    } catch (error) {
      return '0';
    }
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
      <div class="content">
        <!-- Content Goes Here -->
        <div class="wrapper">
          ${this.getAvatar()}
          <div class="details">
            ${this.getHead()}
            ${this.getDesc()}
            ${this.getImages(this.getAttribute("images"))}
            ${this.getActions()}
          </div>
        </div>
        <!-- Content Ends Here -->
        <!-- Reply(ies) Goes Here -->
        <div class="replies">
          ${this.getReplyAction(this.utils.number.parseInteger(this.getAttribute("replies")))}
        </div>
      </div>
    `;
  }

  getReplyAction = total => {
    if (total < 1) {
      return /* html */`
        <span class="view-replies">
          <span class="text">No replies yet!</span>
          <span class="icon">
            <svg id="Arrow - Right 2" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Iconly/Light-Outline/Arrow---Right-2" stroke="none" stroke-width="1.5" fill="none" fill-rule="evenodd">
                <g id="Arrow---Right-2" transform="translate(12.000000, 12.000000) rotate(-90.000000) translate(-12.000000, -12.000000) translate(4.000000, 7.500000)" fill="currentColor" fill-rule="nonzero">
                  <path d="M0.469669914,0.469669914 C0.735936477,0.203403352 1.15260016,0.1791973 1.44621165,0.397051761 L1.53033009,0.469669914 L8,6.939 L14.4696699,0.469669914 C14.7359365,0.203403352 15.1526002,0.1791973 15.4462117,0.397051761 L15.5303301,0.469669914 C15.7965966,0.735936477 15.8208027,1.15260016 15.6029482,1.44621165 L15.5303301,1.53033009 L8.53033009,8.53033009 C8.26406352,8.79659665 7.84739984,8.8208027 7.55378835,8.60294824 L7.46966991,8.53033009 L0.469669914,1.53033009 C0.176776695,1.23743687 0.176776695,0.762563133 0.469669914,0.469669914 Z" id="Stroke-1"></path>
                </g>
              </g>
            </svg>
          </span>
        </span>
      `;
    } else { 
      return /* html */`
        <span class="view-replies">
          <span class="text">
          View ${this.utils.number.intWithCommas(total)} ${total > 1 ? "replies" : "reply"} and response stats</span>
          <span class="icon">
            <svg id="Arrow - Right 2" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Iconly/Light-Outline/Arrow---Right-2" stroke="none" stroke-width="1.5" fill="none" fill-rule="evenodd">
                <g id="Arrow---Right-2" transform="translate(12.000000, 12.000000) rotate(-90.000000) translate(-12.000000, -12.000000) translate(4.000000, 7.500000)" fill="currentColor" fill-rule="nonzero">
                  <path d="M0.469669914,0.469669914 C0.735936477,0.203403352 1.15260016,0.1791973 1.44621165,0.397051761 L1.53033009,0.469669914 L8,6.939 L14.4696699,0.469669914 C14.7359365,0.203403352 15.1526002,0.1791973 15.4462117,0.397051761 L15.5303301,0.469669914 C15.7965966,0.735936477 15.8208027,1.15260016 15.6029482,1.44621165 L15.5303301,1.53033009 L8.53033009,8.53033009 C8.26406352,8.79659665 7.84739984,8.8208027 7.55378835,8.60294824 L7.46966991,8.53033009 L0.469669914,1.53033009 C0.176776695,1.23743687 0.176776695,0.762563133 0.469669914,0.469669914 Z" id="Stroke-1"></path>
                </g>
              </g>
            </svg>
          </span>
        </span>
      `;
    }
  }

  getAvatar = () => {
    return /* html */`
      <div class="avatar">
        <img class="image" src="${this.getAttribute("user-image")}" alt="User Avatar" />
      </div>
    `;
  }

  getHead = () => {
    return /* html */`
      <div class="head">
      <h2 class="user">${this.getAttribute("user-name")}</h2>
      <span class="sp">•</span>
      <span class="time">${this.formatDateTime(this.getAttribute("datetime"))}</span>
      </div>
    `;
  }

  getDesc = () => {
    return /* html */`
      <div class="desc">
        ${this.innerHTML}
      </div>
    `;
  }

  getImages = images => {
    // if no images return empty string
    if (!images || images === "" || images === "null") return "";

    // if images are present,
    return /* html */`
      <div is="images-wrapper" images="${images}"></div>
    `;
  }

  getActions = () => {
    return /* html */`
      <div class="actions">
        <button class="action">
          <span class="icon">
            ${this.getReplyIcon()}
          </span>
          <span class="no">${this.formatNumber(this.getAttribute("replies"))}</span>
        </button>
        <button class="action">
          <span class="icon">
            ${this.getLikeIcon()}
          </span>
          <span class="no">${this.formatNumber(this.getAttribute("likes"))}</span>
        </button>
        <button class="action view">
          <span class="icon">
            ${this.getViewIcon()}
          </span>
          <span class="no">${this.formatNumber(this.getAttribute("views"))}</span>
        </button>
        <button class="action">
          <span class="icon">
            ${this.getBookmarkIcon()}
          </span>
        </button>
        <button class="action">
          <span class="icon">
            ${this.getReportIcon()}
          </span>
        </button>
      </div>
    `;
  }

  getLikeIcon = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
        <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    `;
  }

  getBookmarkIcon = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
      <path d="M11 2C7.22876 2 5.34315 2 4.17157 3.12874C3 4.25748 3 6.07416 3 9.70753V17.9808C3 20.2867 3 21.4396 3.77285 21.8523C5.26947 22.6514 8.0768 19.9852 9.41 19.1824C10.1832 18.7168 10.5698 18.484 11 18.484C11.4302 18.484 11.8168 18.7168 12.59 19.1824C13.9232 19.9852 16.7305 22.6514 18.2272 21.8523C19 21.4396 19 20.2867 19 17.9808V13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M17 10L17 2M13 6H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    `;
  }

  getReplyIcon = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
      <path d="M21.9165 10.5001C21.9351 10.6557 21.9495 10.8127 21.9598 10.9708C22.0134 11.801 22.0134 12.6608 21.9598 13.491C21.6856 17.7333 18.3536 21.1126 14.1706 21.3906C12.7435 21.4855 11.2536 21.4853 9.82937 21.3906C9.33893 21.358 8.80437 21.241 8.34398 21.0514C7.83174 20.8404 7.57557 20.7349 7.44541 20.7509C7.31524 20.7669 7.12637 20.9062 6.74865 21.1847C6.08265 21.6758 5.24364 22.0286 3.9994 21.9983C3.37023 21.983 3.05565 21.9753 2.91481 21.7352C2.77398 21.4951 2.94938 21.1627 3.30018 20.4979C3.78671 19.5759 4.09498 18.5204 3.62788 17.6747C2.8234 16.4667 2.14007 15.0361 2.04021 13.491C1.98656 12.6608 1.98656 11.801 2.04021 10.9708C2.31438 6.7285 5.64636 3.34925 9.82937 3.07119C11.0318 2.99126 12.2812 2.97868 13.5 3.0338" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8.49997 15.0001H15.5M8.49997 10.0001H11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M20.8683 2.43946L21.5607 3.13183C22.1465 3.71761 22.1465 4.66736 21.5607 5.25315L17.9333 8.94881C17.6479 9.23416 17.2829 9.42652 16.8863 9.50061L14.6381 9.98865C14.2832 10.0657 13.9671 9.75054 14.0431 9.39537L14.5216 7.16005C14.5957 6.76336 14.7881 6.39836 15.0734 6.11301L18.747 2.43946C19.3328 1.85368 20.2825 1.85368 20.8683 2.43946Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  getViewIcon = () => {
    return /* html */`
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4.48" width="1.7" height="11.52" fill="currentColor"/>
    <rect x="7" y="0.32" width="1.7" height="15.68" fill="currentColor"/>
    <rect x="12" y="7.68" width="1.7" height="8.32" fill="currentColor"/>
    </svg>
    `;
  }

  getReportIcon = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
      <path d="M5.32171 9.6829C7.73539 5.41196 8.94222 3.27648 10.5983 2.72678C11.5093 2.42437 12.4907 2.42437 13.4017 2.72678C15.0578 3.27648 16.2646 5.41196 18.6783 9.6829C21.092 13.9538 22.2988 16.0893 21.9368 17.8293C21.7376 18.7866 21.2469 19.6548 20.535 20.3097C19.241 21.5 16.8274 21.5 12 21.5C7.17265 21.5 4.75897 21.5 3.46496 20.3097C2.75308 19.6548 2.26239 18.7866 2.06322 17.8293C1.70119 16.0893 2.90803 13.9538 5.32171 9.6829Z" stroke="currentColor" stroke-width="1.8" />
      <path d="M11.992 16H12.001" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12 13L12 8.99997" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  getReplies = () => {
    return /* html */`
      <div is="response-wrapper" user-name="Fredrick Adenuga" datetime="2024-09-12T12:25:00Z"
      user-image="https://randomuser.me/api/portraits/men/1.jpg"
      replies="3" views="120" likes="53">
      <p>This is a placeholder response. I have been following this investment for a while and I believe it has great potential.</p>
      <p> The team behind it is very experienced and the market conditions are favorable. Looking forward to seeing how it performs.</p>
      </div>
      <div is="response-wrapper" user-name="Grace Johnson" datetime="2024-09-20T10:15:00Z"
      user-image="https://randomuser.me/api/portraits/men/6.jpg"
      replies="5" views="200" likes="70">
      <p>Great investment, I'm in for 100 shares. The projected ROI looks promising and the risk factors have been well mitigated. </p>
      <p> I have done my due diligence, and I am confident in the growth prospects of this venture. Excited to be a part of this!</p>
      </div>
      <div is="response-wrapper" user-name="Jane Doe" datetime="2024-10-12T14:30:00Z"
      user-image="https://randomuser.me/api/portraits/women/1.jpg"
      replies="2" views="150" likes="60">
      <p>I have been watching this investment closely, and I am impressed with the consistent growth. The team is doing a fantastic job.</p>
      </div>
      <div is="response-wrapper" user-name="John Smith" datetime="2024-11-15T09:45:00Z"
      user-image="https://randomuser.me/api/portraits/men/2.jpg"
      images="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      views="709" likes="120" replies="63978">
      <p>Invested 50 shares. The market analysis looks promising and I believe this will yield good returns in the long run.</p>
      </div>
      <div is="response-wrapper" user-name="Alice Johnson" datetime="2024-12-01T16:20:00Z"
      user-image="https://randomuser.me/api/portraits/women/2.jpg"
      replies="31" views="183" likes="88">
      <p>Excited about this investment. The ROI projections are very attractive and the risk seems manageable.</p>
      </div>
      <div is="response-wrapper" user-name="Bob Brown" datetime="2024-12-05T11:10:00Z"
      user-image="https://randomuser.me/api/portraits/men/3.jpg"
      replies="4" views="253" likes="91">
      <p>Great opportunity! I have invested 200 shares. Looking forward to seeing the growth in the coming months.</p>
      </div>
      <div is="response-wrapper" user-name="Catherine Green" datetime="2024-12-10T08:50:00Z"
      user-image="https://randomuser.me/api/portraits/women/3.jpg"
      replies="2" views="137" likes="65">
      <p>This investment has a lot of potential. The team is experienced and the market conditions are favorable. I'm in!</p>
      </div>
      <div is="response-wrapper" user-name="David White" datetime="2024-12-15T13:35:00Z"
      user-image="https://randomuser.me/api/portraits/men/4.jpg"
      replies="3" views="190" likes="75">
      <p>Invested 150 shares. The projected ROI is very promising and the risk factors have been well mitigated.</p>
      </div>
      <div is="response-wrapper" user-name="Emily Black" datetime="2024-12-20T10:25:00Z"
      user-image="https://randomuser.me/api/portraits/women/4.jpg"
      replies="4" views="220" likes="85">
      <p>I've done my research and this investment looks solid. The team behind it is very capable and the market conditions are right.</p>
      </div>
      <div is="response-wrapper" user-name="Frank Wilson" datetime="2024-12-25T15:40:00Z"
      user-image="https://randomuser.me/api/portraits/men/5.jpg"
      replies="11" views="241" likes="93">
      <p>Invested 300 shares. The growth potential is huge and the team is doing a great job. Excited to be a part of this!</p>
      </div>
      <div is="response-wrapper" user-name="Grace Lee" datetime="2024-12-30T12:15:00Z"
      user-image="https://randomuser.me/api/portraits/women/5.jpg"
      replies="21" views="169" likes="78">
      <p>This investment is very promising. The ROI projections are attractive and the risk is manageable. Looking forward to the returns.</p>
      </div>
      <div is="response-wrapper" user-name="Henry Kim" datetime="2025-01-05T14:55:00Z"
      user-image="https://randomuser.me/api/portraits/men/6.jpg"
      replies="15" views="107" likes="89">
      <p>Invested 100 shares. The market analysis looks good and the team is experienced. Confident in the growth prospects of this venture.</p>
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
          padding: 12px 0 10px;
          margin: 0;
          display: flex;
          height: max-content;
          gap: 0;
          width: 100%;
          border-bottom: var(--action-border);
        }

        .content {
          display: flex;
          flex-flow: column;
          width: 100%;
          min-width: 100%;
          height: 100%;
          transition: 0.3s;
        }

        .content > .wrapper {
          position: relative;
          display: flex;
          flex-flow: row;
          gap: 15px;
          align-items: start;
          width: 100%;
          min-width: 100%;
          height: 100%;
          padding: 0;
        }

        .content .arrow {
          display: inline-block;
          position: absolute;
          top: 42px;
          left: 20px;
          height: calc(100% - 42px);
          width: 2px;
          background: var(--gray-background);
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: start;
          justify-content: start;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .details {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
          width: calc(100% - 60px);
          min-width: calc(100% - 60px);
        }

        .details .head {
          display: flex;
          gap: 5px;
          align-items: center;
          justify-content: start;
        }

        .details .head .user {
          margin: 0;
          padding: 0;
          font-size: 1.1rem;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
        }

        .details .head > .sp {
          font-size: 1rem;
          margin: 0 0 1px 0;
          color: var(--gray-color);
        }

        .details .head .time {
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }

        .details .desc {
          padding: 5px 0 0;
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          line-height: 1.35;
        }

        .details .desc * {
          margin: 0;
          padding: 0;
          line-height: 1.4;
          font-size: 1rem;
          line-height: inherit;
          color: var(--text-color);
        }

        .details .desc p {
          margin: 0 0 5px 0;
          padding: 0;
        }

        .details .desc a {
          color: var(--anchor-color);
          cursor: pointer;
        }

        .details .desc a:hover {
          text-decoration: underline;
        }

        .details .desc img {
          max-width: 100%;
          height: auto;
          margin: 10px 0;
        }

        .details .desc ul {
          list-style-type: disc;
          padding-left: 20px;
        }

        .details .desc ol {
          list-style-type: decimal;
          padding-left: 20px;
        }

        .details .desc ul li,
        .details .desc ol li {
          margin: 5px 0;
        }

        .details .desc blockquote {
          border-left: 3px solid var(--gray-border);
          padding-left: 10px;
          margin: 10px 0;
        }

        .details .desc code {
          background: var(--gray-background);
          color: var(--code-color);
          padding: 2px 5px;
          border-radius: 5px;
        }

        .details .desc pre {
          background: var(--gray-background);
          color: var(--code-color);
          padding: 10px;
          border-radius: 5px;
          overflow: auto;
        }

        .details .desc pre code {
          background: transparent;
          color: var(--code-color);
          padding: 0;
          border-radius: 0;
        }

        .actions {
          display: flex;
          gap: 1px;
          align-items: center;
          justify-content: start;
          margin: 3px 0 0 -5px;
        }

        .actions > button.action {
          border: none;
          display: flex;
          gap: 5px;
          align-items: center;
          justify-content: start;
          padding: 5px 10px;
          border-radius: 50px;
          background: transparent;
          cursor: pointer;
          color: var(--gray-color);
          font-size: 1rem;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          transition: 0.3s;
        }

        .actions > button.action:hover {
          background: var(--gray-background);
        }

        .actions > button.action .icon {
          display: flex;
          align-items: center;
          color: inherit;
          justify-content: start;
          gap: 5px;
        }

        .actions > button.action.view {
          display: flex;
          align-items: center;
        }

        .actions > button.action .icon svg {
          width: 20px;
          height: 20px;
        }

        .actions > button.action.view .icon svg {
          width: 16px;
          height: 16px;
          color: var(--gray-color);
        }

        .actions > button.action .no {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 5px;
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
        }

        .actions > button.action.view .no {
          display: inline-block;
          padding: 3px 0 0;
        }

        .replies {
          display: flex;
          align-items: center;
          justify-content: start;
          padding: 7px 0 0 0;
          width: 100%;
        }

        .replies .view-replies {
          width: 100%;
          border-top: var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 5px;
          padding: 9px 2px 0 0;
          font-size: .9rem;
          font-family: var(--font-main), sans-serif;
          color: var(--gray-color);
          cursor: pointer;
        }

        .replies .view-replies > .no {
          font-size: .9rem;
          font-family: var(--font-main), sans-serif;
          color: var(--gray-color);
        }

        .replies .view-replies >.text {
          font-size: .9rem;
          font-weight: 500;
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
        }

        .replies .view-replies .icon {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 5px;
        }

        .replies .view-replies .icon svg {
          width: 20px;
          height: 20px;
          color: var(--gray-color);
        }

				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a,
          .actions > button.action,
          .actions > button.action:hover {
						cursor: default !important;
          }
				}
	    </style>
    `;
  }
}