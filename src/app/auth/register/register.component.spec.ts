import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['register']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize registerForm with empty values', () => {
      expect(component.registerForm).toBeDefined();
      expect(component.registerForm.get('name')?.value).toBe('');
      expect(component.registerForm.get('username')?.value).toBe('');
      expect(component.registerForm.get('cpf')?.value).toBe('');
      expect(component.registerForm.get('password')?.value).toBe('');
    });

    it('should initialize error as null', () => {
      expect(component.error).toBeNull();
    });

    it('should initialize isSubmitting as false', () => {
      expect(component.isSubmitting).toBe(false);
    });
  });

  describe('Form Validation - Name Field', () => {
    it('should be invalid when name is empty', () => {
      component.registerForm.controls['name'].setValue('');
      expect(component.registerForm.controls['name'].hasError('required')).toBe(true);
      expect(component.registerForm.controls['name'].valid).toBe(false);
    });

    it('should be valid when name is provided', () => {
      component.registerForm.controls['name'].setValue('John Doe');
      expect(component.registerForm.controls['name'].valid).toBe(true);
    });

    it('should reject name exceeding 100 characters', () => {
      const longName = 'a'.repeat(101);
      component.registerForm.controls['name'].setValue(longName);
      expect(component.registerForm.controls['name'].hasError('maxlength')).toBe(true);
    });

    it('should accept name with exactly 100 characters', () => {
      const maxName = 'a'.repeat(100);
      component.registerForm.controls['name'].setValue(maxName);
      expect(component.registerForm.controls['name'].valid).toBe(true);
    });

    it('should accept name with special characters', () => {
      component.registerForm.controls['name'].setValue('José da Silva-Santos');
      expect(component.registerForm.controls['name'].valid).toBe(true);
    });
  });

  describe('Form Validation - Username Field', () => {
    it('should be invalid when username is empty', () => {
      component.registerForm.controls['username'].setValue('');
      expect(component.registerForm.controls['username'].hasError('required')).toBe(true);
    });

    it('should be invalid when username is less than 3 characters', () => {
      component.registerForm.controls['username'].setValue('ab');
      expect(component.registerForm.controls['username'].hasError('minlength')).toBe(true);
    });

    it('should be valid when username is exactly 3 characters', () => {
      component.registerForm.controls['username'].setValue('abc');
      expect(component.registerForm.controls['username'].valid).toBe(true);
    });

    it('should be valid with normal username', () => {
      component.registerForm.controls['username'].setValue('testuser');
      expect(component.registerForm.controls['username'].valid).toBe(true);
    });

    it('should reject username exceeding 100 characters', () => {
      const longUsername = 'a'.repeat(101);
      component.registerForm.controls['username'].setValue(longUsername);
      expect(component.registerForm.controls['username'].hasError('maxlength')).toBe(true);
    });

    it('should accept username with exactly 100 characters', () => {
      const maxUsername = 'a'.repeat(100);
      component.registerForm.controls['username'].setValue(maxUsername);
      expect(component.registerForm.controls['username'].valid).toBe(true);
    });
  });

  describe('Form Validation - CPF Field', () => {
    it('should be invalid when CPF is empty', () => {
      component.registerForm.controls['cpf'].setValue('');
      expect(component.registerForm.controls['cpf'].hasError('required')).toBe(true);
    });

    it('should be valid with correct CPF', () => {
      component.registerForm.controls['cpf'].setValue('11144477735');
      expect(component.registerForm.controls['cpf'].valid).toBe(true);
    });

    it('should be valid with formatted CPF', () => {
      component.registerForm.controls['cpf'].setValue('111.444.777-35');
      expect(component.registerForm.controls['cpf'].valid).toBe(true);
    });

    it('should be invalid with incorrect CPF', () => {
      component.registerForm.controls['cpf'].setValue('11144477700');
      expect(component.registerForm.controls['cpf'].hasError('cpfInvalid')).toBe(true);
    });

    it('should be invalid with repeated digits CPF', () => {
      component.registerForm.controls['cpf'].setValue('11111111111');
      expect(component.registerForm.controls['cpf'].hasError('cpfInvalid')).toBe(true);
    });

    it('should be invalid with short CPF', () => {
      component.registerForm.controls['cpf'].setValue('123456789');
      expect(component.registerForm.controls['cpf'].hasError('cpfInvalid')).toBe(true);
    });

    it('should be invalid with CPF containing letters', () => {
      component.registerForm.controls['cpf'].setValue('111ABC77735');
      expect(component.registerForm.controls['cpf'].hasError('cpfInvalid')).toBe(true);
    });

    it('should accept another valid CPF', () => {
      component.registerForm.controls['cpf'].setValue('52998224725');
      expect(component.registerForm.controls['cpf'].valid).toBe(true);
    });
  });

  describe('Form Validation - Password Field', () => {
    it('should be invalid when password is empty', () => {
      component.registerForm.controls['password'].setValue('');
      expect(component.registerForm.controls['password'].hasError('required')).toBe(true);
    });

    it('should be invalid when password is less than 6 characters', () => {
      component.registerForm.controls['password'].setValue('12345');
      expect(component.registerForm.controls['password'].hasError('minlength')).toBe(true);
    });

    it('should be valid when password is exactly 6 characters', () => {
      component.registerForm.controls['password'].setValue('123456');
      expect(component.registerForm.controls['password'].valid).toBe(true);
    });

    it('should be valid with normal password', () => {
      component.registerForm.controls['password'].setValue('password123');
      expect(component.registerForm.controls['password'].valid).toBe(true);
    });

    it('should reject password exceeding 100 characters', () => {
      const longPassword = 'a'.repeat(101);
      component.registerForm.controls['password'].setValue(longPassword);
      expect(component.registerForm.controls['password'].hasError('maxlength')).toBe(true);
    });

    it('should accept password with exactly 100 characters', () => {
      const maxPassword = 'a'.repeat(100);
      component.registerForm.controls['password'].setValue(maxPassword);
      expect(component.registerForm.controls['password'].valid).toBe(true);
    });

    it('should accept password with special characters', () => {
      component.registerForm.controls['password'].setValue('P@ssw0rd!#$');
      expect(component.registerForm.controls['password'].valid).toBe(true);
    });
  });

  describe('Form Validation - Overall Form', () => {
    it('should be invalid when all fields are empty', () => {
      expect(component.registerForm.valid).toBe(false);
    });

    it('should be invalid when only some fields are filled', () => {
      component.registerForm.controls['name'].setValue('John Doe');
      component.registerForm.controls['username'].setValue('johndoe');
      expect(component.registerForm.valid).toBe(false);
    });

    it('should be valid when all fields are correctly filled', () => {
      component.registerForm.controls['name'].setValue('John Doe');
      component.registerForm.controls['username'].setValue('johndoe');
      component.registerForm.controls['cpf'].setValue('11144477735');
      component.registerForm.controls['password'].setValue('password123');
      expect(component.registerForm.valid).toBe(true);
    });

    it('should be invalid if any field is invalid', () => {
      component.registerForm.controls['name'].setValue('John Doe');
      component.registerForm.controls['username'].setValue('johndoe');
      component.registerForm.controls['cpf'].setValue('00000000000'); // Invalid CPF
      component.registerForm.controls['password'].setValue('password123');
      expect(component.registerForm.valid).toBe(false);
    });
  });

  describe('onSubmit Method - Happy Path', () => {
    beforeEach(() => {
      component.registerForm.controls['name'].setValue('John Doe');
      component.registerForm.controls['username'].setValue('johndoe');
      component.registerForm.controls['cpf'].setValue('11144477735');
      component.registerForm.controls['password'].setValue('password123');
    });

    it('should call authService.register with correct payload', () => {
      authService.register.and.returnValue(of({}));
      
      component.onSubmit();
      
      expect(authService.register).toHaveBeenCalledWith({
        name: 'John Doe',
        username: 'johndoe',
        cpf: '11144477735',
        password: 'password123'
      });
    });

    it('should set isSubmitting to true during submission', () => {
      authService.register.and.returnValue(of({}));
      
      component.onSubmit();
      
      expect(component.isSubmitting).toBe(true);
    });

    it('should clear error message before submission', () => {
      component.error = 'Previous error';
      authService.register.and.returnValue(of({}));
      
      component.onSubmit();
      
      expect(component.error).toBeNull();
    });

    it('should navigate to login page on successful registration', () => {
      authService.register.and.returnValue(of({}));
      
      component.onSubmit();
      
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle formatted CPF in submission', () => {
      component.registerForm.controls['cpf'].setValue('111.444.777-35');
      authService.register.and.returnValue(of({}));
      
      component.onSubmit();
      
      expect(authService.register).toHaveBeenCalledWith({
        name: 'John Doe',
        username: 'johndoe',
        cpf: '111.444.777-35',
        password: 'password123'
      });
    });
  });

  describe('onSubmit Method - Invalid Form', () => {
    it('should not call authService when form is invalid', () => {
      component.registerForm.controls['name'].setValue('');
      
      component.onSubmit();
      
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should return early when form is invalid', () => {
      component.registerForm.controls['username'].setValue('ab'); // Too short
      
      component.onSubmit();
      
      expect(component.isSubmitting).toBe(false);
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should not navigate when form is invalid', () => {
      component.registerForm.controls['cpf'].setValue('invalid');
      
      component.onSubmit();
      
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit Method - Error Handling', () => {
    beforeEach(() => {
      component.registerForm.controls['name'].setValue('John Doe');
      component.registerForm.controls['username'].setValue('johndoe');
      component.registerForm.controls['cpf'].setValue('11144477735');
      component.registerForm.controls['password'].setValue('password123');
    });

    it('should set error message when registration fails', () => {
      const errorResponse = { error: { message: 'Username already exists' } };
      authService.register.and.returnValue(throwError(() => errorResponse));
      
      component.onSubmit();
      
      expect(component.error).toBe('Username already exists');
    });

    it('should use default error message when no message is provided', () => {
      const errorResponse = { error: {} };
      authService.register.and.returnValue(throwError(() => errorResponse));
      
      component.onSubmit();
      
      expect(component.error).toBe('Erro ao registrar usuário. Tente novamente.');
    });

    it('should reset isSubmitting to false on error', () => {
      const errorResponse = { error: { message: 'Error' } };
      authService.register.and.returnValue(throwError(() => errorResponse));
      
      component.onSubmit();
      
      expect(component.isSubmitting).toBe(false);
    });

    it('should not navigate on error', () => {
      const errorResponse = { error: { message: 'Error' } };
      authService.register.and.returnValue(throwError(() => errorResponse));
      
      component.onSubmit();
      
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle network error', () => {
      const errorResponse = { error: { message: 'Network error' } };
      authService.register.and.returnValue(throwError(() => errorResponse));
      
      component.onSubmit();
      
      expect(component.error).toBe('Network error');
      expect(component.isSubmitting).toBe(false);
    });

    it('should handle server error', () => {
      const errorResponse = { error: { message: 'Internal server error' } };
      authService.register.and.returnValue(throwError(() => errorResponse));
      
      component.onSubmit();
      
      expect(component.error).toBe('Internal server error');
    });
  });

  describe('Multiple Submission Attempts', () => {
    beforeEach(() => {
      component.registerForm.controls['name'].setValue('John Doe');
      component.registerForm.controls['username'].setValue('johndoe');
      component.registerForm.controls['cpf'].setValue('11144477735');
      component.registerForm.controls['password'].setValue('password123');
    });

    it('should clear previous error on new submission', () => {
      const errorResponse = { error: { message: 'First error' } };
      authService.register.and.returnValue(throwError(() => errorResponse));
      
      component.onSubmit();
      expect(component.error).toBe('First error');
      
      authService.register.and.returnValue(of({}));
      component.onSubmit();
      expect(component.error).toBeNull();
    });

    it('should allow resubmission after error', () => {
      const errorResponse = { error: { message: 'Error' } };
      authService.register.and.returnValue(throwError(() => errorResponse));
      
      component.onSubmit();
      expect(authService.register).toHaveBeenCalledTimes(1);
      
      authService.register.and.returnValue(of({}));
      component.onSubmit();
      expect(authService.register).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty error response object', () => {
      component.registerForm.controls['name'].setValue('John Doe');
      component.registerForm.controls['username'].setValue('johndoe');
      component.registerForm.controls['cpf'].setValue('11144477735');
      component.registerForm.controls['password'].setValue('password123');
      
      authService.register.and.returnValue(throwError(() => ({})));
      
      component.onSubmit();
      
      expect(component.error).toBe('Erro ao registrar usuário. Tente novamente.');
    });

    it('should handle null form values gracefully', () => {
      component.registerForm.controls['name'].setValue(null);
      
      component.onSubmit();
      
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should handle whitespace in form fields', () => {
      component.registerForm.controls['name'].setValue('   ');
      component.registerForm.controls['username'].setValue('johndoe');
      component.registerForm.controls['cpf'].setValue('11144477735');
      component.registerForm.controls['password'].setValue('password123');
      
      authService.register.and.returnValue(of({}));
      component.onSubmit();
      
      expect(authService.register).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: '   '
        })
      );
    });
  });

  describe('Form State Management', () => {
    it('should maintain form state after failed submission', () => {
      component.registerForm.controls['name'].setValue('John Doe');
      component.registerForm.controls['username'].setValue('johndoe');
      component.registerForm.controls['cpf'].setValue('11144477735');
      component.registerForm.controls['password'].setValue('password123');
      
      const errorResponse = { error: { message: 'Error' } };
      authService.register.and.returnValue(throwError(() => errorResponse));
      
      component.onSubmit();
      
      expect(component.registerForm.controls['name'].value).toBe('John Doe');
      expect(component.registerForm.controls['username'].value).toBe('johndoe');
      expect(component.registerForm.controls['cpf'].value).toBe('11144477735');
      expect(component.registerForm.controls['password'].value).toBe('password123');
    });
  });

  describe('Integration Tests', () => {
    it('should complete full registration flow', () => {
      component.registerForm.controls['name'].setValue('João Silva');
      component.registerForm.controls['username'].setValue('joaosilva');
      component.registerForm.controls['cpf'].setValue('529.982.247-25');
      component.registerForm.controls['password'].setValue('securePass123');
      
      authService.register.and.returnValue(of({ success: true }));
      
      component.onSubmit();
      
      expect(authService.register).toHaveBeenCalledWith({
        name: 'João Silva',
        username: 'joaosilva',
        cpf: '529.982.247-25',
        password: 'securePass123'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(component.error).toBeNull();
    });

    it('should validate all fields before submission', () => {
      component.registerForm.controls['name'].setValue('a'.repeat(101));
      component.registerForm.controls['username'].setValue('ab');
      component.registerForm.controls['cpf'].setValue('00000000000');
      component.registerForm.controls['password'].setValue('123');
      
      component.onSubmit();
      
      expect(component.registerForm.valid).toBe(false);
      expect(authService.register).not.toHaveBeenCalled();
    });
  });

  describe('CPF Validation Integration', () => {
    it('should accept valid CPF and submit successfully', () => {
      component.registerForm.controls['name'].setValue('Test User');
      component.registerForm.controls['username'].setValue('testuser');
      component.registerForm.controls['cpf'].setValue('12345678909');
      component.registerForm.controls['password'].setValue('password');
      
      authService.register.and.returnValue(of({}));
      
      expect(component.registerForm.valid).toBe(true);
      component.onSubmit();
      expect(authService.register).toHaveBeenCalled();
    });

    it('should reject invalid CPF and prevent submission', () => {
      component.registerForm.controls['name'].setValue('Test User');
      component.registerForm.controls['username'].setValue('testuser');
      component.registerForm.controls['cpf'].setValue('12345678900');
      component.registerForm.controls['password'].setValue('password');
      
      expect(component.registerForm.valid).toBe(false);
      component.onSubmit();
      expect(authService.register).not.toHaveBeenCalled();
    });
  });
});