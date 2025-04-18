import { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosRequestConfig, AxiosError, CancelTokenSource, AxiosResponse } from 'axios';
import { debounce } from 'lodash';

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
  execute: (config?: AxiosRequestConfig) => Promise<void>;
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
    async (config: AxiosRequestConfig = {}) => {
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
      } catch (err) {
        if (axios.isCancel(err)) return;

        const error = err as AxiosError;
        setState(prev => ({ ...prev, loading: false, error }));
        onError?.(error);
      }
    },
    [method, url, axiosConfig, onSuccess, onError]
  );

  const execute = useRef(debounceDelay > 0 ? debounce(_execute, debounceDelay) : _execute).current;

  const cancel = useCallback(() => {
    cancelTokenSource.current?.cancel('Request canceled by user');
    cancelTokenSource.current = null;
    if (debounceDelay > 0) {
      (execute as ReturnType<typeof debounce>).cancel?.();
    }
  }, [execute, debounceDelay]);

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
