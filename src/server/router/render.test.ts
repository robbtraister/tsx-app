import supertest from "supertest";

import { createApp } from "src/server";

describe("render routes", () => {
  it("/", () => {
    return supertest(createApp())
      .get("/")
      .expect(200)
      .expect("Content-Type", /text/);
  });

  it("/abc redirect", () => {
    return supertest(createApp())
      .get("/abc")
      .expect(302)
      .expect("Location", "/");
  });

  it("no index.html", () => {
    return supertest(createApp("non-existent-directory")).get("/").expect(500);
  });
});
