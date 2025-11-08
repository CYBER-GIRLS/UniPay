import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, PiggyBank, Store, Users, User, ArrowLeftRight, Plus, Receipt, Repeat, ShieldCheck, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/topup', icon: Plus, label: 'Top Up' },
  { path: '/transfers', icon: ArrowLeftRight, label: 'Transfers' },
  { path: '/cards', icon: CreditCard, label: 'Cards' },
  { path: '/subscriptions', icon: Repeat, label: 'Subscriptions' },
  { path: '/transactions', icon: Receipt, label: 'Activity' },
  { path: '/savings', icon: PiggyBank, label: 'Savings & Goals' },
  { path: '/darkdays-pocket', icon: ShieldCheck, label: 'DarkDays Pocket' },
  { path: '/isic', icon: Percent, label: 'ISIC Discounts' },
  { path: '/marketplace', icon: Store, label: 'Marketplace' },
  { path: '/loans', icon: Users, label: 'Loans' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <>
      <aside className="hidden md:flex md:flex-col w-64 border-r bg-white">
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Icon className={cn('h-5 w-5', isActive && 'text-violet-600')} />
                  <span>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
        <div className="grid grid-cols-5 gap-1 p-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors',
                    isActive
                      ? 'bg-gradient-to-br from-violet-50 to-indigo-50'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      isActive ? 'text-violet-600' : 'text-gray-600'
                    )}
                  />
                  <span
                    className={cn(
                      'text-[10px] mt-1 font-medium',
                      isActive ? 'text-violet-600' : 'text-gray-600'
                    )}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
