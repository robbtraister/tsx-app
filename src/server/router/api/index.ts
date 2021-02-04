import express from "express";

import { createApiV1Router } from "./v1";

export function createApiRouter() {
  const router = express.Router();

  router.use("/v1", createApiV1Router());

  router.use((_req, res) => {
    res.sendStatus(404);
  });

  return router;
}
