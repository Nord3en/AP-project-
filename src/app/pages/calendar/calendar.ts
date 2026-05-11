import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CalendarDay {
  dayNumber: number | null;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface CalendarTask {
  category: string;
  text: string;
  color: string;
  startTime: string;
  endTime: string;
  day: number;
  month: number;
  year: number;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent {
  weekDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  currentDate: Date = new Date();
  monthName: string = '';
  year: number = 0;

  calendarDays: CalendarDay[] = [];
  tasks: CalendarTask[] = [];

  selectedDay: number | null = null;
  showTaskBox = false;
  editingTask: CalendarTask | null = null;

  newCategory = '';
  newTaskText = '';
  newColor = '#4f46e5';
  newStartTime = '';
  newEndTime = '';

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
    startDay = startDay === 0 ? 6 : startDay - 1;

    const daysInMonth = lastDayOfMonth.getDate();
    const today = new Date();

    this.calendarDays = [];

    for (let i = 0; i < startDay; i++) {
      this.calendarDays.push({
        dayNumber: null,
        isCurrentMonth: false,
        isToday: false
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      this.calendarDays.push({
        dayNumber: day,
        isCurrentMonth: true,
        isToday
      });
    }

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

  openAddTask(dayNumber: number | null): void {
    if (dayNumber === null) return;

    this.selectedDay = dayNumber;
    this.editingTask = null;
    this.newCategory = '';
    this.newTaskText = '';
    this.newColor = '#4f46e5';
    this.newStartTime = '';
    this.newEndTime = '';
    this.showTaskBox = true;
  }

  addOrUpdateTask(): void {
    if (!this.selectedDay || this.newTaskText.trim() === '') return;

    if (this.editingTask) {
      this.editingTask.category = this.newCategory;
      this.editingTask.text = this.newTaskText;
      this.editingTask.color = this.newColor;
      this.editingTask.startTime = this.newStartTime;
      this.editingTask.endTime = this.newEndTime;
    } else {
      this.tasks.push({
        category: this.newCategory,
        text: this.newTaskText,
        color: this.newColor,
        startTime: this.newStartTime,
        endTime: this.newEndTime,
        day: this.selectedDay,
        month: this.currentDate.getMonth(),
        year: this.currentDate.getFullYear()
      });
    }

    this.closeTaskBox();
  }

  editTask(task: CalendarTask): void {
    this.editingTask = task;
    this.selectedDay = task.day;
    this.newCategory = task.category;
    this.newTaskText = task.text;
    this.newColor = task.color;
    this.newStartTime = task.startTime;
    this.newEndTime = task.endTime;
    this.showTaskBox = true;
  }

  deleteTask(): void {
    if (!this.editingTask) return;

    this.tasks = this.tasks.filter(task => task !== this.editingTask);
    this.closeTaskBox();
  }

  closeTaskBox(): void {
    this.showTaskBox = false;
    this.editingTask = null;
    this.selectedDay = null;
    this.newCategory = '';
    this.newTaskText = '';
    this.newStartTime = '';
    this.newEndTime = '';
  }

  getTasksForDay(dayNumber: number | null): CalendarTask[] {
    if (dayNumber === null) return [];

    return this.tasks
      .filter(task =>
        task.day === dayNumber &&
        task.month === this.currentDate.getMonth() &&
        task.year === this.currentDate.getFullYear()
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  get todayTasks(): CalendarTask[] {
    const today = new Date();

    return this.tasks.filter(task =>
      task.day === today.getDate() &&
      task.month === today.getMonth() &&
      task.year === today.getFullYear()
    );
  }

  get tomorrowTasks(): CalendarTask[] {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.tasks.filter(task =>
      task.day === tomorrow.getDate() &&
      task.month === tomorrow.getMonth() &&
      task.year === tomorrow.getFullYear()
    );
  }
}