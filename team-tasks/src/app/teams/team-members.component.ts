// // import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { TeamsService } from './teams.service';
// // import { MatButtonModule } from '@angular/material/button';
// // import { FormsModule } from '@angular/forms';
// // import { HttpErrorResponse } from '@angular/common/http';

// // @Component({
// //   selector: 'app-team-members',
// //   standalone: true,
// //   imports: [CommonModule, MatButtonModule, FormsModule],
// //   changeDetection: ChangeDetectionStrategy.Default, // ✅ הוספה
// //   template: `
// //     <form (ngSubmit)="addMember()" style="display:flex;gap:8px;align-items:center;margin-bottom:12px;">
// //       <input 
// //         type="number"
// //         [(ngModel)]="userId"
// //         name="userId"
// //         required 
// //         min="1"
// //         placeholder="User ID (מספר) להוספה"
// //         [ngClass]="{'invalid-input': !validUserId() && attemptedSubmit}"
// //         (ngModelChange)="clearError()"
// //         [disabled]="isSubmitting"
// //       >
// //       <button 
// //         mat-raised-button 
// //         color="primary" 
// //         type="submit" 
// //         [disabled]="!validUserId() || isSubmitting"
// //       >
// //         {{ isSubmitting ? 'מוסיף...' : 'הוסף' }}
// //       </button>
// //       <button 
// //         mat-button 
// //         type="button" 
// //         (click)="onCancel()"
// //         [disabled]="isSubmitting"
// //       >
// //         ביטול
// //       </button>
// //     </form>
    
// //     <div *ngIf="attemptedSubmit && !validUserId()" 
// //          style="color:#ff9800;font-size:14px;margin-bottom:8px;">
// //       ⚠️ יש להזין מזהה משתמש מספרי גדול מאפס
// //     </div>
    
// //     <div *ngIf="error" 
// //          style="color:#d32f2f;font-size:18px;font-weight:bold;margin:0;padding:12px 0;background:#ffebee;border-right:4px solid #d32f2f;">
// //       {{ error }}
// //     </div>
// //     <p>{{error}}</p>
// //   `,
// //   styles: [`
// //     .invalid-input { 
// //       border: 2px solid #d32f2f !important; 
// //       background: #ffebee !important; 
// //     }
// //     input:disabled, button:disabled {
// //       opacity: 0.6;
// //       cursor: not-allowed;
// //     }
// //   `]
// // })
// // export class TeamMembersComponent {
// //   @Input() teamId!: string;
// //   @Output() cancel = new EventEmitter<void>();
// //   @Output() memberAdded = new EventEmitter<void>();
  
// //   userId: number | null = null;
// //   error: string | null = null;
// //   attemptedSubmit = false;
// //   isSubmitting = false;

// //   constructor(
// //     private teamsService: TeamsService,
// //     private cdr: ChangeDetectorRef
// //   ) {}

// //   validUserId(): boolean {
// //     return this.userId !== null && this.userId > 0;
// //   }

// //   clearError(): void {
// //     this.error = null;
// //     this.attemptedSubmit = false;
// //   }

// //   addMember(): void {
// //     this.attemptedSubmit = true;
    
// //     if (!this.validUserId() || this.isSubmitting) {
// //       return;
// //     }

// //     this.isSubmitting = true;
// //     this.error = null;

// //     const userIdToAdd = this.userId as number;

// //     this.teamsService.addMember(this.teamId, userIdToAdd)
// //       .subscribe({
// //         next: (member) => {
// //           this.resetForm();
// //           this.cdr.detectChanges();
// //           this.memberAdded.emit();
// //         },
// //         error: (err: HttpErrorResponse) => {
// //           this.isSubmitting = false;
// //           this.handleError(err, userIdToAdd);
// //         }
// //       });
// //   }

// //   private handleError(err: HttpErrorResponse, userId: number): void {
// //     // ✅ הגדרה ישירה
// //     if (err.status === 500 || err.status === 502 || err.status === 503) {
// //       this.error = `משתמש ${userId} לא קיים במערכת`;
// //     } else if (err.status === 404) {
// //       this.error = `משתמש ${userId} לא קיים במערכת`;
// //     } else if (err.status === 409) {
// //       this.error = 'משתמש כבר חבר בצוות';
// //     } else if (err.status === 0) {
// //       this.error = 'לא ניתן להתחבר לשרת';
// //     } else {
// //       this.error = `שגיאה (${err.status})`;
// //     }
    
