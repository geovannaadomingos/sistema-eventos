import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import EventForm from './EventForm';

describe('EventForm Component', () => {
  it('should display validation errors when submitting empty form', async () => {
    const mockSubmit = vi.fn();
    render(<EventForm onSubmit={mockSubmit} />);

    const user = userEvent.setup();
    const submitBtn = screen.getByRole('button', { name: /salvar evento/i });

    await user.click(submitBtn);

    expect(
      screen.getByText('Preencha todos os campos corretamente.'),
    ).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit on success', async () => {
    const mockSubmit = vi.fn().mockResolvedValue(true);
    render(<EventForm onSubmit={mockSubmit} />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/nome do evento \*/i), 'Evento X');
    await user.type(
      screen.getByLabelText(/data e hora \*/i),
      '2026-03-05T10:00',
    );
    await user.type(screen.getByLabelText(/local \*/i), 'Centro');

    await user.click(screen.getByRole('button', { name: /salvar evento/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Evento X',
      date: '2026-03-05T10:00',
      location: 'Centro',
      status: 'ativo',
    });
  });
});
