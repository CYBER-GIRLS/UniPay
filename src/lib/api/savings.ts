import { apiClient } from './client';

export const savingsAPI = {
  getPockets: () => apiClient.get('/savings/pockets'),
  
  createPocket: (data: {
    name?: string;
    auto_save_percentage?: number;
    auto_save_frequency?: string;
  }) => apiClient.post('/savings/pockets', data),
  
  depositToPocket: (pocketId: number, data: { amount: number; pin?: string }) =>
    apiClient.post(`/savings/pockets/${pocketId}/deposit`, data),
  
  getGoals: () => apiClient.get('/savings/goals'),
  
  createGoal: (data: {
    title: string;
    description?: string;
    target_amount: number;
    target_date?: string;
    icon?: string;
    color?: string;
  }) => apiClient.post('/savings/goals', data),
  
  contributeToGoal: (goalId: number, data: { amount: number }) =>
    apiClient.post(`/savings/goals/${goalId}/contribute`, data),
};
