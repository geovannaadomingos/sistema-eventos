import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../../services/dashboardService';
import type { DashboardSummary } from '../../types/Dashboard';
import { FiCalendar, FiUsers } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';

export default function Dashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);

        const response = await getDashboardSummary();
        setData(response);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao carregar dashboard';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Carregando dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert type="error" title="Erro ao carregar dashboard">
          {error}
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <Alert type="info">Nenhum dado disponível.</Alert>
      </div>
    );
  }

  return (
    <main className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Painel do Organizador
        </h1>
        <p className="text-gray-600">
          Visão geral dos seus eventos e participantes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100">
              <FiCalendar className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Total de Eventos Cadastrados</p>
            <p className="text-3xl font-bold text-gray-900">
              {data.totalEvents}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-secondary-100">
              <FiUsers className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Total de Participantes</p>
            <p className="text-3xl font-bold text-gray-900">
              {data.totalParticipants}
            </p>
          </div>
        </Card>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Próximos Eventos <span className="text-base font-normal text-gray-500">(Ativos)</span>
        </h2>

        {data.upcomingEvents.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">
              Nenhum evento ativo encontrado.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {data.upcomingEvents.map((event) => (
              <Card
                key={event.id}
                className="flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{event.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(event.date).toLocaleString('pt-BR')}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Últimos Check-ins
        </h2>

        {data.recentCheckins.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">
              Nenhum check-in recente.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {data.recentCheckins.map((checkin, index) => (
              <Card key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {checkin.participantName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Evento: {checkin.eventName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(checkin.checkinDate).toLocaleString('pt-BR')}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
