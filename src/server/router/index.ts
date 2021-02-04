import express from "express";

import { createApiRouter } from "./api";
import { createRenderRouter } from "./render";

/* istanbul ignore next */
export function createRouter(root = process.cwd()) {
  const router = express.Router();

  router.use("/api", createApiRouter());

  router.use(createRenderRouter(root));

  return router;
}
