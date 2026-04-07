import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar'; // Adjust path if needed!

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [SidebarComponent],
  template: `
    <div class="main-layout">
      <app-sidebar></app-sidebar>

      <main class="page-content">
        <h1>Calendar Page</h1>
        <p>This is where your Monday-Sunday grid will go!</p>
      </main>
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    app-sidebar {
      width: 250px;
      height: 100%;
    }

    .page-content {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      background-color: #dfb2b2; /* That soft reddish background color from Figma! */
      padding: 30px;
      font-family: sans-serif;
    }
  `]
})
export class CalendarComponent { }