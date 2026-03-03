import { useCallback, useState } from 'react';

/**
 * Hook para gerenciar estado de carregamento, erro e sucesso em operações assincronas.
 * Reutilizável em múltiplos contextos (fetch, CRUD, etc).
 */
export function useAsyncState<T>(initialState?: T) {
  const [data, setData] = useState<T | null>(initialState ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (asyncFn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(initialState ?? null);
    setLoading(false);
    setError(null);
  }, [initialState]);

  return { data, loading, error, execute, reset, setData };
}
