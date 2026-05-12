import { Component,inject,ChangeDetectorRef } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ⬅️ Tool to read what user types
import { CommonModule } from '@angular/common'; // ⬅️ Tool to show error messages
import { AuthService } from '../../app/services/auth.service'; //

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // 1. Inject our helpers
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // 2. Create variables to hold the data from the input boxes
  name = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  // 3. The function that runs when the "Sign up" button is clicked
 onRegister() {
    // Clear old messages
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
        // Show success message and wait 1.5 seconds before navigating
        this.successMessage = 'Registration successful! Redirecting to login...';
           this.cdr.detectChanges();
        setTimeout(() => {
            this.router.navigate(['/auth']); 
        }, 1500);
      },
     error: (err) => {
        console.error('Oops!', err);
        
        // 1. Check if the backend sent a specific error message back in the payload
        if (err.error && typeof err.error === 'string') {
            // If your C# backend returns a simple string like return BadRequest("User already exists");
            this.errorMessage = err.error;
        } 
        else if (err.error && err.error.message) {
            // If your C# backend returns a JSON object like return BadRequest(new { message = "User already exists" });
            this.errorMessage = err.error.message;
        }
        // 2. Fallback to status codes if there is no specific message
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