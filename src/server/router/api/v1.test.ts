import supertest from "supertest";

import { createApp } from "src/server";

describe("api/v1 routes", () => {
  it("/404", () => {
    return supertest(createApp()).get("/api/v1/404").expect(404);
  });

  it("/error", () => {
    return supertest(createApp()).get("/api/v1/error").expect(500);
  });

  it("/pages", () => {
    return supertest(createApp())
      .get("/api/v1/pages")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect([
        { id: "one", name: "One" },
        { id: "two", name: "Two" },
      ]);
  });
});
