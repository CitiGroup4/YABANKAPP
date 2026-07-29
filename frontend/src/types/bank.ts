export interface Account {
  account_id: number;
  user_id: number;
  balance: number;
  account_type: 'Checking' | 'Saving' | 'Investment' | 'Business';
  created_at: string;
}

export interface Card {
  id: string;
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  type: 'Visa' | 'Mastercard' | 'Amex';
  variant: 'credit' | 'debit';
  bgGradient: string;
}

export interface SpendingData {
  month: string;
  amount: number;
}