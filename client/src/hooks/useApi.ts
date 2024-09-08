/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import instance from '../api/axios';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const useApi = <T>() => {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const request = useCallback(async (
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      let response: AxiosResponse<T>;
      switch (method) {
        case 'get':
          response = await instance.get<T>(url);
          break;
        case 'post':
          response = await instance.post<T>(url, data);
          break;
        case 'put':
          response = await instance.put<T>(url, data);
          break;
        case 'delete':
          response = await instance.delete<T>(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      setState({ data: response.data, error: null, loading: false });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        setState({ 
          data: null, 
          error: axiosError.response?.data?.message || axiosError.message || 'An error occurred', 
          loading: false 
        });
      } else {
        setState({ data: null, error: 'An unexpected error occurred', loading: false });
      }
      throw error;
    }
  }, []);

  return { ...state, request };
};