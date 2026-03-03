import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Preencha email e senha.');
      return;
    }

    setLoading(true);
    setError('');

    const success = await login(email, password);

    setLoading(false);

    if (!success) {
      setError('Email ou senha inválidos.');
      return;
    }

    navigate('/dashboard');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo</h1>
            <p className="text-gray-600">Painel do Organizador de Eventos</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6">
              <Alert type="error" closable onClose={() => setError('')}>
                {error}
              </Alert>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              icon={<FiMail size={18} />}
              type="email"
              label="Email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
            />

            <Input
              icon={<FiLock size={18} />}
              type="password"
              label="Senha"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              isLoading={loading}
            >
              Entrar
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Credenciais de teste: admin@email.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
}
