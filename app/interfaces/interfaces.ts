export interface Question  {
    id: number;
    text: string,
    proposals: Proposal[],
    answers: number[],
    difficulty: DIFFICULTIES,
    topics: string[],
}

export interface Proposal {
    text: string,
    id: number,
    reason: string
}

export interface Answer {
    questionId: number,
    userId: number
    correct: boolean,
}

export enum DIFFICULTIES {
    MEDIUM = "medium",
    EASY = "easy",
    HARD = "hard",
}

