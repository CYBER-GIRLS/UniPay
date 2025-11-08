import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import GoalCard from '../components/GoalCard';
import CreateGoalModal from '../components/CreateGoalModal';
import TransferToGoalModal from '../components/TransferToGoalModal';
import ConfettiCelebration from '../components/ConfettiCelebration';
import GoalCompletionModal from '../components/GoalCompletionModal';

export default function PiggyGoalsPage() {
  const [goals, setGoals] = useState<any[]>([
    {
      id: 1,
      name: 'New Laptop',
      target_amount: 1200,
      current_amount: 850,
      icon: '💻',
      deadline: '2025-12-25',
      status: 'active',
    },
    {
      id: 2,
      name: 'Spring Break Trip',
      target_amount: 800,
      current_amount: 200,
      icon: '✈️',
      deadline: '2025-03-15',
      status: 'active',
    },
  ]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [completedGoal, setCompletedGoal] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState(500);

  const handleCreateGoal = (goalData: any) => {
    const activeGoals = goals.filter(g => g.status === 'active');
    if (activeGoals.length >= 10) {
      toast.error('You can only have 10 active goals at a time');
      return;
    }

    const newGoal = {
      ...goalData,
      id: goals.length + 1,
      current_amount: 0,
      status: 'active',
      created_at: new Date().toISOString(),
    };
    setGoals([...goals, newGoal]);
    toast.success(`Goal "${goalData.name}" created! Start saving now! 🎯`);
  };

  const handleAddMoney = (goal: any) => {
    setSelectedGoal(goal);
    setTransferModalOpen(true);
  };

  const handleTransfer = (goalId: number, amount: number) => {
    if (amount > walletBalance) {
      toast.error('Insufficient wallet balance');
      return;
    }

    setWalletBalance(prev => prev - amount);
    
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const newAmount = goal.current_amount + amount;
          const updated = { ...goal, current_amount: newAmount };

          if (newAmount >= goal.target_amount && goal.current_amount < goal.target_amount) {
            setTimeout(() => {
              setCelebrationActive(true);
              setCompletedGoal(updated);
              setCompletionModalOpen(true);
              setTimeout(() => setCelebrationActive(false), 4000);
            }, 500);
          }

          return updated;
        }
        return goal;
      })
    );
    toast.success(`Added $${amount.toFixed(2)} to ${selectedGoal?.name}! 🎉`);
  };

  const handleDelete = (goal: any) => {
    setGoals(goals.filter((g) => g.id !== goal.id));
    toast.success(`Goal "${goal.name}" deleted`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PiggyBank className="h-7 w-7 text-violet-600" />
            Piggy Goals
          </h1>
          <p className="text-gray-600 mt-1">Save for what matters most</p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Goal
        </Button>
      </motion.div>

      {goals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-violet-100 rounded-full mb-6">
                <PiggyBank className="h-12 w-12 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Start Your First Savings Goal
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Whether it's a new laptop, vacation, or emergency fund, Piggy Goals helps you save
                with visual progress tracking and fun celebrations!
              </p>
              <Button
                onClick={() => setCreateModalOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GoalCard
                goal={goal}
                onAddMoney={handleAddMoney}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <CreateGoalModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateGoal}
        activeGoalsCount={goals.filter(g => g.status === 'active').length}
      />

      <TransferToGoalModal
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        goal={selectedGoal}
        walletBalance={walletBalance}
        onTransfer={handleTransfer}
      />

      <ConfettiCelebration isActive={celebrationActive} />

      <GoalCompletionModal
        open={completionModalOpen}
        onClose={() => setCompletionModalOpen(false)}
        goal={completedGoal}
      />
    </div>
  );
}
