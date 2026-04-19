import { Component } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <h1 class="logo">Classroom</h1>

      <nav class="menu">
        <p class="menu-label">Main menu</p>
        <ul>
          <li><a routerLink="/calendar" routerLinkActive="active">Calendar</a></li>
          <li><a routerLink="/subjects" routerLinkActive="active">Subjects</a></li>
          <li><a routerLink="/tasks" routerLinkActive="active">Tasks</a></li>
        </ul>
      </nav>

      <div class="footer-actions">
        <button class="logout-btn" routerLink="/login">Logout</button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background-color: #c4c4c4; /* The gray from your Figma */
      padding: 20px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    .logo {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 40px;
      font-family: sans-serif;
    }

    .menu-label {
      font-weight: bold;
      margin-bottom: 15px;
      font-family: sans-serif;
      text-transform: uppercase;
      font-size: 12px;
      color: #555;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      margin-bottom: 10px;
    }

    a {
      display: block;
      padding: 12px;
      background-color: #e0e0e0;
      text-decoration: none;
      color: black;
      border-radius: 4px;
      font-weight: bold;
      text-align: center;
      font-family: sans-serif;
      transition: background-color 0.2s;
    }

    a:hover {
      background-color: #d0d0d0;
    }

    /* This styles the button for the page you are currently on */
    .active {
      background-color: #a0a0a0;
      box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
    }

    .footer-actions {
      margin-top: auto;
    }

    .logout-btn {
      width: 100%;
      padding: 12px;
      background-color: #e0e0e0;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      font-family: sans-serif;
    }
    
    .logout-btn:hover {
      background-color: #d0d0d0;
    }
  `]
})
export class SidebarComponent { }
