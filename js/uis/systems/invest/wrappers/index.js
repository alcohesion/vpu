import InvestmentDetails from "./details.js";
import InvestmentWrapper from "./investment.js";

// register all wrappers
export default function wrappers() {
  customElements.define("investment-wrapper", InvestmentWrapper);
  customElements.define("investment-details", InvestmentDetails);
}