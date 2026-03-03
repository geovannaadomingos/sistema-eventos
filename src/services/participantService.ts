import type { Participant } from '../types/Participant';

let participants: Participant[] = [];

function validateToken(token: string) {
  if (!token || token !== 'fake-jwt-token') {
    throw new Error('Não autorizado');
  }
}

export async function getParticipants(token?: string): Promise<Participant[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const tokenToUse = token ?? localStorage.getItem('token') ?? '';
        validateToken(tokenToUse);
        resolve([...participants]);
      } catch (err) {
        reject(err);
      }
    }, 600);
  });
}

export async function createParticipant(
  token: string | undefined,
  data: Omit<Participant, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Participant> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const tokenToUse = token ?? localStorage.getItem('token') ?? '';
        validateToken(tokenToUse);

        const participant: Participant = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        participants.push(participant);
        resolve(participant);
      } catch (err) {
        reject(err);
      }
    }, 600);
  });
}

export async function updateParticipant(
  token: string | undefined,
  id: string,
  data: Partial<Participant>,
): Promise<Participant> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const tokenToUse = token ?? localStorage.getItem('token') ?? '';
        validateToken(tokenToUse);

        const index = participants.findIndex((p) => p.id === id);
        if (index === -1) throw new Error('Participante não encontrado');

        participants[index] = {
          ...participants[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };

        resolve(participants[index]);
      } catch (err) {
        reject(err);
      }
    }, 600);
  });
}

export async function deleteParticipant(
  token: string | undefined,
  id: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const tokenToUse = token ?? localStorage.getItem('token') ?? '';
        validateToken(tokenToUse);
        participants = participants.filter((p) => p.id !== id);
        resolve();
      } catch (err) {
        reject(err);
      }
    }, 600);
  });
}
