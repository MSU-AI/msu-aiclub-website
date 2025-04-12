// Custom types for database queries
export type DbUser = {
  id: string;
  email: string;
  metadata: unknown;
  user_metadata?: {
    full_name?: string;
    [key: string]: any;
  };
  roles: Array<{ id: string; name: string; [key: string]: any }>;
  projects: Array<{ id: string; name: string; [key: string]: any }>;
  points: number;
};
