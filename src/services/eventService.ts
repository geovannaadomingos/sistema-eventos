import type { Event } from "../types/Event";

let events: Event[] = [
    {
        id: "1",
        name: "Tech Conference 2026",
        date: "2026-03-15T18:00:00",
        location: "Recife",
        status: "ativo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Frontend Summit",
        date: "2026-02-10T09:00:00",
        location: "São Paulo",
        status: "encerrado",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

function validateToken(token: string) {
    if (!token || token !== "fake-jwt-token") {
        throw new Error("Não autorizado");
    }
}

export async function getEvents(token: string): Promise<Event[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                validateToken(token);
                resolve([...events]);
            } catch (error) {
                reject(error);
            }
        }, 600);
    });
}

export async function createEvent(
    token: string,
    newEvent: Omit<Event, "id" | "createdAt" | "updatedAt">
): Promise<Event> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                validateToken(token);

                const event: Event = {
                    ...newEvent,
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                events.push(event);
                resolve(event);
            } catch (error) {
                reject(error);
            }
        }, 600);
    });
}

export async function updateEvent(
    token: string,
    id: string,
    updatedData: Partial<Event>
): Promise<Event> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                validateToken(token);

                const index = events.findIndex((e) => e.id === id);

                if (index === -1) {
                    throw new Error("Evento não encontrado");
                }

                events[index] = {
                    ...events[index],
                    ...updatedData,
                    updatedAt: new Date().toISOString(),
                };

                resolve(events[index]);
            } catch (error) {
                reject(error);
            }
        }, 600);
    });
}

export async function deleteEvent(
    token: string,
    id: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                validateToken(token);

                events = events.filter((e) => e.id !== id);
                resolve();
            } catch (error) {
                reject(error);
            }
        }, 600);
    });
}