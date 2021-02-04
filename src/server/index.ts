import express from "express";

import { createRouter } from "./router";

export function createApp(root = process.cwd()) {
  const app = express();

  app.disable("x-powered-by");

  app.use(express.static(`${root}/dist`, { index: false }));
  app.use(express.static(`${root}/public`, { index: false }));

  app.use(createRouter(root));

  app.use((_req, res) => {
    res.sendFile(`${root}/dist/index.html`);
  });

  app.use((_err: any, _req: any, res: any, _next: any) => {
    res.sendStatus(500);
  });

  return app;
}

export function server(port = Number(process.env.PORT) || 8080) {
  /* istanbul ignore next */
  return createApp().listen(port);
}
