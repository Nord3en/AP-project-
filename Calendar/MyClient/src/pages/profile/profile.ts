import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink], // Fixed: HTML now understands routerLink
    templateUrl: './profile.html',
    styleUrls: ['./profile.css']
})
export class ProfileComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    userName: string = 'John Doe';
    userEmail: string = 'user@example.com';
    newPassword: string = '';

    saveChanges(): void {
        const updateData = {
            name: this.userName,
            email: this.userEmail,
            password: this.newPassword
        };
        console.log('Saving changes...', updateData);
        alert('Profile updated successfully!');
    }

    deleteProfile(): void {
        const confirmed = confirm("Are you sure you want to delete your account? This action is permanent.");
        if (confirmed) {
            console.log('Account deleted');
            // Logic to delete from backend goes here
            this.router.navigate(['/login']);
        }
    }
}