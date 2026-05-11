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

  // REMEMBER: Change 5208 to your actual C# port if it ever changes!
  private backendUrl = 'http://localhost:5208/api/Users';

  // 📝 1. The Registration Method
  register(newUser: User) {
    // We "POST" (send) the newUser data to the C# window
    return this.http.post(`${this.backendUrl}/register`, newUser);
  }

  // 🔐 2. The Login Method
  login(email: string, passhash: string) {
    const loginData = { email: email, passhash: passhash };

    // Notice the third parameter here! We are telling Angular to accept the cookie.
    return this.http.post(`http://localhost:5208/api/Users/login`, loginData, {
      withCredentials: true
    });
  }

  // 🚪 3. The Logout Method (NEW!)
  logout() {
    // We send an empty object {} because the backend just needs to know to destroy the cookie
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
getMe(): Observable<any> {
  return this.http.get(`${this.backendUrl}/me`, { withCredentials: true });
}

updateMe(data: any): Observable<any> {
  return this.http.put(`${this.backendUrl}/me`, data, { withCredentials: true });
}

deleteMe(): Observable<any> {
  return this.http.delete(`${this.backendUrl}/me`, { withCredentials: true });
}
}