import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { mockInterceptor } from '@core/mocks/mock.interceptor';
import { environment } from '../environments/environment';

const interceptors = environment.useMocks
  ? [mockInterceptor, errorInterceptor]
  : [errorInterceptor];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors(interceptors))
  ]
};
