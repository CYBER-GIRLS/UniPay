import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Currency = 'USD' | 'EUR' | 'BGN';

interface CurrencyState {
  selectedCurrency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CONVERSION_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  BGN: 1.80,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  BGN: 'лв',
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

export const convertAmount = (amountInUSD: number, targetCurrency: Currency): number => {
  return amountInUSD * CONVERSION_RATES[targetCurrency];
};

export const formatCurrency = (amountInUSD: number, currency: Currency): string => {
  const converted = convertAmount(amountInUSD, currency);
  const symbol = CURRENCY_SYMBOLS[currency];
  
  if (currency === 'BGN') {
    return `${converted.toFixed(2)} ${symbol}`;
  }
  
  return `${symbol}${converted.toFixed(2)}`;
};

export const getCurrencySymbol = (currency: Currency): string => {
  return CURRENCY_SYMBOLS[currency];
};
