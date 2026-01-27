import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should pass through successful requests', () => {
    const testData = { message: 'success' };

    httpClient.get('/test').subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne('/test');
    req.flush(testData);
  });

  it('should handle 400 error with message', () => {
    httpClient.get('/test').subscribe({
      error: (error) => {
        expect(error.message).toBe('Bad request message');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({ message: 'Bad request message' }, { status: 400, statusText: 'Bad Request' });
  });

  it('should handle 400 error without message', () => {
    httpClient.get('/test').subscribe({
      error: (error) => {
        expect(error.message).toBe('Solicitud inválida');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 400, statusText: 'Bad Request' });
  });

  it('should handle 404 error', () => {
    httpClient.get('/test').subscribe({
      error: (error) => {
        expect(error.message).toBe('Recurso no encontrado');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('should handle 500 error', () => {
    httpClient.get('/test').subscribe({
      error: (error) => {
        expect(error.message).toBe('Error interno del servidor');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle other status codes', () => {
    httpClient.get('/test').subscribe({
      error: (error) => {
        expect(error.message).toContain('Error 403');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 403, statusText: 'Forbidden' });
  });

  it('should handle client-side errors', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    httpClient.get('/test').subscribe({
      error: () => {
        expect(consoleSpy).toHaveBeenCalled();
      }
    });

    const req = httpMock.expectOne('/test');
    req.error(new ProgressEvent('error'));

    consoleSpy.mockRestore();
  });
});
