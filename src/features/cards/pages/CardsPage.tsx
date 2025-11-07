import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Lock, Unlock, Trash2 } from 'lucide-react';
import { useState } from 'react';

const MotionCard = motion(Card);

export default function CardsPage() {
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: cardsData } = useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const response = await cardsAPI.getCards();
      return response.data.cards;
    },
  });

  const freezeMutation = useMutation({
    mutationFn: (cardId: number) => cardsAPI.freezeCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });

  const unfreezeMutation = useMutation({
    mutationFn: (cardId: number) => cardsAPI.unfreezeCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
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
          <h1 className="text-2xl font-bold text-gray-900">Virtual Cards</h1>
          <p className="text-gray-600 mt-1">Manage your virtual cards and subscriptions</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Card
        </Button>
      </motion.div>

      {cardsData && cardsData.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsData.map((card: any) => (
            <MotionCard
              key={card.id}
              variants={itemVariants}
              className="border-0 shadow-md overflow-hidden"
            >
              <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-white/80 text-sm">{card.card_name}</p>
                    <p className="text-xs text-white/60 mt-1">{card.card_type}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-white/80" />
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-lg tracking-wider">
                    {card.card_number?.replace(/(\d{4})/g, '$1 ').trim() || '****  ****  ****'}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Exp: {card.expiry_date || 'XX/XX'}</span>
                    {card.is_frozen && (
                      <span className="bg-white/20 px-2 py-0.5 rounded text-xs">FROZEN</span>
                    )}
                  </div>
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="flex gap-2">
                  {card.is_frozen ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => unfreezeMutation.mutate(card.id)}
                    >
                      <Unlock className="h-4 w-4 mr-1" />
                      Unfreeze
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => freezeMutation.mutate(card.id)}
                    >
                      <Lock className="h-4 w-4 mr-1" />
                      Freeze
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      ) : (
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No cards yet</h3>
              <p className="text-gray-600 mb-6">Create your first virtual card to get started</p>
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Card
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
