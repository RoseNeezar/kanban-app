import { createBrowserHistory, History } from "history";

let Navigate: History | undefined;

if (typeof document !== "undefined") {
  Navigate = createBrowserHistory();
}

export default Navigate;
