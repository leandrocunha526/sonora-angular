export type CpfValidationResult = {
  valid: boolean;
  cleaned?: string; // cpf sem máscara
  calculatedFirstDigit?: number;
  calculatedSecondDigit?: number;
};

export function validateCpfDetailed(
  input: string | null | undefined
): CpfValidationResult {
  const raw = (input ?? '').toString();
  const cpf = raw.replace(/\D/g, '');

  if (cpf.length !== 11) {
    return {
      valid: false,
      cleaned: cpf,
    };
  }

  // Rejeita sequências repetidas (ex.: 00000000000, 11111111111)
  if (/^(\d)\1+$/.test(cpf)) {
    return {
      valid: false,
      cleaned: cpf,
    };
  }

  const digits = cpf.split('').map((d) => parseInt(d, 10));

  // calcula 1º dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  const firstDV = rest;

  if (firstDV !== digits[9]) {
    return {
      valid: false,
      cleaned: cpf,
      calculatedFirstDigit: firstDV,
    };
  }

  // calcula 2º dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  const secondDV = rest;

  if (secondDV !== digits[10]) {
    return {
      valid: false,
      cleaned: cpf,
      calculatedFirstDigit: firstDV,
      calculatedSecondDigit: secondDV,
    };
  }

  return {
    valid: true,
    cleaned: cpf,
    calculatedFirstDigit: firstDV,
    calculatedSecondDigit: secondDV,
  };
}
