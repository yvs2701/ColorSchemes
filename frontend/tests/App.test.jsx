import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { test, expect } from "vitest"
import { routesConfig } from "../src/App.jsx"
import { RouterProvider, createMemoryRouter } from "react-router-dom"

let COLOR_CODE, route;

test('Render ColorExtractor component', async () => {
  const router = createMemoryRouter(routesConfig, {
    initialEntries: ["/"],
  })
  render(<RouterProvider router={createMemoryRouter(routesConfig)} />)
  const user = userEvent.setup()

  expect(screen.getByRole('heading', { name: /upload an image/i })).toBeInTheDocument()

  const element = screen.getAllByRole('link', { name: /get theme/i })[1]
  const btns = element.parentElement.querySelectorAll('button')

  for (let i = 0; i < btns.length; i++) {
    const color = btns[i].innerHTML
    if (color !== undefined && color.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/)) { // regex matches color hex code
      COLOR_CODE = color
      break
    }
  }
  console.log('This color must become primary color in the generated theme: ' + COLOR_CODE);

  await user.click(element)
  await screen.findByRole('heading', { name: /pick a color/i }, { timeout: 2000 }) // wait for maximum 2 seconds for the page to load
  // if above line throws no error then test passes as we navigate to the next component

  route = element.getAttribute('href')
  console.log('Navigated to: ' + route)
})

test('Render ColorTheme component', async () => {
  render(<RouterProvider router={createMemoryRouter(routesConfig, { initialEntries: [route] })} />)
  await screen.findByRole('heading', { name: /pick a color/i }) // by default wait for maximum 1 second for the page to load

  ///NOTE - this page has now been loaded
  const btns = screen.getAllByRole('button', { name: /^#(?:[0-9a-fA-F]{3}){1,2}$/ })
  console.log('Primary color of the generated theme: ' + btns[0].innerHTML);
  expect(btns[0].innerHTML === COLOR_CODE).toBe(true)
})

/* test('Snapshot Homepage', () => {
  const router = createMemoryRouter(routesConfig, {
    initialEntries: ["/"],
  })

  const page = render(<RouterProvider router={router} />)

  expect(page).toMatchSnapshot()
}) */