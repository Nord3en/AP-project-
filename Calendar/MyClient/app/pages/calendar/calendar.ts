import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent {
  // 1. Properties (Variables) go here
  days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  showFilter: boolean = false;
  isTaskBarOpen: boolean = false;

  // 2. Methods (Functions) go here
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  toggleTaskBar() {
    this.isTaskBarOpen = !this.isTaskBarOpen;
  }

  markDone(event: any) {
    console.log("Task status updated:", event.target.checked);
  }
} // <--- Make sure this closing bracket is at the very bottom!