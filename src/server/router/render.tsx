import fs from "fs";
import path from "path";

import express from "express";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router";

import { App } from "ui/app";

export function createRenderRouter() {
  const router = express.Router();

  router.use((req, res) => {
    const context: { url?: string } = {};
    const content = renderToStaticMarkup(
      <StaticRouter location={req.originalUrl} context={context}>
        <App />
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      fs.readFile(
        path.join(req.app.get("distDir"), "index.html"),
        (err, data) => {
          if (err) {
            res.sendStatus(500);
          } else {
            res.send(
              data
                .toString()
                .replace(
                  '<div id="app"></div>',
                  `<div id="app">${content}</div>`
                )
            );
          }
        }
      );
    }
  });

  return router;
}
