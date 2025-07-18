import type {Answer} from "@/interfaces/AnswerInterface.tsx";

export interface Question {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    answers: Answer[];
    isAnswered: boolean;
}