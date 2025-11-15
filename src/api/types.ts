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

export interface ClassBrief {
  startTime: Date;
  courseId: string;
  courseName: string;
  teacherId: string;
}
export interface FileData {
  id: string;
  fileName: string;
  relativePath: string;
  uploadedAt: string;
  uploadedBy: string;
  courseId?: string;
  courseName?: string;
  tags: FileTag[];
}
export interface FileFilter {
  query?: string;
  studentId?: string;
  courseId?: string;
  origin?: string[];
  tagIds?: string[];
  createdBy?: string[];
  type?: string[];
  //optional: dates (can be added)
}

export interface FileTag {
  id: string;
  name: string;
  ownerId: string;
}

/**
 * Represents a brief student view used in selection lists.
 */
export type StudentBriefDTO = {
  id: string;
  name: string;
  surname: string;
};

/**
 * A single class with its course name and students enrolled in the course/class.
 * This is returned by the backend: GET /api/teachers/classes-with-students
 */
export type ClassWithStudentsDTO = {
  classId: string;
  courseName: string;
  students: StudentBriefDTO[];
};

export type Student = { name: string; courses: CourseBrief[] };

export type CourseBrief = {
  id: string;
  name: string;
};


export type QuizBrief = {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  questionNumber: number;
  completed: boolean;
};

export type Quiz = {
  id: string;
  name: string;
  classId: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  studentId: string;
  // questions: Question[];
  isMultipleChoice: boolean;
  score?: number;
  maxScore: number;
};

export type Question = {
  id?: string; //id opcjonalne - jak tworzymy to nie mamy
  content: string;
  categories: QuestionCategory[];
  answers?: Answer[]; // nie zwracane przy podglądzie
  //answered?: boolean; //wysyłane przez solve
};

export type Answer = {
  id?: string; //id opcjonalne - jak tworzymy to nie mamy
  questionId?: string; //id opcjonalne - jak tworzymy to nie mamy??
  //correct?: boolean; //nie zwracane przy solve
  content: string;
};

export type QuestionCategory = {
  id?: string;
  name: string;
  description?: string; //imo do wywalenia
};
export type QuizSolution = {
  quizId: string;
  answers: {
    questionId: string;
    selectedAnswerIds: string[];
  }[];
};
