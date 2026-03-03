import type { DashboardSummary } from '../types/Dashboard';
import { getEvents } from './eventService';
import { getParticipants } from './participantService';

export async function getDashboardSummary(
  token?: string,
): Promise<DashboardSummary> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const events = await getEvents(token);
        const participants = await getParticipants(token);

        const upcomingEvents = events
          .filter((e) => e.status === 'ativo')
          .slice(0, 3)
          .map((e) => ({
            id: e.id,
            name: e.name,
            date: e.date,
          }));

        const recentCheckins = participants
          .filter((p) => p.checkIn)
          .slice(0, 5)
          .map((p) => ({
            participantName: p.name,
            eventName: events.find((e) => e.id === p.eventId)?.name || 'Evento',
            checkinDate: p.updatedAt,
          }));

        resolve({
          totalEvents: events.length,
          totalParticipants: participants.length,
          upcomingEvents,
          recentCheckins,
        });
      } catch (error) {
        reject(error);
      }
    }, 800);
  });
}
