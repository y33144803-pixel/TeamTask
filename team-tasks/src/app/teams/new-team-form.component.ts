import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-team-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatButtonModule
  ],
  template: `
    <div class="team-form-container">
      <div class="form-field">
        <label for="teamName">שם הצוות:</label>
        <input 
          type="text"
          id="teamName"
          [(ngModel)]="teamName" 
          name="teamName"
          placeholder="הזן שם לצוות החדש"
          (keyup.enter)="onCreate()"
          class="team-input"
        >
      </div>
      
      <div class="form-actions">
        <button 
          mat-raised-button 
          color="primary" 
          type="button"
          (click)="onCreate()"
          [disabled]="!teamName.trim()">
          צור צוות
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
    .team-form-container {
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
    
    .team-input {
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
    
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-start;
    }
  `]
})
export class NewTeamFormComponent {
  @Output() create = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  
  teamName = '';

  onCreate(): void {
    const name = this.teamName.trim();
    if (name) {
      this.create.emit(name);
      this.teamName = '';
    }
  }

  onCancel(): void {
    this.teamName = '';
    this.cancel.emit();
  }
}