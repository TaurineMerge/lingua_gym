import { Navigate, createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import App from '../App';
import { AuthPage } from '../pages/AuthPage';
import HomePage from '../pages/HomePage';
import { useAuth } from '../hooks/auth/UseAuthForm';
import PasswordResetPage from '../components/auth/PasswordResetForm';
import AdvancedSearchView from '../pages/AdvancedSearchPage';
import TextReader from '../pages/TextReader';
import TextLoader from '../pages/TextLoader';
import Library from '../pages/Library';
import Progress from '../pages/Progress';
import SetPage from '../pages/SetPage';
import SetExercisePage from '../pages/SetExercisePage';

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
          { index: true, element: <HomePage /> },
          { path: 'materials', element: <AdvancedSearchView /> },
          { path: 'text/:filename/', element: <TextReader /> },
          { path: 'text-loader', element: <TextLoader /> },
          { path: 'library', element: <Library /> },
          { path: 'progress', element: <Progress /> },
          { path: 'set/:setId', element: <SetPage /> },
          { path: 'set/:setId/exercise/', element: <SetExercisePage /> },
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