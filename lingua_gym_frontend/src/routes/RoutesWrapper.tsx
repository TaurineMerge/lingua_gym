import { Navigate, createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import App from '../App';
import { AuthPage } from '../pages/AuthPage';
import NewMaterialsPage from '../pages/NewMaterialsPage';
import { useAuth } from '../hooks/auth/UseAuthForm';
import PasswordResetPage from '../components/auth/PasswordResetForm';

export function ProtectedRoute() {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading || isAuthenticated === null) return <div>Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}

export function PublicRoute() {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading || isAuthenticated === null) return <div>Loading...</div>;
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <App />,
        children: [
          { index: true, element: <div>Home Page</div> },
          { path: 'materials', element: <NewMaterialsPage /> },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <PublicRoute />,
    children: [
      { index: true, element: <AuthPage /> },
      { path: 'password-reset', element: <PasswordResetPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const RoutesWrapper = () => <RouterProvider router={router} />;