import { useAuth } from '../context/AuthContext';

/**
 * Hook para obter o token JWT de forma centralizada.
 * Reutiliza o token armazenado no contexto de autenticação.
 * @returns token armazenado no contexto
 */
export function useToken(): string | null {
  const { token } = useAuth();
  return token;
}
