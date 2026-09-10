import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ApiError } from '@/types/api';

export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Response Interceptor: Standardizes errors into ApiError
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError<Record<string, unknown>>): Promise<never> => {
    const status = error.response?.status ?? 500;
    const errorPayload = error.response?.data;
    const serverMessage =
      typeof errorPayload?.message === 'string'
        ? errorPayload.message
        : error.message || 'An unexpected error occurred';

    const normalizedError: ApiError = {
      statusCode: status,
      message: serverMessage,
      code: error.code,
    };

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
