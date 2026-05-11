import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { TasksService } from '../../app/api-client/api/tasks.service';
import { SubjectsService } from '../../app/api-client/api/subjects.service'; // 👈 Fully activated!

interface CalendarTask {
  id?: number; 
  text: string;
  subid: number; 
  category: string;
  color: string;
  startTime: string; 
  endTime: string;   
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
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private tasksApi = inject(TasksService);
  private subjectsApi = inject(SubjectsService); // 👈 Injected!
  private cdr = inject(ChangeDetectorRef);
  
  weekDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  currentDate: Date = new Date();
  monthName: string = '';
  year: number = 0;
  calendarDays: CalendarDay[] = [];

  tasks: CalendarTask[] = [];
  subjects: any[] = []; // Using any to flexibly handle the C# generated model
  
  expandedDay: number | null = null;
  selectedDay: number | null = null;

  showTaskModal: boolean = false;
  isEditing: boolean = false;
  selectedTask: CalendarTask | null = null;

  // Form Bindings
  newCategory: string = '';
  newTaskText: string = '';
  newColor: string = '#673ab7';
  newStartTime: string = '09:00';
  newEndTime: string = '10:00';

  ngOnInit(): void {
    this.buildCalendar();
    this.loadSubjectsAndTasks(); 
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth']),
      error: (err) => console.error('Logout failed', err)
    });
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
      this.calendarDays.push({ dayNumber: null, isCurrentMonth: false, isToday: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      this.calendarDays.push({ dayNumber: day, isCurrentMonth: true, isToday: isToday });
    }

    while (this.calendarDays.length < 42) {
      this.calendarDays.push({ dayNumber: null, isCurrentMonth: false, isToday: false });
    }
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.selectedDay = null;
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.selectedDay = null;
    this.buildCalendar();
  }

  selectDate(day: CalendarDay): void {
    if (day.dayNumber !== null) {
      this.selectedDay = day.dayNumber;
    }
  }

  openAddTaskBox(): void {
    this.isEditing = false;
    this.selectedTask = null;
    this.selectedSubjectName = ''
    this.newCategory = '';
    this.newTaskText = '';
    this.newColor = '#673ab7';
    this.newStartTime = '09:00';
    this.newEndTime = '10:00';
    
    this.showTaskModal = true;
  }

  openTaskEditor(task: CalendarTask): void {
    this.isEditing = true;
    this.selectedTask = task;
    this.selectedDay = task.day;
    this.selectedSubjectName = task.category;
    this.newTaskText = task.text;
    this.newCategory = task.category;
    this.newColor = task.color;
    this.newStartTime = task.startTime;
    this.newEndTime = task.endTime;

    this.showTaskModal = true;
  }

  
  selectedSubjectName: string = '';

