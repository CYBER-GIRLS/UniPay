/**
 * DarkDaysPocketPage - Enhanced Savings Interface
 * 
 * Purpose:
 *   Comprehensive DarkDays Pocket management interface with all security features.
 *   Integrates all DarkDays components for complete user experience.
 * 
 * Components Included:
 *   - DarkDaysCard: Black card visualization with vault aesthetics
 *   - SecurityVerificationModal: Multi-layer security for withdrawals
 *   - AutoSaveConfigPanel: Automatic savings configuration
 *   - EmergencyUnlockDialog: Emergency access with verification
 *   - SavingsReportWidget: Progress reports and milestones
 * 
 * Status:
 *   [DONE] Component integration
 *   [DONE] Deposit functionality UI
 *   [DONE] Emergency access flow UI
 *   [DONE] Auto-save configuration UI
 *   [DONE] Reports and analytics UI
 *   [PENDING] Backend integration for new endpoints
 *   [PENDING] Actual withdrawal implementation
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savingsAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Settings, FileText } from 'lucide-react';
import { toast } from 'sonner';

import { DarkDaysCard } from '../components/DarkDaysCard';
import { SecurityVerificationModal } from '../components/SecurityVerificationModal';
import { AutoSaveConfigPanel } from '../components/AutoSaveConfigPanel';
import { EmergencyUnlockDialog } from '../components/EmergencyUnlockDialog';
import { SavingsReportWidget } from '../components/SavingsReportWidget';

export default function DarkDaysPocketPage() {
  const queryClient = useQueryClient();
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [changePercentageDialogOpen, setChangePercentageDialogOpen] = useState(false);
  
  // Form states
  const [pocketName, setPocketName] = useState('DarkDays Pocket');
  const [autoSavePercentage, setAutoSavePercentage] = useState('20');
  const [newPercentage, setNewPercentage] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositPin, setDepositPin] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [emergencyData, setEmergencyData] = useState<any>(null);
  
  // Selected pocket for operations
  const [selectedPocket, setSelectedPocket] = useState<any>(null);

  // Fetch pockets
  const { data: pocketsData, isLoading } = useQuery({
    queryKey: ['savings-pockets'],
    queryFn: async () => {
      const response = await savingsAPI.getPockets();
      return response.data.pockets;
    },
  });

  // Create pocket mutation
  const createPocketMutation = useMutation({
    mutationFn: (data: any) => savingsAPI.createPocket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-pockets'] });
      setCreateDialogOpen(false);
      toast.success('DarkDays Pocket created successfully!');
      setPocketName('DarkDays Pocket');
      setAutoSavePercentage('20');
    },
    onError: (error: any) => {
      toast.error(`Failed to create pocket: ${error.response?.data?.error || error.message}`);
    },
  });

  // Deposit mutation
  const depositMutation = useMutation({
    mutationFn: ({ pocketId, amount, pin }: any) => 
      savingsAPI.depositToPocket(pocketId, { amount, pin }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-pockets'] });
      setDepositDialogOpen(false);
      toast.success('Deposit successful!');
      setDepositAmount('');
      setDepositPin('');
    },
    onError: (error: any) => {
      toast.error(`Deposit failed: ${error.response?.data?.error || error.message}`);
    },
  });

  // Update auto-save config mutation
  const updateAutoSaveMutation = useMutation({
    mutationFn: ({ pocketId, config }: any) => 
      savingsAPI.updateAutoSave(pocketId, config),
    onMutate: async ({ pocketId, config }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['savings-pockets'] });
      
      // Snapshot the previous value
      const previousPockets = queryClient.getQueryData(['savings-pockets']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['savings-pockets'], (old: any) => {
        if (!old) return old;
        return old.map((pocket: any) => 
          pocket.id === pocketId 
            ? { 
                ...pocket, 
                auto_save_enabled: config.enabled,
                auto_save_percentage: config.percentage,
                auto_save_frequency: config.frequency,
              } 
            : pocket
        );
      });
      
      return { previousPockets };
    },
    onSuccess: () => {
      toast.success('Auto-save configuration updated successfully!');
    },
    onError: (error: any, variables, context: any) => {
      // Rollback on error
      if (context?.previousPockets) {
        queryClient.setQueryData(['savings-pockets'], context.previousPockets);
      }
      toast.error(`Failed to update configuration: ${error.response?.data?.error || error.message || 'An error occurred'}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-pockets'] });
    },
  });

  // Handle percentage update
  const handlePercentageUpdate = (percentage: number) => {
    toast.info('Auto-save percentage update will be implemented with backend endpoint');
    console.log('Update auto-save percentage:', {
      pocketId: activePocket?.id,
      percentage,
    });
    setChangePercentageDialogOpen(false);
    setNewPercentage('');
  };

  // Handle emergency access initiation
  const handleEmergencyAccess = (pocket: any) => {
    setSelectedPocket(pocket);
    setEmergencyDialogOpen(true);
  };

  // Handle emergency proceed
  const handleEmergencyProceed = (data: { category: string; reason: string }) => {
    setEmergencyData(data);
    setEmergencyDialogOpen(false);
    setVerificationDialogOpen(true);
  };

  // Handle security verification complete
  const handleVerificationComplete = (verificationData: any) => {
    // This would call the withdrawal API endpoint
    toast.info('Withdrawal functionality will be implemented with backend endpoint');
    console.log('Emergency withdrawal request:', {
      pocket: selectedPocket,
      emergency: emergencyData,
      verification: verificationData,
      amount: withdrawalAmount,
    });
    setVerificationDialogOpen(false);
  };

  // Handle deposit
  const handleDeposit = (pocket: any) => {
    setSelectedPocket(pocket);
    setDepositDialogOpen(true);
  };

  // Handle auto-save config save
  const handleAutoSaveConfig = (config: any) => {
    if (activePocket) {
      updateAutoSaveMutation.mutate({
        pocketId: activePocket.id,
        config,
      });
    }
  };

  const activePocket = pocketsData?.[0]; // For demo, using first pocket

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            DarkDays Pocket
          </h1>
          <p className="text-muted-foreground mt-2">
            Secure emergency fund with multi-layer protection
          </p>
        </div>
        {!activePocket && (
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-gradient-to-r from-gray-900 to-gray-700 mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Pocket
          </Button>
        )}
      </div>

      {/* Main Content */}
      {activePocket ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* DarkDays Card */}
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <DarkDaysCard
                  pocket={activePocket}
                  onDeposit={() => handleDeposit(activePocket)}
                  onEmergencyAccess={() => handleEmergencyAccess(activePocket)}
                />
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg border border-violet-200">
                <h3 className="font-semibold text-violet-900 mb-2">🔒 Multi-Layer Security</h3>
                <p className="text-sm text-violet-700">
                  PIN + Password + Emergency confirmation required for withdrawals
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">⚡ Auto-Save Active</h3>
                <p className="text-sm text-green-700">
                  {activePocket.auto_save_percentage}% of income automatically saved
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <AutoSaveConfigPanel
              pocketId={activePocket.id}
              currentConfig={{
                enabled: activePocket.auto_save_enabled,
                percentage: activePocket.auto_save_percentage,
                frequency: activePocket.auto_save_frequency || 'monthly',
              }}
              onSave={handleAutoSaveConfig}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl">🏦</div>
            <h2 className="text-2xl font-bold text-gray-900">No DarkDays Pocket Yet</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Create your secure emergency fund to protect yourself from unexpected expenses.
            </p>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-gradient-to-r from-gray-900 to-gray-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create DarkDays Pocket
            </Button>
          </div>
        </div>
      )}

      {/* Create Pocket Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create DarkDays Pocket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pocket-name">Pocket Name</Label>
              <Input
                id="pocket-name"
                value={pocketName}
                onChange={(e) => setPocketName(e.target.value)}
                placeholder="DarkDays Pocket"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auto-save">Auto-Save Percentage (%)</Label>
              <Input
                id="auto-save"
                type="number"
                min="5"
                max="50"
                value={autoSavePercentage}
                onChange={(e) => setAutoSavePercentage(e.target.value)}
              />
            </div>
            <Button
              onClick={() =>
                createPocketMutation.mutate({
                  name: pocketName,
                  auto_save_percentage: Number(autoSavePercentage),
                })
              }
              disabled={createPocketMutation.isPending}
              className="w-full bg-gradient-to-r from-gray-900 to-gray-700"
            >
              {createPocketMutation.isPending ? 'Creating...' : 'Create Pocket'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deposit Dialog */}
      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit to DarkDays Pocket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount ($)</Label>
              <Input
                id="deposit-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="100.00"
              />
            </div>
            <Button
              onClick={() => {
                if (selectedPocket && depositAmount && Number(depositAmount) > 0) {
                  depositMutation.mutate({
                    pocketId: selectedPocket.id,
                    amount: Number(depositAmount),
                    pin: '',
                  });
                }
              }}
              disabled={depositMutation.isPending || !depositAmount || Number(depositAmount) <= 0}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
            >
              {depositMutation.isPending ? 'Processing...' : 'Confirm Deposit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Emergency Unlock Dialog */}
      <EmergencyUnlockDialog
        open={emergencyDialogOpen}
        onClose={() => setEmergencyDialogOpen(false)}
        onProceed={handleEmergencyProceed}
        pocketBalance={selectedPocket?.balance || 0}
      />

      {/* Security Verification Modal */}
      <SecurityVerificationModal
        open={verificationDialogOpen}
        onClose={() => setVerificationDialogOpen(false)}
        onVerified={handleVerificationComplete}
        amount={selectedPocket?.balance || 0}
      />

      {/* Change Percentage Dialog */}
      <Dialog open={changePercentageDialogOpen} onOpenChange={setChangePercentageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Auto-Save Percentage</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-percentage">Auto-Save Percentage (%)</Label>
              <Input
                id="new-percentage"
                type="number"
                min="5"
                max="50"
                value={newPercentage}
                onChange={(e) => setNewPercentage(e.target.value)}
                placeholder="20"
              />
              <p className="text-sm text-muted-foreground">
                Choose between 5% and 50% of your income to automatically save
              </p>
            </div>
            <Button
              onClick={() => handlePercentageUpdate(Number(newPercentage))}
              disabled={!newPercentage}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700"
            >
              Update Percentage
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
