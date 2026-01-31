import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectsService } from './projects.service';
import { Project } from '../shared/models/project.model';
import { NewProjectFormComponent } from './new-project-form.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NewProjectFormComponent
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class ProjectsComponent implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  
  teamId: number | null = null;
  
  readonly projects = signal<Project[]>([]);
  readonly error = signal<string>('');
  readonly loading = signal<boolean>(false);
  readonly editingProject = signal<Project | null>(null);
  
  showForm = false;
  editData = {
    name: '',
    description: ''
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['teamId']) {
        this.teamId = +params['teamId'];
      }
      this.loadProjects();
    });
  }

  loadProjects(): void {
    this.loading.set(true);
    this.error.set('');
    
    this.projectsService.getProjects(this.teamId ?? undefined).subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message || 'שגיאה בטעינת פרויקטים');
        this.loading.set(false);
      }
    });
  }

  onAddProject(data: {name: string, description: string}): void {
    if (!this.teamId) {
      this.error.set('לא נמצא מזהה צוות');
      return;
    }

    this.projectsService.createProject({
      name: data.name,
      description: data.description,
      teamId: this.teamId
    }).subscribe({
      next: (newProject: Project) => {
        this.projects.update(current => [...current, newProject]);
        this.showForm = false;
      },
      error: (err: Error) => {
        this.error.set(err.message || 'שגיאה ביצירת פרויקט');
      }
    });
  }

  onEditProject(project: Project): void {
    this.editingProject.set(project);
    this.editData = {
      name: project.name,
      description: project.description || ''
    };
  }

  saveEdit(): void {
    const project = this.editingProject();
    if (!project || !this.editData.name.trim()) {
      return;
    }

    this.projectsService.updateProject(project.id, {
      name: this.editData.name,
      description: this.editData.description
    }).subscribe({
      next: (updatedProject: Project) => {
        this.projects.update(current =>
          current.map(p => p.id === project.id ? updatedProject : p)
        );
        this.cancelEdit();
      },
      error: (err: Error) => {
        this.error.set(err.message || 'שגיאה בעדכון פרויקט');
      }
    });
  }

  cancelEdit(): void {
    this.editingProject.set(null);
    this.editData = { name: '', description: '' };
  }

  onRemoveProject(id: number): void {
    this.projectsService.deleteProject(id).subscribe({
      next: () => {
        this.projects.update(current => current.filter(p => p.id !== id));
      },
      error: (err: Error) => {
        this.error.set(err.message || 'שגיאה במחיקת פרויקט');
      }
    });
  }

  navigateToTasks(projectId: number): void {
    this.router.navigate(['/teams', this.teamId, 'projects', projectId, 'tasks']);
  }

  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'active': 'פעיל',
      'archived': 'בארכיון',
      'completed': 'הושלם'
    };
    return statusMap[status] || status;
  }

  clearError(): void {
    this.error.set('');
  }

  goBack(): void {
    this.location.back();
  }
}