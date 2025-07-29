import global from "./global/index.js";
import invest from "./invest/index.js";
import wallet from "./wallet/index.js";
import wrappers from "./wrappers/index.js";
import market from "./market/index.js";
// register all sub systems
export default function systems() {
  wrappers();
  global();
  invest();
  wallet();
  market();
}