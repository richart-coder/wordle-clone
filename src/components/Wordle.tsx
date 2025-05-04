"use client";
import Line from "./Line";
import { toast } from "react-toastify";
import { useEffect, useReducer, useRef } from "react";
import { randomPick } from "../features/wordle/logic";
import createWordleContext, { WordleContext } from "../features/wordle/context";
import { Guess, GuessResult } from "../features/wordle/domain";

const API_URL = "/api/words";

interface Game {
  status: "playing" | "won" | "lost";
  results: GuessResult[];
}

const initialGame: Game = {
  status: "playing",
  results: [],
};

const gameReducer = (
  state: Game,
  action: {
    type: "PROCESS";
    payload: {
      result: GuessResult;
      gameStatus: "playing" | "won" | "lost";
    };
  }
) => {
  const { type, payload } = action;
  switch (type) {
    case "PROCESS": {
      return {
        status: payload.gameStatus,
        results: [...state.results, payload.result],
      };
    }
    default:
      return state;
  }
};

const initialGuess: Guess = {
  value: "",
  isCompleted: false,
  attempts: 0,
};

const guessReducer = (
  state: Guess,
  action:
    | { type: "ADD_LETTER"; payload: string }
    | { type: "REMOVE_LETTER" }
    | { type: "SUBMIT_GUESS" }
): Guess => {
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

const isLetter = (key: string): boolean => {
  return /^[a-zA-Z]$/.test(key);
};

export default function WordleGame() {
  const [guess, guessDispatch] = useReducer(guessReducer, initialGuess);
  const [game, gameDispatch] = useReducer(gameReducer, initialGame);

  const wordleContextRef = useRef<WordleContext | null>(null);

  useEffect(() => {
    if (game.status !== "playing" && wordleContextRef.current) {
      wordleContextRef.current.handleGameStatus(game.status);
    }
  }, [game.status]);

  const handleType = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      try {
        if (!wordleContextRef.current) return;

        wordleContextRef.current.assertGuess(guess);

        gameDispatch({
          type: "PROCESS",
          payload: wordleContextRef.current.processGuess(guess),
        });

        guessDispatch({ type: "SUBMIT_GUESS" });
      } catch (error: any) {
        toast.error(error.message || "An unknown error occurred");
      }
    } else if (event.key === "Backspace") {
      guessDispatch({ type: "REMOVE_LETTER" });
    } else if (isLetter(event.key)) {
      guessDispatch({ type: "ADD_LETTER", payload: event.key });
    }
  };

  useEffect(() => {
    if (game.status !== "playing") return;
    window.addEventListener("keydown", handleType);
    return () => window.removeEventListener("keydown", handleType);
  }, [guess, game.status]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((words: string[]) => {
        const word = randomPick(words);
        wordleContextRef.current = createWordleContext(words, word);
      })
      .catch(() => {
        toast.error("Failed to load game data. Please try again.");
      });
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 relative">
      <h1 className="text-2xl font-bold">Wordle</h1>
      <div className="grid grid-rows-6 gap-2">
        {Array.from({ length: 6 }).map((_, index) => {
          const isCurrentRow = index === guess.attempts;
          const result = game.results[index];

          return (
            <Line
              key={index}
              guess={isCurrentRow ? guess.value : result?.value ?? ""}
              statuses={isCurrentRow ? null : result?.letterStatuses ?? null}
              isActive={isCurrentRow && game.status === "playing"}
            />
          );
        })}
      </div>
    </div>
  );
}
