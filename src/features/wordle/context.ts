import { toast } from "react-toastify";
import { Guess } from "./domain";
import { getGuessStatuses } from "./logic";

export class WordleContext {
  private words: string[];
  private word: string;
  readonly messages: { won: string; lost: string };

  constructor(words: string[], word: string) {
    this.words = words;
    this.word = word;
    this.messages = {
      won: "Congratulations! 🎉",
      lost: `Game Over! The word was: ${word}`,
    };
  }

  assertGuess(guess: Guess) {
    if (!guess.isCompleted) {
      throw new Error("Not enough letters");
    }
    if (!this.words.includes(guess.value.toUpperCase())) {
      throw new Error("Not in word list");
    }
  }

  processGuess(guess: Guess) {
    const letterStatuses = getGuessStatuses(guess.value, this.word);
    const isWin = letterStatuses.every((status) => status === "correct");
    let gameStatus: "playing" | "won" | "lost" = "playing";
    if (isWin) {
      gameStatus = "won";
    } else if (guess.attempts === 5) {
      gameStatus = "lost";
    }
    return {
      result: { value: guess.value, letterStatuses },
      gameStatus,
    };
  }

  getWord() {
    return this.word;
  }

  handleGameStatus(status: "playing" | "won" | "lost") {
    if (status === "playing") return;

    const message = this.messages[status];
    if (status === "won") {
      toast.info(message);
    } else if (status === "lost") {
      toast.info(message, { autoClose: 10000 });
    }
  }
}

export default function createWordleContext(words: string[], word: string) {
  return new WordleContext(words, word);
}
