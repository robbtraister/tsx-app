import { ParsedQs } from "qs";

export class Resource<Type extends { id: string } = { id: string }> {
  constructor(private load: () => Promise<{ default: Type[] }>) {}

  async get(id: string): Promise<Type | undefined> {
    const { default: data } = await this.load();
    return data.find((datum) => datum.id === id);
  }

  async list(_query?: ParsedQs): Promise<Type[]> {
    const { default: data } = await this.load();
    return data;
  }
}

export const resources = {
  "/api/v1/pages": new Resource(() => import("./data/api/v1/pages.json")),
};
