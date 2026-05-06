import { Routes } from '@angular/router';
import { AuthComponent } from '../pages/auth/auth';
import { CalendarComponent } from '../pages/calendar/calendar';
import { Register } from '../pages/register/register';

// 🛡️ 1. Import the Guard we just created!
// (Adjust this path if you saved your guard somewhere else)
import { authGuard } from '../app/services/auth.guard'; 

export const routes: Routes = [
    // When the app loads, go straight to login
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: AuthComponent },
    { path: 'register', component: Register },

    // App pages
    { 
      path: 'calendar', 
      component: CalendarComponent,
      canActivate: [authGuard] // 🔒 2. THE VELVET ROPE: Attach the guard here!
    },

    // Wildcard route (redirects any typed-in typos to login)
    { path: '**', redirectTo: 'login' }
];