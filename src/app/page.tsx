"use client";
import WordleGame from "@/components/Wordle";
import { ToastContainer } from "react-toastify";
export default function Home() {
  return (
    <div className="flex justify-center mt-6">
      <ToastContainer
        position="top-center"
        autoClose={500}
        hideProgressBar={true}
      />
      <WordleGame />
    </div>
  );
}
