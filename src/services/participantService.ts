import type { Participant } from "../types/Participant";

let participants: Participant[] = [
    {
        id: "1",
        name: "Maria Silva",
        email: "maria@email.com",
        eventId: "1",
        checkedIn: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "João Souza",
        email: "joao@email.com",
        eventId: "1",
        checkedIn: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

function validateToken(token: string) {
    if (!token || token !== "fake-jwt-token") {
        throw new Error("Não autorizado");
    }
}

export async function getParticipants(
    token: string
): Promise<Participant[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                validateToken(token);
                resolve([...participants]);
            } catch (error) {
                reject(error);
            }
        }, 600);
    });
}