import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import { ROUTES } from './app/routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      RouterModule.forRoot(ROUTES, {
        scrollPositionRestoration: 'top',
      })
    ),
  ],
}).catch((err) => console.error(err));
