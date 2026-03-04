import { useEffect, useMemo, useState } from 'react';
import {
  getParticipants,
  deleteParticipant,
} from '../../services/participantService';
import { getEvents } from '../../services/eventService';
import type { Participant } from '../../types/Participant';
import type { Event } from '../../types/Event';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Participants() {
  const navigate = useNavigate();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('todos');
  const [checkInFilter, setCheckInFilter] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [p, e] = await Promise.all([getParticipants(), getEvents()]);
        setParticipants(p);
        setEvents(e);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao carregar participantes';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return participants.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(search.toLowerCase());

      const matchesEvent = eventFilter === 'todos' || p.eventId === eventFilter;

      const matchesCheckIn =
        checkInFilter === 'todos' ||
        (checkInFilter === 'feito' && p.checkIn) ||
        (checkInFilter === 'nao' && !p.checkIn);

      return matchesName && matchesEvent && matchesCheckIn;
    });
  }, [participants, search, eventFilter, checkInFilter]);

  async function handleDelete(id: string) {
    const previous = [...participants];

    try {
      setDeletingId(id);
      setParticipants((prev) => prev.filter((p) => p.id !== id));
      setDeleteModalOpen(false);
      setSelectedParticipant(null);

      await deleteParticipant(undefined, id);
    } catch {
      setParticipants(previous);
      setError('Erro ao remover participante');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Carregando participantes..." />
      </div>
    );
  }

  return (
    <main className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Participantes
          </h1>
          <p className="text-gray-600">
            Gerencie os participantes dos seus eventos.
          </p>
        </div>
        <Button
          onClick={() => navigate('/participantes/criar')}
          variant="primary"
          className="gap-2"
        >
          <FiPlus size={18} />
          Novo Participante
        </Button>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" closable onClose={() => setError(null)}>
            {error}
          </Alert>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Buscar e Filtrar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />

          <Select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            options={[
              { value: 'todos', label: 'Todos os eventos' },
              ...events.map((e) => ({ value: e.id, label: e.name })),
            ]}
          />

          <Select
            value={checkInFilter}
            onChange={(e) => setCheckInFilter(e.target.value)}
            options={[
              { value: 'todos', label: 'Todos' },
              { value: 'feito', label: 'Check-in realizado' },
              { value: 'nao', label: 'Não realizado' },
            ]}
          />
        </div>
      </div>

      <Table<Participant>
        columns={[
          {
            key: 'name',
            label: 'Nome',
            render: (value) => <span className="font-semibold">{value}</span>,
          },
          {
            key: 'email',
            label: 'Email',
            render: (value) => (
              <a
                href={`mailto:${value}`}
                className="text-primary-600 hover:underline"
              >
                {value}
              </a>
            ),
          },
          {
            key: 'eventId',
            label: 'Evento',
            render: (eventId) => {
              const event = events.find((e) => e.id === eventId);
              return event?.name || 'Evento removido';
            },
          },
          {
            key: 'checkIn',
            label: 'Check-in',
            render: (value) => (
              <div className="flex items-center gap-1">
                {value ? (
                  <>
                    <FiCheckCircle className="text-green-600" size={16} />
                    <span className="text-green-700">Realizado</span>
                  </>
                ) : (
                  <>
                    <FiXCircle className="text-gray-400" size={16} />
                    <span className="text-gray-500">Pendente</span>
                  </>
                )}
              </div>
            ),
          },
          {
            key: 'actions',
            label: 'Ações',
            render: (_, participant) => (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigate(`/participantes/editar/${participant.id}`)
                  }
                  title="Editar participante"
                >
                  <FiEdit2 size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedParticipant(participant);
                    setDeleteModalOpen(true);
                  }}
                  title="Remover participante"
                >
                  <FiTrash2 size={16} className="text-error" />
                </Button>
              </div>
            ),
          },
        ]}
        data={filtered}
        keyExtractor={(participant) => participant.id}
        emptyMessage="Nenhum participante encontrado com os filtros aplicados"
      />

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedParticipant(null);
        }}
        title="Confirmar exclusão"
        isDanger
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedParticipant(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              isLoading={deletingId === selectedParticipant?.id}
              onClick={() =>
                selectedParticipant && handleDelete(selectedParticipant.id)
              }
            >
              Remover
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Tem certeza que deseja remover o participante{' '}
          <strong>{selectedParticipant?.name}</strong>?
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </main>
  );
}
