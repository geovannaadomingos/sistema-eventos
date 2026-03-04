import { useState } from 'react';
import type { Participant } from '../types/Participant';
import type { Event } from '../types/Event';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Checkbox from './ui/Checkbox';
import Card from './ui/Card';
import Alert from './ui/Alert';

interface Props {
  events: Event[];
  initialData?: Partial<Participant>;
  onSubmit: (
    data: Omit<Participant, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<void>;
  loading?: boolean;
}

export default function ParticipantForm({
  events,
  initialData,
  onSubmit,
  loading,
}: Props) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [eventId, setEventId] = useState(initialData?.eventId || '');
  const [checkIn, setCheckIn] = useState(initialData?.checkIn || false);
  const [error, setError] = useState<string | null>(null);

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Nome é obrigatório';
  if (!email) errors.email = 'Email é obrigatório';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Email inválido';
  if (!eventId) errors.eventId = 'Evento é obrigatório';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (Object.keys(errors).length > 0) {
      setError('Preencha todos os campos corretamente.');
      return;
    }

    try {
      await onSubmit({ name, email, eventId, checkIn });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao salvar';
      setError(errorMessage);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {initialData?.id ? 'Editar Participante' : 'Cadastrar Participante'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert type="error" closable onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Input
          label="Nome Completo *"
          placeholder="João da Silva"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={loading}
          autoFocus
        />

        <Input
          label="Email *"
          type="email"
          placeholder="joao@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={loading}
        />

        <Select
          label="Evento *"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          error={errors.eventId}
          disabled={loading}
        >
          <option value="">Selecione um evento</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </Select>

        <Checkbox
          label="Check-in realizado"
          checked={checkIn}
          onChange={(e) => setCheckIn(e.target.checked)}
          disabled={loading}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="flex-1"
          >
            {loading ? 'Salvando...' : 'Salvar Participante'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
