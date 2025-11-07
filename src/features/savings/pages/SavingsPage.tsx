import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savingsAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { PiggyBank, Target, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const MotionCard = motion(Card);

export default function SavingsPage() {
  const [pocketDialogOpen, setPocketDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [contributionDialogOpen, setContributionDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  
  const [pocketName, setPocketName] = useState('');
  const [autoSavePercentage, setAutoSavePercentage] = useState('20');
  
  const [goalTitle, setGoalTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  
  const queryClient = useQueryClient();

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

  const createPocketMutation = useMutation({
    mutationFn: (data: any) => savingsAPI.createPocket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-pockets'] });
      setPocketDialogOpen(false);
      toast.success('Savings pocket created');
      setPocketName('');
      setAutoSavePercentage('20');
    },
    onError: () => {
      toast.error('Failed to create savings pocket');
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: (data: any) => savingsAPI.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      setGoalDialogOpen(false);
      toast.success('Goal created');
      setGoalTitle('');
      setGoalAmount('');
      setGoalDescription('');
    },
    onError: () => {
      toast.error('Failed to create goal');
    },
  });

  const contributeMutation = useMutation({
    mutationFn: ({ goalId, amount }: { goalId: number; amount: number }) =>
      savingsAPI.contributeToGoal(goalId, amount),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      setContributionDialogOpen(false);
      setContributionAmount('');
      if (response.data.goal_unlocked) {
        toast.success('Congratulations! Goal completed! 🎉');
      } else {
        toast.success('Contribution added');
      }
    },
    onError: () => {
      toast.error('Failed to contribute to goal');
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
            <Dialog open={pocketDialogOpen} onOpenChange={setPocketDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600">
                  <Plus className="h-4 w-4 mr-1" />
                  New Pocket
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Savings Pocket</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="pocket-name">Pocket Name</Label>
                    <Input
                      id="pocket-name"
                      placeholder="Emergency Fund"
                      value={pocketName}
                      onChange={(e) => setPocketName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auto-save">Auto-save Percentage (%)</Label>
                    <Input
                      id="auto-save"
                      type="number"
                      placeholder="20"
                      value={autoSavePercentage}
                      onChange={(e) => setAutoSavePercentage(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600"
                    onClick={() => createPocketMutation.mutate({
                      name: pocketName || 'DarkDays Pocket',
                      auto_save_percentage: Number(autoSavePercentage),
                    })}
                    disabled={createPocketMutation.isPending}
                  >
                    {createPocketMutation.isPending ? 'Creating...' : 'Create Pocket'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                <p className="text-gray-600 mb-4">No savings pockets yet</p>
                <Button
                  size="sm"
                  onClick={() => setPocketDialogOpen(true)}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Pocket
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Piggy Goals</h2>
            <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600">
                  <Plus className="h-4 w-4 mr-1" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Savings Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-title">Goal Title</Label>
                    <Input
                      id="goal-title"
                      placeholder="New Laptop"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-amount">Target Amount ($)</Label>
                    <Input
                      id="goal-amount"
                      type="number"
                      placeholder="1000"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-description">Description (optional)</Label>
                    <Input
                      id="goal-description"
                      placeholder="MacBook Pro for coding"
                      value={goalDescription}
                      onChange={(e) => setGoalDescription(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                    onClick={() => createGoalMutation.mutate({
                      title: goalTitle,
                      target_amount: Number(goalAmount),
                      description: goalDescription,
                    })}
                    disabled={createGoalMutation.isPending || !goalTitle || !goalAmount}
                  >
                    {createGoalMutation.isPending ? 'Creating...' : 'Create Goal'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-600">
                          {((goal.current_amount / goal.target_amount) * 100).toFixed(0)}% complete
                        </p>
                        {!goal.is_completed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedGoal(goal);
                              setContributionDialogOpen(true);
                            }}
                          >
                            Contribute
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No goals yet</p>
                <Button
                  size="sm"
                  onClick={() => setGoalDialogOpen(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Goal
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      <Dialog open={contributionDialogOpen} onOpenChange={setContributionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contribute to {selectedGoal?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contribution-amount">Contribution Amount ($)</Label>
              <Input
                id="contribution-amount"
                type="number"
                placeholder="50"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
              onClick={() => {
                if (selectedGoal && contributionAmount && Number(contributionAmount) > 0) {
                  contributeMutation.mutate({
                    goalId: selectedGoal.id,
                    amount: Number(contributionAmount),
                  });
                }
              }}
              disabled={contributeMutation.isPending || !contributionAmount || Number(contributionAmount) <= 0}
            >
              {contributeMutation.isPending ? 'Contributing...' : 'Contribute'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
