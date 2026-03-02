import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../services/dashboardService";
import type { DashboardSummary } from "../../types/Dashboard";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
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

        const response = await getDashboardSummary(token);
        setData(response);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [isAuthenticated]);

  if (loading) return <p>Carregando dashboard...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!data) return <p>Nenhum dado disponível.</p>;

  return (
    <main style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto" }}>
      <header>
        <h1>Painel do Organizador</h1>
        <p>Visão geral dos seus eventos e participantes.</p>
      </header>

      <section style={{ marginTop: "32px" }}>
        <h2>Resumo</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <div style={cardStyle}>
            <h3>Total de Eventos</h3>
            <p style={bigNumberStyle}>{data.totalEvents}</p>
          </div>

          <div style={cardStyle}>
            <h3>Total de Participantes</h3>
            <p style={bigNumberStyle}>{data.totalParticipants}</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>Próximos Eventos</h2>

        {data.upcomingEvents.length === 0 ? (
          <p>Nenhum evento ativo encontrado.</p>
        ) : (
          <ul style={{ marginTop: "16px" }}>
            {data.upcomingEvents.map((event) => (
              <li key={event.id}>
                <strong>{event.name}</strong>
                <br />
                <small>{new Date(event.date).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>Últimos Check-ins</h2>

        {data.recentCheckins.length === 0 ? (
          <p>Nenhum check-in recente.</p>
        ) : (
          <ul style={{ marginTop: "16px" }}>
            {data.recentCheckins.map((checkin, index) => (
              <li key={index}>
                <strong>{checkin.participantName}</strong> no evento{" "}
                <strong>{checkin.eventName}</strong>
                <br />
                <small>
                  {new Date(checkin.checkinDate).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  padding: "16px",
  border: "1px solid #ddd",
  borderRadius: "8px",
};

const bigNumberStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "bold",
};