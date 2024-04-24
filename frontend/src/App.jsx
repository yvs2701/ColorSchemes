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
      const url = new URL(request.url)
      const rgb_color = url.searchParams.get('c').split(',')

      if (rgb_color === null || rgb_color.length !== 3) {
        throw new Response('Invalid RGB value', { status: 400 });
      }
      rgb_color.forEach((value, idx) => {
        if (typeof value === 'string' && isNaN(value) === false) {
          value = parseInt(value)
          rgb_color[idx] = value

          if (value < 0 || value > 255) {
            throw new Response('Invalid RGB value', { status: 400 });
          }
        } else {
          throw new Response('Invalid RGB value', { status: 400 });
        }
      });

      try {
        const api_res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/generate_colors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ rgb_color })
        });
        const data = await api_res.json()

        if (api_res.status !== 200) {
          throw new Error(api_res.status);
        }

        return { rgb_color, theme_data: data }
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
