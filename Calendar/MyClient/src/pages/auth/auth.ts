import { Component,inject } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/services/auth.service'; //
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  styleUrl: './auth.css',
  templateUrl: './auth.html',
})
export class AuthComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';
  errorMessage='';

 onAuth() {
    // Clear any previous errors on a new attempt
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = "Please fill in both your email and password.";
      return; 
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.router.navigate(['/calendar']); 
      },
      error: (err) => {
        console.error('Oops!', err);
        
        // Catch the 400 Bad Request or 401 Unauthorized from your C# API
        if (err.status === 400 || err.status === 401) {
            this.errorMessage = 'Login failed. Incorrect email or password.';
        } else if (err.status === 0) {
            this.errorMessage = 'Cannot connect to the server.';
        } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      }
    });
  }

   
  

}