export interface Comment {
  id: number;
  taskId: number;
  userId: number;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  taskId: number;
  body: string;
}