import { Toaster } from 'react-hot-toast';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ColorExtractor from './components/ColorExtractor';
import ColorTheme from './components/ColorTheme';
import ErrorPage from './components/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: < ColorExtractor />
  },
  {
    path: '/theme-from',
    loader: ({ request }) => {
      const url = new URL(request.url)
      const rgb_color = url.searchParams.get('c').split(',')

      rgb_color.forEach((value, idx) => {
        if (typeof value === 'string' && isNaN(value) === false) {
          value = parseInt(value)
          rgb_color[idx] = value

          if (value < 0 || value > 255) {
            throw new Error('Invalid RGB value');
          }
        } else {
          throw new Error('Invalid RGB value');
        }
      });
      return rgb_color
    },
    element: <ColorTheme />,
    errorElement: <ErrorPage title={'WDYM?'} message={"Did not get the expected color values."} />
  },
  {
    path: '*',
    element: <ErrorPage title={"Err 404"} message={"The requested page was not found."} />
  }
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-center" toastOptions={{ custom: { duration: 2000 } }} />
    </>
  );
}

export default App
