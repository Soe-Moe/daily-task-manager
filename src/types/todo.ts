export type Priority = 'low' | 'medium' | 'high';

export type DueOption = 'none' | 'today' | 'tomorrow' | 'weekend' | 'next_week';

export interface Todo {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  dueDate: string | null;
  completed: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}
