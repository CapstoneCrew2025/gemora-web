import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicRoutes from './router/publicRoutes';
import PrivateRoutes from './router/PrivateRoutes';

function App() {
  // TODO: Add authentication logic here
  // const { isAuthenticated } = useAuth();
  const isAuthenticated = false; // Change to true to test private routes

  return (
    <BrowserRouter>
      {isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
    </BrowserRouter>
  );
}

export default App;

