import { FormControl } from '@angular/forms';
import { cpfValidatorDetailed } from './cpf-validator';

describe('cpfValidatorDetailed', () => {
  let validator: ReturnType<typeof cpfValidatorDetailed>;

  beforeEach(() => {
    validator = cpfValidatorDetailed();
  });

  describe('valid CPFs', () => {
    it('should return null for valid CPF without formatting', () => {
      const control = new FormControl('11144477735');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for valid CPF with formatting', () => {
      const control = new FormControl('111.444.777-35');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for another valid CPF', () => {
      const control = new FormControl('52998224725');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for CPF with special characters', () => {
      const control = new FormControl('529.982.247-25');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for CPF 123.456.789-09', () => {
      const control = new FormControl('123.456.789-09');
      const result = validator(control);
      expect(result).toBeNull();
    });

    it('should return null for valid CPF with spaces', () => {
      const control = new FormControl(' 111.444.777-35 ');
      const result = validator(control);
      expect(result).toBeNull();
    });
  });

  describe('invalid CPFs', () => {
    it('should return error object for CPF with incorrect length', () => {
      const control = new FormControl('123456789');
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: '123456789'
      });
    });

    it('should return error object for empty string', () => {
      const control = new FormControl('');
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: ''
      });
    });

    it('should return error object for CPF with all zeros', () => {
      const control = new FormControl('00000000000');
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: '00000000000'
      });
    });

    it('should return error object for CPF with all ones', () => {
      const control = new FormControl('11111111111');
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: '11111111111'
      });
    });

    it('should return error object for CPF with invalid first check digit', () => {
      const control = new FormControl('11144477745');
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: '11144477745'
      });
    });

    it('should return error object for CPF with invalid second check digit', () => {
      const control = new FormControl('11144477734');
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: '11144477734'
      });
    });

    it('should return error object for formatted CPF with invalid digits', () => {
      const control = new FormControl('111.444.777-00');
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: '11144477700'
      });
    });

    it('should return error object for CPF with too many digits', () => {
      const control = new FormControl('123456789012');
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: '123456789012'
      });
    });

    it('should return error object for CPF with too few digits', () => {
      const control = new FormControl('1234567');
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: '1234567'
      });
    });
  });

  describe('null and undefined values', () => {
    it('should return error object for null value', () => {
      const control = new FormControl(null);
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: ''
      });
    });

    it('should return error object for undefined value', () => {
      const control = new FormControl(undefined);
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: ''
      });
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace-only input', () => {
      const control = new FormControl('   ');
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: ''
      });
    });

    it('should handle CPF with only special characters', () => {
      const control = new FormControl('...-');
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: ''
      });
    });

    it('should handle CPF with letters mixed in', () => {
      const control = new FormControl('111ABC77735');
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: '11177735'
      });
    });
  });

  describe('validator function behavior', () => {
    it('should be reusable across multiple controls', () => {
      const control1 = new FormControl('11144477735');
      const control2 = new FormControl('52998224725');
      
      expect(validator(control1)).toBeNull();
      expect(validator(control2)).toBeNull();
    });

    it('should provide consistent results for same input', () => {
      const control = new FormControl('11144477735');
      
      expect(validator(control)).toBeNull();
      expect(validator(control)).toBeNull();
      expect(validator(control)).toBeNull();
    });

    it('should update validation when control value changes', () => {
      const control = new FormControl('11144477735');
      expect(validator(control)).toBeNull();
      
      control.setValue('00000000000');
      const result = validator(control);
      expect(result).toEqual({
        cpfInvalid: true,
        cleaned: '00000000000'
      });
    });
  });

  describe('error object structure', () => {
    it('should always include cpfInvalid flag in error object', () => {
      const control = new FormControl('invalid');
      const result = validator(control);
      expect(result).toBeTruthy();
      expect(result!.cpfInvalid).toBe(true);
    });

    it('should always include cleaned value in error object', () => {
      const control = new FormControl('111.444.777-00');
      const result = validator(control);
      expect(result).toBeTruthy();
      expect(result!.cleaned).toBe('11144477700');
    });
  });

  describe('integration with Angular forms', () => {
    it('should work with FormControl touched state', () => {
      const control = new FormControl('invalid');
      control.markAsTouched();
      const result = validator(control);
      expect(result).toBeTruthy();
      expect(control.touched).toBe(true);
    });

    it('should work with FormControl dirty state', () => {
      const control = new FormControl('invalid');
      control.markAsDirty();
      const result = validator(control);
      expect(result).toBeTruthy();
      expect(control.dirty).toBe(true);
    });

    it('should work with pristine control', () => {
      const control = new FormControl('11144477735');
      const result = validator(control);
      expect(result).toBeNull();
      expect(control.pristine).toBe(true);
    });
  });

  describe('repeated digit patterns', () => {
    it('should reject all variations of repeated digits', () => {
      const repeatedPatterns = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
      ];

      repeatedPatterns.forEach(pattern => {
        const control = new FormControl(pattern);
        const result = validator(control);
        expect(result).toEqual({
          cpfInvalid: true,
          cleaned: pattern
        });
      });
    });
  });
});