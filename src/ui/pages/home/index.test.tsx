import { render } from "@testing-library/react";

import { Home } from ".";

describe("home page", () => {
  it("simple", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
});
