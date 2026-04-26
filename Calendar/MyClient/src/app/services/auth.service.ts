import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    return this.http.post(`${this.backendUrl}/login`, loginData, { 
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
}