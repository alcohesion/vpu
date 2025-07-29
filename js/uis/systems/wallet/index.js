import feeds from "./feed/index.js";
import wrappers from "./wrappers/index.js";
import forms from "./forms/index.js";

// register wallet systems
export default function wallet() {
  wrappers();
  feeds();
  forms();
}