// //     // ✅ כפה רענון מיידי
// //     Promise.resolve().then(() => {
// //       this.cdr.detectChanges();
// //     });
// //   }

// //   private resetForm(): void {
// //     this.userId = null;
// //     this.error = null;
// //     this.attemptedSubmit = false;
// //     this.isSubmitting = false;
// //   }

// //   onCancel(): void {
// //     this.resetForm();
// //     this.cancel.emit();
// //   }
// // }


// import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { TeamsService } from './teams.service';
// import { MatButtonModule } from '@angular/material/button';
// import { FormsModule } from '@angular/forms';
// import { HttpErrorResponse } from '@angular/common/http';

// @Component({
//   selector: 'app-team-members',
//   standalone: true,
//   imports: [CommonModule, MatButtonModule, FormsModule],
//   changeDetection: ChangeDetectionStrategy.Default,
//   template: `
//     <form (ngSubmit)="addMember()" style="display:flex;gap:8px;align-items:center;margin-bottom:12px;">
//       <input 
//         type="number"
//         [(ngModel)]="userId"
//         name="userId"
//         required 
//         min="1"
//         placeholder="User ID (מספר) להוספה"
//         [ngClass]="{'invalid-input': !validUserId() && attemptedSubmit}"
//         (ngModelChange)="clearError()"
//         [disabled]="isSubmitting"
//       >
//       <button 
//         mat-raised-button 
//         color="primary" 
//         type="submit" 
//         [disabled]="!validUserId() || isSubmitting"
//       >
//         {{ isSubmitting ? 'מוסיף...' : 'הוסף' }}
//       </button>
//       <button 
//         mat-button 
//         type="button" 
//         (click)="onCancel()"
//         [disabled]="isSubmitting"
//       >
//         ביטול
//       </button>
//     </form>
    
//     <div *ngIf="attemptedSubmit && !validUserId()" 
//          style="color:#ff9800;font-size:14px;margin-bottom:8px;">
//       ⚠️ יש להזין מזהה משתמש מספרי גדול מאפס
//     </div>
    
//     <div *ngIf="error" 
//          style="color:#d32f2f;font-size:18px;font-weight:bold;margin:0;padding:12px 0;background:#ffebee;border-right:4px solid #d32f2f;">
//       {{ error }}
//     </div>
//   `,
//   styles: [`
//     .invalid-input { 
//       border: 2px solid #d32f2f !important; 
//       background: #ffebee !important; 
//     }
//     input:disabled, button:disabled {
//       opacity: 0.6;
//       cursor: not-allowed;
//     }
//   `]
// })
// export class TeamMembersComponent {
//   // ⚠️ שינוי: teamId מ-string ל-number
//   @Input() teamId!: number;
//   @Output() cancel = new EventEmitter<void>();
//   @Output() memberAdded = new EventEmitter<void>();
  
//   userId: number | null = null;
//   error: string | null = null;
//   attemptedSubmit = false;
//   isSubmitting = false;

//   constructor(
//     private readonly teamsService: TeamsService,
//     private readonly cdr: ChangeDetectorRef
//   ) {}

//   validUserId(): boolean {
//     return this.userId !== null && this.userId > 0;
//   }

//   clearError(): void {
//     this.error = null;
//     this.attemptedSubmit = false;
//   }

//   addMember(): void {
//     this.attemptedSubmit = true;
    
//     if (!this.validUserId() || this.isSubmitting) {
//       return;
//     }

//     this.isSubmitting = true;
//     this.error = null;

//     const userIdToAdd = this.userId as number;

//     // ⚠️ שינוי: שימוש ב-AddTeamMemberRequest object
//     this.teamsService.addMember(this.teamId, { userId: userIdToAdd })
//       .subscribe({
//         next: () => {
//           this.resetForm();
//           this.cdr.detectChanges();
//           this.memberAdded.emit();
//         },
//         error: (err: HttpErrorResponse) => {
//           this.isSubmitting = false;
//           this.handleError(err, userIdToAdd);
//         }
//       });
//   }

//   private handleError(err: HttpErrorResponse, userId: number): void {
//     if (err.status === 500 || err.status === 502 || err.status === 503) {
//       this.error = `משתמש ${userId} לא קיים במערכת`;
//     } else if (err.status === 404) {
//       this.error = `משתמש ${userId} לא קיים במערכת`;
//     } else if (err.status === 409) {
//       this.error = 'משתמש כבר חבר בצוות';
//     } else if (err.status === 0) {
//       this.error = 'לא ניתן להתחבר לשרת';
//     } else {
//       this.error = err.error?.message || `שגיאה (${err.status})`;
//     }
    
