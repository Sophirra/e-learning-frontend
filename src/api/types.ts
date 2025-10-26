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
  email: string;
  password: string;
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
  coursesBrief?: CourseBrief[];
  teacherProfilePictureUrl: string;
}

export interface ProfilePicture {
  fileName: string;
  url: string;
  uploadedAt: string;
}

export interface TeacherReview {
  id: string;
  reviewerName: string;
  reviewerSurname: string;
  starsNumber: number;
  content: string;
}

export interface TeacherAvailability {
  day: string;
  timeslots: { timeFrom: string; timeUntil: string }[];
}

// Course Section
export interface CourseWidget {
  id: string;
  name: string;
  profilePictureUrl: string;
  rating: number;
  description: string;
  minimumCoursePrice: number;
  maximumCoursePrice: number;
  levelVariants: string[];
  languageVariants: string[];
  teacherId: string;
  teacherName: string;
  teacherSurname: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  variants: CourseVariant[];
  profilePictureUrl: string;
  teacher: Teacher;
}

export interface CourseVariant {
  levelName: string;
  price: number;
  languageName: string;
}

export interface CourseBrief {
  courseId: string;
  courseName: string;
  teacherId: string;
  startTime: Date;
}
export interface FileData {
  id: string;
  fileName: string;
  relativePath: string;
  uploadedAt: string;
  uploadedBy: string;
  courseId?: string;
  courseName?: string;
  tags?: string[];
}
export interface FileFilter {
  query?: string;
  studentId?: string;
  courseId?: string;
  origin?: string[];
  tags?: string[];
  createdBy?: string[];
  type?: string[];
  //optional: dates (can be added)
}
