import { Component, inject, OnInit } from '@angular/core'; // 👈 Added OnInit
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

    userName: string = ''; // Start empty
    userEmail: string = '';
    newPassword: string = '';
    isLoading: boolean = true; // Helpful for UX

    ngOnInit(): void {
        // 1. Fetch the real data as soon as the component wakes up
        this.authService.getMe().subscribe({
            next: (user) => {
                this.userName = user.name;
                this.userEmail = user.email;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load profile', err);
                // If the session expired, kick them back to login
                this.router.navigate(['/login']);
            }
        });
    }

    saveChanges(): void {
        // 2. Prepare the payload to match your C# UpdateProfileRequest DTO
        const updateData = {
            name: this.userName,
            email: this.userEmail,
            password: this.newPassword || null // Send null if blank so backend ignores it
        };

        this.authService.updateMe(updateData).subscribe({
            next: () => {
                alert('Profile updated successfully!');
                this.newPassword = ''; // Clear the password field for security
            },
            error: (err) => {
                console.error('Update failed', err);
                alert('Could not update profile. ' + (err.error?.message || ''));
            }
        });
    }

    deleteProfile(): void {
        const confirmed = confirm("Are you sure? This will delete your account and all your calendar data permanently.");
        
        if (confirmed) {
            // 3. Trigger the backend deletion
            this.authService.deleteMe().subscribe({
                next: () => {
                    alert('Your account has been deleted.');
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    console.error('Delete failed', err);
                    alert('Failed to delete account. Please try again.');
                }
            });
        }
    }
}