export interface Account {
  account_id: number;
  user_id: number;
  balance: number;
  account_type: 'Checking' | 'Saving' | 'Investment' | 'Business';
  created_at: string;
}

export interface Transaction {
  txn_id: number;
  account_id: number;
  txn_type: string;
  amount: number;
  created_at: string;
}

export interface Card {
  id: string;
  account_id: number;
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  type: 'Visa' | 'Mastercard' | 'Amex';
  variant: 'credit' | 'debit';
  bgGradient: string;
  status?: 'active' | 'frozen';
  spendingLimit?: number;
}

export interface SpendingData {
  month: string;
  amount: number;
}