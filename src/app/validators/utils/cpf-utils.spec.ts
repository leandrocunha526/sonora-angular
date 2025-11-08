import { validateCpfDetailed, CpfValidationResult } from './cpf-utils';

describe('cpf-utils', () => {
  describe('validateCpfDetailed', () => {
    describe('valid CPFs', () => {
      it('should validate a correct CPF without formatting', () => {
        const result = validateCpfDetailed('11144477735');
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('11144477735');
        expect(result.calculatedFirstDigit).toBe(3);
        expect(result.calculatedSecondDigit).toBe(5);
      });

      it('should validate a correct CPF with formatting (dots and dash)', () => {
        const result = validateCpfDetailed('111.444.777-35');
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('11144477735');
        expect(result.calculatedFirstDigit).toBe(3);
        expect(result.calculatedSecondDigit).toBe(5);
      });

      it('should validate another correct CPF', () => {
        const result = validateCpfDetailed('52998224725');
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('52998224725');
        expect(result.calculatedFirstDigit).toBe(2);
        expect(result.calculatedSecondDigit).toBe(5);
      });

      it('should validate CPF with special characters', () => {
        const result = validateCpfDetailed('529.982.247-25');
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('52998224725');
      });

      it('should validate CPF with mixed formatting', () => {
        const result = validateCpfDetailed('111 444 777-35');
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('11144477735');
      });

      it('should validate CPF 00000000191', () => {
        const result = validateCpfDetailed('00000000191');
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('00000000191');
      });
    });

    describe('invalid CPFs - incorrect length', () => {
      it('should reject CPF with less than 11 digits', () => {
        const result = validateCpfDetailed('123456789');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('123456789');
        expect(result.calculatedFirstDigit).toBeUndefined();
        expect(result.calculatedSecondDigit).toBeUndefined();
      });

      it('should reject CPF with more than 11 digits', () => {
        const result = validateCpfDetailed('123456789012');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('123456789012');
      });

      it('should reject empty string', () => {
        const result = validateCpfDetailed('');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('');
      });

      it('should reject CPF with only special characters', () => {
        const result = validateCpfDetailed('...-');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('');
      });
    });

    describe('invalid CPFs - repeated digits', () => {
      it('should reject CPF with all zeros', () => {
        const result = validateCpfDetailed('00000000000');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('00000000000');
      });

      it('should reject CPF with all ones', () => {
        const result = validateCpfDetailed('11111111111');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('11111111111');
      });

      it('should reject CPF with all twos', () => {
        const result = validateCpfDetailed('22222222222');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('22222222222');
      });

      it('should reject CPF with all threes', () => {
        const result = validateCpfDetailed('33333333333');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('33333333333');
      });

      it('should reject CPF with all fours', () => {
        const result = validateCpfDetailed('44444444444');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('44444444444');
      });

      it('should reject CPF with all fives', () => {
        const result = validateCpfDetailed('55555555555');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('55555555555');
      });

      it('should reject CPF with all sixes', () => {
        const result = validateCpfDetailed('66666666666');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('66666666666');
      });

      it('should reject CPF with all sevens', () => {
        const result = validateCpfDetailed('77777777777');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('77777777777');
      });

      it('should reject CPF with all eights', () => {
        const result = validateCpfDetailed('88888888888');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('88888888888');
      });

      it('should reject CPF with all nines', () => {
        const result = validateCpfDetailed('99999999999');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('99999999999');
      });

      it('should reject formatted CPF with all zeros', () => {
        const result = validateCpfDetailed('000.000.000-00');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('00000000000');
      });
    });

    describe('invalid CPFs - incorrect check digits', () => {
      it('should reject CPF with invalid first check digit', () => {
        const result = validateCpfDetailed('11144477745');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('11144477745');
        expect(result.calculatedFirstDigit).toBe(3);
      });

      it('should reject CPF with invalid second check digit', () => {
        const result = validateCpfDetailed('11144477734');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('11144477734');
        expect(result.calculatedFirstDigit).toBe(3);
        expect(result.calculatedSecondDigit).toBe(5);
      });

      it('should reject CPF with both check digits invalid', () => {
        const result = validateCpfDetailed('11144477700');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('11144477700');
        expect(result.calculatedFirstDigit).toBe(3);
      });

      it('should reject formatted CPF with invalid check digits', () => {
        const result = validateCpfDetailed('111.444.777-00');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('11144477700');
      });
    });

    describe('edge cases - null and undefined inputs', () => {
      it('should handle null input', () => {
        const result = validateCpfDetailed(null);
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('');
      });

      it('should handle undefined input', () => {
        const result = validateCpfDetailed(undefined);
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('');
      });

      it('should handle whitespace-only input', () => {
        const result = validateCpfDetailed('   ');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('');
      });
    });

    describe('edge cases - various input formats', () => {
      it('should handle CPF with extra spaces', () => {
        const result = validateCpfDetailed(' 111.444.777-35 ');
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('11144477735');
      });

      it('should handle CPF with unusual separators', () => {
        const result = validateCpfDetailed('111/444/777-35');
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('11144477735');
      });

      it('should handle CPF with parentheses', () => {
        const result = validateCpfDetailed('(111)444.777-35');
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('11144477735');
      });

      it('should reject CPF with letters', () => {
        const result = validateCpfDetailed('111ABC77735');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('11177735');
      });
    });

    describe('boundary conditions for check digit calculation', () => {
      it('should handle CPF where remainder calculation results in 10', () => {
        // Test case where modulo operation might result in 10 (should become 0)
        const result = validateCpfDetailed('12345678909');
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('12345678909');
      });

      it('should correctly calculate when first check digit is 0', () => {
        const result = validateCpfDetailed('11111111100');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('11111111100');
      });

      it('should correctly calculate when second check digit is 0', () => {
        const result = validateCpfDetailed('11144477730');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('11144477730');
      });
    });

    describe('type coercion and toString behavior', () => {
      it('should handle numeric input by converting to string', () => {
        const result = validateCpfDetailed('11144477735' as any);
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('11144477735');
      });
    });

    describe('real-world valid CPFs', () => {
      it('should validate CPF 123.456.789-09', () => {
        const result = validateCpfDetailed('123.456.789-09');
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('12345678909');
      });

      it('should validate CPF 111.444.777-35', () => {
        const result = validateCpfDetailed('111.444.777-35');
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('11144477735');
      });

      it('should validate CPF 529.982.247-25', () => {
        const result = validateCpfDetailed('529.982.247-25');
        expect(result.valid).toBe(true);
        expect(result.cleaned).toBe('52998224725');
      });
    });

    describe('return value structure', () => {
      it('should return all expected fields for valid CPF', () => {
        const result: CpfValidationResult = validateCpfDetailed('11144477735');
        expect(result).toEqual({
          valid: true,
          cleaned: '11144477735',
          calculatedFirstDigit: 3,
          calculatedSecondDigit: 5
        });
      });

      it('should return appropriate fields for invalid length', () => {
        const result: CpfValidationResult = validateCpfDetailed('123');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('123');
        expect(result.calculatedFirstDigit).toBeUndefined();
        expect(result.calculatedSecondDigit).toBeUndefined();
      });

      it('should return appropriate fields for repeated digits', () => {
        const result: CpfValidationResult = validateCpfDetailed('11111111111');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('11111111111');
        expect(result.calculatedFirstDigit).toBeUndefined();
        expect(result.calculatedSecondDigit).toBeUndefined();
      });

      it('should return appropriate fields for invalid first digit', () => {
        const result: CpfValidationResult = validateCpfDetailed('11144477745');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('11144477745');
        expect(result.calculatedFirstDigit).toBe(3);
        expect(result.calculatedSecondDigit).toBeUndefined();
      });

      it('should return appropriate fields for invalid second digit', () => {
        const result: CpfValidationResult = validateCpfDetailed('11144477734');
        expect(result.valid).toBe(false);
        expect(result.cleaned).toBe('11144477734');
        expect(result.calculatedFirstDigit).toBe(3);
        expect(result.calculatedSecondDigit).toBe(5);
      });
    });
  });
});