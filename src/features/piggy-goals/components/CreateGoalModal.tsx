import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface CreateGoalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (goalData: any) => void;
}

const GOAL_ICONS = [
  { emoji: '🎓', label: 'Education', category: 'study' },
  { emoji: '💻', label: 'Electronics', category: 'tech' },
  { emoji: '✈️', label: 'Travel', category: 'travel' },
  { emoji: '🎮', label: 'Entertainment', category: 'fun' },
  { emoji: '🏠', label: 'Housing', category: 'home' },
  { emoji: '💼', label: 'Emergency Fund', category: 'emergency' },
  { emoji: '🎯', label: 'Other', category: 'other' },
];

export default function CreateGoalModal({ open, onClose, onSubmit }: CreateGoalModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    deadline: '',
    description: '',
    icon: '🎯',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      target_amount: parseFloat(formData.target_amount),
      deadline: formData.deadline || null,
    });
    setFormData({
      name: '',
      target_amount: '',
      deadline: '',
      description: '',
      icon: '🎯',
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Savings Goal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="icon">Choose Icon</Label>
            <div className="grid grid-cols-7 gap-2">
              {GOAL_ICONS.map((item) => (
                <button
                  key={item.emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: item.emoji })}
                  className={`
                    text-3xl p-3 rounded-lg border-2 transition-all hover:scale-110
                    ${formData.icon === item.emoji 
                      ? 'border-violet-500 bg-violet-50 scale-110' 
                      : 'border-gray-200 hover:border-violet-300'
                    }
                  `}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Goal Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., New Laptop, Spring Break Trip"
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_amount">Target Amount ($) *</Label>
            <Input
              id="target_amount"
              type="number"
              value={formData.target_amount}
              onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
              placeholder="1000.00"
              required
              min="10"
              max="100000"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Target Date (Optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Why are you saving for this?"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
