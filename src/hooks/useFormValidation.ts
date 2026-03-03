import { useState, useCallback } from 'react';

export type FormErrors = Record<string, string>;

/**
 * Hook para gerenciar validações e erros de formulário.
 */
export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({});

  const addError = useCallback((field: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  const removeError = useCallback((field: string) => {
    setErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const setFieldError = useCallback(
    (field: string, message?: string) => {
      if (message) {
        addError(field, message);
      } else {
        removeError(field);
      }
    },
    [addError, removeError],
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasError = useCallback(
    (field: string) => {
      return !!errors[field];
    },
    [errors],
  );

  return {
    errors,
    addError,
    removeError,
    setFieldError,
    clearErrors,
    hasError,
  };
}
