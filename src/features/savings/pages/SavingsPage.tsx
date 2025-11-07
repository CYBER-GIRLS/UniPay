import { useQuery } from '@tanstack/react-query';
import { savingsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { PiggyBank, Target, Plus, TrendingUp } from 'lucide-react';

const MotionCard = motion(Card);

export default function SavingsPage() {
  const { data: pocketsData } = useQuery({
    queryKey: ['savings-pockets'],
    queryFn: async () => {
      const response = await savingsAPI.getPockets();
      return response.data.pockets;
    },
  });

  const { data: goalsData } = useQuery({
    queryKey: ['savings-goals'],
    queryFn: async () => {
      const response = await savingsAPI.getGoals();
      return response.data.goals;
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
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900">Savings</h1>
        <p className="text-gray-600 mt-1">Manage your savings pockets and goals</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">DarkDays Pockets</h2>
            <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600">
              <Plus className="h-4 w-4 mr-1" />
              New Pocket
            </Button>
          </div>

          {pocketsData && pocketsData.length > 0 ? (
            <div className="space-y-3">
              {pocketsData.map((pocket: any) => (
                <Card key={pocket.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <PiggyBank className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{pocket.name}</p>
                          <p className="text-sm text-gray-600">Auto-save: {pocket.auto_save_percentage}%</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-violet-600">${pocket.balance}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <PiggyBank className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No savings pockets yet</p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Piggy Goals</h2>
            <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600">
              <Plus className="h-4 w-4 mr-1" />
              New Goal
            </Button>
          </div>

          {goalsData && goalsData.length > 0 ? (
            <div className="space-y-3">
              {goalsData.map((goal: any) => (
                <Card key={goal.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Target className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{goal.title}</p>
                        <p className="text-sm text-gray-600">${goal.current_amount} of ${goal.target_amount}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 text-right">
                        {((goal.current_amount / goal.target_amount) * 100).toFixed(0)}% complete
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No goals yet</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
