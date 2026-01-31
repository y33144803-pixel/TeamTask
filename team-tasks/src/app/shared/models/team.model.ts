// src/app/shared/models/team.model.ts

export interface Team {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  members_count: number;
  created_at: string;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

export interface TeamMember {
  id?: number;
  userId: number;
  teamId: number;
  userName?: string;
  userEmail?: string;
  role?: 'owner' | 'member';
  joinedAt?: string;
}

export interface AddTeamMemberRequest {
  userId: number;
  role?: 'owner' | 'member';
}