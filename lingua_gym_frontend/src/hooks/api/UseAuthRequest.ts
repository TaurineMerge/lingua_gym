import { useCallback, useState } from "react";
import { useAxios } from "./UseAxios";
import { User } from "../../types/UserTypes";

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

export function useAuthRequest<TData, TResponse extends Partial<AuthResponse>>(url: string, method: 'post' | 'get') {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    data,
    error,
    loading,
    execute,
    cancel
  } = useAxios<TResponse>({
    method,
    url,
    manual: true,
    withCredentials: true,
    onSuccess: (data) => {
      setSuccessMessage((data as AuthResponse).message || 'Request successful');
    },
    onError: () => {
      setSuccessMessage(null);
    }
  });

  const request = useCallback(async (body: TData): Promise<AuthResponse> => {
    setSuccessMessage(null);
    try {
      const response = await execute({ data: body });

      return {
        success: true,
        ...response,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed';
      return {
        success: false,
        error: message,
      };
    }
  }, [execute]);

  return {
    request,
    cancel,
    successMessage,
    loading,
    error,
    data,
  };
}
