import { useState, useCallback } from 'react';

type ValidationRule<T> = (value: T[keyof T], values: T) => string | null;
type ValidationRules<T> = Partial<Record<keyof T, ValidationRule<T>[]>>;

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export function useFormState<T extends Record<string, any>>(initialValues: T, validationRules?: ValidationRules<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false,
  });

  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setState(prev => {
      const newValues = { ...prev.values, [field]: value };
      const fieldErrors = validateField(field, value, newValues, validationRules);
      const newErrors = { ...prev.errors, [field]: fieldErrors };
      const isValid = Object.values(newErrors).every(e => !e);
      return { ...prev, values: newValues, errors: newErrors, touched: { ...prev.touched, [field]: true }, isValid, isDirty: true };
    });
  }, [validationRules]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setState(prev => ({ ...prev, touched: { ...prev.touched, [field]: true } }));
  }, []);

  const validateAll = useCallback((): boolean => {
    if (!validationRules) return true;
    const errors: Partial<Record<keyof T, string>> = {};
    let isValid = true;
    for (const field of Object.keys(validationRules) as (keyof T)[]) {
      const error = validateField(field, state.values[field], state.values, validationRules);
      if (error) { errors[field] = error; isValid = false; }
    }
    setState(prev => ({ ...prev, errors, isValid }));
    return isValid;
  }, [state.values, validationRules]);

  const reset = useCallback(() => {
    setState({ values: initialValues, errors: {}, touched: {}, isSubmitting: false, isValid: true, isDirty: false });
  }, [initialValues]);

  return { ...state, setValue, setFieldTouched, validateAll, reset };
}

function validateField<T extends Record<string, any>>(field: keyof T, value: T[keyof T], values: T, rules?: ValidationRules<T>): string | null {
  const fieldRules = rules?.[field];
  if (!fieldRules) return null;
  for (const rule of fieldRules) { const error = rule(value, values); if (error) return error; }
  return null;
}