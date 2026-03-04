interface LoginResponse {
  token: string;
  user: {
    email: string;
  };
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'admin@email.com' && password === '123456') {
        resolve({
          token: 'fake-jwt-token',
          user: { email },
        });
      } else {
        reject(new Error('Credenciais inválidas'));
      }
    }, 800);
  });
}
