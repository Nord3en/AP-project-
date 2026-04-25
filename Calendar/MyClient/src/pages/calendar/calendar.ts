import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CalendarTask {
  text: string;
  color: string;
  day: number;
  month: number;
  year: number;
}

interface CalendarDay {
  dayNumber: number | null;
  isCurrentMonth: boolean;
  isToday: boolean;
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

  currentDate: Date = new Date(2026, 3, 1);
  monthName: string = '';
  year: number = 0;
  calendarDays: CalendarDay[] = [];

  selectedDay: number | null = null;
  showTaskBox: boolean = false;
  newTaskText: string = '';
  selectedColor: string = 'black';

  colorOptions: string[] = [
    'red', 'blue', 'green', 'purple', 'pink', 'orange', 'brown', 'black'
  ];

  tasks: CalendarTask[] = [];

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
    this.selectedDay = null;
    this.showTaskBox = false;
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.selectedDay = null;
    this.showTaskBox = false;
    this.buildCalendar();
  }

  selectDate(day: CalendarDay): void {
    if (day.dayNumber === null) {
      return;
    }

    this.selectedDay = day.dayNumber;
    this.showTaskBox = false;
  }

  openAddTaskBox(): void {
    this.showTaskBox = true;
    this.newTaskText = '';
    this.selectedColor = 'black';
  }

  addTask(): void {
    if (this.selectedDay === null || this.newTaskText.trim() === '') {
      return;
    }

    this.tasks.push(
      {
      text: this.newTaskText,
      color: this.selectedColor,
      day: this.selectedDay,
      month: this.currentDate.getMonth(),
      year: this.currentDate.getFullYear()
    });

    this.saveTasks();

    this.newTaskText = '';
    this.selectedColor = 'black';
    this.showTaskBox = false;
  }

  getTasksForDay(dayNumber: number | null): CalendarTask[] {
    if (dayNumber === null) {
      return [];
    }

    return this.tasks.filter(task =>
      task.day === dayNumber &&
      task.month === this.currentDate.getMonth() &&
      task.year === this.currentDate.getFullYear()
    );
  }

  getFirstFiveWords(text: string): string {
    return text.split(' ').slice(0, 5).join(' ');
  }

  openFullTask(task: CalendarTask): void {
    alert(task.text);
  }
  selectedTask: CalendarTask | null = null;
editedTaskText: string = '';
editedTaskColor: string = 'black';
showEditBox: boolean = false;

openTaskEditor(task: CalendarTask): void {
  this.selectedTask = task;
  this.editedTaskText = task.text;
  this.editedTaskColor = task.color;
  this.showEditBox = true;
}

saveEditedTask(): void {
  if (this.selectedTask === null) {
    return;
  }

  this.selectedTask.text = this.editedTaskText;
  this.selectedTask.color = this.editedTaskColor;
  this.saveTasks();

  this.showEditBox = false;
  this.selectedTask = null;
}

deleteTask(): void {
  if (this.selectedTask === null) {
    return;
    this.saveTasks();
  }

  this.tasks = this.tasks.filter(task => task !== this.selectedTask);
  this.saveTasks();

  this.showEditBox = false;
  this.selectedTask = null;
}

cancelEdit(): void {
  this.showEditBox = false;
  this.selectedTask = null;
}
expandedDay: number | null = null;

isDayExpanded(dayNumber: number | null): boolean {
  return this.expandedDay === dayNumber;
}

toggleMoreTasks(dayNumber: number | null): void {
  if (dayNumber === null) {
    return;
  }

  this.expandedDay = this.expandedDay === dayNumber ? null : dayNumber;
}

getTasksForSpecificDate(date: Date): CalendarTask[] {
  return this.tasks.filter(task =>
    task.day === date.getDate() &&
    task.month === date.getMonth() &&
    task.year === date.getFullYear()
  );
}

getTodayTasks(): CalendarTask[] {
  const today = new Date();
  return this.getTasksForSpecificDate(today);
}

getTomorrowTasks(): CalendarTask[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return this.getTasksForSpecificDate(tomorrow);
}

saveTasks(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('calendarTasks', JSON.stringify(this.tasks));
  }
}

loadTasks(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedTasks = window.localStorage.getItem('calendarTasks');

    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }
}

}
