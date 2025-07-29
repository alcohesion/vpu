import LoginForm from "./login.js";
import registerIdentityForms from "./identity/index.js";
import registerRecoverForms from "./recover/index.js";
import registerRegisterForms from "./register/index.js";
import registerVerifyForms from "./verify/index.js";

export default function forms() {
  registerRegisterForms();
  registerVerifyForms();
  registerRecoverForms();
  registerIdentityForms();
  customElements.define("login-form", LoginForm);
}