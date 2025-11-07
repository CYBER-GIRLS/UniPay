import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  setPin: (pin: string) => api.post('/auth/set-pin', { pin }),
  verifyPin: (pin: string) => api.post('/auth/verify-pin', { pin }),
};

export const walletAPI = {
  getWallet: () => api.get('/wallet'),
  topup: (amount: number, method: string) => api.post('/wallet/topup', { amount, method }),
  transfer: (receiver_username: string, amount: number, description?: string) => 
    api.post('/wallet/transfer', { receiver_username, amount, description }),
};

export const transactionsAPI = {
  getTransactions: (page: number = 1, per_page: number = 20, type?: string) => 
    api.get('/transactions', { params: { page, per_page, type } }),
  getTransaction: (id: number) => api.get(`/transactions/${id}`),
  getStats: () => api.get('/transactions/stats'),
};

export const cardsAPI = {
  getCards: () => api.get('/cards'),
  createCard: (data: any) => api.post('/cards', data),
  getCard: (id: number) => api.get(`/cards/${id}`),
  freezeCard: (id: number) => api.post(`/cards/${id}/freeze`),
  unfreezeCard: (id: number) => api.post(`/cards/${id}/unfreeze`),
  getSubscriptions: (cardId: number) => api.get(`/cards/${cardId}/subscriptions`),
  addSubscription: (cardId: number, data: any) => api.post(`/cards/${cardId}/subscriptions`, data),
};

export const savingsAPI = {
  getPockets: () => api.get('/savings/pockets'),
  createPocket: (data: any) => api.post('/savings/pockets', data),
  depositToPocket: (pocketId: number, amount: number, pin: string) => 
    api.post(`/savings/pockets/${pocketId}/deposit`, { amount, pin }),
  getGoals: () => api.get('/savings/goals'),
  createGoal: (data: any) => api.post('/savings/goals', data),
  contributeToGoal: (goalId: number, amount: number) => 
    api.post(`/savings/goals/${goalId}/contribute`, { amount }),
};

export const marketplaceAPI = {
  getListings: (page: number = 1, category?: string, university?: string) => 
    api.get('/marketplace/listings', { params: { page, category, university } }),
  createListing: (data: any) => api.post('/marketplace/listings', data),
  getListing: (id: number) => api.get(`/marketplace/listings/${id}`),
  createOrder: (listingId: number) => api.post('/marketplace/orders', { listing_id: listingId }),
};

export const loansAPI = {
  getLoans: () => api.get('/loans'),
  createLoan: (data: any) => api.post('/loans', data),
  repayLoan: (loanId: number, amount: number) => api.post(`/loans/${loanId}/repay`, { amount }),
};
