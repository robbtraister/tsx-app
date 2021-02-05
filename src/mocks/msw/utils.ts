import { rest, RequestHandler } from "msw";

import { resources, Resource } from "../resources";

function createHandler(endpoint: string, resource: Resource) {
  return [
    rest.get(endpoint, async (req, res, ctx) => {
      const query = [...req.url.searchParams.entries()].reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {}
      );
      return res(ctx.json(await resource.list(query)));
    }),

    rest.get(`${endpoint}/:id`, async (req, res, ctx) => {
      return res(ctx.json(await resource.get(req.params.id)));
    }),
  ];
}

export const handlers = ([] as RequestHandler[]).concat(
  ...Object.entries(resources).map(([endpoint, resource]) =>
    createHandler(endpoint, resource)
  )
);
