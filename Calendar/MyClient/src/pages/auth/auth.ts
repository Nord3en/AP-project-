import { Component,inject } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/services/auth.service'; //
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="auth-screen">
      <h1 class="welcome-title">Student Organization Calendar</h1>
      
      <div class="login-card">
        <h2 class="card-header">Welcome</h2>
        
        <div class="input-section">
          <div class="label-box">Enter your school email address</div>
          <input type="email" class="custom-input" [(ngModel)]="email" placeholder="name@school.edu" >
        </div>

        <div class="input-section">
          <div class="label-box">Enter password</div>
          <input type="password" class="custom-input" [(ngModel)]="password" placeholder="••••••••">
        </div>
      <div *ngIf="errorMessage" style="color: red; font-size: 13px; margin-bottom: 10px;">
            {{ errorMessage }}
      </div>
        <button class="continue-btn" (click)="onAuth()">Continue</button>

        <p class="signup-text">Don't have an account yet?</p>
        <button class="create-btn" routerLink="/register">Create it here</button>      </div>
    </div>
  `,
  styles: [`
    .auth-screen {
      height: 100vh;
      width: 100vw;
      background-color: #dfb2b2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: 'Inter', sans-serif; 
    }

    .welcome-title {
      font-size: 28px; /* Slightly smaller so the long title fits on one line */
      font-weight: 500;
      margin-bottom: 24px;
      color: #1a1a1a;
      letter-spacing: -0.5px;
      text-align: center;
    }

    .login-card {
      background-color: #d9d9d9;
      border: 1px solid #999;
      border-radius: 8px;
      padding: 40px;
      width: 380px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .card-header {
      font-size: 28px;
      font-weight: 500;
      margin-bottom: 30px;
      color: #1a1a1a;
    }

    .input-section {
      text-align: left;
      margin-bottom: 20px;
    }

    .label-box {
      font-size: 13px;
      font-weight: 500;
      color: #444;
      margin-bottom: 6px;
      display: block;
    }

    .custom-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #aaa;
      border-radius: 4px;
      background: white;
      box-sizing: border-box;
      display: block;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
    }
    
    .custom-input:focus {
      border-color: #4f46e5;
      outline: none;
    }

    .continue-btn {
      width: 100%;
      background-color: #4f46e5;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 12px;
      font-weight: 600;
      font-size: 16px;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      margin-top: 10px;
      transition: background 0.2s;
    }
    
    .continue-btn:hover {
      background-color: #4338ca;
    }

    .signup-text {
      margin-top: 30px;
      font-size: 14px;
      color: #555;
    }

    .create-btn {
      width: 100%;
      background-color: white;
      color: #4f46e5;
      border: 1px solid #4f46e5;
      border-radius: 4px;
      padding: 10px;
      font-weight: 600;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      margin-top: 5px;
      transition: background 0.2s;
    }
    
    .create-btn:hover {
      background-color: #f5f5ff;
    }
  `]
})
export class AuthComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';
  errorMessage='';

  onAuth(){
    
    if(!this.email || !this.password){
      this.errorMessage="All field are required"
        alert('All field are required');
      console.log("All field are required")
      return;
    }


    this.authService.login(this.email,this.password).subscribe({
        next: (response) => {
        console.log('successful login', response);
        this.router.navigate(['/calendar']); // Take them to the login page
      },
      error: (err) => {
        console.error('Oops!', err);
        
        this.errorMessage = 'Login failed. Tha email or the password is wrong';
      }
    })

  }

   
  

}