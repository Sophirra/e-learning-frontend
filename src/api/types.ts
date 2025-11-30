/**
 * MISC SECTION
 */
/**
 * Generic interface representing a paginated API response.
 **/
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface TimeSlot {
  start: number;
  end: number;
  dayIndex: number;
  date: Date;
}

export interface ApiDayAvailability {
  day: string;
  timeslots: { timeFrom: string; timeUntil: string }[];
}

export interface WeekScheduleDialogProps {
  disabled: boolean;
  onConfirm: (selectedSlot: TimeSlot) => void;
  classDetails?: string;
  courseId: string;
}

export interface TimeSlot {
  start: number;
  end: number;
  dayIndex: number;
  date: Date;
  courseName?: string;
  studentName?: string;
  classId?: string;
}

//type downloaded from backend - can be moved
export interface ClassSchedule {
  classId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  classDate: Date;
  classStartTime: string;
  classEndTime: string;
}

export interface ApiDayAvailability {
  day: string;
  timeslots: { timeFrom: string; timeUntil: string }[];
}

export type FileLink = {
  id?: string;
  courseName: string;
  filePath: string;
  className?: string;
};

export type LinkProps = {
  id?: string;
  isMeeting?: boolean;
  path: string;
  courseName: string;
  className?: string;
};

export type FileProps = {
  id: string;
  name: string;
  filePath: string;
  associatedCourseName: string;
  associatedClassDate: string;
};

/**
 * USERS SECTION
 */
export interface AuthResponse {
  accessToken: string;
  roles: string[];
}
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

export interface aboutUser {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  description: string;
}

export interface ProfilePicture {
  fileName: string;
  url: string;
  uploadedAt: string;
}

/**
 * FILES SECTION
 */

export interface FileData {
  id: string;
  fileName: string;
  relativePath: string;
  uploadedAt: string;
  uploadedBy: string;
  courses: CourseShortVersion[];
  tags: FileTag[];
  ownerInfo: FileOwner;
}

export type FileBrief = {
  id: string;
  name: string;
  path: string;
};

export interface FileFilter {
  query?: string;
  studentId?: string;
  courseId?: string;
  origin?: string[];
  tagIds?: string[];
  createdBy?: string[];
  type?: string[];
  page?: number;
  pageSize?: number;
  //optional: dates (can be added)
}

export interface FileTag {
  id: string;
  name: string;
  ownerId: string;
}

export interface FileOwner {
  id: string;
  name: string;
  surname: string;
}

/**
 * TEACHER SECTION
 */

export interface Teacher {
  id: string;
  name: string;
  surname: string;
  description: string;
  coursesBrief?: CourseBrief[];
  teacherProfilePictureUrl: string;
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

/**
 * STUDENTS SECTION
 */

/**
 * Represents a brief student view used in selection lists.
 */
export type StudentBrief = {
  id: string;
  name: string;
  surname: string;
};

export type Student = {
  name: string;
  courses: CourseBrief[];
};

/**
 * COURSE SECTION
 */

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

export interface CourseShortVersion {
  id: string;
  name: string;
}

export type CourseBrief = {
  id: string;
  name: string;
};

/**
 * CLASS SECTION
 */

export interface ClassBrief {
  id: string;
  startTime: Date;
  courseId: string;
  courseName: string;
  teacherId?: string;
  studentId?: string;
}

//co to za potwór (z teacher calendar)
export type ClassBriefDto = {
  id: string;
  startTime: string;
  status: string;
  linkToMeeting?: string;
  links: string[];
  userId: string;
  courseId: string;
  courseName: string;
  exercises: {
    id: string;
    exerciseStatus: string;
    grade?: number;
  }[];
  quizzes: {
    id: string;
    title: string;
    score?: number;
  }[];
  files: {
    id: string;
    name: string;
    path: string;
    courseName: string;
    classDate: string;
  }[];
};

/**
 * A single class with its course name and students enrolled in the course/class.
 * This is returned by the backend: GET /api/teachers/classes-with-students
 */
export type ClassWithStudentsDTO = {
  classId: string;
  courseName: string;
  students: StudentBrief[];
};

/**
 * QUIZ & QUESTIONS SECTION
 */

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
  correct?: boolean; //nie zwracane przy solve
  content: string;
};

export type QuestionCategory = {
  id: string;
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

export type ExerciseBrief = {
  id: string;
  name: string;
  date: Date;
  status: string;
};
//
// export interface ExerciseProps {
//   id: string;
//   courseName: string;
//   className?: string;
//   status: string;
//   graded: boolean;
//   grade?: number;
//   comments?: string;
// }

export type Exercise = {
  id?: string;
  name: string; //nie wiem czym jest ale jest zawarte w ExerciseSummary
  courseName: string;
  className?: string;
  status: "Unsolved" | "SolutionAdded" | "Submitted" | "Graded";
  graded: boolean; //powinno być wyliczalne ze statusu, można usunąć
  grade?: number;
  comments?: string; //tylko gdy graded
  instruction?: string; //potrzebne tylko na podglądzie
  date: Date;
  files?: ExerciseFile[]; //musimy pobrać solution dla nauczyciela gdy jest status submitted
};

export type ExerciseFile = {
  id?: string;
  name: string;
  path: string;
  type: "solution" | "content";
  uploadDate?: Date;
};
