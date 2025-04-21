import { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosRequestConfig, AxiosError, CancelTokenSource, AxiosResponse } from 'axios';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface UseAxiosOptions<T> extends AxiosRequestConfig {
  method?: HttpMethod;
  url: string;
  manual?: boolean;
  initialData?: T;
  debounceDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
}

export interface UseAxiosResult<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  response: AxiosResponse<T> | null;
  execute: (config?: AxiosRequestConfig) => Promise<T>;
  cancel: () => void;
}

export function useAxios<T = unknown>(options: UseAxiosOptions<T>): UseAxiosResult<T> {
  const {
    method = 'get',
    url,
    manual = false,
    initialData = null,
    debounceDelay = 0,
    onSuccess,
    onError,
    ...axiosConfig
  } = options;

  const [state, setState] = useState({
    data: initialData,
    loading: !manual,
    error: null,
    response: null,
  } as {
    data: T | null;
    loading: boolean;
    error: AxiosError | null;
    response: AxiosResponse<T> | null;
  });

  const cancelTokenSource = useRef<CancelTokenSource | null>(null);

  const _execute = useCallback(
    async (config: AxiosRequestConfig = {}): Promise<T> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        cancelTokenSource.current?.cancel();
        cancelTokenSource.current = axios.CancelToken.source();

        const response = await axios.request<T>({
          method,
          url,
          ...axiosConfig,
          ...config,
          cancelToken: cancelTokenSource.current.token,
        });

        setState({
          data: response.data,
          loading: false,
          error: null,
          response,
        });

        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        if (axios.isCancel(err)) return Promise.reject(new Error('Request cancelled'));

        const error = err as AxiosError;
        setState(prev => ({ ...prev, loading: false, error }));
        onError?.(error);
        throw error;
      }
    },
    [method, url, axiosConfig, onSuccess, onError]
  );

  const debouncePromise = <A extends unknown[], R>(fn: (...args: A) => Promise<R>, delay: number) => {
    let timeout: NodeJS.Timeout;
    let pendingPromise: {
      resolve: (value: R | PromiseLike<R>) => void;
      reject: (reason?: unknown) => void;
    } | null = null;

    return (...args: A): Promise<R> => {
      clearTimeout(timeout);

      if (pendingPromise) {
        pendingPromise.reject(new Error('Debounced call superseded'));
        pendingPromise = null;
      }

      return new Promise<R>((resolve, reject) => {
        pendingPromise = { resolve, reject };

        timeout = setTimeout(async () => {
          try {
            const result = await fn(...args);
            pendingPromise?.resolve(result);
          } catch (error) {
            pendingPromise?.reject(error);
          } finally {
            pendingPromise = null;
          }
        }, delay);
      });
    };
  };

  const debouncedExecute = useRef(
    debounceDelay > 0 ? debouncePromise(_execute, debounceDelay) : _execute
  ).current;

  const execute = useCallback(
    (config?: AxiosRequestConfig): Promise<T> => {
      return debouncedExecute(config);
    },
    [debouncedExecute]
  );

  const cancel = useCallback(() => {
    cancelTokenSource.current?.cancel('Request canceled by user');
    cancelTokenSource.current = null;
  }, []);

  useEffect(() => {
    if (!manual) {
      execute({});
    }

    return cancel;
  }, [manual, execute, cancel]);

  return {
    ...state,
    execute,
    cancel,
  };
}

export default useAxios;
