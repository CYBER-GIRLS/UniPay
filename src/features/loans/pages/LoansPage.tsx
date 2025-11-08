import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loansAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Users, Plus, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const MotionCard = motion.create(Card);

export default function LoansPage() {
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);
  const [repayDialogOpen, setRepayDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [repayingLoanIds, setRepayingLoanIds] = useState<Set<number>>(new Set());
  
  const [borrowerUsername, setBorrowerUsername] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDescription, setLoanDescription] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  
  const queryClient = useQueryClient();

  const { data: loansData } = useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      const response = await loansAPI.getLoans();
      return response.data;
    },
  });

  const createLoanMutation = useMutation({
    mutationFn: (data: any) => loansAPI.createLoan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      setLoanDialogOpen(false);
      toast.success('Loan created');
      setBorrowerUsername('');
      setLoanAmount('');
      setLoanDescription('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create loan');
    },
  });

  const repayMutation = useMutation({
    mutationFn: ({ loanId, amount }: { loanId: number; amount: number }) => {
      setRepayingLoanIds(prev => new Set(prev).add(loanId));
      return loansAPI.repayLoan(loanId, amount);
    },
    onSuccess: (_data, { loanId }) => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      setRepayDialogOpen(false);
      toast.success('Repayment successful');
      setRepayAmount('');
      setRepayingLoanIds(prev => {
        const next = new Set(prev);
        next.delete(loanId);
        return next;
      });
    },
    onError: (_error, { loanId }) => {
      toast.error('Failed to process repayment');
      setRepayingLoanIds(prev => {
        const next = new Set(prev);
        next.delete(loanId);
        return next;
      });
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
        <Dialog open={loanDialogOpen} onOpenChange={setLoanDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600">
              <Plus className="h-4 w-4 mr-2" />
              New Loan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Loan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="borrower">Borrower Username</Label>
                <Input
                  id="borrower"
                  placeholder="johndoe"
                  value={borrowerUsername}
                  onChange={(e) => setBorrowerUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="100"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Textbook expenses"
                  value={loanDescription}
                  onChange={(e) => setLoanDescription(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600"
                onClick={() => createLoanMutation.mutate({
                  borrower_username: borrowerUsername,
                  amount: Number(loanAmount),
                  description: loanDescription,
                })}
                disabled={createLoanMutation.isPending || !borrowerUsername || !loanAmount || Number(loanAmount) <= 0}
              >
                {createLoanMutation.isPending ? 'Creating...' : 'Create Loan'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                      <div className="mt-3 space-y-2">
                        <div className="text-sm text-gray-600">
                          Remaining: ${(loan.amount - (loan.amount_repaid || 0)).toFixed(2)}
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedLoan(loan);
                            setRepayDialogOpen(true);
                          }}
                          disabled={repayingLoanIds.has(loan.id)}
                        >
                          {repayingLoanIds.has(loan.id) ? 'Processing...' : 'Repay Loan'}
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

      <Dialog open={repayDialogOpen} onOpenChange={setRepayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Repay Loan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-gray-50 rounded-lg space-y-1">
              <p className="text-sm text-gray-600">Loan Amount: ${selectedLoan?.amount}</p>
              <p className="text-sm text-gray-600">Already Repaid: ${selectedLoan?.amount_repaid || 0}</p>
              <p className="text-sm font-semibold text-gray-900">
                Remaining: ${selectedLoan ? (selectedLoan.amount - (selectedLoan.amount_repaid || 0)).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="repay-amount">Repayment Amount ($)</Label>
              <Input
                id="repay-amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="50"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600"
              onClick={() => {
                if (selectedLoan && repayAmount && Number(repayAmount) > 0) {
                  repayMutation.mutate({
                    loanId: selectedLoan.id,
                    amount: Number(repayAmount),
                  });
                }
              }}
              disabled={repayMutation.isPending || !repayAmount || Number(repayAmount) <= 0}
            >
              {repayMutation.isPending ? 'Processing...' : 'Repay'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
