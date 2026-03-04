import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CheckinRules from './index';
import {
    getCheckinRules,
    createCheckinRule,
    updateCheckinRule,
    deleteCheckinRule,
} from '../../services/checkinRuleService';

vi.mock('../../services/checkinRuleService', () => ({
    getCheckinRules: vi.fn(),
    createCheckinRule: vi.fn(),
    updateCheckinRule: vi.fn(),
    deleteCheckinRule: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ id: 'event-1' }),
    };
});

describe('CheckinRules Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <CheckinRules />
            </BrowserRouter>,
        );
    };

    it('should add a new rule correctly', async () => {
        vi.mocked(getCheckinRules).mockResolvedValue([]);
        vi.mocked(createCheckinRule).mockResolvedValue({
            id: '1',
            name: 'QR Code',
            startOffsetMinutes: -30,
            endOffsetMinutes: 30,
            required: true,
            active: true,
            eventId: 'event-1',
            createdAt: '2026-03-01T10:00:00.000Z',
            updatedAt: '2026-03-01T10:00:00.000Z',
        });

        renderComponent();

        const user = userEvent.setup();

        await waitFor(() =>
            expect(screen.getByText('Configuração de Check-in')).toBeInTheDocument(),
        );

        await user.type(screen.getByLabelText(/nome da regra/i), 'QR Code');

        const startInput = screen.getByLabelText(/minutos antes/i);
        fireEvent.change(startInput, { target: { value: '-30' } });

        const endInput = screen.getByLabelText(/minutos depois/i);
        fireEvent.change(endInput, { target: { value: '30' } });
        await user.click(screen.getByLabelText(/marcar como obrigatória/i));

        await user.click(screen.getByRole('button', { name: /adicionar regra/i }));

        expect(createCheckinRule).toHaveBeenCalledWith({
            name: 'QR Code',
            startOffsetMinutes: -30,
            endOffsetMinutes: 30,
            required: true,
            active: true,
            eventId: 'event-1',
        });

        await waitFor(() => {
            expect(screen.getByText('QR Code')).toBeInTheDocument();
            expect(screen.getByText('Obrigatória')).toBeInTheDocument();
        });
    });

    it('should remove a rule and display alert if no active rule is left', async () => {
        vi.mocked(getCheckinRules).mockResolvedValue([
            {
                id: '1',
                name: 'Regra Única',
                startOffsetMinutes: 0,
                endOffsetMinutes: 0,
                required: false,
                active: true,
                eventId: 'event-1',
                createdAt: '2026-03-01T10:00:00.000Z',
                updatedAt: '2026-03-01T10:00:00.000Z',
            },
        ]);
        vi.mocked(deleteCheckinRule).mockResolvedValue();

        renderComponent();
        const user = userEvent.setup();

        await waitFor(() =>
            expect(screen.getByText('Regra Única')).toBeInTheDocument(),
        );

        const deleteBtn = screen.getByTitle('Remover regra');
        await user.click(deleteBtn);

        const confirmBtn = screen.getByRole('button', { name: 'Remover Regra' });
        await user.click(confirmBtn);

        await waitFor(() => {
            expect(
                screen.getByText('Deve existir pelo menos uma regra ativa.'),
            ).toBeInTheDocument();
        });
    });

    it('should display conflict alert for incompatible mandatory rules', async () => {
        vi.mocked(getCheckinRules).mockResolvedValue([
            {
                id: '1',
                name: 'Regra 1',
                startOffsetMinutes: -60,
                endOffsetMinutes: -30,
                required: true,
                active: true,
                eventId: 'event-1',
                createdAt: '2026-03-01T10:00:00.000Z',
                updatedAt: '2026-03-01T10:00:00.000Z',
            },
            {
                id: '2',
                name: 'Regra 2',
                startOffsetMinutes: 30,
                endOffsetMinutes: 60,
                required: true,
                active: true,
                eventId: 'event-1',
                createdAt: '2026-03-01T10:00:00.000Z',
                updatedAt: '2026-03-01T10:00:00.000Z',
            },
        ]);

        renderComponent();

        await waitFor(() => {
            expect(
                screen.getByText(
                    /Existem regras obrigatórias com janelas de validação incompatíveis/i,
                ),
            ).toBeInTheDocument();
        });
    });

    it('should toggle active/inactive status', async () => {
        vi.mocked(getCheckinRules).mockResolvedValue([
            {
                id: '1',
                name: 'Regra Teste',
                startOffsetMinutes: 0,
                endOffsetMinutes: 0,
                required: false,
                active: true,
                eventId: 'event-1',
                createdAt: '2026-03-01T10:00:00.000Z',
                updatedAt: '2026-03-01T10:00:00.000Z',
            },
        ]);
        vi.mocked(updateCheckinRule).mockResolvedValue({
            id: '1',
            name: 'Regra Teste',
            startOffsetMinutes: 0,
            endOffsetMinutes: 0,
            required: false,
            active: false,
            eventId: 'event-1',
            createdAt: '2026-03-01T10:00:00.000Z',
            updatedAt: '2026-03-01T10:00:00.000Z',
        });

        renderComponent();
        const user = userEvent.setup();

        await waitFor(() => {
            expect(screen.getByText('✓ Ativa')).toBeInTheDocument();
        });

        await user.click(screen.getByTitle('Desativar'));

        await waitFor(() => {
            expect(updateCheckinRule).toHaveBeenCalledWith('1', { active: false });
            expect(screen.getByText('○ Inativa')).toBeInTheDocument();
        });
    });
});
