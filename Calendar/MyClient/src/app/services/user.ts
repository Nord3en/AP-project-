import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  uid: number;
  email: string;
  name: string;
  passhash: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Check your terminal for the C# port (e.g., 5057 or 5000)
  private apiUrl = 'http://localhost:5208/api/users'; 

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}