isExistingCategory(): boolean {
    return this.selectedSubjectName !== '';
  }

  onSubjectChange(): void {
    if (this.isExistingCategory()) {
      const subject = this.subjects.find(s => s.name === this.selectedSubjectName);
      if (subject) {
        this.newColor = subject.colorCode || subject.color_code;
        this.newCategory = subject.name;
      }
    } else {
      // Reset for "Create New"
      this.newCategory = '';
      this.newColor = '#673ab7';
    }
  }
  closeModal(): void {
    this.showTaskModal = false;
    this.selectedTask = null;
    this.isEditing = false;
  }

  
  // --- 📡 REAL API CALLS ---

  loadSubjectsAndTasks(): void {
    this.subjectsApi.apiSubjectsGet().subscribe({
      next: (dbSubjects: any[]) => {
        this.subjects = dbSubjects; // Save the raw subjects from the database
        this.loadTasks(); // Only load tasks AFTER subjects are ready
      },
      error: (err) => {
        console.error('Failed to load subjects', err);
        this.loadTasks(); // Fallback: load tasks anyway if subjects fail
      }
    });
  }

  loadTasks(): void {
    this.tasksApi.apiTasksGet().subscribe({
      next: (dbTasks: any[]) => {
        this.tasks = dbTasks.map(dbTask => {
            
            // Relational mapping: Match the Task's subid to our Subjects array
            const matchedSubject = this.subjects.find(s => s.subid === dbTask.subid);
            const computedColor = matchedSubject ? (matchedSubject.colorCode || matchedSubject.color_code) : '#333333';
            const computedCategory = matchedSubject ? matchedSubject.name : 'Uncategorized';

            const taskStartDate = new Date(dbTask.startTime);
            const taskEndDate = new Date(dbTask.endTime);
            const formatTime = (d: Date) => d.toTimeString().substring(0, 5);

            return {
                id: dbTask.id, 
                text: dbTask.title,
                subid: dbTask.subid,
                category: computedCategory,
                color: computedColor, 
                startTime: formatTime(taskStartDate),
                endTime: formatTime(taskEndDate),
                day: taskStartDate.getDate(),
                month: taskStartDate.getMonth(),
                year: taskStartDate.getFullYear()
            };
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  filterSubid: number | null = null;

onFilterChange(): void {
  this.cdr.detectChanges(); // Force UI to refresh
}
  saveTask(): void {
    const categoryName = this.isExistingCategory() ? this.selectedSubjectName : this.newCategory;
    if (this.newTaskText.trim() === '' || categoryName.trim() === '') return;

    const existingSubject = this.subjects.find(
      s => s.name.toLowerCase() === categoryName.trim().toLowerCase()
    );

    if (existingSubject) {
      const subjectId = existingSubject.subid || existingSubject.id;
      const oldColor = existingSubject.colorCode || existingSubject.color_code;

      // Check if the user changed the color of the existing category
      if (this.newColor !== oldColor) {
        const updatedSubject = { ...existingSubject, colorCode: this.newColor };
        
        // 1. Update the Category color in the DB (PUT)
        this.subjectsApi.apiSubjectsIdPut(subjectId, updatedSubject).subscribe({
          next: () => {
            // Update local array so the calendar colors change immediately
            existingSubject.colorCode = this.newColor;
            existingSubject.color_code = this.newColor;
            this.executeTaskSave(subjectId);
          },
          error: (err) => console.error('Failed to update category color', err)
        });
      } else {
        // No color change, just save the task
        this.executeTaskSave(subjectId);
      }
    } else {
      // 2. It's a brand new category (POST)
      const newSubjectPayload: any = {
        name: categoryName.trim(),
        colorCode: this.newColor
      };

      this.subjectsApi.apiSubjectsPost(newSubjectPayload).subscribe({
        next: (createdSubject: any) => {
          this.subjects.push(createdSubject);
          this.executeTaskSave(createdSubject.subid || createdSubject.id);
        },
        error: (err) => console.error('Failed to create new category', err)
      });
    }
  }

  executeTaskSave(validSubid: number): void {
    const dayToSave = this.isEditing && this.selectedTask ? this.selectedTask.day : this.selectedDay;
    if (dayToSave === null) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const [startH, startM] = this.newStartTime.split(':').map(Number);
    const [endH, endM] = this.newEndTime.split(':').map(Number);

    const startDate = new Date(year, month, dayToSave, startH || 0, startM || 0, 0);
    const endDate = new Date(year, month, dayToSave, endH || 23, endM || 59, 59);

    const payload: any = { 
      title: this.newTaskText,          
      description: "", 
      startTime: startDate.toISOString(), 
      endTime: endDate.toISOString(),
      isCompleted: false,                
      subid: validSubid,  // 👈 Passing the verified relational ID
      source: "Angular"   // No more smuggling!
    };

    if (this.isEditing && this.selectedTask?.id) {
      payload.id = this.selectedTask.id;
      this.tasksApi.apiTasksIdPut(this.selectedTask.id, payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadSubjectsAndTasks(); // Reload everything to ensure sync
        },
        error: (err) => console.error('Failed to update task', err)
      });
    } else {
      this.tasksApi.apiTasksPost(payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadSubjectsAndTasks(); // Reload everything to ensure sync
        },
        error: (err) => console.error('Failed to save task', err)
      });
    }
  }

  deleteTask(): void {
    if (!this.selectedTask?.id) return;

    this.tasksApi.apiTasksIdDelete(this.selectedTask.id).subscribe({
      next: () => {
        this.closeModal();
        this.loadTasks();
      },
      error: (err) => console.error('Failed to delete task', err)
    });
  }

  // --- UTILITIES ---
  isDayExpanded(dayNumber: number | null): boolean { return this.expandedDay === dayNumber; }
  toggleMoreTasks(dayNumber: number | null): void { if (dayNumber !== null) this.expandedDay = this.expandedDay === dayNumber ? null : dayNumber; }
  getTasksForDay(dayNumber: number | null): CalendarTask[] {
  if (dayNumber === null) return [];
  
  return this.tasks.filter(task =>
    task.day === dayNumber &&
    task.month === this.currentDate.getMonth() &&
    task.year === this.currentDate.getFullYear() &&
    // 👈 The Filter: Only show if no filter is set OR if the IDs match
    (this.filterSubid === null || task.subid === this.filterSubid)
  );
}
  getFirstFiveWords(text: string): string { return text.split(' ').slice(0, 5).join(' '); }
  getTasksForSpecificDate(date: Date): CalendarTask[] { return this.tasks.filter(task => task.day === date.getDate() && task.month === date.getMonth() && task.year === date.getFullYear()); }
  getTodayTasks(): CalendarTask[] { return this.getTasksForSpecificDate(new Date()); }
  getTomorrowTasks(): CalendarTask[] { const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); return this.getTasksForSpecificDate(tomorrow); }
}