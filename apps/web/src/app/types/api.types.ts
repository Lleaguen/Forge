export type ApiError = {
  message: string
}

export type LoginResponse = {
  token: string
}

export interface DashboardStats {
  projects: {
    total: number;
    active: number;
    completed: number;
  };
  tasks: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
  };
  team: {
    totalMembers: number;
    activeMembers: number;
  };
  activity: {
    recentProjects: number;
    recentTasks: number;
  };
}

export interface Activity {
  id: string;
  type: 'project_created' | 'task_created' | 'task_updated' | 'member_added';
  title: string;
  description: string;
  userId: string;
  userName: string;
  createdAt: string;
  metadata?: {
    projectId?: string;
    projectName?: string;
    taskId?: string;
    taskTitle?: string;
    oldStatus?: string;
    newStatus?: string;
  };
}