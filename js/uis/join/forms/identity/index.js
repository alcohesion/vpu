import IdentityBack from "./back.js";
import IdentityFront from "./front.js";
import IdentityPicture from "./picture.js";
import IdentityStatus from "./status.js";
import identityKind from "./kind.js";

export default function registerIdentityForms() {
  customElements.define("identity-picture", IdentityPicture);
  customElements.define("identity-kind", identityKind);
  customElements.define("identity-front", IdentityFront);
  customElements.define("identity-back", IdentityBack);
  customElements.define("identity-status", IdentityStatus);
}