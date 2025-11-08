import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpRight, ArrowDownLeft, Send, Users } from 'lucide-react';
import { walletAPI, transactionsAPI } from '@/lib/api';
import { toast } from 'sonner';

const MotionCard = motion.create(Card);

export default function TransfersPage() {
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [recipientUsername, setRecipientUsername] = useState('');
  const [amount, setAmount] = useState('');
  const queryClient = useQueryClient();

  const { data: walletData } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await walletAPI.getWallet();
      return response.data;
    },
  });

  const { data: transactionsData } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await transactionsAPI.getTransactions();
      return response.data;
    },
  });

  const transferMutation = useMutation({
    mutationFn: ({ recipient, amount }: { recipient: string; amount: number }) =>
      walletAPI.transfer(recipient, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setSendDialogOpen(false);
      toast.success('Transfer successful!');
      setRecipientUsername('');
      setAmount('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Transfer failed');
    },
  });

  const handleSendMoney = () => {
    if (!recipientUsername || !amount || Number(amount) <= 0) {
      toast.error('Please enter valid recipient and amount');
      return;
    }
    transferMutation.mutate({
      recipient: recipientUsername,
      amount: Number(amount),
    });
  };

  const recentTransfers = transactionsData?.transactions?.filter(
    (tx: any) => tx.type === 'transfer_sent' || tx.type === 'transfer_received'
  ).slice(0, 10) || [];

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
      className="p-6 max-w-7xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Transfers
        </h1>
        <p className="text-gray-600 mt-2">Send and receive money instantly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MotionCard variants={itemVariants} className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950 dark:to-indigo-950">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl">
                <ArrowUpRight className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Send Money</CardTitle>
                <CardDescription>Transfer funds to any user</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">
              Available Balance: <span className="font-bold text-violet-600">${walletData?.balance?.toFixed(2) || '0.00'}</span>
            </p>
            <Button
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600"
              onClick={() => setSendDialogOpen(true)}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Money
            </Button>
          </CardContent>
        </MotionCard>

        <MotionCard variants={itemVariants} className="hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
                <ArrowDownLeft className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Receive Money</CardTitle>
                <CardDescription>Your username for transfers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Share your username:</p>
              <p className="text-xl font-bold text-violet-600">@{walletData?.username || 'loading...'}</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Others can send you money using this username
            </p>
          </CardContent>
        </MotionCard>
      </div>

      <MotionCard variants={itemVariants}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-violet-600" />
            <CardTitle>Recent Transfers</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {recentTransfers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No transfers yet</p>
              <p className="text-sm">Start sending money to your friends!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransfers.map((transfer: any) => (
                <div
                  key={transfer.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transfer.type === 'transfer_sent' 
                        ? 'bg-red-100 dark:bg-red-900' 
                        : 'bg-green-100 dark:bg-green-900'
                    }`}>
                      {transfer.type === 'transfer_sent' ? (
                        <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {transfer.type === 'transfer_sent' ? 'Sent to' : 'Received from'}{' '}
                        <span className="text-violet-600">@{transfer.description?.split(' ')[2] || 'user'}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transfer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className={`font-bold ${
                    transfer.type === 'transfer_sent' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transfer.type === 'transfer_sent' ? '-' : '+'}${transfer.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </MotionCard>

      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Money</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Username</Label>
              <Input
                id="recipient"
                placeholder="@username"
                value={recipientUsername}
                onChange={(e) => setRecipientUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transfer-amount">Amount ($)</Label>
              <Input
                id="transfer-amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="50.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600"
              onClick={handleSendMoney}
              disabled={transferMutation.isPending || !recipientUsername || !amount || Number(amount) <= 0}
            >
              {transferMutation.isPending ? 'Sending...' : 'Send Money'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
