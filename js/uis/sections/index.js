import Sidebar from "./sidebar.js"
import Header from "./header.js";

// export all registered components
export default function sections() {
  customElements.define("sidebar-section", Sidebar);
  customElements.define("header-section", Header);
}