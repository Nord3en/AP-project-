import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  dayNumber: number | null;
  isCurrentMonth: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent {
  weekDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  currentDate: Date = new Date(2026, 3, 1); // April 2026
  monthName: string = '';
  year: number = 0;

  calendarDays: CalendarDay[] = [];

  ngOnInit(): void {
    this.buildCalendar();
  }

  buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.monthName = this.currentDate.toLocaleString('en-US', { month: 'long' });
    this.year = year;

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let startDay = firstDayOfMonth.getDay();
    // JavaScript: Sunday = 0, Monday = 1, ..., Saturday = 6

    // Convert so Monday becomes first column
    startDay = startDay === 0 ? 6 : startDay - 1;

    const daysInMonth = lastDayOfMonth.getDate();

    const today = new Date();
    this.calendarDays = [];

    // Empty boxes before day 1
    for (let i = 0; i < startDay; i++) {
      this.calendarDays.push({
        dayNumber: null,
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Real days of this month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      this.calendarDays.push({
        dayNumber: day,
        isCurrentMonth: true,
        isToday: isToday
      });
    }

    // Fill the rest so the grid looks complete
    while (this.calendarDays.length < 42) {
      this.calendarDays.push({
        dayNumber: null,
        isCurrentMonth: false,
        isToday: false
      });
    }
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.buildCalendar();
  }
}