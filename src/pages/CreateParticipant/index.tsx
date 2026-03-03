import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticipantForm from '../../components/ParticipantForm';
import { createParticipant } from '../../services/participantService';
import { getEvents } from '../../services/eventService';
import type { Event } from '../../types/Event';
import type { Participant } from '../../types/Participant';

export default function CreateParticipant() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  async function handleSubmit(
    data: Omit<Participant, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    await createParticipant(undefined, data);
    navigate('/participantes');
  }

  if (loading) return <p>Carregando eventos...</p>;

  return (
    <main style={{ padding: 32 }}>
      <h1>Criar Participante</h1>
      <ParticipantForm events={events} onSubmit={handleSubmit} />
    </main>
  );
}
