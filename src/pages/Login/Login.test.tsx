import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Login from './index';

const mockLogin = vi.fn();
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );
  };

  it('should render the email and password fields and the submit button', () => {
    renderComponent();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should show an error if submitting empty form', async () => {
    renderComponent();

    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    await user.click(submitButton);

    expect(screen.getByText('Preencha email e senha.')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should call mockLogin and navigate to dashboard on success', async () => {
    mockLogin.mockResolvedValueOnce(true);
    renderComponent();

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'admin@email.com');
    await user.type(screen.getByLabelText(/senha/i), '123456');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalledWith('admin@email.com', '123456');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should show an error message if credentials are invalid', async () => {
    mockLogin.mockResolvedValueOnce(false);
    renderComponent();

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'wrong@email.com');
    await user.type(screen.getByLabelText(/senha/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalledWith('wrong@email.com', 'wrongpass');
    expect(screen.getByText('Email ou senha inválidos.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
