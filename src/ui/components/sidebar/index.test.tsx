import { render, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";

import { StaticRouter } from "react-router";

import { Sidebar } from ".";

const server = setupServer(
  rest.get("/api/v1/pages", (_req, res, ctx) => {
    return res(ctx.json({ pages: ["one", "two"] }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("sidebar component", () => {
  it("mocked", async () => {
    const { container } = render(
      <StaticRouter location="/">
        <Sidebar />
      </StaticRouter>
    );

    expect(container).toMatchSnapshot();

    await waitFor(() =>
      expect(container.querySelectorAll("li")).toHaveLength(2)
    );

    expect(container).toMatchSnapshot();
  });
});
