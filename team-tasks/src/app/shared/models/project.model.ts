export type ProjectStatus = 'active' | 'archived' | 'completed';

export interface Project {
  id: number;
  teamId: number;
  name: string;
  description?: string;
  status?: ProjectStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProjectRequest {
  teamId: number;
  name: string;
  description?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}