import {
  rest,
  RequestHandler,
  MockedRequest,
  ResponseComposition,
  RestContext,
} from "msw";

import { resources, Resource } from "../resources";

function createHandler(endpoint: string, resource: Resource) {
  const update = async (
    req: MockedRequest,
    res: ResponseComposition,
    ctx: RestContext
  ) => {
    try {
      const model = await resource.update(JSON.stringify(req.body) as any);
      return res(ctx.json(model));
    } catch {
      return res(ctx.status(400));
    }
  };

  return [
    // list
    rest.get(endpoint, async (req, res, ctx) => {
      const query = [...req.url.searchParams.entries()].reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {}
      );
      return res(ctx.json(await resource.list(query)));
    }),

    // create
    rest.post(endpoint, async (req, res, ctx) => {
      try {
        const model = await resource.create(JSON.stringify(req.body) as any);
        return res(ctx.json(model));
      } catch {
        return res(ctx.status(400));
      }
    }),

    // get
    rest.get(`${endpoint}/:id`, async (req, res, ctx) => {
      return res(ctx.json(await resource.get(req.params.id)));
    }),

    // delete
    rest.delete(`${endpoint}/:id`, async (req, res, ctx) => {
      try {
        await resource.delete(req.params.id);
        return res(ctx.status(204));
      } catch {
        return res(ctx.status(400));
      }
    }),

    // patch
    rest.patch(`${endpoint}/:id`, async (req, res, ctx) => {
      try {
        const model = await resource.patch(
          req.params.id,
          JSON.stringify(req.body) as any
        );
        return res(ctx.json(model));
      } catch {
        return res(ctx.status(400));
      }
    }),

    // update
    rest.post(`${endpoint}/:id`, update),
    rest.put(`${endpoint}/:id`, update),
  ];
}

export const handlers = ([] as RequestHandler[]).concat(
  ...Object.entries(resources).map(([endpoint, resource]) =>
    createHandler(endpoint, resource)
  )
);
