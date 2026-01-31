// import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';
// import { ReactiveFormsModule } from '@angular/forms';
// // import { routes } from './app.routes';  
// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { App } from './app/app';
// import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
// import { AuthInterceptor } from './app/core/auth.interceptor'; 

// // bootstrapApplication(App, appConfig)
// //   .catch((err) => console.error(err));



// // providers: [
// //   provideHttpClient(
// //     withInterceptors([AuthInterceptor])
// //   )
// // ]


// bootstrapApplication(App, {
//   ...appConfig,
//   providers: [
//     provideHttpClient(
//       withInterceptors([authInterceptor])
//     )
//   ]
// });

import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));