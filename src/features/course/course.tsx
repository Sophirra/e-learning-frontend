export interface Course {
  id: string;
  name: string;
  description: string;
  variants: CourseVariant[];
  thumbnailUrl: string;
  teacher: Teacher;
  courseBrief: CoursesBrief[];
  teacherReviews: TeacherReview[];
  teacherAvailability: TeacherAvailability[];
}

export interface CourseVariant {
  level: string;
  price: number;
  language: string;
}
export interface Teacher {
  name: string;
  surname: string;
  description: string;
  coursesBrief:[];
}

export interface CoursesBrief {
  id: string;
  name: string
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
