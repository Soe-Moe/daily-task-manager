import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { ApiError } from '@/types/api';

export interface RemoteUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export const fetchUsers = async (): Promise<RemoteUser[]> => {
  const response = await apiClient.get<RemoteUser[]>('/users');
  return response.data;
};

export const fetchUserById = async (id: number): Promise<RemoteUser> => {
  const response = await apiClient.get<RemoteUser>(`/users/${id}`);
  return response.data;
};

export const useUsers = () => {
  return useQuery<RemoteUser[], ApiError>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

export const useUser = (id: number) => {
  return useQuery<RemoteUser, ApiError>({
    queryKey: ['user', id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
};
