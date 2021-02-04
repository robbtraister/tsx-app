import express from "express";

export function createApiV1Router() {
  const router = express.Router();

  router.use("/error", (_req, _res, next) => {
    next(new Error("error"));
  });

  router.use("/pages", (_req, res) => {
    res.send({ pages: ["one", "two"] });
  });

  return router;
}
