import { Component, OnInit } from '@angular/core';
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
export class CalendarComponent implements OnInit {
  weekDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  currentDate: Date = new Date();
  monthName: string = '';
  year: number = 0;
  calendarDays: CalendarDay[] = [];

  tasks: CalendarTask[] = [];

  selectedCategory: string = 'All';

  selectedDay: number | null = null;
  showTaskBox: boolean = false;

  newTaskCategory: string = '';
  newTaskText: string = '';
  newTaskColor: string = 'lightblue';
  newTaskStartTime: string = '';
  newTaskEndTime: string = '';

  selectedTask: CalendarTask | null = null;
  isEditingTask: boolean = false;

  editTaskCategory: string = '';
  editTaskText: string = '';
  editTaskColor: string = '';
  editTaskStartTime: string = '';
  editTaskEndTime: string = '';

  colorOptions: string[] = [
    'black',
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink',
    'brown',

  ];

  ngOnInit(): void {
    this.loadTasks();
    this.generateCalendar();
  }

  get categories(): string[] {
    return [
      ...new Set(
        this.tasks
          .map(task => task.category?.trim())
          .filter((category): category is string => !!category)
      )
    ];
  }

  generateCalendar(): void {
    this.calendarDays = [];

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.monthName = this.currentDate.toLocaleString('default', {
      month: 'long'
    });

    this.year = year;

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let startingDay = firstDayOfMonth.getDay();
    startingDay = startingDay === 0 ? 6 : startingDay - 1;

    for (let i = 0; i < startingDay; i++) {
      this.calendarDays.push({
        dayNumber: null,
        isCurrentMonth: false,
        isToday: false
      });
    }

    const today = new Date();

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
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
  }

  previousMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );

    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );

    this.generateCalendar();
  }

  openTaskBox(day: number): void {
    this.selectedDay = day;
    this.showTaskBox = true;

    this.newTaskCategory = '';
    this.newTaskText = '';
    this.newTaskColor = 'lightblue';
    this.newTaskStartTime = '';
    this.newTaskEndTime = '';
  }

  closeTaskBox(): void {
    this.showTaskBox = false;
    this.selectedDay = null;
  }

  addTask(): void {
    if (!this.selectedDay || this.newTaskText.trim() === '') {
      return;
    }

    const newTask: CalendarTask = {
      category: this.newTaskCategory.trim(),
      text: this.newTaskText.trim(),
      color: this.newTaskColor,
      startTime: this.newTaskStartTime,
      endTime: this.newTaskEndTime,
      day: this.selectedDay,
      month: this.currentDate.getMonth(),
      year: this.currentDate.getFullYear()
    };

    this.tasks.push(newTask);
    this.saveTasks();
    this.closeTaskBox();
  }

  getTasksForDay(day: number | null): CalendarTask[] {
    if (day === null) {
      return [];
    }

    let dayTasks = this.tasks.filter(task =>
      task.day === day &&
      task.month === this.currentDate.getMonth() &&
      task.year === this.currentDate.getFullYear()
    );

    if (this.selectedCategory !== 'All') {
      dayTasks = dayTasks.filter(task =>
        task.category === this.selectedCategory
      );
    }

    return dayTasks.sort((a, b) =>
      (a.startTime || '').localeCompare(b.startTime || '')
    );
  }

  getShortTaskText(text: string): string {
    const words = text.split(' ');

    if (words.length <= 5) {
      return text;
    }

    return words.slice(0, 5).join(' ') + '...';
  }

  openTaskDetails(task: CalendarTask): void {
    this.selectedTask = task;
    this.isEditingTask = false;
  }

  openEditTask(day: number | null, task: CalendarTask): void {
    this.selectedTask = task;
    this.isEditingTask = false;
  }

  closeTaskDetails(): void {
    this.selectedTask = null;
    this.isEditingTask = false;
  }

  startEditingTask(): void {
    if (!this.selectedTask) {
      return;
    }

    this.isEditingTask = true;

    this.editTaskCategory = this.selectedTask.category;
    this.editTaskText = this.selectedTask.text;
    this.editTaskColor = this.selectedTask.color;
    this.editTaskStartTime = this.selectedTask.startTime;
    this.editTaskEndTime = this.selectedTask.endTime;
  }

  cancelEditingTask(): void {
    this.isEditingTask = false;
  }

  saveEditedTask(): void {
    if (!this.selectedTask) {
      return;
    }

    this.selectedTask.category = this.editTaskCategory.trim();
    this.selectedTask.text = this.editTaskText.trim();
    this.selectedTask.color = this.editTaskColor;
    this.selectedTask.startTime = this.editTaskStartTime;
    this.selectedTask.endTime = this.editTaskEndTime;

    this.saveTasks();

    this.isEditingTask = false;
    this.selectedTask = null;
  }

  deleteTask(): void {
    if (!this.selectedTask) {
      return;
    }

    this.tasks = this.tasks.filter(task => task !== this.selectedTask);

    this.saveTasks();

    this.selectedTask = null;
    this.isEditingTask = false;
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

  getTodayTasks(): CalendarTask[] {
    const today = new Date();

    return this.tasks
      .filter(task =>
        task.day === today.getDate() &&
        task.month === today.getMonth() &&
        task.year === today.getFullYear()
      )
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }

  getTomorrowTasks(): CalendarTask[] {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.tasks
      .filter(task =>
        task.day === tomorrow.getDate() &&
        task.month === tomorrow.getMonth() &&
        task.year === tomorrow.getFullYear()
      )
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }

  saveTasks(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('calendarTasks', JSON.stringify(this.tasks));
    }
  }

  loadTasks(): void {
    if (typeof localStorage !== 'undefined') {
      const savedTasks = localStorage.getItem('calendarTasks');

      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks);
      }
    }
  }
}