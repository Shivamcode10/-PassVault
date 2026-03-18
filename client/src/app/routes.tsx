import { createBrowserRouter } from 'react-router';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Dashboard } from './pages/Dashboard';
import { AllPasswords } from './pages/AllPasswords';
import { AddPasswordPage } from './pages/AddPasswordPage';
import { PasswordDetailPage } from './pages/PasswordDetailPage';
import { GeneratorPage } from './pages/GeneratorPage';
import { SettingsPage } from './pages/SettingsPage';
import { EditPasswordPage } from "./pages/EditPasswordPage";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/passwords',
        element: <AllPasswords />,
      },
      {
        path: '/passwords/:id',
        element: <PasswordDetailPage />,
      },
      {
        path: '/passwords/:id/edit', // ✅ FIXED
        element: <EditPasswordPage />,
      },
      {
        path: '/add-password',
        element: <AddPasswordPage />,
      },
      {
        path: '/generator',
        element: <GeneratorPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
]);