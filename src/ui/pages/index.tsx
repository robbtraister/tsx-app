import clsx from "clsx";
import { Switch, Route, Redirect } from "react-router-dom";

import { Home } from "./home";

import layout from "ui/styles/layout.scss";

export function Pages() {
  return (
    <div data-testid="page" className={clsx(layout.column, layout.fill)}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
}
