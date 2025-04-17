import App from '../App';
import { AuthPage } from '../pages/AuthPage';
import NewMaterialsPage from '../pages/NewMaterialsPage';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/' },
      { path: '/materials', element: <NewMaterialsPage  /> },
      { path: '/auth', element: <AuthPage /> },
    ],
  },
]);

export default router;