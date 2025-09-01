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
  roles: string[];
}

export interface aboutUser {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  description: string;
}

// Teacher Section
export interface Teacher {
  name: string;
  surname: string;
  description: string;
  coursesBrief:[];
}

export interface TeacherReview {
  reviewerName: string;
  reviewerSurname: string;
  starsNumber: number;
  content: string
}

export interface TeacherAvailability {
  day: string;
  timeslots: { timeFrom: string; timeUntil: string }[];
}

// Course Section
export interface Course {
  id: string;
  name: string;
  description: string;
  variants: CourseVariant[];
  thumbnailUrl: string;
  teacher: Teacher;
}

export interface CourseVariant {
  level: string;
  price: number;
  language: string;
}

export interface CoursesBrief {
  id: string;
  name: string
}

