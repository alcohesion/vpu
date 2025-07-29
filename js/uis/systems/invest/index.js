import feed from "./feed/index.js";
import infos from "./info/index.js";
import listings from "./listings/index.js";
import wrappers from "./wrappers/index.js";

// register all investment sub system
export default function invest() {
  wrappers();
  infos();
  listings();
  feed();
}