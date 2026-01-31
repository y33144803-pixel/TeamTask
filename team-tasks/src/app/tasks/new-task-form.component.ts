import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-new-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatSelectModule, MatFormFieldModule],
  template: `
    <div class="task-form-container">
      <h4>{{ isEdit ? 'ערוך משימה' : 'משימה חדשה' }}</h4>
      
      <div class="form-field">
        <label for="taskTitle">כותרת המשימה:</label>
        <input 
          type="text"
          id="taskTitle"
          [(ngModel)]="taskData.title" 
          placeholder="הזן כותרת למשימה"
          class="task-input"
        >
      </div>
      
      <div class="form-field">
        <label for="taskDesc">תיאור (אופציונלי):</label>
        <textarea 
          id="taskDesc"
          [(ngModel)]="taskData.description" 
          placeholder="הזן תיאור למשימה"
          rows="3"
          class="task-textarea">
        </textarea>
      </div>
      
      <div class="form-row">
        <div class="form-field">
          <label for="taskStatus">סטטוס:</label>
          <select id="taskStatus" [(ngModel)]="taskData.status" class="task-select">
            <option value="todo">לביצוע</option>
            <option value="in_progress">בתהליך</option>
            <option value="done">הושלם</option>
          </select>
        </div>
        
        <div class="form-field">
          <label for="taskPriority">עדיפות:</label>
          <select id="taskPriority" [(ngModel)]="taskData.priority" class="task-select">
            <option value="low">נמוכה</option>
            <option value="normal">רגילה</option>
            <option value="high">גבוהה</option>
          </select>
        </div>
      </div>
      
      <div class="form-actions">
        <button 
          mat-raised-button 
          color="primary" 
          (click)="onSave()"
          [disabled]="!taskData.title.trim()">
          {{ isEdit ? 'שמור' : 'צור משימה' }}
        </button>
        <button 
          mat-button 
          (click)="onCancel()">
          ביטול
        </button>
      </div>
    </div>
  `,
  styles: [`
    .task-form-container {
      margin: 20px 0;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
    }
    
    h4 {
      margin: 0 0 20px 0;
      font-size: 1.25rem;
      color: #333;
    }
    
    .form-field {
      margin-bottom: 16px;
      flex: 1;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }
    
    .task-input,
    .task-textarea,
    .task-select {
      width: 100%;
      padding: 12px 16px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 4px;
      outline: none;
      transition: border-color 0.3s;
      direction: rtl;
      text-align: right;
      font-family: inherit;
      
      &:focus {
        border-color: #3f51b5;
      }
      
      &::placeholder {
        color: #999;
      }
    }
    
    .task-textarea {
      resize: vertical;
    }
    
    .task-select {
      background: white;
      cursor: pointer;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }
  `]
})
export class NewTaskFormComponent {
  @Input() isEdit = false;
  @Input() existingTask: any = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  
  taskData = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'normal'
  };

  ngOnInit(): void {
    if (this.isEdit && this.existingTask) {
      this.taskData = { ...this.existingTask };
    }
  }

  onSave(): void {
    if (this.taskData.title.trim()) {
      this.save.emit(this.taskData);
      this.resetForm();
    }
  }

  onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  resetForm(): void {
    this.taskData = {
      title: '',
      description: '',
      status: 'todo',
      priority: 'normal'
    };
  }
}