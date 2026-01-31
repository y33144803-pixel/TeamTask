import { Component, input, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService, Comment, CreateCommentDto } from './comments.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.scss'

})
export class CommentsComponent {
  // Input Signal
  taskId = input.required<string>();

  // Service Injection
  private commentsService = inject(CommentsService);

  // State Signals
  comments = signal<Comment[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  newCommentText = signal<string>('');
  replyToCommentId = signal<string | null>(null);

  // Computed Signals
  topLevelComments = computed(() => {
    return this.sortedComments().filter(c => !c.parentId);
  });

  sortedComments = computed(() => {
    return [...this.comments()].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  replyToComment = computed(() => {
    const replyId = this.replyToCommentId();
    if (!replyId) return null;
    return this.comments().find(c => c.id === replyId);
  });

  // Effect - Load comments when taskId changes
  constructor() {
    effect(() => {
      const id = this.taskId();
      this.loadComments(id);
    });
  }

  /**
   * Load comments for the task
   */
  private loadComments(taskId: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.commentsService.getCommentsByTaskId(taskId).subscribe({
      next: (comments) => {
        this.comments.set(comments);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
        this.comments.set([]);
      }
    });
  }

  /**
   * Get replies for a specific comment
   */
  getReplies(commentId: string): Comment[] {
    return this.sortedComments().filter(c => c.parentId === commentId);
  }

  /**
   * Submit new comment or reply
   */
  submitComment(): void {
    const text = this.newCommentText().trim();
    if (!text) return;

    const dto: CreateCommentDto = {
      taskId: this.taskId(),
      content: text,
      parentId: this.replyToCommentId() || undefined
    };

    this.commentsService.addComment(dto).subscribe({
      next: () => {
        this.newCommentText.set('');
        this.replyToCommentId.set(null);
        this.loadComments(this.taskId());
      },
      error: (error) => {
        this.errorMessage.set(error.message);
      }
    });
  }

  /**
   * Start replying to a comment
   */
  startReply(commentId: string): void {
    this.replyToCommentId.set(commentId);
    this.newCommentText.set('');
  }

  /**
   * Cancel reply
   */
  cancelReply(): void {
    this.replyToCommentId.set(null);
    this.newCommentText.set('');
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.errorMessage.set('');
  }

  /**
   * Get initials from name for avatar
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Get avatar color based on author ID
   */
  getAvatarColor(authorId: string): string {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    const idStr = String(authorId);
    const hash = idStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | string): string {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'עכשיו';
    if (diffMins < 60) return `לפני ${diffMins} דקות`;
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    if (diffDays < 7) return `לפני ${diffDays} ימים`;

    return commentDate.toLocaleDateString('he-IL');
  }
}