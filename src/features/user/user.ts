export interface User {
  name: string;
  surname: string;
  roles: Role[];
  activeRole: Role;
}

export type Role = "student" | "teacher";
