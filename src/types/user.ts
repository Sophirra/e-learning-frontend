export type User = {
    id: string;
    name: string;
    email: string;
    role: "student" | "teacher"// | "guest" równoważny z null
}