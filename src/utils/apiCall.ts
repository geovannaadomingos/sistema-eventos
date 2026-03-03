/**
 * Utilitário centralizado para requisições HTTP com token.
 * Facilita adição de headers, tratamento de erros e logs.
 */

export async function apiCall<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  options?: {
    body?: unknown;
    token?: string;
  },
): Promise<T> {
  const token = options?.token ?? localStorage.getItem('token') ?? '';

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (options?.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(endpoint, config);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${response.statusText}: ${error}`);
  }

  return response.json();
}
