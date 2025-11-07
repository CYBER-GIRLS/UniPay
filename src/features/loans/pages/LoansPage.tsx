import { useQuery } from '@tanstack/react-query';
import { loansAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Users, Plus, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

const MotionCard = motion(Card);

export default function LoansPage() {
  const { data: loansData } = useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      const response = await loansAPI.getLoans();
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
          <h1 className="text-2xl font-bold text-gray-900">P2P Loans</h1>
          <p className="text-gray-600 mt-1">Manage loans with friends and track debts</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600">
          <Plus className="h-4 w-4 mr-2" />
          New Loan
        </Button>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowDownRight className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Money Lent</h2>
          </div>

          {loansData && loansData.loans_given && loansData.loans_given.length > 0 ? (
            <div className="space-y-3">
              {loansData.loans_given.map((loan: any) => (
                <Card key={loan.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {loan.borrower?.username || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600">{loan.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${loan.amount}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          loan.status === 'repaid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {loan.status}
                        </span>
                      </div>
                    </div>
                    {loan.status !== 'repaid' && (
                      <div className="mt-2 text-sm text-gray-600">
                        Repaid: ${loan.amount_repaid || 0} / ${loan.amount}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No loans given</p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <ArrowUpRight className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Money Borrowed</h2>
          </div>

          {loansData && loansData.loans_taken && loansData.loans_taken.length > 0 ? (
            <div className="space-y-3">
              {loansData.loans_taken.map((loan: any) => (
                <Card key={loan.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {loan.lender?.username || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600">{loan.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${loan.amount}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          loan.status === 'repaid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {loan.status}
                        </span>
                      </div>
                    </div>
                    {loan.status !== 'repaid' && (
                      <div className="mt-3">
                        <Button size="sm" className="w-full">
                          Repay Loan
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No loans taken</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
