import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './index';
import { getDashboardSummary } from '../../services/dashboardService';

vi.mock('../../services/dashboardService', () => ({
  getDashboardSummary: vi.fn(),
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    vi.mocked(getDashboardSummary).mockReturnValue(new Promise(() => {}));

    render(<Dashboard />);

    expect(screen.getByText(/carregando dashboard/i)).toBeInTheDocument();
  });

  it('should show an error message if the request fails', async () => {
    vi.mocked(getDashboardSummary).mockRejectedValue(
      new Error('Falha na conexão'),
    );

    render(<Dashboard />);

    expect(screen.getByText(/carregando dashboard/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/erro ao carregar dashboard/i),
      ).toBeInTheDocument();
    });
    expect(screen.getByText('Falha na conexão')).toBeInTheDocument();
  });

  it('should display the dashboard data successfully', async () => {
    const mockData = {
      totalEvents: 10,
      totalParticipants: 50,
      upcomingEvents: [
        { id: '1', name: 'Evento Teste 1', date: '2026-03-05T10:00:00.000Z' },
      ],
      recentCheckins: [
        {
          participantName: 'João',
          eventName: 'Evento Teste 1',
          checkinDate: '2026-03-04T10:00:00.000Z',
        },
      ],
    };

    vi.mocked(getDashboardSummary).mockResolvedValue(mockData);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Painel do Organizador')).toBeInTheDocument();
    });

    // Verifica totalizadores
    expect(screen.getByText('10')).toBeInTheDocument(); // totalEvents
    expect(screen.getByText('50')).toBeInTheDocument(); // totalParticipants

    // Verifica listas
    expect(screen.getByText('Evento Teste 1')).toBeInTheDocument();
    expect(screen.getByText('João')).toBeInTheDocument();
  });

  it('should show empty list messages when list arrays return empty', async () => {
    const mockData = {
      totalEvents: 0,
      totalParticipants: 0,
      upcomingEvents: [],
      recentCheckins: [],
    };

    vi.mocked(getDashboardSummary).mockResolvedValue(mockData);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Painel do Organizador')).toBeInTheDocument();
    });

    expect(screen.getAllByText('0')).toHaveLength(2);
    expect(
      screen.getByText('Nenhum evento ativo encontrado.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Nenhum check-in recente.')).toBeInTheDocument();
  });
});
