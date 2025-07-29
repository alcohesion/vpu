import AllAccounts from "./all.js";
import HoldingAccount from "./holding.js";
import InvestmentAccount from "./investment.js";
import LoanAccount from "./loan.js";
import RevenueAccount from "./revenue.js";
import TransactionItem from "./transaction.js";

// register all wrappers
export default function wrappers() {
  customElements.define("all-accounts", AllAccounts);
  customElements.define("holding-account", HoldingAccount);
  customElements.define("investment-account", InvestmentAccount);
  customElements.define("loan-account", LoanAccount);
  customElements.define("revenue-account", RevenueAccount);
  customElements.define("transaction-item", TransactionItem, { extends: "div" });
}