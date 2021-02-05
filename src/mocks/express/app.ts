import express from "express";

import { resources, Resource } from "../resources";

export function createRouter(resource: Resource) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    res.send(await resource.list(req.query));
  });

  router.get("/:id", async (req, res) => {
    res.send(await resource.get(req.params.id));
  });

  return router;
}

export const app = express();

Object.entries(resources).map(([endpoint, resource]) => {
  app.use(endpoint, createRouter(resource));
});
