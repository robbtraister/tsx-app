import express from "express";

export function createRouter() {
  const router = express.Router();

  router.use("/api/v1/error", () => {
    throw new Error("error");
  });

  router.use("/api/v1/pages", (_req, res) => {
    res.send({ pages: ["one", "two"] });
  });

  return router;
}
