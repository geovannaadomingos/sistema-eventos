import { useEffect, useMemo, useState } from "react";
import { getParticipants, deleteParticipant } from "../../services/participantService";
import { getEvents } from "../../services/eventService";
import type { Participant } from "../../types/Participant";
import type { Event } from "../../types/Event";
import { useNavigate } from "react-router-dom";

export default function Participants() {
  const navigate = useNavigate();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("todos");
  const [checkInFilter, setCheckInFilter] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);
        const [p, e] = await Promise.all([
          getParticipants(token),
          getEvents(token),
        ]);
        setParticipants(p);
        setEvents(e);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return participants.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(search.toLowerCase());

      const matchesEvent =
        eventFilter === "todos" || p.eventId === eventFilter;

      const matchesCheckIn =
        checkInFilter === "todos" ||
        (checkInFilter === "feito" && p.checkIn) ||
        (checkInFilter === "nao" && !p.checkIn);

      return matchesName && matchesEvent && matchesCheckIn;
    });
  }, [participants, search, eventFilter, checkInFilter]);

  async function handleDelete(id: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    const previous = [...participants];

    try {
      setParticipants((prev) => prev.filter((p) => p.id !== id));
      await deleteParticipant(token, id);
    } catch {
      setParticipants(previous);
      alert("Erro ao remover participante");
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main style={{ padding: 32 }}>
      <h1>Participantes</h1>

      <button onClick={() => navigate("/participantes/criar")}>
        Cadastrar Participante
      </button>

      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setEventFilter(e.target.value)}>
          <option value="todos">Todos eventos</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        <select onChange={(e) => setCheckInFilter(e.target.value)}>
          <option value="todos">Check-in</option>
          <option value="feito">Feito</option>
          <option value="nao">Não feito</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>Nenhum participante encontrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Evento</th>
              <th>Check-in</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const event = events.find((e) => e.id === p.eventId);
              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{event?.name || "Evento removido"}</td>
                  <td>{p.checkIn ? "✔" : "—"}</td>
                  <td>
                    <button onClick={() => navigate(`/participantes/editar/${p.id}`)}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(p.id)}>
                      Remover
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}