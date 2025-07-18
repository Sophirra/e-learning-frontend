export interface Tag {
    id: string;
    name: string;
    category: 'student' | 'course' | 'creator' | 'level' | 'other';
}