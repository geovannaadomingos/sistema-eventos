import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/eventService';
import EventForm from '../../components/EventForm';
import type { Event } from '../../types/Event';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleCreate(
    data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    try {
      setLoading(true);
      await createEvent(undefined, data);
      navigate('/eventos');
    } catch {
      alert('Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>Criar Evento</h1>
      <EventForm onSubmit={handleCreate} loading={loading} />
    </main>
  );
}
