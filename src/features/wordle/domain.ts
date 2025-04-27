export type LetterStatus = "correct" | "present" | "absent";

export interface Guess {
  value: string;
  isCompleted?: boolean;
  attempts: number;
}

export interface GuessResult {
  value: string;
  letterStatuses: LetterStatus[];
}
