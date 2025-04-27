"use client";
import Line from "./Line";
import { toast } from "react-toastify";
import { pipe } from "../lib/util";
import { useEffect, useReducer, useState, useRef } from "react";
import {
  validateGuess,
  processGuess,
  randomPick,
} from "../features/wordle/logic";
import { Guess, GuessResult } from "../features/wordle/domain";

const API_URL = "/api/words";

export default function WordleGame() {
  const [guess, dispatch] = useReducer(guessReducer, initialGuess);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );

  const [guessResults, setGuessResults] = useState<GuessResult[]>([]);
  const wordle = useRef<{ words: string[]; word: string }>(null);

  useEffect(() => {
    if (gameStatus !== "playing") return;
    const handleType = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        try {
          if (!wordle.current?.words)
            throw new Error("Word list not loaded yet");

          const {
            result: guessResult,
            isWin,
            gameStatus,
          } = pipe(
            (guess: Guess) => validateGuess(guess, wordle.current!.words),
            (validatedGuess: Guess) =>
              processGuess(validatedGuess, wordle.current!.word)
          )(guess);

          setGuessResults((prev) => [...prev, guessResult]);
          setGameStatus(gameStatus);
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
  }, [guess, gameStatus]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((words: string[]) => {
        wordle.current = {
          words,
          word: randomPick(words),
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
          Game Over! The word was: {wordle.current?.word}
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

type Action =
  | { type: "ADD_LETTER"; payload: string }
  | { type: "REMOVE_LETTER" }
  | { type: "SUBMIT_GUESS" }
  | { type: "CLEAR_WORD" };

const initialGuess: Guess = {
  value: "",
  isCompleted: false,
  attempts: 0,
};

const guessReducer = (state: Guess, action: Action): Guess => {
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

    default:
      return state;
  }
};
