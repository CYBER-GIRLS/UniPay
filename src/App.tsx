import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from './components/ui/toaster';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import SettingsPage from './features/settings/pages/SettingsPage';

import './App.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/wallet" element={<div>Wallet Page - Coming Soon</div>} />
            <Route path="/cards" element={<div>Cards Page - Coming Soon</div>} />
            <Route path="/transactions" element={<div>Transactions Page - Coming Soon</div>} />
            <Route path="/savings" element={<div>Savings Page - Coming Soon</div>} />
            <Route path="/marketplace" element={<div>Marketplace Page - Coming Soon</div>} />
            <Route path="/loans" element={<div>Loans Page - Coming Soon</div>} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
