import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loansAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { LoanCard } from '../components/LoanCard';
import { 
  Plus, ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, 
  TrendingDown
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const MotionCard = motion(Card);

export default function LoansPage() {
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);
  const [repayDialogOpen, setRepayDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [repayingLoanIds, setRepayingLoanIds] = useState<Set<number>>(new Set());
  
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDescription, setLoanDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  
  const queryClient = useQueryClient();

  const { data: loansData } = useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      const response = await loansAPI.getLoans();
      return response.data;
    },
  });

  const { data: usersData } = useQuery({
    queryKey: ['available-users'],
    queryFn: async () => {
      const response = await loansAPI.getAvailableUsers();
      return response.data;
    },
  });

  const createLoanMutation = useMutation({
    mutationFn: (data: any) => loansAPI.createLoan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      setLoanDialogOpen(false);
      toast.success('Loan disbursed successfully!');
      setSelectedUserId('');
      setLoanAmount('');
      setLoanDescription('');
      setDueDate('');
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
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      setRepayDialogOpen(false);
      toast.success('Repayment successful!');
      setRepayAmount('');
      setRepayingLoanIds(prev => {
        const next = new Set(prev);
        next.delete(loanId);
        return next;
      });
    },
    onError: (_error: any, { loanId }) => {
      toast.error('Failed to process repayment');
      setRepayingLoanIds(prev => {
        const next = new Set(prev);
        next.delete(loanId);
        return next;
      });
    },
  });

  const handleCreateLoan = () => {
    const selectedUser = usersData?.users.find((u: any) => u.id === Number(selectedUserId));
    if (!selectedUser) {
      toast.error('Please select a borrower');
      return;
    }

    createLoanMutation.mutate({
      borrower_username: selectedUser.username,
      amount: Number(loanAmount),
      description: loanDescription,
      due_date: dueDate || undefined,
    });
  };

  const handleSendReminder = (loan: any) => {
    toast.info(`Reminder sent to ${loan.borrower.username}!`, {
      description: 'They have been notified about the outstanding loan.',
    });
  };

  const handleViewDetails = (loan: any) => {
    toast.info('Loan Details', {
      description: `Full loan details for $${loan.amount} loan.`,
    });
  };

  const summary = loansData?.summary || { owed_to_me: 0, i_owe: 0, net_balance: 0 };
  const loansGiven = loansData?.loans_given || [];
  const loansTaken = loansData?.loans_taken || [];

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">P2P Loans</h1>
          <p className="text-gray-600 mt-1">Lend and borrow money with friends</p>
        </div>
        <Dialog open={loanDialogOpen} onOpenChange={setLoanDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600">
              <Plus className="h-4 w-4 mr-2" />
              New Loan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Loan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="borrower">Select Borrower</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user..." />
                  </SelectTrigger>
                  <SelectContent>
                    {usersData?.users.map((user: any) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.username} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="100.00"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date (Optional)</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
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
                onClick={handleCreateLoan}
                disabled={createLoanMutation.isPending || !selectedUserId || !loanAmount || Number(loanAmount) <= 0}
              >
                {createLoanMutation.isPending ? 'Creating...' : 'Create Loan'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4 text-green-600" />
              Owed to Me
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(summary.owed_to_me)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {loansGiven.filter((l: any) => !l.is_fully_repaid).length} active loans
            </p>
          </CardContent>
        </MotionCard>

        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-50"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-red-600" />
              I Owe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(summary.i_owe)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {loansTaken.filter((l: any) => !l.is_fully_repaid).length} active loans
            </p>
          </CardContent>
        </MotionCard>

        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`border-0 shadow-lg ${
            summary.net_balance > 0 
              ? 'bg-gradient-to-br from-blue-50 to-indigo-50' 
              : summary.net_balance < 0
              ? 'bg-gradient-to-br from-orange-50 to-amber-50'
              : 'bg-gradient-to-br from-gray-50 to-slate-50'
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              {summary.net_balance > 0 ? (
                <TrendingUp className="h-4 w-4 text-blue-600" />
              ) : summary.net_balance < 0 ? (
                <TrendingDown className="h-4 w-4 text-orange-600" />
              ) : (
                <DollarSign className="h-4 w-4 text-gray-600" />
              )}
              Net Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${
              summary.net_balance > 0 
                ? 'text-blue-600' 
                : summary.net_balance < 0 
                ? 'text-orange-600' 
                : 'text-gray-600'
            }`}>
              {formatCurrency(Math.abs(summary.net_balance))}
              {summary.net_balance < 0 && <span className="text-sm ml-1">debt</span>}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {summary.net_balance > 0 ? 'Net creditor' : summary.net_balance < 0 ? 'Net debtor' : 'Balanced'}
            </p>
          </CardContent>
        </MotionCard>
      </div>

      <Tabs defaultValue="given" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="given">
            Money Lent ({loansGiven.length})
          </TabsTrigger>
          <TabsTrigger value="taken">
            Money Borrowed ({loansTaken.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="given" className="space-y-4">
          {loansGiven.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {loansGiven.map((loan: any) => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  isLender={true}
                  onSendReminder={handleSendReminder}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No loans given</p>
                <p className="text-gray-500 text-sm mt-2">Click "New Loan" to lend money to a friend</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="taken" className="space-y-4">
          {loansTaken.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {loansTaken.map((loan: any) => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  isLender={false}
                  onRepay={(selectedLoan) => {
                    setSelectedLoan(selectedLoan);
                    setRepayDialogOpen(true);
                  }}
                  onViewDetails={handleViewDetails}
                  isRepaying={repayingLoanIds.has(loan.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No loans borrowed</p>
                <p className="text-gray-500 text-sm mt-2">You haven't borrowed any money yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={repayDialogOpen} onOpenChange={setRepayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Repay Loan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Lender:</span>
                <span className="font-semibold">{selectedLoan?.lender?.username}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Loan Amount:</span>
                <span className="font-semibold">{formatCurrency(selectedLoan?.amount || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Already Repaid:</span>
                <span className="font-semibold">{formatCurrency(selectedLoan?.amount_repaid || 0)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-gray-900 font-medium">Remaining:</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(selectedLoan?.amount_remaining || 0)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="repay-amount">Repayment Amount ($)</Label>
              <Input
                id="repay-amount"
                type="number"
                min="0.01"
                step="0.01"
                max={selectedLoan?.amount_remaining || 0}
                placeholder="50.00"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Maximum: {formatCurrency(selectedLoan?.amount_remaining || 0)}
              </p>
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
              {repayMutation.isPending ? 'Processing...' : 'Confirm Repayment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
