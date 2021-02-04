import { createHandler, Resource } from "./utils";

export const handlers = [
  ...createHandler(
    "/api/v1/pages",
    new Resource(() => import("../data/api/v1/pages.json"))
  ),
];
