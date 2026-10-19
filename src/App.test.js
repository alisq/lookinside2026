import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => [],
    })
  );
});

test("renders the exhibition title", async () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /look inside/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/october 24, 2026/i)).toBeInTheDocument();
  expect(await screen.findByText(/no projects in this group/i)).toBeInTheDocument();
});
