import { useQuery } from '@tanstack/react-query';
import { walletAPI, transactionsAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, Plus, Send, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

const MotionCard = motion(Card);

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();

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
      className="space-y-6 max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.first_name || user?.username}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Here's your financial overview</p>
      </motion.div>

      <MotionCard
        variants={itemVariants}
        className="overflow-hidden border-0 shadow-lg"
      >
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
            
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium">Available Balance</p>
              <h2 className="text-5xl font-bold mt-2 mb-1">
                ${walletData?.balance?.toLocaleString() || '0.00'}
              </h2>
              <p className="text-white/70 text-sm">{walletData?.currency || 'USD'}</p>
              
              <div className="grid grid-cols-3 gap-4 mt-8">
                <Link to="/wallet/topup" className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="secondary"
                      className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Top Up
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/wallet/transfer" className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="secondary"
                      className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Transfer
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/cards" className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="secondary"
                      className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Cards
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </MotionCard>

      <div className="grid md:grid-cols-2 gap-6">
        <MotionCard
          variants={itemVariants}
          className="border-0 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Income</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${statsData?.total_income?.toLocaleString() || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </MotionCard>

        <MotionCard
          variants={itemVariants}
          className="border-0 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${statsData?.total_expenses?.toLocaleString() || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </MotionCard>
      </div>

      <MotionCard
        variants={itemVariants}
        className="border-0 shadow-sm"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <Link to="/transactions">
              <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700">
                View All
              </Button>
            </Link>
          </div>

          {statsData?.recent_transactions?.length > 0 ? (
            <div className="space-y-4">
              {statsData.recent_transactions.slice(0, 5).map((transaction: any) => (
                <motion.div
                  key={transaction.id}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  className="flex items-center justify-between p-3 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.transaction_type === 'topup'
                          ? 'bg-green-100'
                          : transaction.transaction_type === 'transfer' && transaction.receiver_id === walletData?.user_id
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      {transaction.transaction_type === 'topup' || 
                       (transaction.transaction_type === 'transfer' && transaction.receiver_id === walletData?.user_id) ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description || transaction.transaction_type}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${
                      transaction.transaction_type === 'topup' ||
                      (transaction.transaction_type === 'transfer' && transaction.receiver_id === walletData?.user_id)
                        ? 'text-green-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {transaction.transaction_type === 'topup' ||
                    (transaction.transaction_type === 'transfer' && transaction.receiver_id === walletData?.user_id)
                      ? '+'
                      : '-'}
                    ${transaction.amount.toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <ArrowUpRight className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">Start by topping up your wallet</p>
            </div>
          )}
        </CardContent>
      </MotionCard>
    </motion.div>
  );
}
