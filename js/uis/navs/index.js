import InvestmentNav from "./invest.js";
import WalletNav from "./wallet.js";
import FormationNav from "./formtion.js";

// export register navs function
export default function navs() {
  customElements.define("wallet-nav", WalletNav);
  customElements.define("investment-nav", InvestmentNav);
  customElements.define("formation-nav", FormationNav);
}