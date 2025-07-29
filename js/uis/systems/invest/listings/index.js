import ListingDetails from "./details.js";
import ListingWrapper from "./listing.js";

// register all listings
export default function listings() {
  customElements.define("listing-wrapper", ListingWrapper, { extends: "div" });
  customElements.define("listing-details", ListingDetails);
}