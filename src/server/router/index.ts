import express from "express";

import { createApiRouter } from "./api";
import { createRenderRouter } from "./render";

export function createRouter() {
  const router = express.Router();

  router.use("/api", createApiRouter());

  router.use(createRenderRouter());

  return router;
}
