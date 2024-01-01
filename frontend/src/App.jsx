import { Toaster } from 'react-hot-toast';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom";
import ColorExtractor from './components/ColorExtractor';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<ColorExtractor />}></Route>
  )
)

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-center" toastOptions={{ custom: { duration: 2000 } }} />
    </>
  );
}

export default App
