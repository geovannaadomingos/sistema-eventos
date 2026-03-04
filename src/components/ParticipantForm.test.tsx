import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import ParticipantForm from './ParticipantForm';

const mockEvents = [
  {
    id: '1',
    name: 'Evento A',
    date: '2026-03-05T10:00:00.000Z',
    location: 'SP',
    status: 'ativo' as const,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
];

describe('ParticipantForm Component', () => {
  it('should display validation errors when submitting empty form', async () => {
    const mockSubmit = vi.fn();
    render(<ParticipantForm events={mockEvents} onSubmit={mockSubmit} />);

    const user = userEvent.setup();
    const btn = screen.getByRole('button', { name: /salvar participante/i });

    await user.click(btn);

    expect(
      screen.getByText('Preencha todos os campos corretamente.'),
    ).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit on success', async () => {
    const mockSubmit = vi.fn().mockResolvedValue(true);
    render(<ParticipantForm events={mockEvents} onSubmit={mockSubmit} />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/nome completo \*/i), 'Maria');
    await user.type(screen.getByLabelText(/email \*/i), 'maria@gmail.com');
    await user.selectOptions(screen.getByLabelText(/evento \*/i), '1');

    await user.click(
      screen.getByRole('button', { name: /salvar participante/i }),
    );

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Maria',
      email: 'maria@gmail.com',
      eventId: '1',
      checkIn: false,
    });
  });
});
