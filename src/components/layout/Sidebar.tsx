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
        className="hidden md:flex md:flex-col border-r border-border/50 bg-surface-1/80 backdrop-blur-sm relative shadow-soft"
      >
        <div className="flex items-center justify-end p-4 border-b border-border/50">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-9 w-9 rounded-xl hover:bg-primary-light/30 transition-all duration-200"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-primary" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-primary" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-1.5 p-4 overflow-hidden">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              const navItemContent = (
                <Link key={item.path} to={item.path} className="block">
                  <motion.div
                    whileHover={{ x: isCollapsed ? 0 : 4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200',
                      isCollapsed ? 'justify-center' : '',
                      isActive
                        ? 'bg-gradient-to-r from-primary-light/40 to-secondary-light/40 text-primary shadow-soft backdrop-blur-sm font-semibold'
                        : 'text-muted-foreground hover:bg-surface-2/60 hover:text-foreground'
                    )}
                  >
                    <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
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
                  <TooltipContent side="right" className="font-medium bg-surface-1 border-border/50 shadow-soft">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ) : navItemContent;
            })}
          </TooltipProvider>
        </nav>
      </motion.aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-1/95 backdrop-blur-md border-t border-border/50 shadow-soft-lg safe-area-bottom">
        <div className="grid grid-cols-5 gap-0.5 xs:gap-1 p-2 xs:p-2.5 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link key={item.path} to={item.path} className="tap-target">
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className={cn(
                    'flex flex-col items-center justify-center py-2 xs:py-2.5 px-1 rounded-lg xs:rounded-xl transition-all duration-200 min-h-[60px] xs:min-h-[64px]',
                    isActive
                      ? 'bg-gradient-to-br from-primary-light/50 to-secondary-light/50 shadow-soft'
                      : 'hover:bg-surface-2/60'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 xs:h-5.5 xs:w-5.5',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <span
                    className={cn(
                      'text-[9px] xs:text-[10px] mt-0.5 xs:mt-1 font-medium truncate max-w-[60px] xs:max-w-full',
                      isActive ? 'text-primary' : 'text-muted-foreground'
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
