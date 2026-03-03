import type { CheckinRule } from "../types/CheckinRule";

let rules: CheckinRule[] = [];

function validateToken(token: string) {
    if (!token || token !== "fake-jwt-token") {
        throw new Error("Não autorizado");
    }
}

export async function getCheckinRules(
    token: string,
    eventId: string
): Promise<CheckinRule[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                validateToken(token);
                resolve(rules.filter((r) => r.eventId === eventId));
            } catch (err) {
                reject(err);
            }
        }, 600);
    });
}

export async function createCheckinRule(
    token: string,
    data: Omit<CheckinRule, "id" | "createdAt" | "updatedAt">
): Promise<CheckinRule> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                validateToken(token);

                const rule: CheckinRule = {
                    ...data,
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                rules.push(rule);
                resolve(rule);
            } catch (err) {
                reject(err);
            }
        }, 600);
    });
}

export async function updateCheckinRule(
    token: string,
    id: string,
    data: Partial<CheckinRule>
): Promise<CheckinRule> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                validateToken(token);

                const index = rules.findIndex((r) => r.id === id);
                if (index === -1) throw new Error("Regra não encontrada");

                rules[index] = {
                    ...rules[index],
                    ...data,
                    updatedAt: new Date().toISOString(),
                };

                resolve(rules[index]);
            } catch (err) {
                reject(err);
            }
        }, 600);
    });
}

export async function deleteCheckinRule(
    token: string,
    id: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                validateToken(token);
                rules = rules.filter((r) => r.id !== id);
                resolve();
            } catch (err) {
                reject(err);
            }
        }, 600);
    });
}