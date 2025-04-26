"use client";
import Line from "./Line";
import { toast } from "react-toastify";
import { useEffect, useReducer, useState, useRef } from "react";

const API_URL = "/api/words";

export default function WordleGame() {
  const [guess, dispatch] = useReducer(guessReducer, initialGuessState);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [word, setWord] = useState("");
  const [guessResults, setGuessResults] = useState<GuessResult[]>([]);
  const validWords = useRef<ValidWords | null>(null);

  useEffect(() => {
    if (gameStatus !== "playing") return;
    const handleType = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        try {
          if (!validWords.current) throw new Error("Word list not loaded yet");
          const { result, nextGameStatus, isWin } = pipe(
            ([guessState, validWords]: [GuessState, ValidWords]) =>
              validateGuessSubmission(guessState, validWords),
            (guessObj: GuessState) =>
              processValidatedGuess({ guessObj, targetWord: word })
          )([guess, validWords.current]);

          setGuessResults((prev) => [...prev, result]);
          setGameStatus(nextGameStatus);
          if (isWin) {
            toast.success("Congratulations! 🎉");
          }

          dispatch({ type: "SUBMIT_GUESS" });
        } catch (error: any) {
          toast.error(error.message || "An unknown error occurred");
        }
      } else if (event.key === "Backspace") {
        dispatch({ type: "REMOVE_LETTER" });
      } else if (isLetter(event.key)) {
        dispatch({ type: "ADD_LETTER", payload: event.key });
      }
    };

    window.addEventListener("keydown", handleType);
    return () => window.removeEventListener("keydown", handleType);
  }, [guess, word, gameStatus]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((words: string[]) => {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setWord(randomWord);
        validWords.current = {
          has(word: string) {
            return words.includes(word);
          },
        };
      })
      .catch((error) => {
        console.error("Error fetching word list:", error);
        toast.error("Failed to load word list", { autoClose: 1500 });
      });
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 relative">
      <h1 className="text-2xl font-bold">Wordle</h1>

      {gameStatus === "lost" && (
        <div className="my-2 p-3 text-white bg-red-600 rounded shadow-md font-bold">
          Game Over! The word was: {word}
        </div>
      )}

      <div className="grid grid-rows-6 gap-2">
        {Array.from({ length: 6 }).map((_, index) => {
          const isCurrentRow = index === guess.attempts;
          const previousGuessResult = guessResults[index];

          return (
            <Line
              key={index}
              guess={
                isCurrentRow ? guess.value : previousGuessResult?.value ?? ""
              }
              statuses={
                isCurrentRow
                  ? null
                  : previousGuessResult?.letterStatuses ?? null
              }
              isActive={isCurrentRow && gameStatus === "playing"}
            />
          );
        })}
      </div>
    </div>
  );
}

const isLetter = (key: string): boolean => {
  return /^[a-zA-Z]$/.test(key);
};

export type LetterStatus = "correct" | "present" | "absent" | "empty";

interface GuessResult {
  value: string;
  letterStatuses: LetterStatus[];
}

const getGuessStatuses = (guess: string, word: string): LetterStatus[] => {
  const upperGuess = guess.toUpperCase();
  const upperWord = word.toUpperCase();

  if (upperGuess.length !== 5 || upperWord.length !== 5) {
    return Array(5).fill("empty");
  }

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
  for (let i = 0; i < 5; i++) {
    if (!guessLetters[i]) {
      statuses[i] = "empty";
    }
  }
  return statuses;
};

interface GuessState {
  value: string;
  isCompleted: boolean;
  attempts: number;
}

type Action =
  | { type: "ADD_LETTER"; payload: string }
  | { type: "REMOVE_LETTER" }
  | { type: "SUBMIT_GUESS" }
  | { type: "CLEAR_WORD" };

const initialGuessState: GuessState = {
  value: "",
  isCompleted: false,
  attempts: 0,
};

const guessReducer = (state: GuessState, action: Action): GuessState => {
  switch (action.type) {
    case "ADD_LETTER":
      if (state.value.length >= 5) return state;
      const newValue = state.value + action.payload;
      return {
        ...state,
        value: newValue,
        isCompleted: newValue.length === 5,
      };

    case "SUBMIT_GUESS":
      if (!state.isCompleted || state.attempts >= 6) return state;
      return {
        ...state,
        value: "",
        isCompleted: false,
        attempts: state.attempts + 1,
      };

    case "REMOVE_LETTER":
      return {
        ...state,
        value: state.value.slice(0, -1),
        isCompleted: false,
      };

    case "CLEAR_WORD":
      return {
        ...state,
        value: "",
        isCompleted: false,
      };

    default:
      return state;
  }
};

interface ValidWords {
  has: (word: string) => boolean;
}

const validateGuessSubmission = (
  guessState: GuessState,
  validWords: ValidWords
): GuessState => {
  if (!guessState.isCompleted) {
    throw new Error("Not enough letters");
  }
  const upperGuess = guessState.value.toUpperCase();
  if (!validWords.has(upperGuess)) {
    throw new Error("Not in word list");
  }
  return { ...guessState, value: upperGuess };
};

interface ProcessedGuess {
  result: GuessResult;
  nextGameStatus: "playing" | "won" | "lost";
  isWin: boolean;
}

const processValidatedGuess = ({
  guessObj,
  targetWord,
}: {
  guessObj: GuessState;
  targetWord: string;
}): ProcessedGuess => {
  const calculatedStatuses = getGuessStatuses(guessObj.value, targetWord);
  const isWin = calculatedStatuses.every((status) => status === "correct");

  let nextGameStatus: "playing" | "won" | "lost" = "playing";
  if (isWin) {
    nextGameStatus = "won";
  } else if (guessObj.attempts === 5) {
    nextGameStatus = "lost";
  }

  return {
    result: { value: guessObj.value, letterStatuses: calculatedStatuses },
    nextGameStatus: nextGameStatus,
    isWin: isWin,
  };
};

const pipe =
  (...fns: Function[]) =>
  (arg: any) =>
    fns.reduce((v, f) => f(v), arg);
