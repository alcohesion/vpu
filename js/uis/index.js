import apps from "./apps/index.js";
import join from "./join/index.js";
import navs from "./navs/index.js"
import systems from "./systems/index.js"
import sections from "./sections/index.js";
import chats from "./chats/index.js";
import shots from "./shots/index.js";

// export all registered components
export default function uis(text) {
  apps()
  join()
  navs()
  systems()
  sections();
  chats();
  shots();

  //ToDo: Remove in production
  console.log(text);
}