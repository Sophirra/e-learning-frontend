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
  id: string;
  name: string;
  surname: string;
  description: string;
  coursesBrief?: CoursesBrief[];
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
export interface CourseWidget {
  id: string;
  name: string;
  image: string;
  rating: number;
  description: string;
  minimumCoursePrice: number;
  maximumCoursePrice: number;
  levelVariants: string[];
  languageVariants: string[];
  teacherId: string;
  teacherName : string;
  teacherSurname : string;
}

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

