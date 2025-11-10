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
        className="w-full max-w-[clamp(20rem,85vw,42rem)] mx-auto px-2 sm:px-0"
      >
        <div 
          className="relative w-full bg-gradient-to-br from-primary via-purple-500/90 to-secondary rounded-[4%] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.16),0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-300"
          style={{ 
            aspectRatio: '7 / 4',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-white/8 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-300/5 to-indigo-300/10 pointer-events-none" />
          
          <div 
            className="absolute bg-white/8 rounded-full blur-3xl pointer-events-none" 
            style={{ 
              top: '0%', 
              right: '0%', 
              width: '40%', 
              height: '40%' 
            }} 
          />
          <div 
            className="absolute bg-purple-400/10 rounded-full blur-2xl pointer-events-none" 
            style={{ 
              bottom: '0%', 
              left: '0%', 
              width: '35%', 
              height: '35%' 
            }} 
          />
          <div 
            className="absolute bg-indigo-300/8 rounded-full blur-xl pointer-events-none" 
            style={{ 
              top: '33%', 
              right: '25%', 
              width: '25%', 
              height: '25%' 
            }} 
          />
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
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
          
          <svg 
            className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern id="card-grid" width="3.75" height="6" patternUnits="userSpaceOnUse">
                <path d="M 1 0 L 0 0 0 1" fill="none" stroke="white" strokeWidth="0.02" opacity="0.4"/>
              </pattern>
              <linearGradient id="diag-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.1 }} />
                <stop offset="50%" style={{ stopColor: 'white', stopOpacity: 0.05 }} />
                <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0.1 }} />
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#card-grid)" />
            <circle cx="15" cy="25" r="6" fill="white" opacity="0.04" />
            <circle cx="85" cy="75" r="8" fill="white" opacity="0.04" />
            <circle cx="50" cy="50" r="5" fill="white" opacity="0.03" />
            <line x1="0" y1="30" x2="100" y2="35" stroke="white" strokeWidth="0.2" opacity="0.06"/>
            <line x1="0" y1="70" x2="100" y2="65" stroke="white" strokeWidth="0.15" opacity="0.05"/>
            <path d="M 0 60 Q 15 45, 30 60 T 60 60" stroke="white" strokeWidth="0.18" fill="none" opacity="0.06"/>
            <rect x="70" y="10" width="25" height="15" fill="url(#diag-gradient)" rx="1" />
          </svg>
          
          <div 
            className="absolute flex flex-col relative z-10" 
            style={{ 
              inset: '5%',
            }}
          >
            <div 
              className="flex items-start justify-between" 
              style={{ 
                height: '15%',
                marginBottom: '2%'
              }}
            >
              <div 
                className="bg-white/15 backdrop-blur-sm rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center"
                style={{
                  padding: '3%',
                  width: 'auto',
                  aspectRatio: '1'
                }}
                aria-hidden="true"
              >
                <ScanLine className="text-white/80" style={{ width: '1.2em', height: '1.2em', fontSize: 'clamp(0.75rem, 2.5vw, 1.25rem)' }} />
              </div>
              <div 
                className="bg-white/15 backdrop-blur-sm rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center"
                style={{
                  padding: '3%',
                  width: 'auto',
                  aspectRatio: '1'
                }}
                aria-hidden="true"
              >
                <Wallet className="text-white/90" style={{ width: '1.2em', height: '1.2em', fontSize: 'clamp(0.75rem, 2.5vw, 1.25rem)' }} />
              </div>
            </div>
            
            <div 
              className="flex flex-col items-center justify-center text-center flex-1"
              style={{
                paddingTop: '2%',
                paddingBottom: '2%'
              }}
            >
              <p 
                className="text-white/90 font-medium tracking-wide uppercase"
                style={{ 
                  fontSize: 'clamp(0.65rem, 1.8vw, 0.875rem)',
                  marginBottom: '2%'
                }}
              >
                Available Balance
              </p>
              <h2 
                className="text-white font-bold tracking-tight leading-none"
                style={{ 
                  fontSize: 'clamp(1.75rem, 4.5vw, 3rem)',
                  marginBottom: '1%'
                }}
                aria-live="polite"
                aria-label={`Available balance: ${formatCurrency(walletData?.balance || 0, selectedCurrency)}`}
              >
                {formatCurrency(walletData?.balance || 0, selectedCurrency)}
              </h2>
              <p 
                className="text-white/80 font-medium"
                style={{ fontSize: 'clamp(0.65rem, 1.8vw, 0.875rem)' }}
              >
                {getCurrencyName(selectedCurrency)}
              </p>
            </div>
            
            <div 
              className="grid grid-cols-3" 
              style={{ 
                gap: '2%',
                height: '17%',
                marginTop: 'auto'
              }}
            >
              <Link to="/topup" className="w-full h-full">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="h-full w-full"
                >
                  <Button
                    className="w-full h-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 font-semibold"
                    style={{ 
                      fontSize: 'clamp(0.625rem, 1.75vw, 0.875rem)',
                      padding: '0 5%'
                    }}
                  >
                    <Plus className="mr-[0.3em]" style={{ width: '1em', height: '1em' }} />
                    <span className="hidden xs:inline">Top Up</span>
                    <span className="xs:hidden">Top</span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/transfers" className="w-full h-full">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="h-full w-full"
                >
                  <Button
                    className="w-full h-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 font-semibold"
                    style={{ 
                      fontSize: 'clamp(0.625rem, 1.75vw, 0.875rem)',
                      padding: '0 5%'
                    }}
                  >
                    <Send className="mr-[0.3em]" style={{ width: '1em', height: '1em' }} />
                    <span className="hidden xs:inline">Transfer</span>
                    <span className="xs:hidden">Send</span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/budget-cards" className="w-full h-full">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="h-full w-full"
                >
                  <Button
                    className="w-full h-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 font-semibold"
                    style={{ 
                      fontSize: 'clamp(0.625rem, 1.75vw, 0.875rem)',
                      padding: '0 5%'
                    }}
                  >
                    <CreditCard className="mr-[0.3em]" style={{ width: '1em', height: '1em' }} />
                    <span className="hidden xs:inline">Cards</span>
                    <span className="xs:hidden">Card</span>
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
