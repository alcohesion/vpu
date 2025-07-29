import VerifyEmail from "./email.js";
import VerifyPhone from "./phone.js";
import VerifySuccess from "./success.js";

export default function registerVerifyForms() {
  customElements.define("verify-phone", VerifyPhone);
  customElements.define("verify-email", VerifyEmail);
  customElements.define("verify-success", VerifySuccess);
}