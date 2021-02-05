import path from "path";

import express from "express";

import { createRouter } from "./router";

export function createApp(root = process.cwd()) {
  const app = express();

  app.disable("x-powered-by");

  const distDir = path.join(root, "dist");
  app.set("distDir", path.join(root, "dist"));

  app.use(express.static(distDir, { index: false }));
  app.use(express.static(path.join(root, "public"), { index: false }));

  app.use(createRouter());

  app.use((_req, res) => {
    /* istanbul ignore next */
    res.sendFile(path.join(distDir, "index.html"));
  });

  app.use((_err: any, _req: any, res: any, _next: any) => {
    res.sendStatus(500);
  });

  return app;
}

/* istanbul ignore next */
export function server(port = Number(process.env.PORT) || 8080) {
  /* istanbul ignore next */
  return createApp().listen(port);
}
