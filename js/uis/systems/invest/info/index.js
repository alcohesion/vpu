import InvestmentInfo from "./general.js";
import InvestmentReports from "./reports.js";
import subs from "./subs/index.js";

// register investment infos
export default function infos() {
  // register all subs
  subs();
  customElements.define("investment-info", InvestmentInfo);
  customElements.define("investment-reports", InvestmentReports);
}