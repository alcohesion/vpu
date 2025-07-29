import ImagesWrapper from "./images.js";
import ResponseWrapper from "./response.js";
import ReplyWrapper from "./reply.js";

// register all wrappers
export default function wrappers() {
  customElements.define("response-wrapper", ResponseWrapper, { extends: "div" });
  customElements.define("images-wrapper", ImagesWrapper, { extends: "div" });
  customElements.define("reply-wrapper", ReplyWrapper, { extends: "div" });
}