import { Component,inject,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink,Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service'; //ű
import { TasksService } from '../../app/api-client/api/tasks.service';



interface CalendarTask {
  id?: number; 
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


  
  private authService = inject(AuthService);
  private router = inject(Router);
  private tasksApi = inject(TasksService);
  private cdr = inject(ChangeDetectorRef);
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

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully');
        this.router.navigate(['/auth']); 
      },
      error: (err) => {
        console.error('Logout failed', err);
      }
    });
  }
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

// --- 📡 DATABASE CONNECTED METHODS ---

  loadTasks(): void {
    this.tasksApi.apiTasksGet().subscribe({
      next: (dbTasks: any[]) => {
        // Map the backend tasks to your frontend format
        this.tasks = dbTasks.map(dbTask => {
            
            // Extract the color out of the source column!
            let extractedColor = 'black';
            if (dbTask.source && dbTask.source.includes('|')) {
                extractedColor = dbTask.source.split('|')[1];
            }

            const taskDate = new Date(dbTask.startTime);

            return {
                id: dbTask.id, // 👈 Save the DB ID so we can edit/delete it later!
                text: dbTask.title,
                color: extractedColor,
                day: taskDate.getDate(),
                month: taskDate.getMonth(),
                year: taskDate.getFullYear()
            };
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }


  // CRUD methods ____________________________________________________________________

  addTask(): void {
    if (this.selectedDay === null || this.newTaskText.trim() === '') {
      return;
    }

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const day = this.selectedDay;

    const startTime = new Date(year, month, day, 0, 0, 0);
    const endTime = new Date(year, month, day, 23, 59, 59);

    const newTask: any = { 
      title: this.newTaskText,           
      description: "", 
      startTime: startTime.toISOString(), 
      endTime: endTime.toISOString(),
      isCompleted: false,                
      source: `Angular|${this.selectedColor}` // 👈 Smuggle the color!
    };

    this.tasksApi.apiTasksPost(newTask).subscribe({
      next: (savedTask: any) => {
        let extractedColor = 'black';
        if (savedTask.source && savedTask.source.includes('|')) {
            extractedColor = savedTask.source.split('|')[1];
        }

        this.tasks.push({
           id: savedTask.id, // 👈 Capture the brand new ID generated by PostgreSQL
           text: savedTask.title,
           color: extractedColor, 
           day: day,
           month: month,
           year: year
        }); 
        
        this.newTaskText = '';
        this.selectedColor = 'black';
        this.showTaskBox = false;
        this.loadTasks()
      },
      error: (err) => console.error('Failed to save task', err)
    });
  }

  saveEditedTask(): void {
    // If we don't have a task, or the task doesn't have an ID, we can't update it!
    if (this.selectedTask === null || !this.selectedTask.id) {
      console.error("Cannot update task: Missing database ID!");
      return;
    }

    // Reconstruct the strict database time formats
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const day = this.selectedTask.day;
    const startTime = new Date(year, month, day, 0, 0, 0);
    const endTime = new Date(year, month, day, 23, 59, 59);

    const updatedTask: any = { 
      id: this.selectedTask.id, // Must pass the ID back to C#
      title: this.editedTaskText,           
      description: "", 
      startTime: startTime.toISOString(), 
      endTime: endTime.toISOString(),
      isCompleted: false,                
      source: `Angular|${this.editedTaskColor}` // 👈 Smuggle the NEW color!
    };

    // UPDATE: Tell C# to modify the task with this specific ID
    this.tasksApi.apiTasksIdPut(this.selectedTask.id, updatedTask).subscribe({
      next: () => {
        // Success! Update the UI to match
        this.selectedTask!.text = this.editedTaskText;
        this.selectedTask!.color = this.editedTaskColor;
        this.showEditBox = false;
        this.selectedTask = null;
        this.loadTasks();
      },
      error: (err) => console.error('Failed to update task', err)
    });
  }

  deleteTask(): void {
    // If we don't know the DB ID, we can't delete it
    if (this.selectedTask === null || !this.selectedTask.id) {
      console.error("Cannot delete task: Missing database ID!");
      return;
    }

    // DELETE: Tell C# to wipe this ID from PostgreSQL
    this.tasksApi.apiTasksIdDelete(this.selectedTask.id).subscribe({
      next: () => {
        // Success! Remove it from the Angular array
        this.tasks = this.tasks.filter(task => task.id !== this.selectedTask!.id);
        this.showEditBox = false;
        this.selectedTask = null;
      },
      error: (err) => console.error('Failed to delete task', err)
    });
  }

// end of  CRUD methods ___________________________________________________________

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


}
