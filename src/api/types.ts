export interface RegisterUserDto {
  accountType: "student" | "teacher";
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
  telephone: string;
}

export interface LoginUserDto {
  Email: string;
  Password: string;
}

export interface AuthResponse {
  accessToken: string;
  name: string;
  surname: string;
  roles: string[];
}
