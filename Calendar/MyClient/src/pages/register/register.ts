import { Component,inject } from '@angular/core';
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

  // 2. Create variables to hold the data from the input boxes
  name = '';
  email = '';
  password = '';
  errorMessage = '';

  // 3. The function that runs when the "Sign up" button is clicked
  onRegister() {
    // A simple check to make sure they didn't leave anything blank
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'All fields are required!';
      return;
    }

    // Bundle the data into an object that matches your C# 'User' model
    const newUser = {
      name: this.name,
      email: this.email,
      passhash: this.password // Remember: Your C# backend hashes this for security
    };

    // 4. Send the package to the C# backend via the AuthService
    this.authService.register(newUser).subscribe({
      next: (response) => {
        console.log('User created!', response);
        alert('Registration successful! Please log in.');
        this.router.navigate(['/auth']); // Take them to the login page
      },
      error: (err) => {
        console.error('Oops!', err);
        alert('Registration failed. That email might already be taken.');
        this.errorMessage = 'Registration failed. That email might already be taken.';
      }
    });
  }
}