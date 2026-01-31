import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  template: `
    <div class="project-form-container">
      <div class="form-field">
        <label for="projectName">שם הפרויקט:</label>
        <input 
          type="text"
          id="projectName"
          [(ngModel)]="projectName" 
          name="projectName"
          placeholder="הזן שם לפרויקט החדש"
          (keyup.enter)="onCreate()"
          class="project-input"
        >
      </div>
      
      <div class="form-field">
        <label for="projectDesc">תיאור (אופציונלי):</label>
        <textarea 
          id="projectDesc"
          [(ngModel)]="projectDescription" 
          name="projectDescription"
          placeholder="הזן תיאור לפרויקט"
          rows="3"
          class="project-textarea">
        </textarea>
      </div>
      
      <div class="form-actions">
        <button 
          mat-raised-button 
          color="primary" 
          type="button"
          (click)="onCreate()"
          [disabled]="!projectName.trim()">
          צור פרויקט
        </button>
        <button 
          mat-button 
          type="button" 
          (click)="onCancel()">
          ביטול
        </button>
      </div>
    </div>
  `,
  styles: [`
    .project-form-container {
      margin: 20px 0;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
    }
    
    .form-field {
      margin-bottom: 16px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
      font-size: 16px;
    }
    
    .project-input,
    .project-textarea {
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
    
    .project-textarea {
      resize: vertical;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-start;
    }
  `]
})
export class NewProjectFormComponent {
  @Input() teamId!: number;
  @Output() create = new EventEmitter<{name: string, description: string}>();
  @Output() cancel = new EventEmitter<void>();
  
  projectName = '';
  projectDescription = '';

  onCreate(): void {
    const name = this.projectName.trim();
    if (name) {
      this.create.emit({
        name,
        description: this.projectDescription.trim()
      });
      this.projectName = '';
      this.projectDescription = '';
    }
  }

  onCancel(): void {
    this.projectName = '';
    this.projectDescription = '';
    this.cancel.emit();
  }
}