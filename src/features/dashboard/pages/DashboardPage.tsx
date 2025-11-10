import { useQuery } from '@tanstack/react-query';
import { walletAPI, transactionsAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, Plus, Send, CreditCard, TrendingUp, TrendingDown, Wallet, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useCurrencyStore, formatCurrency, getCurrencyName } from '@/stores/currencyStore';
import { CurrencySelector } from '@/components/CurrencySelector';

const MotionCard = motion.create(Card);

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { selectedCurrency } = useCurrencyStore();
  const shouldReduceMotion = useReducedMotion();

  const { data: walletData } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await walletAPI.getWallet();
      return response.data.wallet;
    },
    enabled: isAuthenticated,
  });

  const { data: statsData } = useQuery({
    queryKey: ['transaction-stats'],
    queryFn: async () => {
      const response = await transactionsAPI.getStats();
      return response.data;
    },
    enabled: isAuthenticated,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4 sm:space-y-6 md:space-y-8 max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Welcome back, {user?.first_name || user?.username}! 👋
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Here's your financial overview</p>
        </div>
        <CurrencySelector compact />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8"
      >
        <div className="relative w-full aspect-[7/4] bg-gradient-to-br from-primary via-purple-500/90 to-secondary rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.2)] transition-shadow duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-white/8" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-300/5 to-indigo-300/10" />
          
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-white/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[35%] h-[35%] bg-purple-400/10 rounded-full blur-2xl" />
          <div className="absolute top-1/3 right-1/4 w-[25%] h-[25%] bg-indigo-300/8 rounded-full blur-xl" />
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={shouldReduceMotion ? {} : {
              x: ['-100%', '200%'],
            }}
            transition={shouldReduceMotion ? {} : {
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
            style={{
              transform: 'skewX(-20deg)',
              ...(shouldReduceMotion ? { left: '50%' } : {}),
            }}
          />
          
          <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="card-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4"/>
              </pattern>
              <linearGradient id="diag-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.1 }} />
                <stop offset="50%" style={{ stopColor: 'white', stopOpacity: 0.05 }} />
                <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0.1 }} />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#card-grid)" />
            <circle cx="15%" cy="25%" r="50" fill="white" opacity="0.04" />
            <circle cx="85%" cy="75%" r="70" fill="white" opacity="0.04" />
            <circle cx="50%" cy="50%" r="40" fill="white" opacity="0.03" />
            <line x1="0" y1="30%" x2="100%" y2="35%" stroke="white" strokeWidth="1.5" opacity="0.06" />
            <line x1="0" y1="70%" x2="100%" y2="65%" stroke="white" strokeWidth="1" opacity="0.05" />
            <path d="M 0 60 Q 30 45, 60 60 T 120 60" stroke="white" strokeWidth="1.2" fill="none" opacity="0.06" />
            <rect x="70%" y="10%" width="25%" height="15%" fill="url(#diag-gradient)" rx="8" />
            <polygon points="10,10 25,20 10,30" fill="white" opacity="0.03" />
          </svg>
          
          <div className="absolute inset-0 p-[clamp(1rem,3vw,1.75rem)] flex flex-col relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div 
                className="p-[clamp(0.5rem,1.2vw,0.75rem)] bg-white/15 backdrop-blur-sm rounded-lg shadow-sm flex-shrink-0"
                aria-hidden="true"
              >
                <ScanLine className="h-[clamp(1rem,2.5vw,1.5rem)] w-[clamp(1rem,2.5vw,1.5rem)] text-white/80" />
              </div>
              <div 
                className="p-[clamp(0.5rem,1.2vw,0.75rem)] bg-white/15 backdrop-blur-sm rounded-full shadow-sm flex-shrink-0"
                aria-hidden="true"
              >
                <Wallet className="h-[clamp(1rem,2.5vw,1.5rem)] w-[clamp(1rem,2.5vw,1.5rem)] text-white/90" />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
              <p className="text-white/90 text-[clamp(0.7rem,1.8vw,0.875rem)] font-medium mb-[clamp(0.5rem,1.5vw,0.75rem)] tracking-wide uppercase">
                Available Balance
              </p>
              <h2 
                className="text-white text-[clamp(2rem,6vw,4rem)] font-bold mb-[clamp(0.25rem,1vw,0.5rem)] tracking-tight leading-none"
                aria-live="polite"
                aria-label={`Available balance: ${formatCurrency(walletData?.balance || 0, selectedCurrency)}`}
              >
                {formatCurrency(walletData?.balance || 0, selectedCurrency)}
              </h2>
              <p className="text-white/80 text-[clamp(0.7rem,1.8vw,0.875rem)] font-medium">
                {getCurrencyName(selectedCurrency)}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-[clamp(0.5rem,1.5vw,0.75rem)] mt-4">
              <Link to="/topup" className="w-full">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    className="w-full h-[clamp(2.75rem,6vw,3.25rem)] bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-[clamp(0.7rem,1.8vw,0.875rem)] font-semibold px-[clamp(0.5rem,1.5vw,1rem)]"
                  >
                    <Plus className="h-[clamp(0.875rem,2.2vw,1.125rem)] w-[clamp(0.875rem,2.2vw,1.125rem)] mr-[clamp(0.25rem,0.8vw,0.5rem)]" />
                    <span>Top Up</span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/transfers" className="w-full">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    className="w-full h-[clamp(2.75rem,6vw,3.25rem)] bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-[clamp(0.7rem,1.8vw,0.875rem)] font-semibold px-[clamp(0.5rem,1.5vw,1rem)]"
                  >
                    <Send className="h-[clamp(0.875rem,2.2vw,1.125rem)] w-[clamp(0.875rem,2.2vw,1.125rem)] mr-[clamp(0.25rem,0.8vw,0.5rem)]" />
                    <span>Transfer</span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/budget-cards" className="w-full">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    className="w-full h-[clamp(2.75rem,6vw,3.25rem)] bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 text-[clamp(0.7rem,1.8vw,0.875rem)] font-semibold px-[clamp(0.5rem,1.5vw,1rem)]"
                  >
                    <CreditCard className="h-[clamp(0.875rem,2.2vw,1.125rem)] w-[clamp(0.875rem,2.2vw,1.125rem)] mr-[clamp(0.25rem,0.8vw,0.5rem)]" />
                    <span>Cards</span>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        <MotionCard
          variants={itemVariants}
          className="border-border/50 shadow-soft hover:shadow-soft-lg transition-all duration-300"
        >
          <CardContent className="p-5 sm:p-6 md:p-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-success-light rounded-xl sm:rounded-2xl shadow-soft">
                <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-success-hover" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-0.5 sm:mb-1">Total Income</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {formatCurrency(statsData?.total_income || 0, selectedCurrency)}
                </p>
              </div>
            </div>
          </CardContent>
        </MotionCard>

        <MotionCard
          variants={itemVariants}
          className="border-border/50 shadow-soft hover:shadow-soft-lg transition-all duration-300"
        >
          <CardContent className="p-5 sm:p-6 md:p-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-danger-light rounded-xl sm:rounded-2xl shadow-soft">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-danger-hover" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-0.5 sm:mb-1">Total Expenses</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {formatCurrency(statsData?.total_expenses || 0, selectedCurrency)}
                </p>
              </div>
            </div>
          </CardContent>
        </MotionCard>
      </div>

      <MotionCard
        variants={itemVariants}
        className="border-border/50 shadow-soft"
      >
        <CardContent className="p-5 sm:p-6 md:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">Recent Transactions</h3>
            <Link to="/transactions">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover hover:bg-primary-light/20 text-xs sm:text-sm">
                View All
              </Button>
            </Link>
          </div>

          {statsData?.recent_transactions?.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {statsData.recent_transactions.slice(0, 5).map((transaction: any) => (
                <motion.div
                  key={transaction.id}
                  whileHover={{ scale: 1.01, backgroundColor: 'hsl(var(--color-surface-2))' }}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                    <div
                      className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl shadow-soft flex-shrink-0 ${
                        transaction.transaction_type === 'topup'
                          ? 'bg-success-light'
                          : transaction.transaction_type === 'transfer' && transaction.receiver_id === walletData?.user_id
                          ? 'bg-success-light'
                          : 'bg-surface-2'
                      }`}
                    >
                      {transaction.transaction_type === 'topup' || 
                       (transaction.transaction_type === 'transfer' && transaction.receiver_id === walletData?.user_id) ? (
                        <ArrowDownLeft className="h-4 w-4 sm:h-5 sm:w-5 text-success-hover" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm sm:text-base truncate">
                        {transaction.description || transaction.transaction_type}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-bold text-base sm:text-lg flex-shrink-0 ml-2 ${
                      transaction.transaction_type === 'topup' ||
                      (transaction.transaction_type === 'transfer' && transaction.receiver_id === walletData?.user_id)
                        ? 'text-success-hover'
                        : 'text-foreground'
                    }`}
                  >
                    {transaction.transaction_type === 'topup' ||
                    (transaction.transaction_type === 'transfer' && transaction.receiver_id === walletData?.user_id)
                      ? '+'
                      : '-'}
                    {formatCurrency(transaction.amount, selectedCurrency)}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-surface-2 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-soft">
                <ArrowUpRight className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium text-sm sm:text-base">No transactions yet</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Start by topping up your wallet</p>
            </div>
          )}
        </CardContent>
      </MotionCard>
    </motion.div>
  );
}
