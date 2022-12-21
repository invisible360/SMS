import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import StdInfoProvider from './context/StdInfoProvider';
import { router } from './Routes/Router';

function App() {
  return (
    <div className="max-w-screen-xl mx-auto font-myFont">
      <StdInfoProvider>
        <RouterProvider router={router}></RouterProvider>
      </StdInfoProvider>
      <Toaster />
    </div>
  );
}

export default App;
