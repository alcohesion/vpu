import ReportWrapper from "./report.js";

// export function to register all subs
export default function subs() {
  customElements.define("report-wrapper", ReportWrapper);
}