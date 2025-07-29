import forms from "./forms/index.js";
import staff from "./staff/index.js";

export default function global() {
  staff();
  forms();
}