import { apiClient } from './client';
import type { Card } from '../types/bank';

export interface CreateCardPayload {
  user_id: number;
  account_id: number;
  cardHolder: String;
  type: string;
  variant: string;
  status: string;
  spendingLimit: number;
}

/**
 * Issue/Add a new card for a user
 */
export const addCard = async (userId: number, payload: CreateCardPayload): Promise<any> => {
  const response = await apiClient.post(`/api/users/${userId}/cards/add`, payload);
  return response.data;
};

/**
 * Fetch all cards associated with a specific account ID
 */
export const getCardsForAccount = async (accountId: number): Promise<Card[]> => {
  const response = await apiClient.get<{ "Cards for this user": Card[] }>(
    `/api/accounts/${accountId}/cards`
  );
  return response.data["Cards for this user"] || [];
};