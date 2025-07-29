import StaffContainer from "./staffs.js";
import StaffWrapper from "./wrapper.js";

export default function staff() {
  customElements.define("staff-container", StaffContainer);
  customElements.define("staff-wrapper", StaffWrapper);
}