//     // כפה רענון מיידי
//     Promise.resolve().then(() => {
//       this.cdr.detectChanges();
//     });
//   }

//   private resetForm(): void {
//     this.userId = null;
//     this.error = null;
//     this.attemptedSubmit = false;
//     this.isSubmitting = false;
//   }

//   onCancel(): void {
//     this.resetForm();
//     this.cancel.emit();
//   }
// }

import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { TeamsService } from './teams.service';
import { UserService } from '../core/services/user.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatButtonModule, 
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="add-member-container">
      <h4>הוסף חבר לצוות</h4>
      
      @if (loadingUsers()) {
        <div class="loading">
          <mat-progress-spinner diameter="30" mode="indeterminate"></mat-progress-spinner>
          <span>טוען משתמשים...</span>
        </div>
      }
      
      @if (!loadingUsers() && users().length > 0) {
        <div class="form-field">
          <label for="userSelect">בחר משתמש:</label>
          <select 
            id="userSelect"
            [(ngModel)]="selectedUserId"
            name="userSelect"
            class="user-select"
            [disabled]="isSubmitting">
            <option [ngValue]="null">-- בחר משתמש --</option>
            @for (user of users(); track user.id) {
              <option [ngValue]="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            }
          </select>
        </div>
        
        <div class="form-actions">
          <button 
            mat-raised-button 
            color="primary"
            (click)="addMember()"
            [disabled]="!selectedUserId || isSubmitting">
            {{ isSubmitting ? 'מוסיף...' : 'הוסף לצוות' }}
          </button>
          <button 
            mat-button 
            (click)="onCancel()"
            [disabled]="isSubmitting">
            ביטול
          </button>
        </div>
      }
      
      @if (error()) {
        <div class="error-message">
          {{ error() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .add-member-container {
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      margin-top: 12px;
    }
    
    h4 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 18px;
    }
    
    .loading {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      justify-content: center;
      color: #666;
    }
    
    .form-field {
      margin-bottom: 16px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    
    .user-select {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      direction: rtl;
      
      &:focus {
        outline: none;
        border-color: #3f51b5;
      }
      
      &:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
      }
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
    }
    
    .error-message {
      margin-top: 12px;
      padding: 12px;
      background: #ffebee;
      color: #c62828;
      border-radius: 4px;
      border-right: 4px solid #f44336;
      font-weight: 500;
    }
  `]
})
export class TeamMembersComponent implements OnInit {
  @Input() teamId!: number;
  @Output() cancel = new EventEmitter<void>();
  @Output() memberAdded = new EventEmitter<void>();
  
  // Signals
  users = signal<User[]>([]);
  loadingUsers = signal<boolean>(false);
  error = signal<string>('');
  
  selectedUserId: number | null = null;
  isSubmitting = false;

  constructor(
    private readonly teamsService: TeamsService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * טעינת רשימת כל המשתמשים
   */
  loadUsers(): void {
    this.loadingUsers.set(true);
    this.error.set('');
    
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loadingUsers.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message || 'שגיאה בטעינת משתמשים');
        this.loadingUsers.set(false);
        this.users.set([]);
      }
    });
  }

  /**
   * הוספת חבר לצוות
   */
  addMember(): void {
    if (!this.selectedUserId || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.error.set('');

    this.teamsService.addMember(this.teamId, { userId: this.selectedUserId })
      .subscribe({
        next: () => {
          this.resetForm();
          this.memberAdded.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.handleError(err);
        }
      });
  }

  private handleError(err: HttpErrorResponse): void {
    let errorMessage = 'שגיאה בהוספת חבר';
    
    if (err.status === 404) {
      errorMessage = 'משתמש לא נמצא במערכת';
    } else if (err.status === 409) {
      errorMessage = 'משתמש כבר חבר בצוות';
    } else if (err.status === 403) {
      errorMessage = 'אין לך הרשאה להוסיף חברים';
    } else if (err.error?.message) {
      errorMessage = err.error.message;
    }
    
    this.error.set(errorMessage);
  }

  private resetForm(): void {
    this.selectedUserId = null;
    this.error.set('');
    this.isSubmitting = false;
  }

  onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }
}