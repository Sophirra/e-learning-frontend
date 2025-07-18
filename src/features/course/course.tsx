export interface Course {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  variants: CourseVariant[];
  thumbnailUrl: string;
}

export interface CourseVariant {
  level: string;
  price: number;
  language: string;
}
