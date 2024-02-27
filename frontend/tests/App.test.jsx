import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { test, expect } from "vitest"
import { routesConfig } from "../src/App.jsx"
import { RouterProvider, createMemoryRouter } from "react-router-dom"

test('Render ColorExtractor component', async () => {
    const router = createMemoryRouter(routesConfig, {
        initialEntries: ["/"],
    });
    render(<RouterProvider router={createMemoryRouter(routesConfig)} />)
    const user = userEvent.setup()

    expect(screen.getByRole('heading', { name: /upload an image/i })).toBeInTheDocument()

    await user.click(screen.getAllByRole('link', { name: /get theme/i })[1])
})

// FIXME: Not able to route to /theme-from?c=
test('Render ColorTheme component', async () => {
    render(<RouterProvider router={createMemoryRouter(routesConfig, { initialEntries: ["/theme-from?c=204,214,237"] })} />)
    const user = userEvent.setup()

    expect(screen.getByRole('heading', { name: /pick a color/i })).toBeInTheDocument()

    await user.click(screen.getAllByRole('link', { name: /get theme/i })[1])
})
