import type { CheckinRule } from '../types/CheckinRule';

function hasCommonWindow(rules: CheckinRule[]): boolean {
  if (rules.length === 0) return true;

  const maxStart = Math.max(...rules.map((r) => r.startOffsetMinutes));
  const minEnd = Math.min(...rules.map((r) => r.endOffsetMinutes));

  return maxStart <= minEnd;
}

export function validateCheckinRules(rules: CheckinRule[]): string[] {
  const errors: string[] = [];

  const active = rules.filter((r) => r.active);
  const required = active.filter((r) => r.required);

  if (active.length === 0) {
    errors.push('Deve existir pelo menos uma regra ativa.');
  }

  if (required.length > 1 && !hasCommonWindow(required)) {
    errors.push(
      'Existem regras obrigatórias com janelas de validação incompatíveis. Não há um período onde todas as regras obrigatórias podem coexistir.',
    );
  }

  return errors;
}
