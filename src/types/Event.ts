export type EventStatus = "ativo" | "encerrado";

export interface Event {
    id: string;
    name: string;
    date: string; // ISO string (ex: 2026-03-10T18:00:00)
    location: string;
    status: EventStatus;
    createdAt: string;
    updatedAt: string;
}