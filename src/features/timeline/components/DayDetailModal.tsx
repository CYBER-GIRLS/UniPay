import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface DayDetailModalProps {
  date: Date;
  transactions: any[];
  open: boolean;
  onClose: () => void;
}

export default function DayDetailModal({ date, transactions, open, onClose }: DayDetailModalProps) {
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const totalIncome = transactions
    .filter((t: any) => t.type === 'credit' || t.type === 'income' || t.type === 'topup')
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t: any) => t.type === 'debit' || t.type === 'expense' || t.type === 'transfer')
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-violet-600" />
            {formattedDate}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)] p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Card className="border-0 shadow-sm bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowUpCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">Income</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">${totalIncome.toFixed(2)}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowDownCircle className="h-4 w-4 text-red-600" />
                    <span className="text-xs font-medium text-red-700">Expenses</span>
                  </div>
                  <p className="text-lg font-bold text-red-600">${totalExpense.toFixed(2)}</p>
                </CardContent>
              </Card>

              <Card className={`border-0 shadow-sm ${netBalance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className={`h-4 w-4 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                    <span className={`text-xs font-medium ${netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                      Net
                    </span>
                  </div>
                  <p className={`text-lg font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {netBalance >= 0 ? '+' : ''} ${netBalance.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {transactions.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Transactions ({transactions.length})
                </h3>
                {transactions.map((transaction: any, index: number) => {
                  const isIncome = transaction.type === 'credit' || transaction.type === 'income' || transaction.type === 'topup';
                  
                  return (
                    <motion.div
                      key={transaction.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`
                                h-10 w-10 rounded-full flex items-center justify-center
                                ${isIncome ? 'bg-green-100' : 'bg-red-100'}
                              `}>
                                {isIncome ? (
                                  <ArrowUpCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <ArrowDownCircle className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {transaction.description || transaction.type}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(transaction.created_at).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`
                                text-lg font-bold
                                ${isIncome ? 'text-green-600' : 'text-red-600'}
                              `}>
                                {isIncome ? '+' : '-'}${parseFloat(transaction.amount || 0).toFixed(2)}
                              </p>
                              {transaction.category && (
                                <p className="text-xs text-gray-500 capitalize">{transaction.category}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions</h3>
                  <p className="text-gray-600">No financial activity on this day</p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
