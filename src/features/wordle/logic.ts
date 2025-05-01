import { Guess, LetterStatus, GuessResult } from "./domain";

export function validateGuess(guess: Guess, words: string[]): Guess {
  if (!guess.isCompleted) {
    throw new Error("Not enough letters");
  }
  const upperGuess = guess.value.toUpperCase();
  if (!words.includes(upperGuess)) {
    throw new Error("Not in word list");
  }
  return { ...guess, value: upperGuess };
}

export function randomPick(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)];
}

export function processGuess(
  guess: Guess,
  word: string
): {
  result: GuessResult;
  gameStatus: "playing" | "won" | "lost";
} {
  const letterStatuses = getGuessStatuses(guess.value, word);
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

export function getGuessStatuses(guess: string, word: string): LetterStatus[] {
  const upperGuess = guess.toUpperCase();
  const upperWord = word.toUpperCase();

  const wordLetters = upperWord.split("");
  const guessLetters = upperGuess.split("");
  const statuses: LetterStatus[] = Array(5).fill("absent");
  const wordLetterUsage = wordLetters.map(() => false);

  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === wordLetters[i]) {
      statuses[i] = "correct";
      wordLetterUsage[i] = true;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (statuses[i] === "correct") continue;
    let foundMatchIndex = -1;
    for (let j = 0; j < 5; j++) {
      if (!wordLetterUsage[j] && guessLetters[i] === wordLetters[j]) {
        foundMatchIndex = j;
        break;
      }
    }
    if (foundMatchIndex !== -1) {
      statuses[i] = "present";
      wordLetterUsage[foundMatchIndex] = true;
    }
  }
  return statuses;
}
