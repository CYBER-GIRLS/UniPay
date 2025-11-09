import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Currency = 'USD' | 'EUR' | 'BGN';

interface CurrencyState {
  selectedCurrency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  BGN: 'лв',
};

const CURRENCY_NAMES: Record<Currency, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  BGN: 'Bulgarian Lev',
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      selectedCurrency: 'USD',
      setCurrency: (currency: Currency) => set({ selectedCurrency: currency }),
    }),
    {
      name: 'currency-storage',
    }
  )
);

export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbol = CURRENCY_SYMBOLS[currency];
  
  if (currency === 'BGN') {
    return `${amount.toFixed(2)} ${symbol}`;
  }
  
  return `${symbol}${amount.toFixed(2)}`;
};

export const getCurrencySymbol = (currency: Currency): string => {
  return CURRENCY_SYMBOLS[currency];
};

export const getCurrencyName = (currency: Currency): string => {
  return CURRENCY_NAMES[currency];
};
