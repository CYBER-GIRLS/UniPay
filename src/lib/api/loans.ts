import { apiClient } from './client';

export const loansAPI = {
  getLoans: () => apiClient.get('/loans'),
  
  createLoan: (data: {
    borrower_username: string;
    amount: number;
    description?: string;
    due_date?: string;
    interest_rate?: number;
  }) => apiClient.post('/loans', data),
  
  repayLoan: (loanId: number, data: { amount: number }) =>
    apiClient.post(`/loans/${loanId}/repay`, data),
};
