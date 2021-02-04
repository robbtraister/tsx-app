import { rest } from "msw";

export function createHandler(
  endpoint: string,
  resource: {
    get: (id: string) => Promise<unknown>;
    list: (search: URLSearchParams) => Promise<unknown>;
  }
) {
  return [
    rest.get(endpoint, async (req, res, ctx) => {
      return res(ctx.json(await resource.list(req.url.searchParams)));
    }),
    rest.get(`${endpoint}/:id`, async (req, res, ctx) => {
      return res(ctx.json(await resource.get(req.params.id)));
    }),
  ];
}

export class Resource<Type extends { id: string } = { id: string }> {
  constructor(private load: () => Promise<{ default: Type[] }>) {}

  async get(id: string): Promise<Type | undefined> {
    const { default: data } = await this.load();
    return data.find((datum) => datum.id === id);
  }

  async list(_search: URLSearchParams): Promise<Type[]> {
    const { default: data } = await this.load();
    return data;
  }
}
