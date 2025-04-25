import Image from "next/image";
import WordleGame from "@/components/Wordle";
export default function Home() {
  return (
    <div className="flex justify-center mt-6">
      <WordleGame />
    </div>
  );
}
