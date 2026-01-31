import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Task, UpdateTaskRequest, TaskStatus } from '../../models/task.model';
import { CommentsComponent } from '../../../comments/comments';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatTooltipModule,
    TextFieldModule,
    CommentsComponent
  ],
  templateUrl: './task-card.html',
  styleUrls: ['./task-card.scss']
})
export class TaskCardComponent {
  @Input() task!: Task;
  
  @Output() delete = new EventEmitter<void>();
  @Output() update = new EventEmitter<UpdateTaskRequest>();
  @Output() statusChange = new EventEmitter<TaskStatus>();

  isEditing = false;
  showComments = false;
  editData: any = {};

  statusOptions = [
    { value: 'todo', label: 'לביצוע' },
    { value: 'in_progress', label: 'בתהליך' },
    { value: 'done', label: 'הושלם' }
  ];

  priorityOptions = [
    { value: 'low', label: 'נמוכה', icon: 'arrow_downward' },
    { value: 'normal', label: 'רגילה', icon: 'remove' },
    { value: 'high', label: 'גבוהה', icon: 'arrow_upward' }
  ];

  getPriorityText(): string {
    switch (this.task.priority) {
      case 'high': return 'גבוהה';
      case 'normal': return 'רגילה';
      case 'low': return 'נמוכה';
      default: return '';
    }
  }

  getPriorityColor(): string {
    switch (this.task.priority) {
      case 'high': return 'warn';
      case 'normal': return 'accent';
      case 'low': return 'primary';
      default: return '';
    }
  }

  getPriorityIcon(): string {
    switch (this.task.priority) {
      case 'high': return 'arrow_upward';
      case 'normal': return 'remove';
      case 'low': return 'arrow_downward';
      default: return 'flag';
    }
  }

  getStatusText(): string {
    switch (this.task.status) {
      case 'todo': return 'לביצוע';
      case 'in_progress': return 'בתהליך';
      case 'done': return 'הושלם';
      default: return '';
    }
  }

  getStatusColor(): string {
    switch (this.task.status) {
      case 'todo': return '#f44336';
      case 'in_progress': return '#ff9800';
      case 'done': return '#4caf50';
      default: return '#999';
    }
  }

  getStatusColorByValue(status: string): string {
    switch (status) {
      case 'todo': return '#f44336';
      case 'in_progress': return '#ff9800';
      case 'done': return '#4caf50';
      default: return '#999';
    }
  }

  getStatusIconByValue(status: string): string {
    switch (status) {
      case 'todo': return 'radio_button_unchecked';
      case 'in_progress': return 'hourglass_empty';
      case 'done': return 'check_circle';
      default: return 'flag';
    }
  }

  formatDate(date?: string): string {
    if (!date) return '';
    
    const d = new Date(date);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return `איחור ${Math.abs(days)} ימים`;
    } else if (days === 0) {
      return 'היום';
    } else if (days === 1) {
      return 'מחר';
    } else if (days <= 7) {
      return `עוד ${days} ימים`;
    } else {
      return d.toLocaleDateString('he-IL');
    }
  }

  isOverdue(): boolean {
    if (!this.task.dueDate) return false;
    return new Date(this.task.dueDate) < new Date();
  }

  toggleComments(): void {
    this.showComments = !this.showComments;
  }

  startEdit(): void {
    this.isEditing = true;
    this.showComments = false; // הסתר תגובות בעת עריכה
    this.editData = {
      title: this.task.title,
      description: this.task.description,
      status: this.task.status,
      priority: this.task.priority,
      dueDate: this.task.dueDate ? new Date(this.task.dueDate) : null,
      assigneeId: this.task.assigneeId
    };
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editData = {};
  }

  saveEdit(): void {
    if (!this.editData.title?.trim()) {
      alert('נא להזין כותרת למשימה');
      return;
    }

    const updateData: UpdateTaskRequest = {};
    
    if (this.editData.title !== this.task.title) {
      updateData.title = this.editData.title;
    }
    if (this.editData.description !== this.task.description) {
      updateData.description = this.editData.description;
    }
    if (this.editData.status !== this.task.status) {
      updateData.status = this.editData.status;
    }
    if (this.editData.priority !== this.task.priority) {
      updateData.priority = this.editData.priority;
    }
    if (this.editData.dueDate) {
      const dueDateStr = this.editData.dueDate.toISOString();
      if (dueDateStr !== this.task.dueDate) {
        updateData.dueDate = dueDateStr;
      }
    }
    if (this.editData.assigneeId !== this.task.assigneeId) {
      updateData.assigneeId = this.editData.assigneeId;
    }

    if (Object.keys(updateData).length > 0) {
      this.update.emit(updateData);
    }
    
    this.isEditing = false;
  }

  onDelete(): void {
    if (confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) {
      this.delete.emit();
    }
  }

  onStatusChange(status: TaskStatus): void {
    this.statusChange.emit(status);
  }
}