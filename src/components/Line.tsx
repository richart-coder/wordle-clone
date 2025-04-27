import { LetterStatus } from "../features/wordle/domain";

interface LineProps {
  guess: string;
  statuses: LetterStatus[] | null;
  isActive: boolean;
}

const getStatusBgColor = (status: LetterStatus | undefined): string => {
  switch (status) {
    case "correct":
      return "bg-green-500";
    case "present":
      return "bg-yellow-500";
    case "absent":
      return "bg-gray-500";
    default:
      return "bg-white";
  }
};

export default function Line({ guess, statuses, isActive }: LineProps) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, index) => {
        const status = statuses ? statuses[index] : undefined;
        const bgColor = getStatusBgColor(status);
        const borderColor = isActive ? "border-gray-400" : "border-gray-300";
        const textColor =
          status === "correct" || status === "present" || status === "absent"
            ? "text-white"
            : "text-black";

        return (
          <div
            key={index}
            className={`w-12 h-12 border-2 ${borderColor} ${bgColor} ${textColor} flex items-center justify-center text-2xl font-bold uppercase`}
          >
            {guess[index] || ""}
          </div>
        );
      })}
    </div>
  );
}
