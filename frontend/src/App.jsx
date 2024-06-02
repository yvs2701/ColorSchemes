import { Toaster } from 'react-hot-toast';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ColorExtractor from './components/ColorExtractor';
import ColorTheme from './components/ColorTheme';
import ErrorPage from './components/ErrorPage';

const routesConfig = [
  {
    path: '/',
    element: <ColorExtractor />
  },
  {
    path: '/theme-from',
    loader: async ({ request }) => {
      try {
        const url = new URL(request.url)
        const hex_colors = url.searchParams.get('c').split(',')

        if (hex_colors === null || hex_colors.length !== 2) {
          throw new Error('Malformed color data');
        }

        for (let i = 0; i < hex_colors.length; i++) {
          hex_colors[i] = '#' + hex_colors[i] // dont change this as everywhere later on frontend code expects 'hex_colors' with pound sign
          const value = hex_colors[i]
          if (typeof value === 'string' && value.trim() !== "") {
            if (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value) === false) { // check if hex code is valid color value (without the pound sign)
              throw new Error('Invalid HEX value');
            }
          } else {
            throw new Error('Malformed color data');
          }
        }

        const api_res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/generate_colors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ hex_colors })
        });
        const data = await api_res.json()

        if (api_res.status !== 200) {
          throw new Error(api_res.status);
        }

        return { hex_colors, theme: data.hex_colors }
      } catch (err) {
        console.error(err.message)
        throw err
      }
    },
    element: <ColorTheme />,
    errorElement: <ErrorPage />
  },
  {
    path: '*',
    element: <ErrorPage title={"Err 404"} message={"The requested page was not found."} />
  }
]

const router = createBrowserRouter(routesConfig)

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-center" toastOptions={{ custom: { duration: 2000 } }} />
    </>
  );
}

export default App
export { routesConfig }
