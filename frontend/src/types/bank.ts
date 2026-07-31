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
  id: string; // ISO datetime string from backend
  user_id?: number;
  account_id: number;
  cardHolder: string;
  cardNumber: number | string;
  expiry: string;
  type: string;
  variant: string;
  status: string;
  spendingLimit: number;
  bgGradient?: string;
}
export interface SpendingData {
  month: string;
  amount: number;
}

