import { Routes } from '@angular/router';
import { AuthComponent } from '../pages/auth/auth';
import { CalendarComponent } from '../pages/calendar/calendar';
import { Subjects } from '../pages/subjects/subjects';
import { Tasks } from '../pages/tasks/tasks';
import { Register } from '../pages/register/register';

export const routes: Routes = [
    // When the app loads, go straight to login
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: AuthComponent },
    { path: 'register', component: Register },

    // App pages
    { path: 'calendar', component: CalendarComponent },
    { path: 'subjects', component: Subjects },
    { path: 'tasks', component: Tasks },

    // Wildcard route (redirects any typed-in typos to login)
    { path: '**', redirectTo: 'login' }
];
