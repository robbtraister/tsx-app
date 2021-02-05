import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { App } from "./app";

import "./index.scss";

if (process.env.NODE_ENV === "development") {
  const { worker } = require("mocks/msw/worker");
  worker.start();
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("app")
);
