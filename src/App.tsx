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
import CardsPage from './features/cards/pages/CardsPage';
import SavingsPage from './features/savings/pages/SavingsPage';
import MarketplacePage from './features/marketplace/pages/MarketplacePage';
import LoansPage from './features/loans/pages/LoansPage';
import TransactionsPage from './features/transactions/pages/TransactionsPage';
import TransfersPage from './features/transfers/pages/TransfersPage';
import TopupPage from './features/topup/pages/TopupPage';
import NotificationsPage from './features/notifications/pages/NotificationsPage';
import SubscriptionsPage from './features/subscriptions/pages/SubscriptionsPage';

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
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/transfers" element={<TransfersPage />} />
            <Route path="/topup" element={<TopupPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
