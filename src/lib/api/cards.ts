import { apiClient } from './client';

export const cardsAPI = {
  getCards: () => apiClient.get('/cards'),
  
  createCard: (data: { card_type?: string; card_name?: string; spending_limit?: number }) =>
    apiClient.post('/cards', data),
  
  getCard: (cardId: number) => apiClient.get(`/cards/${cardId}`),
  
  freezeCard: (cardId: number) => apiClient.post(`/cards/${cardId}/freeze`),
  
  unfreezeCard: (cardId: number) => apiClient.post(`/cards/${cardId}/unfreeze`),
  
  getCardSubscriptions: (cardId: number) => apiClient.get(`/cards/${cardId}/subscriptions`),
  
  addSubscription: (cardId: number, data: {
    service_name: string;
    service_category?: string;
    amount: number;
    billing_cycle?: string;
    next_billing_date?: string;
  }) => apiClient.post(`/cards/${cardId}/subscriptions`, data),
};
