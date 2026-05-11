import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface User {
  uid?: number; // The '?' means it's optional, because a brand new user doesn't have an ID yet!
  email: string;
  passhash: string; // The user will type a normal password, and your C# backend will handle the hashing later
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private backendUrl = 'http://localhost:5208/api/Users';

  // the registration method
  register(newUser: User) {
    // We "POST" (send) the newUser data to the C# window
    return this.http.post(`${this.backendUrl}/register`, newUser);
  }

  // he login method
  login(email: string, passhash: string) {
    const loginData = { email: email, passhash: passhash };

    // telling Angular to accept the cookie.
    return this.http.post(`http://localhost:5208/api/Users/login`, loginData, {
      withCredentials: true
    });
  }

  // 🚪 the Logout Method 
  logout() {
    // here we send an empty object {} because the backend just needs to know to destroy the cookie
    return this.http.post(`${this.backendUrl}/logout`, {}, {
      withCredentials: true
    });
  }
  checkAuthStatus(): Observable<boolean> {
    // 🚪 Knock on the C# door, but this time, BRING THE COOKIE!
    return this.http.get('http://localhost:5208/api/Users/auth-status', {
      withCredentials: true
    }).pipe(
      map(() => true),
      catchError(() => {
        return of(false);
      })
    );
  }

}