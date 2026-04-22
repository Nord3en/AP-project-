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
  
  // REMEMBER: Change 7123 to your actual C# port!
  private backendUrl = 'http://localhost:5208/api/Users'; 

  // 📝 1. The Registration Method
  register(newUser: User) {
    // We "POST" (send) the newUser data to the C# window
    return this.http.post(`${this.backendUrl}/register`, newUser);
  }

  // 🔐 2. The Login Method
  login(email: string, passhash: string) {
    // We bundle the email and password together and send it to the login window
    const loginData = { email: email, passhash: passhash };
    return this.http.post(`${this.backendUrl}/login`, loginData);
  }
}