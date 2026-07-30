import { apiClient } from './client';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user_id: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user_id: number;
  name: string;
  email: string;
}

export const registerUser = async (data: RegisterPayload): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>('/register', data);
  return response.data;
};

export const loginUser = async (credentials: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/login', credentials);
  return response.data;
};