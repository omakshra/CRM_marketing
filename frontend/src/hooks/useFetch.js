import { useCallback, useEffect, useState } from 'react';

/**
 * Generic data-fetch hook with loading / error state.
 * @param {() => Promise<{ data: *, error: string|null }>} fetcher
 * @param {Array} deps
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    const result = await fetcher();
    if (result.error) {
      setError(result.error);
      setData(null);
    } else {
      setData(result.data);
    }
    setLoading(false);
    return result;
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, setData };
}
