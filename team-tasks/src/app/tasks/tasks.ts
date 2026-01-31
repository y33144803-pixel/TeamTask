import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TasksService } from './tasks.service';
import { Task, TaskStatus, UpdateTaskRequest } from '../shared/models/task.model';
import { TaskCardComponent } from '../shared/components/task-card/task-card';
import { NewTaskFormComponent } from './new-task-form.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TaskCardComponent,
    NewTaskFormComponent
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class TasksComponent implements OnInit {
  private readonly tasksService = inject(TasksService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  
  teamId: number | null = null;
  projectId: number | null = null;
  
  readonly tasks = signal<Task[]>([]);
  readonly error = signal<string>('');
  readonly loading = signal<boolean>(false);
  
  showForm = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['teamId']) {
        this.teamId = +params['teamId'];
      }
      if (params['projectId']) {
        this.projectId = +params['projectId'];
      }
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.loading.set(true);
    this.error.set('');
    
    this.tasksService.getTasks(this.projectId ?? undefined).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message || 'שגיאה בטעינת משימות');
        this.loading.set(false);
      }
    });
  }

  onAddTask(data: any): void {
    if (!this.projectId) {
      this.error.set('לא נמצא מזהה פרויקט');
      return;
    }

    this.tasksService.createTask({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      projectId: this.projectId
    }).subscribe({
      next: (newTask: Task) => {
        this.tasks.update(current => [...current, newTask]);
        this.showForm = false;
      },
      error: (err: Error) => {
        this.error.set(err.message || 'שגיאה ביצירת משימה');
      }
    });
  }

  onUpdateTask(taskId: number, data: UpdateTaskRequest): void {
    this.tasksService.updateTask(taskId, data).subscribe({
      next: (updatedTask: Task) => {
        this.tasks.update(current =>
          current.map(t => t.id === taskId ? updatedTask : t)
        );
      },
      error: (err: Error) => {
        this.error.set(err.message || 'שגיאה בעדכון משימה');
      }
    });
  }

  onDeleteTask(id: number): void {
    this.tasksService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.update(current => current.filter(t => t.id !== id));
      },
      error: (err: Error) => {
        this.error.set(err.message || 'שגיאה במחיקת משימה');
      }
    });
  }

  onChangeStatus(id: number, status: TaskStatus): void {
    this.tasksService.changeTaskStatus(id, status).subscribe({
      next: (updatedTask: Task) => {
this.tasks.update(current =>
          current.map(t => t.id === id ? updatedTask : t)
        );
      },
      error: (err: Error) => {
        this.error.set(err.message || 'שגיאה בעדכון סטטוס');
      }
    });
  }

  getTodoTasks(): Task[] {
    return this.tasks().filter(t => t.status === 'todo');
  }

  getInProgressTasks(): Task[] {
    return this.tasks().filter(t => t.status === 'in_progress');
  }

  getDoneTasks(): Task[] {
    return this.tasks().filter(t => t.status === 'done');
  }

  clearError(): void {
    this.error.set('');
  }

  goBack(): void {
    this.location.back();
  }
}