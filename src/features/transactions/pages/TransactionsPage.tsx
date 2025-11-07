import { useQuery } from '@tanstack/react-query';
import { transactionsAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Receipt, Download, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const MotionCard = motion(Card);

export default function TransactionsPage() {
  const { data: statsData } = useQuery({
    queryKey: ['transaction-stats'],
    queryFn: async () => {
      const response = await transactionsAPI.getStats();
      return response.data;
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">View and filter your transaction history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        <MotionCard variants={itemVariants} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  ${statsData?.total_income?.toLocaleString() || '0.00'}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowDownLeft className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </MotionCard>

        <MotionCard variants={itemVariants} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  ${statsData?.total_expenses?.toLocaleString() || '0.00'}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <ArrowUpRight className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </MotionCard>

        <MotionCard variants={itemVariants} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData?.recent_transactions?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-violet-100 rounded-lg">
                <Receipt className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </MotionCard>
      </div>

      <MotionCard variants={itemVariants} className="border-0 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Transactions</h3>

          {statsData && statsData.recent_transactions && statsData.recent_transactions.length > 0 ? (
            <div className="space-y-2">
              {statsData.recent_transactions.map((transaction: any) => (
                <motion.div
                  key={transaction.id}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  className="flex items-center justify-between p-4 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.transaction_type === 'topup'
                          ? 'bg-green-100'
                          : transaction.transaction_type === 'transfer' && transaction.receiver_id
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      {transaction.transaction_type === 'topup' ||
                      (transaction.transaction_type === 'transfer' && transaction.receiver_id) ? (
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
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.transaction_type === 'topup' ||
                        (transaction.transaction_type === 'transfer' && transaction.receiver_id)
                          ? 'text-green-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {transaction.transaction_type === 'topup' ||
                      (transaction.transaction_type === 'transfer' && transaction.receiver_id)
                        ? '+'
                        : '-'}
                      ${transaction.amount.toLocaleString()}
                    </p>
                    <span className="text-xs text-gray-500">{transaction.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Receipt className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No transactions yet</p>
            </div>
          )}
        </CardContent>
      </MotionCard>
    </motion.div>
  );
}
