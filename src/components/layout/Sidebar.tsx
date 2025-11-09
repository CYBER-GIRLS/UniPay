import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, PiggyBank, Store, Users, User, ArrowLeftRight, Plus, Receipt, ShieldCheck, Percent, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebarStore';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/topup', icon: Plus, label: 'Top Up' },
  { path: '/transfers', icon: ArrowLeftRight, label: 'Transfers' },
  { path: '/budget-cards', icon: CreditCard, label: 'Budget Cards' },
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
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '5rem' }
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex md:flex-col border-r bg-white relative"
      >
        <div className="flex items-center justify-end p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 rounded-full hover:bg-violet-50 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-violet-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-violet-600" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-4 overflow-hidden">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              const navItemContent = (
                <Link key={item.path} to={item.path} className="block">
                  <motion.div
                    whileHover={{ x: isCollapsed ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                      isCollapsed ? 'justify-center' : '',
                      isActive
                        ? 'bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-violet-600')} />
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              );

              return isCollapsed ? (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    {navItemContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ) : navItemContent;
            })}
          </TooltipProvider>
        </nav>
      </motion.aside>

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
