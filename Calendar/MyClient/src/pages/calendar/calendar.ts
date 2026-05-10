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

  newTaskCategory = '';
  newTaskText = '';
  newTaskColor = 'black';
  newTaskStartTime = '';
  newTaskEndTime = '';

  colorOptions: string[] = [
    'black',
    'red',
    'orange',
    'yellow',
    'blue',
    'purple',
    'pink',
    'brown'
  ];

  selectedTask: CalendarTask | null = null;
  isEditingTask = false;

  editTaskCategory = '';
  editTaskText = '';
  editTaskColor = 'black';
  editTaskStartTime = '';
  editTaskEndTime = '';

  ngOnInit(): void {
    this.loadTasks();
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
      this.calendarDays.push({
        dayNumber: day,
        isCurrentMonth: true,
        isToday:
          day === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
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

    this.closeTaskBox();
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );

    this.closeTaskBox();
    this.closeTaskDetails();
    this.buildCalendar();
  }

  openTaskBox(day: number | null): void {
    if (day === null) {
      return;
    }

    this.selectedDay = day;
    this.showTaskBox = true;

    this.newTaskCategory = '';
    this.newTaskText = '';
    this.newTaskColor = 'black';
    this.newTaskStartTime = '';
    this.newTaskEndTime = '';
  }

  closeTaskBox(): void {
    this.showTaskBox = false;
    this.selectedDay = null;

    this.newTaskCategory = '';
    this.newTaskText = '';
    this.newTaskColor = 'black';
    this.newTaskStartTime = '';
    this.newTaskEndTime = '';
  }

  addTask(): void {
    if (this.selectedDay === null || this.newTaskText.trim() === '') {
      return;
    }

    const task: CalendarTask = {
      category: this.newTaskCategory.trim(),
      text: this.newTaskText.trim(),
      color: this.newTaskColor,
      startTime: this.newTaskStartTime,
      endTime: this.newTaskEndTime,
      day: this.selectedDay,
      month: this.currentDate.getMonth(),
      year: this.currentDate.getFullYear()
    };

    this.tasks.push(task);
    this.saveTasks();
    this.closeTaskBox();
  }

  getTasksForDay(day: number | null): CalendarTask[] {
    if (day === null) {
      return [];
    }

    return this.tasks
      .filter(task =>
        task.day === day &&
        task.month === this.currentDate.getMonth() &&
        task.year === this.currentDate.getFullYear()
      )
      .sort((a, b) => this.convertTimeToMinutes(a.startTime) - this.convertTimeToMinutes(b.startTime));
  }

  convertTimeToMinutes(time: string): number {
    if (!time) {
      return 9999;
    }

    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getShortTaskText(taskText: string): string {
    const words = taskText.trim().split(/\s+/);

    if (words.length <= 5) {
      return taskText;
    }

    return words.slice(0, 5).join(' ') + '...';
  }

  getTaskTimeDisplay(task: CalendarTask): string {
    if (task.startTime && task.endTime) {
      return `${task.startTime} - ${task.endTime}`;
    }

    if (task.startTime) {
      return task.startTime;
    }

    return '';
  }
  openTaskDetails(task: CalendarTask): void {
    this.selectedTask = task;
    this.showTaskBox = true;

    this.newTaskCategory = task.category;
    this.newTaskText = task.text;
    this.newTaskColor = task.color;
    this.newTaskStartTime = task.startTime;
    this.newTaskEndTime = task.endTime;
  }

  closeTaskBox(): void {
    this.showTaskBox = false;
    this.selectedDay = null;
    this.selectedTask = null;

    this.newTaskCategory = '';
    this.newTaskText = '';
    this.newTaskColor = 'black';
    this.newTaskStartTime = '';
    this.newTaskEndTime = '';
  }

  saveEditedTask(): void {
    if (!this.selectedTask || this.newTaskText.trim() === '') {
      return;
    }

    this.selectedTask.category = this.newTaskCategory.trim();
    this.selectedTask.text = this.newTaskText.trim();
    this.selectedTask.color = this.newTaskColor;
    this.selectedTask.startTime = this.newTaskStartTime;
    this.selectedTask.endTime = this.newTaskEndTime;

    this.saveTasks();
    this.closeTaskBox();
  }


  deleteTask(): void {
    if (!this.selectedTask) {
      return;
    }

    this.tasks = this.tasks.filter(task => task !== this.selectedTask);
    this.saveTasks();
    this.closeTaskDetails();
  }

  saveTasks(): void {
    localStorage.setItem('calendarTasks', JSON.stringify(this.tasks));
  }

  loadTasks(): void {
    const savedTasks = localStorage.getItem('calendarTasks');

    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }
}