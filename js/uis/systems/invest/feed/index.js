import InvestmentFeed from "./investments.js";
import ListingFeed from "./listings.js";

// register all feed
export default function feed() {
  customElements.define("listing-feed", ListingFeed);
  customElements.define("investment-feed", InvestmentFeed);
}