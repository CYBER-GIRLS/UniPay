import { apiClient } from './client';

export const marketplaceAPI = {
  getListings: (params?: {
    page?: number;
    per_page?: number;
    category?: string;
    university?: string;
  }) => apiClient.get('/marketplace/listings', { params }),
  
  createListing: (data: {
    title: string;
    description: string;
    category: string;
    price: number;
    university?: string;
    faculty?: string;
    course?: string;
    condition?: string;
    images?: string[];
  }) => apiClient.post('/marketplace/listings', data),
  
  getListing: (listingId: number) => apiClient.get(`/marketplace/listings/${listingId}`),
  
  createOrder: (data: { listing_id: number }) =>
    apiClient.post('/marketplace/orders', data),
};
