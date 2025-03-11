import { render, screen } from "@testing-library/react"
import App from "./App"

test("renders email composer", () => {
  render(<App />)
  const emailElement = screen.getByText(/New message/i)
  expect(emailElement).toBeInTheDocument()
})

