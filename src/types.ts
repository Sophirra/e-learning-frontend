/**
 * MISC SECTION
 **/
/**
 * Generic interface representing a paginated API response.
 **/
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export type TimeSlot = {
  start: number;
  end: number;
  dayIndex: number;
  date: Date;
  courseName?: string;
  studentName?: string;
  classId?: string;
  defined?: boolean;
  preSelected?: boolean;
};

export type ApiDayAvailability = {
  day: string;
  timeslots: { timeFrom: string; timeUntil: string }[];
};

export type DayAvailability = {
  day: Date;
  timeslots: { timeFrom: number; timeUntil: number }[];
};

/**
 * CALENDAR AND TIME SECTION
 */

export type WeekScheduleDialogProps = {
  disabled: boolean;
  onConfirm: (selectedSlot: TimeSlot) => void;
  classDetails?: string;
  courseId: string;
};

export type ClassSchedule = {
  classId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  classDate: Date;
  classStartTime: string;
  classEndTime: string;
};

/**
 * USERS SECTION
 */
export type AuthResponse = {
  accessToken: string;
  roles: string[];
};

export type RegisterUserDto = {
  accountType: "student" | "teacher";
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
  phone: string;
  aboutMe: string;
};

export type LoginUserDto = {
  email: string;
  password: string;
};

export type aboutUser = {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  description: string;
};

export type ProfilePicture = {
  fileName: string;
  url: string;
  uploadedAt: string;
};

/**
 * FILES SECTION
 */

export type FileData = {
  id: string;
  fileName: string;
  relativePath: string;
  uploadedAt: string;
  uploadedBy: string;
  courses: CourseShortVersion[];
  tags: FileTag[];
  ownerInfo: FileOwner;
};

export type FileBrief = {
  id: string;
  name: string;
  path: string;
};

export type FileFilter = {
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
};

export type FileTag = {
  id: string;
  name: string;
  ownerId: string;
};

export type FileOwner = {
  id: string;
  name: string;
  surname: string;
};

export type FileProps = {
  id: string;
  name: string;
  filePath: string;
  associatedCourseName: string;
  associatedClassDate: string;
};

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

/**
 * TEACHER SECTION
 */

export type Teacher = {
  id: string;
  name: string;
  surname: string;
  description: string;
  coursesBrief?: CourseBrief[];
  teacherProfilePictureUrl: string;
};

export type TeacherReview = {
  id: string;
  reviewerName: string;
  reviewerSurname: string;
  starsNumber: number;
  content: string;
};

export type TeacherAvailability = {
  day: string;
  timeslots: { timeFrom: string; timeUntil: string }[];
};

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

export type CourseWidget = {
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
};

export type Course = {
  id: string;
  name: string;
  description: string;
  variants: CourseVariant[];
  profilePictureUrl: string;
  teacher: Teacher;
};

export type CourseVariant = {
  levelName: string;
  levelId: string;
  price: number;
  languageName: string;
  languageId: string;
};

export type CourseShortVersion = {
  id: string;
  name: string;
};

export type CourseBrief = {
  id: string;
  name: string;
};

/**
 * CLASS SECTION
 */

export type ClassBrief = {
  id: string;
  startTime: Date;
  courseId: string;
  courseName: string;
  teacherId?: string;
  studentId?: string;
};

export type ClassBriefDto = {
  id: string;
  startTime: string;
  status: string;
  linkToMeeting?: string;
  links: string[];
  userId: string;
  courseId: string;
  courseName: string;
  // exercises: {
  //   id: string;
  //   exerciseStatus: string;
  //   grade?: number;
  // }[];
  // quizzes: {
  //   id: string;
  //   title: string;
  //   score?: number;
  // }[];
  // files: {
  //   id: string;
  //   name: string;
  //   path: string;
  //   courseName: string;
  //   classDate: string;
  // }[];
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

/**
 * EXERCISE SECTION
 */

export type ExerciseBrief = {
  id: string;
  name?: string;
  courseId: string;
  courseName: string;
  classStartTime: Date;
  exerciseStatus: "Unsolved" | "SolutionAdded" | "Submitted" | "Graded";
};

export type Exercise = {
  id?: string;
  name: string;
  classId?: string;
  courseName: string;
  className?: string;
  status: "Unsolved" | "SolutionAdded" | "Submitted" | "Graded";
  graded: boolean; // TO JEST RACZEJ BEZ SENSU BO JAK STATUS TO GRADED I JEST GRADE, TO TO Z TEGO WYNIKA
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

/**
 *  USER SECTION
 */

export interface User {
    name: string;
    surname: string;
    roles: Role[];
    activeRole: Role;
}

export type Role = "student" | "teacher";