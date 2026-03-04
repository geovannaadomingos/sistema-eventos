/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Participants from './index';
import {
    getParticipants,
    deleteParticipant,
} from '../../services/participantService';
import { getEvents } from '../../services/eventService';

vi.mock('../../services/participantService', () => ({
    getParticipants: vi.fn(),
    deleteParticipant: vi.fn(),
}));

vi.mock('../../services/eventService', () => ({
    getEvents: vi.fn(),
}));

const mockParticipants = [
    {
        id: '1',
        name: 'Ana Silva',
        email: 'ana@teste.com',
        eventId: '10',
        checkIn: true,
    },
    {
        id: '2',
        name: 'Carlos',
        email: 'carlos@teste.com',
        eventId: '20',
        checkIn: false,
    },
];

const mockEvents = [
    {
        id: '10',
        name: 'Evento Dez',
        date: '2026-03-05T10:00:00.000Z',
        location: 'SP',
        status: 'ativo' as const,
    },
    {
        id: '20',
        name: 'Evento Vinte',
        date: '2026-04-05T10:00:00.000Z',
        location: 'RJ',
        status: 'ativo' as const,
    },
];

describe('Participants Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <Participants />
            </BrowserRouter>,
        );
    };

    it('should render the participants list', async () => {
        vi.mocked(getParticipants).mockResolvedValue(mockParticipants as any);
        vi.mocked(getEvents).mockResolvedValue(mockEvents as any);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Ana Silva')).toBeInTheDocument();
        });
        expect(screen.getByText('Carlos')).toBeInTheDocument();
    });

    it('should filter participants by name', async () => {
        vi.mocked(getParticipants).mockResolvedValue(mockParticipants as any);
        vi.mocked(getEvents).mockResolvedValue(mockEvents as any);

        renderComponent();

        const user = userEvent.setup();

        await waitFor(() =>
            expect(screen.getByText('Ana Silva')).toBeInTheDocument(),
        );

        const searchInput = screen.getByPlaceholderText(/buscar por nome/i);
        await user.type(searchInput, 'Carlos');

        expect(screen.getByText('Carlos')).toBeInTheDocument();
        expect(screen.queryByText('Ana Silva')).not.toBeInTheDocument();
    });

    it('should remove participant after confirmation', async () => {
        vi.mocked(getParticipants).mockResolvedValue([mockParticipants[0]] as any);
        vi.mocked(getEvents).mockResolvedValue(mockEvents as any);
        vi.mocked(deleteParticipant).mockResolvedValue();

        renderComponent();

        const user = userEvent.setup();

        await waitFor(() =>
            expect(screen.getByText('Ana Silva')).toBeInTheDocument(),
        );

        const deleteBtn = screen.getByTitle('Remover participante');
        await user.click(deleteBtn);

        const confirmBtn = screen.getByRole('button', { name: 'Remover' });
        await user.click(confirmBtn);

        expect(deleteParticipant).toHaveBeenCalledWith(undefined, '1');
        await waitFor(() => {
            expect(screen.queryByText('Ana Silva')).not.toBeInTheDocument();
        });
    });
});
