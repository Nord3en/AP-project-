import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="auth-screen">
      <h1 class="welcome-title">Student Organization Calendar</h1>

      <div class="login-card">
        <h2 class="card-header">Welcome</h2>

        <div class="input-section">
          <label class="label-box">Enter your school email address</label>
          <input class="custom-input" type="email" />
        </div>

        <div class="input-section">
          <label class="label-box">Enter password</label>
          <input class="custom-input" type="password" />
        </div>

        <button class="continue-btn" routerLink="/calendar">Continue</button>

        <div class="signup-text">
          Don't have an account yet?
        </div>

        <button class="create-btn" routerLink="/register">Create it here</button>
      </div>
    </div>
  `,
  styles: [``]
})
export class AuthComponent { }