import { useCallback, useRef, useEffect, useState } from "react";
import { useAxios, UseAxiosOptions, UseAxiosResult } from "./UseAxios";
import { AxiosRequestConfig } from "axios";

interface UseAxiosWithTotalPageCountResult<T> extends Omit<UseAxiosResult<T>, "execute"> {
  totalCount: number;
  execute: (config?: AxiosRequestConfig) => Promise<T | null>;
}

function useAxiosWithTotalPageCount<T extends { totalCount: number }>(
  options: UseAxiosOptions<T>
): UseAxiosWithTotalPageCountResult<T> {
  const modifiedOptions = { ...options, manual: true };

  const { data, execute: baseExecute, error, ...rest } = useAxios<T>(modifiedOptions);

  const [totalCount, setTotalCount] = useState(0);
  const configRef = useRef<AxiosRequestConfig | null>(null);
  const executionRef = useRef<(() => void) | null>(null);
  const hasWarnedRef = useRef(false);

  useEffect(() => {
    if (data) {
      if (data.totalCount !== undefined) {
        setTotalCount(data.totalCount);
        hasWarnedRef.current = false;
      } else if (!hasWarnedRef.current) {
        console.warn(
          "[useAxiosWithTotalPageCount] Missing 'totalCount' in response. Defaulting to 0.",
          data
        );
        setTotalCount(0);
        hasWarnedRef.current = true;
      }
    }
  }, [data]);

  const executeWrapper = useCallback(async (config: AxiosRequestConfig = {}): Promise<T | null> => {
    configRef.current = config;

    try {
      const result = await baseExecute(config);
      return result;
    } catch (err) {
      if (!hasWarnedRef.current) {
        console.error("[useAxiosWithTotalPageCount] Request failed:", err);
        hasWarnedRef.current = true;
      }
      setTotalCount(0);
      return null;
    }
  }, [baseExecute]);

  useEffect(() => {
    executionRef.current = () => {
      if (configRef.current !== null) {
        executeWrapper(configRef.current);
      } else {
        executeWrapper({});
      }
    };
  }, [executeWrapper]);

  useEffect(() => {
    if (!options.manual && executionRef.current) {
      executionRef.current();
    }
  }, [options.manual]);

  return {
    ...rest,
    data,
    execute: executeWrapper,
    totalCount,
    error
  };
}

export default useAxiosWithTotalPageCount;
