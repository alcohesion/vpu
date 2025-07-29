import RecoverForm from "./recover.js";
import RecoverPassword from "./password.js";
import RecoverSuccess from "./success.js";
import RecoverVerify from "./verify.js";

export default function registerRecoverForms() {
  customElements.define("recover-form", RecoverForm);
  customElements.define("recover-verify", RecoverVerify);
  customElements.define("recover-password", RecoverPassword);
  customElements.define("recover-success", RecoverSuccess);
}