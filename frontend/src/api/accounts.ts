import { apiClient } from './client';
import type { Account } from '../types/bank';

export interface CreateAccountPayload {
  user_id: number;
  balance: number;
  account_type: string;
}

export interface CreateAccountResponse {
  message: string;
  account_id: string;
}

export const getAccountById = async (accountId: number): Promise<Account> => {
  const response = await apiClient.get<Account>(`/api/accounts/${accountId}`);
  return response.data;
};

export const createAccount = async (
  payload: CreateAccountPayload
): Promise<CreateAccountResponse> => {
  const response = await apiClient.post<CreateAccountResponse>(
    '/api/accounts',
    payload
  );
  return response.data;
};