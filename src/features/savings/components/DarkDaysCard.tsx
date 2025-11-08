/**
 * DarkDaysCard Component
 * 
 * Purpose:
 *   Black card visualization for DarkDays Pocket with vault aesthetics.
 *   Emphasizes security and separation from main wallet.
 * 
 * Expected Functions:
 *   - Display balance in secure, vault-like card
 *   - Lock/unlock animations
 *   - Balance blur/hide toggle
 *   - Restricted access indicators
 *   - Deposit-only quick actions
 * 
 * Current Implementation Status:
 *   [DONE] Black card design with gradient
 *   [DONE] Lock icon with status indicator
 *   [DONE] Balance display
 *   [DONE] Auto-save percentage display
 *   [PENDING] Balance blur toggle
 *   [PENDING] Lock/unlock animations
 *   [PENDING] Emergency access button
 *   [PENDING] Withdrawal restrictions UI
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, ShieldCheck, Plus, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface DarkDaysCardProps {
  pocket: {
    id: number;
    name: string;
    balance: number;
    auto_save_percentage: number;
    auto_save_frequency?: string;
    is_locked: boolean;
  };
  onDeposit?: () => void;
  onEmergencyAccess?: () => void;
}

export function DarkDaysCard({ pocket, onDeposit, onEmergencyAccess }: DarkDaysCardProps) {
  const [balanceHidden, setBalanceHidden] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-2xl overflow-hidden text-white" style={{ backgroundColor: '#663399' }}>
        <CardContent className="p-6 relative">
          {/* Lock Icon Overlay */}
          <div className="absolute top-4 right-4">
            <motion.div
              animate={{
                rotate: pocket.is_locked ? 0 : 45,
              }}
              transition={{ duration: 0.3 }}
            >
              <ShieldCheck className="h-8 w-8 opacity-20" style={{ color: '#FFD700' }} />
            </motion.div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#FFD70033', borderWidth: '1px', borderStyle: 'solid', borderColor: '#FFD7004D' }}>
                <Lock className="h-6 w-6" style={{ color: '#FFD700' }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{pocket.name}</h3>
                <p className="text-xs text-white">Secure Emergency Fund</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-opacity-10" style={{ borderColor: '#FFD70080', color: '#FFD700', backgroundColor: '#FFD7001A' }}>
              <ShieldCheck className="h-3 w-3 mr-1" />
              Protected
            </Badge>
          </div>

          {/* Balance Display */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-white">Secured Balance</p>
              <button
                onClick={() => setBalanceHidden(!balanceHidden)}
                className="text-white hover:text-white transition-colors"
              >
                {balanceHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            <motion.div
              animate={{ filter: balanceHidden ? 'blur(8px)' : 'blur(0px)' }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-4xl font-bold text-white mb-1">
                ${pocket.balance.toFixed(2)}
              </p>
            </motion.div>
          </div>

          {/* Auto-Save Info */}
          <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white">Auto-Save Active</p>
                <p className="text-sm font-semibold text-white">
                  {pocket.auto_save_percentage}% of income
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white">Transfer Frequency</p>
                <p className="text-sm font-semibold" style={{ color: '#FFD700' }}>
                  {pocket.auto_save_frequency ? pocket.auto_save_frequency.charAt(0).toUpperCase() + pocket.auto_save_frequency.slice(1) : 'Not Set'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onDeposit}
              className="text-black font-semibold"
              style={{ backgroundColor: '#FFD700' }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Deposit
            </Button>
            <Button
              onClick={onEmergencyAccess}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <Lock className="h-4 w-4 mr-2" />
              Emergency Access
            </Button>
          </div>

          {/* Security Notice */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white text-center">
              🔒 Multi-layer security active • For emergency use only
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
