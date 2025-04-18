import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { useAxios } from './UseAxios';

interface AvailabilityResponse {
  available: boolean;
}

export function useAvailabilityCheck(
  value: string,
  url: string,
  fieldKey: string,
  delay = 300
) {
  const [debouncedValue] = useDebounce(value, delay);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const { execute, loading: isChecking, cancel } = useAxios<AvailabilityResponse>({
    method: 'post',
    url,
    manual: true,
    onSuccess: (data) => setIsAvailable(data.available),
    onError: () => setIsAvailable(null),
  });

  const checkAvailability = useCallback(async () => {
    if (!debouncedValue) {
      setIsAvailable(null);
      return;
    }
    await execute({ data: { [fieldKey]: debouncedValue } });
  }, [debouncedValue, execute, fieldKey]);

  useEffect(() => {
    checkAvailability();
    return cancel;
  }, [checkAvailability, cancel]);
  
  return {
    isAvailable,
    isChecking,
    checkAvailability,
  };
}
