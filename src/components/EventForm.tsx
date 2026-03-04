import { useState } from 'react';
import type { Event } from '../types/Event';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Card from './ui/Card';
import Alert from './ui/Alert';

interface Props {
  initialData?: Partial<Event>;
  onSubmit: (
    data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<void>;
  loading?: boolean;
}

export default function EventForm({ initialData, onSubmit, loading }: Props) {
  const [name, setName] = useState(initialData?.name || '');
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().slice(0, 16)
      : '',
  );
  const [location, setLocation] = useState(initialData?.location || '');
  const [status, setStatus] = useState<'ativo' | 'encerrado'>(
    (initialData?.status as 'ativo' | 'encerrado') || 'ativo',
  );
  const [error, setError] = useState<string | null>(null);

  const MIN_DATE = '1900-01-01T00:00';
  const MAX_DATE = '2100-12-31T23:59';

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Nome é obrigatório';
  if (!date) {
    errors.date = 'Data é obrigatória';
  } else {
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    if (!datetimeRegex.test(date)) {
      errors.date = 'Formato de data inválido';
    } else {
      const year = Number(date.slice(0, 4));
      if (Number.isNaN(year) || year < 1900 || year > 2100) {
        errors.date = 'Ano inválido (1900–2100)';
      }
    }
  }
  if (!location) errors.location = 'Local é obrigatório';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (Object.keys(errors).length > 0) {
      setError('Preencha todos os campos corretamente.');
      return;
    }

    try {
      await onSubmit({
        name,
        date,
        location,
        status,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao salvar';
      setError(errorMessage);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {initialData?.id ? 'Editar Evento' : 'Criar Novo Evento'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert type="error" closable onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Input
          label="Nome do Evento *"
          placeholder="Conferência React 2024"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={loading}
          autoFocus
        />

        <Input
          label="Data e Hora *"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={MIN_DATE}
          max={MAX_DATE}
          error={errors.date}
          disabled={loading}
        />

        <Input
          label="Local *"
          placeholder="São Paulo, SP"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          error={errors.location}
          disabled={loading}
        />

        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'ativo' | 'encerrado')}
          disabled={loading}
          options={[
            { value: 'ativo', label: 'Ativo' },
            { value: 'encerrado', label: 'Encerrado' },
          ]}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="flex-1"
          >
            {loading ? 'Salvando...' : 'Salvar Evento'}
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
