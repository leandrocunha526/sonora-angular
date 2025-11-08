import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { validateCpfDetailed } from './utils/cpf-utils';

export function cpfValidatorDetailed(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const result = validateCpfDetailed(value);

    if (result.valid) return null;

    // retornar erro com motivo e dados úteis
    return {
      cpfInvalid: true,
      cleaned: result.cleaned,
    };
  };
}
