import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ParticipantForm from '../../components/ParticipantForm';
import {
  getParticipants,
  updateParticipant,
} from '../../services/participantService';
import { getEvents } from '../../services/eventService';
import type { Participant } from '../../types/Participant';
import type { Event } from '../../types/Event';

export default function EditParticipant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        const [participantsData, eventsData] = await Promise.all([
          getParticipants(),
          getEvents(),
        ]);

        const found = participantsData.find((p) => p.id === id);
        if (!found) throw new Error('Participante não encontrado');

        setParticipant(found);
        setEvents(eventsData);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  async function handleSubmit(data: Partial<Participant>) {
    if (!id) return;

    await updateParticipant(undefined, id, data);
    navigate('/participantes');
  }

  if (loading) return <p>Carregando...</p>;
  if (!participant) return <p>Participante não encontrado.</p>;

  return (
    <main style={{ padding: 32 }}>
      <h1>Editar Participante</h1>
      <ParticipantForm
        events={events}
        initialData={participant}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
