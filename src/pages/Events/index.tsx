import { useEffect, useMemo, useState } from 'react';
import { getEvents, deleteEvent } from '../../services/eventService';
import type { Event } from '../../types/Event';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSettings } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import clsx from 'clsx';

type StatusFilter = 'todos' | 'ativo' | 'encerrado';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);

        const response = await getEvents();
        setEvents(response);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao carregar eventos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'todos' || event.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  async function handleDelete(id: string) {
    const previousEvents = [...events];

    try {
      setDeletingId(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
      setDeleteModalOpen(false);
      setSelectedEvent(null);

      await deleteEvent(undefined, id);
    } catch {
      setEvents(previousEvents);
      setError('Erro ao remover evento');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Carregando eventos..." />
      </div>
    );
  }

  return (
    <main className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Eventos</h1>
          <p className="text-gray-600">Gerencie seus eventos cadastrados.</p>
        </div>
        <Button
          onClick={() => navigate('/eventos/criar')}
          variant="primary"
          className="gap-2"
        >
          <FiPlus size={18} />
          Novo Evento
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Buscar por nome do evento..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            options={[
              { value: 'todos', label: 'Todos os status' },
              { value: 'ativo', label: 'Ativos' },
              { value: 'encerrado', label: 'Encerrados' },
            ]}
          />
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">
            Nenhum evento encontrado com os filtros aplicados.
          </p>
        </div>
      ) : (
        <Table<Event>
          columns={[
            {
              key: 'name',
              label: 'Nome do Evento',
              render: (value) => <span className="font-semibold">{value}</span>,
            },
            {
              key: 'date',
              label: 'Data e Hora',
              render: (value) => new Date(value).toLocaleString('pt-BR'),
            },
            {
              key: 'location',
              label: 'Local',
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => (
                <span
                  className={clsx(
                    'inline-block px-3 py-1 rounded-full text-sm font-medium',
                    value === 'ativo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  )}
                >
                  {value === 'ativo' ? 'Ativo' : 'Encerrado'}
                </span>
              ),
            },
            {
              key: 'actions',
              label: 'Ações',
              render: (_, event) => (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/eventos/editar/${event.id}`)}
                    title="Editar evento"
                  >
                    <FiEdit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      navigate(`/eventos/${event.id}/regras-checkin`)
                    }
                    title="Configurar regras de check-in"
                  >
                    <FiSettings size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedEvent(event);
                      setDeleteModalOpen(true);
                    }}
                    title="Remover evento"
                  >
                    <FiTrash2 size={16} className="text-error" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={filteredEvents}
          keyExtractor={(event) => event.id}
          emptyMessage="Nenhum evento encontrado"
        />
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedEvent(null);
        }}
        title="Confirmar exclusão"
        isDanger
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedEvent(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              isLoading={deletingId === selectedEvent?.id}
              onClick={() => selectedEvent && handleDelete(selectedEvent.id)}
            >
              Remover
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Tem certeza que deseja remover o evento{' '}
          <strong>{selectedEvent?.name}</strong>?
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </main>
  );
}
