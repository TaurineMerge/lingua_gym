import { useRef, useCallback, useEffect, useReducer } from "react";
import axios, { AxiosRequestConfig, AxiosError, CancelTokenSource, AxiosResponse } from "axios";

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface UseAxiosOptions<T> extends AxiosRequestConfig {
  method?: HttpMethod;
  url: string;
  manual?: boolean;
  initialData?: T;
  debounceDelay?: number;
  retryCount?: number;
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

// Reducer state
interface State<T> {
  loading: boolean;
  data: T | null;
  error: AxiosError | null;
  response: AxiosResponse<T> | null;
}

type Action<T> =
  | { type: 'START' }
  | { type: 'SUCCESS'; payload: { data: T; response: AxiosResponse<T> } }
  | { type: 'ERROR'; payload: AxiosError }
  | { type: 'CANCEL' };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'START':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.payload.data,
        error: null,
        response: action.payload.response,
      };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CANCEL':
      return { ...state, loading: false };
    default:
      return state;
  }
}

function useAxios<T = unknown>(options: UseAxiosOptions<T>): UseAxiosResult<T> {
  const {
    method = 'get',
    url,
    manual = false,
    initialData = null,
    debounceDelay = 0,
    retryCount = 0,
    onSuccess,
    onError,
    ...axiosConfig
  } = options;

  const [state, dispatch] = useReducer(reducer<T>, {
    loading: !manual,
    data: initialData,
    error: null,
    response: null,
  });

  const cancelSourceRef = useRef<CancelTokenSource | null>(null);
  const mountedRef = useRef<boolean>(true);

  const cancel = useCallback(() => {
    cancelSourceRef.current?.cancel('Request canceled');
    cancelSourceRef.current = null;
    dispatch({ type: 'CANCEL' });
  }, []);

  const optionsRef = useRef({
    method,
    url,
    axiosConfig,
    retryCount,
    onSuccess,
    onError,
  });

  useEffect(() => {
    optionsRef.current = {
      method,
      url,
      axiosConfig,
      retryCount,
      onSuccess,
      onError,
    };
  }, [method, url, axiosConfig, retryCount, onSuccess, onError]);

  const coreExecute = useCallback(async (config?: AxiosRequestConfig, retriesLeft?: number): Promise<T> => {
    cancel();
    cancelSourceRef.current = axios.CancelToken.source();

    const {
      method,
      url,
      axiosConfig,
      retryCount,
      onSuccess,
      onError,
    } = optionsRef.current;

    if (retriesLeft === undefined) {
      retriesLeft = retryCount;
    }

    dispatch({ type: 'START' });

    try {
      const res = await axios.request<T>({
        method,
        url,
        cancelToken: cancelSourceRef.current.token,
        ...axiosConfig,
        ...config,
      });

      if (!mountedRef.current) return Promise.reject(new Error("Component unmounted"));

      dispatch({ type: 'SUCCESS', payload: { data: res.data, response: res } });
      onSuccess?.(res.data);

      return res.data;
    } catch (err) {
      if (!mountedRef.current) return Promise.reject(new Error("Component unmounted"));

      const axiosErr = err as AxiosError;
      if (axios.isCancel(err)) {
        return Promise.reject(new Error('Request cancelled'));
      }

      if (retriesLeft > 0) {
        return coreExecute(config, retriesLeft - 1);
      }

      dispatch({ type: 'ERROR', payload: axiosErr });
      onError?.(axiosErr);
      throw axiosErr;
    }
  }, [cancel]);

  const debouncePromise = useCallback(<A extends unknown[], R>(fn: (...args: A) => Promise<R>, delay: number) => {
    let timeout: NodeJS.Timeout | null = null;
    let pendingReject: ((reason?: unknown) => void) | null = null;

    return (...args: A): Promise<R> => {
      if (timeout) clearTimeout(timeout);
      if (pendingReject) pendingReject(new Error("Debounced request cancelled"));

      return new Promise((resolve, reject) => {
        pendingReject = reject;

        timeout = setTimeout(async () => {
          try {
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            pendingReject = null;
            timeout = null;
          }
        }, delay);
      });
    };
  }, []);

  const debouncePromiseRef = useRef(debouncePromise);

  const execute = useCallback((config?: AxiosRequestConfig) => {
    if (debounceDelay > 0) {
      return debouncePromiseRef.current(coreExecute, debounceDelay)(config);
    }
    return coreExecute(config);
  }, [coreExecute, debounceDelay]);

  useEffect(() => {
    mountedRef.current = true;
    if (!manual) {
      execute({});
    }
    return () => {
      mountedRef.current = false;
      cancel();
    };
  }, [manual, execute, cancel]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    response: state.response,
    execute,
    cancel,
  };
}

export { useAxios };
