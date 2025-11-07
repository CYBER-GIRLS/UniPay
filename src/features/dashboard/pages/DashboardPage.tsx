import { useQuery } from '@tanstack/react-query';
import { walletAPI, transactionsAPI } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { data: walletData } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await walletAPI.getWallet();
      return response.data.wallet;
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ['transaction-stats'],
    queryFn: async () => {
      const response = await transactionsAPI.getStats();
      return response.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to your UniPay wallet</p>
      </div>

      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Available Balance</p>
              <h2 className="text-4xl font-bold mt-2">
                ${walletData?.balance || '0.00'}
              </h2>
              <p className="text-sm mt-1 opacity-75">{walletData?.currency || 'USD'}</p>
            </div>
            <Wallet className="h-12 w-12 opacity-75" />
          </div>
          <div className="flex gap-3 mt-6">
            <Link to="/wallet/topup" className="flex-1">
              <Button variant="secondary" className="w-full">
                Top Up
              </Button>
            </Link>
            <Link to="/wallet/transfer" className="flex-1">
              <Button variant="secondary" className="w-full">
                Transfer
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${statsData?.total_income || '0.00'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${statsData?.total_expenses || '0.00'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Virtual Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <Link to="/cards">
              <Button variant="outline" className="w-full">Manage Cards</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {statsData?.recent_transactions?.length > 0 ? (
            <div className="space-y-3">
              {statsData.recent_transactions.map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{transaction.description || transaction.transaction_type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`font-semibold ${
                    transaction.transaction_type === 'topup' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    ${transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No transactions yet</p>
          )}
          <Link to="/transactions">
            <Button variant="link" className="w-full mt-4">View All Transactions</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
