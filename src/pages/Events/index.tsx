import { useEffect, useMemo, useState } from "react";
import { getEvents, deleteEvent } from "../../services/eventService";
import type { Event } from "../../types/Event";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

type StatusFilter = "todos" | "ativo" | "encerrado";

export default function Events() {
  const { isAuthenticated } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);

        if (!isAuthenticated) {
          throw new Error("Usuário não autenticado");
        }

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token não encontrado");
        }

        const response = await getEvents(token);
        setEvents(response);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar eventos");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [isAuthenticated]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "todos" || event.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  async function handleDelete(id: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    const previousEvents = [...events];

    try {
      setDeletingId(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));

      await deleteEvent(token, id);
    } catch (err) {
      setEvents(previousEvents);
      alert("Erro ao remover evento");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <p>Carregando eventos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto" }}>
      <header>
        <h1>Eventos</h1>
        <p>Gerencie seus eventos cadastrados.</p>
      </header>
      <section style={{ marginTop: "32px" }}>
        <h2>Buscar e Filtrar</h2>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "16px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as StatusFilter)
            }
            style={inputStyle}
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="encerrado">Encerrados</option>
          </select>
        </div>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>Lista de Eventos</h2>

        {filteredEvents.length === 0 ? (
          <p style={{ marginTop: "16px" }}>
            Nenhum evento encontrado com os filtros aplicados.
          </p>
        ) : (
          <div style={{ marginTop: "24px", overflowX: "auto" }}>
            <button onClick={() => navigate("/eventos/criar")}>
              Criar Evento
            </button>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Data</th>
                  <th>Local</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>
                      {new Date(event.date).toLocaleString()}
                    </td>
                    <td>{event.location}</td>
                    <td>
                      <span
                        style={{
                          color:
                            event.status === "ativo"
                              ? "green"
                              : "gray",
                          fontWeight: "bold",
                        }}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td>
                      <button style={actionButtonStyle}>
                        Ver
                      </button>
                      <button
                        style={actionButtonStyle}
                        onClick={() => navigate(`/eventos/editar/${event.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        style={{
                          ...actionButtonStyle,
                          color: "red",
                          opacity: deletingId === event.id ? 0.5 : 1,
                        }}
                        disabled={deletingId === event.id}
                        onClick={() => handleDelete(event.id)}
                      >
                        {deletingId === event.id ? "Removendo..." : "Remover"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  minWidth: "200px",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const actionButtonStyle: React.CSSProperties = {
  marginRight: "8px",
  background: "none",
  border: "none",
  cursor: "pointer",
};