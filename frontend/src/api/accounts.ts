import { apiClient } from './client';
import type { Account } from '../types/bank';

export interface CreateAccountDTO {
  user_id: number;
  balance: number;
  account_type: string;
}

export interface CreateAccountResponse {
  message: string;
  account_id: string;
}

export interface TransactionResponse {
  account_id: number;
  message: string;
}

export interface TransferResponse {
  sender_account_id: number;
  receiver_account_id: number;
  message: string;
}

export interface FetchTransactionsResponse {
  account_id: number;
  transactions: {
    txn_id: number;
    account_id: number;
    txn_type: string;
    amount: number;
    created_at: string;
  }[];
}



/**
 * Fetch all accounts belonging to a specific user
 */
export const getAccountsByUserId = async (userId: number): Promise<Account[]> => {
  const response = await apiClient.get<Account[]>(`/api/users/${userId}/accounts`);
  return response.data;
};

/**
 * Create a new account
 */
export const createAccount = async (
  payload: CreateAccountDTO
): Promise<CreateAccountResponse> => {
  const response = await apiClient.post<CreateAccountResponse>(
    '/api/accounts',
    payload
  );
  return response.data;
};

/**
 * Deposit money into an account
 */
export const depositMoney = async (
  accountId: number,
  amount: number
): Promise<TransactionResponse> => {
  const response = await apiClient.post<TransactionResponse>(
    `/api/accounts/${accountId}/deposit`,
    { amount }
  );
  return response.data;
};

/**
 * Withdraw money from an account
 */
export const withdrawMoney = async (
  accountId: number,
  amount: number
): Promise<TransactionResponse> => {
  const response = await apiClient.post<TransactionResponse>(
    `/api/accounts/${accountId}/withdraw`,
    { amount }
  );
  return response.data;
};

/**
 * Transfer funds between two accounts
 */
export const transferFunds = async (
  senderId: number,
  receiverId: number,
  amount: number
): Promise<TransferResponse> => {
  const response = await apiClient.post<TransferResponse>(
    `/api/accounts/transfer`,
    null,
    {
      params: {
        sender_id: senderId,
        receiver_id: receiverId,
        amount: amount,
      },
    }
  );
  return response.data;
};


/**
 * Fetch transactions for a specific account
 */
export const getAccountTransactions = async (
  accountId: number
): Promise<FetchTransactionsResponse> => {
  const response = await apiClient.get<FetchTransactionsResponse>(
    `/api/accounts/${accountId}/transactions`
  );
  return response.data;
};