import { ApplicationConfig, provideBrowserGlobalErrorListeners,importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApiModule, Configuration } from '../app/api-client';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      ApiModule.forRoot(() => new Configuration({
        withCredentials: true // The generated code will now automatically show the cookie to the C# Bouncer!
      }))
    )
  ]
};
