import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthInterceptor } from './auth.interceptor';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: Router, useValue: router }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add Authorization header if token exists', () => {
    localStorage.setItem('token', 'fake-jwt-token'); // Adiciona o token no localStorage

    httpClient.get('/test-url').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpTestingController.expectOne('/test-url');
    expect(req.request.headers.has('Authorization')).toEqual(true); // Verifica se o Authorization está presente
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-jwt-token'); // Verifica o valor do token
    req.flush({}); // Simula a resposta com um corpo vazio
  });

  it('should handle 401 errors and redirect to login', () => {
    const errorMessage = 'Unauthorized';
    httpClient.get('/test-url').subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
        expect(snackBar.open).toHaveBeenCalledOnceWith(
          'Ocorreu um erro com seu login. Por favor, tente novamente.',
          'Fechar',
          { duration: 4000 }
        );
        expect(router.navigate).toHaveBeenCalledOnceWith(['/login']);
      }
    });

    const req = httpTestingController.expectOne('/test-url');
    req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle 403 errors and redirect to login', () => {
    const errorMessage = 'Forbidden';
    httpClient.get('/test-url').subscribe({
      error: (error) => {
        expect(error.status).toBe(403);
        expect(snackBar.open).toHaveBeenCalledOnceWith(
          'Ocorreu um erro com seu login. Por favor, tente novamente.',
          'Fechar',
          { duration: 4000 }
        );
        expect(router.navigate).toHaveBeenCalledOnceWith(['/login']);
      }
    });

    const req = httpTestingController.expectOne('/test-url');
    req.flush(errorMessage, { status: 403, statusText: 'Forbidden' });
  });
});
