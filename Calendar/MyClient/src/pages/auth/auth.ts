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

  onAuth(){
    console.error('inside onauth function');
    if(!this.email || !this.password){
      console.error('error');
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
        
        this.errorMessage = 'Login failed. The email or the password is wrong';
      }
    })

  }

   
  

}