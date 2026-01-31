import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TeamsService } from './teams.service';
import { Team } from '../shared/models/team.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NewTeamFormComponent } from './new-team-form.component';
import { TeamMembersComponent } from './team-members.component';

type TeamsState = {
  loading: boolean;
  error?: string | null;
  teams: Team[];
};

@Component({
  selector: 'app-teams',
  standalone: true,
  templateUrl: './teams.html',
  styleUrl: './teams.scss',  // ⚠️ נוסיף קובץ styles
  imports: [
    CommonModule,
    NewTeamFormComponent,
    MatListModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    TeamMembersComponent  
  ]
})
export class TeamsComponent implements OnInit, OnDestroy {
  private readonly teamsService = inject(TeamsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  
  private readonly stateSubject = new BehaviorSubject<TeamsState>({ 
    loading: true, 
    teams: [] 
  });
  
  readonly state$ = this.stateSubject.asObservable();
  private readonly destroy$ = new Subject<void>();
  
  showForm = false;
  selectedTeamId: number | null = null;

  ngOnInit(): void {
    this.loadTeams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTeams(): void {
    this.stateSubject.next({ 
      loading: true, 
      teams: this.stateSubject.value.teams 
    });

    this.teamsService.getTeams()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (teams) => {
          this.stateSubject.next({
            loading: false,
            teams: Array.isArray(teams) ? teams : []
          });
        },
        error: (err) => {
          const errorMessage = err?.message || err?.error?.message || 'שגיאה בטעינת רשימת הצוותים';
          this.stateSubject.next({
            loading: false,
            error: errorMessage,
            teams: []
          });
        }
      });
  }

  onCreateTeam(name: string): void {
    this.teamsService.createTeam({ name })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showForm = false;
          this.loadTeams();
          this.showSuccess('הצוות נוצר בהצלחה!');
        },
        error: (err) => {
          const errorMessage = err?.message || err?.error?.message || 'שגיאה ביצירת צוות';
          this.showError(errorMessage);
        }
      });
  }

  onCancelCreate(): void { 
    this.showForm = false; 
  }

  onMemberAdded(): void {
    this.selectedTeamId = null;
    this.loadTeams();
    this.showSuccess('חבר נוסף לצוות בהצלחה!');
  }

  openAddMember(team: Team): void { 
    this.selectedTeamId = team.id; 
  }

  closeAddMember(): void { 
    this.selectedTeamId = null; 
  }

  /**
   * ניווט לפרויקטים של הצוות
   */
  navigateToProjects(teamId: number): void {
    this.router.navigate(['/teams', teamId, 'projects']);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'סגור', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'סגור', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}