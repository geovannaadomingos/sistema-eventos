import type { CheckinRule } from "../types/CheckinRule";

function hasIntersection(a: CheckinRule, b: CheckinRule) {
    return (
        a.startOffsetMinutes <= b.endOffsetMinutes &&
        b.startOffsetMinutes <= a.endOffsetMinutes
    );
}

export function validateCheckinRules(rules: CheckinRule[]): string[] {
    const errors: string[] = [];

    const active = rules.filter((r) => r.active);
    const required = active.filter((r) => r.required);

    if (active.length === 0) {
        errors.push("Deve existir pelo menos uma regra ativa.");
    }

    if (required.length === 0) {
        errors.push("Deve existir pelo menos uma regra obrigatória ativa.");
    }

    for (let i = 0; i < required.length; i++) {
        for (let j = i + 1; j < required.length; j++) {
            if (!hasIntersection(required[i], required[j])) {
                errors.push(
                    "Existem regras obrigatórias com janelas de validação incompatíveis."
                );
            }
        }
    }

    return errors;
}