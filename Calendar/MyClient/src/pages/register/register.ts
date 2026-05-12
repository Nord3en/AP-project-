import { Component,inject,ChangeDetectorRef } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/services/auth.service'; //

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  name = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
 onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const newUser = {
      name: this.name,
      email: this.email,
      passhash: this.password 
    };

    this.authService.register(newUser).subscribe({
      next: (response) => {
        console.log('User created!', response);
        this.successMessage = 'Registration successful! Redirecting to login...';
           this.cdr.detectChanges();
        setTimeout(() => {
            this.router.navigate(['/auth']); 
        }, 1500);
      },
     error: (err) => {
        console.error('Oops!', err);
        if (err.error && typeof err.error === 'string') {
            this.errorMessage = err.error;
        } 
        else if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
        }
        else if (err.status === 400 || err.status === 409) {
            this.errorMessage = 'An account with this email already exists.';
        } 
        else if (err.status === 0) {
            this.errorMessage = 'Cannot connect to the server. Is the backend running?';
        } 
        else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}