import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEvents, updateEvent } from '../../services/eventService';
import EventForm from '../../components/EventForm';
import type { Event } from '../../types/Event';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      if (!id) return;

      try {
        const events = await getEvents();
        const found = events.find((e) => e.id === id);
        if (!found) throw new Error('Evento não encontrado');
        setEvent(found);
      } catch {
        alert('Erro ao carregar evento');
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  async function handleUpdate(data: Partial<Event>) {
    if (!id) return;

    try {
      await updateEvent(undefined, id, data);
      navigate('/eventos');
    } catch {
      alert('Erro ao atualizar evento');
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (!event) return <p>Evento não encontrado</p>;

  return (
    <main style={{ padding: 32 }}>
      <h1>Editar Evento</h1>
      <EventForm initialData={event} onSubmit={handleUpdate} />
    </main>
  );
}
