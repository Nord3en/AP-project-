import { Component, inject, OnInit,ChangeDetectorRef } from '@angular/core'; // 👈 Added OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './profile.html',
    styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    userName: string = '';
    userEmail: string = '';
    newPassword: string = '';
    isLoading: boolean = true;
    errorMessage: string = '';
    successMessage: string = '';

    ngOnInit(): void {
        this.authService.getMe().subscribe({
            next: (user) => {
                this.userName = user.name;
                this.userEmail = user.email;
                this.isLoading = false;
                this.cdr.detectChanges()
            },
            error: (err) => {
                console.error('Failed to load profile', err);
                this.router.navigate(['/login']);
            }
        });
    }

   saveChanges(): void {
        this.errorMessage = '';
        this.successMessage = '';
        if (!this.userName.trim() || !this.userEmail.trim()) {
            this.errorMessage = 'Name and Email are required.';
            this.cdr.detectChanges();
            return;
        }

        const updateData = {
            name: this.userName,
            email: this.userEmail,
            password: this.newPassword || null 
        };

        this.authService.updateMe(updateData).subscribe({
            next: () => {
                this.successMessage = 'Profile updated successfully!';
                this.newPassword = ''; 
                this.cdr.detectChanges();
                setTimeout(() => {
                    this.successMessage = '';
                    this.cdr.detectChanges();
                }, 3000);
            },
            error: (err) => {
                console.error('Update failed', err);
                if (err.error && typeof err.error === 'string') {
                    this.errorMessage = err.error;
                } else if (err.error && err.error.message) {
                    this.errorMessage = err.error.message;
                } else {
                    this.errorMessage = 'Could not update profile. Please try again.';
                }
                this.cdr.detectChanges();
            }
        });
    }

    deleteProfile(): void {
        const confirmed = confirm("Are you sure? This will delete your account and all your calendar data permanently.");
        
        if (confirmed) {
            this.errorMessage = '';
            
            this.authService.deleteMe().subscribe({
                next: () => {
                    alert('Your account has been deleted.');
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    console.error('Delete failed', err);
                    this.errorMessage = 'Failed to delete account. Please try again.';
                    this.cdr.detectChanges();
                }
            });
        }
    }
}