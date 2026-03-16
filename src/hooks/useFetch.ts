import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> { data: T | null; loading: boolean; error: string | null; }
interface FetchResult<T> extends FetchState<T> { refetch: () => void; }

export function useFetch<T>(url: string | null, options?: RequestInit): FetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: !!url, error: null });

  const fetchData = useCallback(async () => {
    if (!url) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err instanceof Error ? err.message : 'Fetch failed' });
    }
  }, [url]); // eslint-disable-line

  useEffect(() => { fetchData(); }, [fetchData]);

  return { ...state, refetch: fetchData };
}