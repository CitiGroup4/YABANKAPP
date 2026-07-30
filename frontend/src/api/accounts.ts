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

/**
 * Fetch all accounts belonging to a specific user
 */
export const getAccountsByUserId = async (userId: number): Promise<Account[]> => {
  const response = await apiClient.get<Account[]>(`/api/users/${userId}/accounts/`);
  return response.data;
};

/**
 * Fetch a single account by ID
 */
export const getAccountById = async (accountId: number): Promise<Account> => {
  const response = await apiClient.get<Account>(`/api/accounts/${accountId}`);
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