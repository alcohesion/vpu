import RegisterBio from "./bio.js";
import RegisterForm from "./register.js";
import RegisterPassword from "./password.js";
import RegisterSuccess from "./success.js";

export default function registerRegisterForms() {
  customElements.define("register-form", RegisterForm);
  customElements.define("register-bio", RegisterBio);
  customElements.define("register-password", RegisterPassword);
  customElements.define("register-success", RegisterSuccess);
}