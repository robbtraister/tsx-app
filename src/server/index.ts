import express from "express";

import { createRouter } from "./router";

export function createApp(root = process.cwd()) {
  const app = express();

  app.disable("x-powered-by");

  app.use(express.static(`${root}/dist`));
  app.use(express.static(`${root}/public`));

  app.use(createRouter());

  app.use((_req, res) => {
    res.sendFile(`${root}/dist/index.html`);
  });

  return app;
}

export function server(port = Number(process.env.PORT) || 8080) {
  return createApp().listen(port);
}
