export interface DashboardSummary {
    totalEvents: number;
    totalParticipants: number;
    upcomingEvents: {
        id: string;
        name: string;
        date: string;
    }[];
    recentCheckins: {
        participantName: string;
        eventName: string;
        checkinDate: string;
    }[];
}