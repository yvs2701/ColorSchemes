import { Toaster } from 'react-hot-toast';
import ColorExtractor from './components/ColorExtractor';

function App() {
  return (
    <>
      <ColorExtractor />
      <Toaster position="bottom-center" toastOptions={{ custom: { duration: 2000 } }} />
    </>
  );
}

export default App
