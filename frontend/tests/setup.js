import { afterAll, afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import '@testing-library/jest-dom/vitest'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
console.log('Backend URL: ' + BACKEND_URL);

const extractedColors = {
  "hex_colors": ["#223e51", "#ccd6ed", "#737a88", "#a6c5dd", "#eae1ee"],
  "rgb_colors": [[34, 62, 81], [204, 214, 237], [115, 122, 136], [166, 197, 221], [234, 225, 238]],
}

const generatedColors = {
  "hex_colors": [
    ["primary_color", "#ccd6ed"], ["secondary_color", "#c2b084"], ["primary_tint", "#ffffff"],
    ["secondary_tint", "#ffffff"], ["primary_shadow", "#322ead"], ["secondary_shadow", "#717330"]
  ],
  "rgb_colors": [
    ["primary_color", [204, 214, 237]], ["secondary_color", [194, 176, 132]], ["primary_tint", [255, 255, 255]],
    ["secondary_tint", [255, 255, 255]], ["primary_shadow", [50, 46, 173]], ["secondary_shadow", [113, 115, 48]]
  ]
}

export const restHandlers = [
  http.post(`${BACKEND_URL}/api/extract_colors`, () => {
    return HttpResponse.json(extractedColors)
  }),
  http.post(`${BACKEND_URL}/api/generate_colors`, () => {
    return HttpResponse.json(generatedColors)
  }),
]

const server = setupServer(...restHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterAll(() => server.close())

// unmount component after each test
afterEach(() => cleanup())