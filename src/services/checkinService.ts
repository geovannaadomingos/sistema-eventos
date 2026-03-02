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
            } catch (error) {
                reject(error);
            }
        }, 600);
    });
}
