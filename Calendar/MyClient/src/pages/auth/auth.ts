import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  onAuth() {
    console.error('inside onauth function');

    if (!this.email || !this.password) {
      console.error('error');
      this.errorMessage = "All fields are required";
      alert('All fields are required');
      console.log("All fields are required");
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('successful login', response);
        this.router.navigate(['/calendar']);
      },
      error: (err) => {
        console.error('Oops!', err);
        this.errorMessage = 'Login failed. The email or the password is wrong';
      }
    });
  }
}