import AppJoin from "./join.js";
import ChatApp from "./chat.js";

// export all registered components
export default function apps() {
  customElements.define("app-join", AppJoin);
  customElements.define("chat-app", ChatApp);
}