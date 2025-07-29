import ImagesEditor from "./images.js";
import ResponseEditor from "./respond.js";

// register the forms
export default  function forms() {
  customElements.define("images-editor", ImagesEditor, { extends: "div" });
  customElements.define("response-editor", ResponseEditor, { extends: "div" });
}