import { render, waitFor } from "@testing-library/react";
import { StaticRouter } from "react-router";

import { server } from "fakes/msw/server";

import { Sidebar } from ".";

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
