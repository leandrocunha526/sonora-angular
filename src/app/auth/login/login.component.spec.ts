import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';  // Importando o serviço MatSnackBar
import { MatSnackBarModule } from '@angular/material/snack-bar';  // Importando o módulo MatSnackBar
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';  // Para testar navegação
import { MatCardModule } from '@angular/material/card';  // Importando MatCardModule
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';  // Importando CUSTOM_ELEMENTS_SCHEMA

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Criando um spy para o AuthService e MatSnackBar
    authService = jasmine.createSpyObj('AuthService', ['login']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: MatSnackBar, useValue: snackBar }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve chamar authService.login() e navegar para o dashboard no login bem-sucedido', () => {
    const mockLoginResponse = { token: 'mocked-token' };

    // Mock do serviço retornando sucesso
    authService.login.and.returnValue(of(mockLoginResponse));

    // Preenche o formulário
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('password');

    // Chama o método de submit
    component.onSubmit();
    fixture.detectChanges();

    // Verifica se o serviço de login foi chamado
    expect(authService.login).toHaveBeenCalledWith({ username: 'testuser', password: 'password' });
    expect(authService.login).toHaveBeenCalledTimes(1);

    // Verifique se houve redirecionamento após o sucesso (navegação)
    // Exemplo: Aqui pode verificar se o router.navigate foi chamado
    // expect(component.router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('deve mostrar mensagem de erro quando o login falhar', () => {
    const errorResponse = { error: { message: 'Credenciais inválidas' } };

    // Mock do serviço retornando erro
    authService.login.and.returnValue(throwError(() => errorResponse));

    // Preenche o formulário
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('password');

    // Chama o método de submit
    component.onSubmit();
    fixture.detectChanges();
  });
});
