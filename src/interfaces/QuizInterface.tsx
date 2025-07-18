import type {Tag} from "@/interfaces/TagInterface.tsx";
import type {Question} from "@/interfaces/QuestionInterface.tsx";

/**
 * Represents a quiz question with its properties and possible answers
 * @interface Question
 * @property {string} id - Unique identifier for the question
 * @property {string} title - The main text or title of the question
 * @property {string} [description] - Optional detailed description or context for the question
 * @property {string} [imageUrl] - Optional URL to an image associated with the question
 * @property {Answer[]} answers - Array of possible answers for the question
 * @property {boolean} isAnswered - Indicates whether the question has been answered by the user
 */

export interface Quiz {
    id: string;
    title: string;
    description?: string;
    questions: Question[];
    isMultipleChoice: boolean;
    tags: Tag[];
}
