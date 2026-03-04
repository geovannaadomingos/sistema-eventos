/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Events from './index';
import { getEvents, deleteEvent } from '../../services/eventService';

vi.mock('../../services/eventService', () => ({
    getEvents: vi.fn(),
    deleteEvent: vi.fn(),
}));

const mockEvents = [
    {
        id: '1',
        name: 'Evento React',
        date: '2026-03-05T10:00:00.000Z',
        location: 'SP',
        status: 'ativo',
    },
    {
        id: '2',
        name: 'Vue Conf',
        date: '2026-04-05T10:00:00.000Z',
        location: 'RJ',
        status: 'encerrado',
    },
];

describe('Events Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <Events />
            </BrowserRouter>,
        );
    };

    it('should render the events list', async () => {
        vi.mocked(getEvents).mockResolvedValue(mockEvents as any);
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Evento React')).toBeInTheDocument();
        });
        expect(screen.getByText('Vue Conf')).toBeInTheDocument();
    });

    it('should filter events by name', async () => {
        vi.mocked(getEvents).mockResolvedValue(mockEvents as any);
        renderComponent();

        const user = userEvent.setup();

        await waitFor(() =>
            expect(screen.getByText('Evento React')).toBeInTheDocument(),
        );

        const searchInput = screen.getByPlaceholderText(/buscar por nome/i);
        await user.type(searchInput, 'React');

        expect(screen.getByText('Evento React')).toBeInTheDocument();
        expect(screen.queryByText('Vue Conf')).not.toBeInTheDocument();
    });

    it('should remove event after confirmation', async () => {
        vi.mocked(getEvents).mockResolvedValue([mockEvents[0]] as any);
        vi.mocked(deleteEvent).mockResolvedValue();
        renderComponent();

        const user = userEvent.setup();

        await waitFor(() =>
            expect(screen.getByText('Evento React')).toBeInTheDocument(),
        );

        const deleteBtn = screen.getByTitle('Remover evento');
        await user.click(deleteBtn);

        const confirmBtn = screen.getByRole('button', { name: 'Remover' });
        await user.click(confirmBtn);

        expect(deleteEvent).toHaveBeenCalledWith(undefined, '1');
        await waitFor(() => {
            expect(screen.queryByText('Evento React')).not.toBeInTheDocument();
        });
    });
});
