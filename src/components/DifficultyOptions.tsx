"use client";

import { FC } from "react";

interface Props {
  changeDifficulty: (dif: string) => void;
  difficulty: string;
}

const DifficultyOptions: FC<Props> = ({ changeDifficulty, difficulty }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-center text-lg">
        {difficulty ? "Change" : "Choose"} Difficulty
      </h1>
      <div className="flex gap-5">
        {["easy", "medium", "hard"].map((dif) => {
          return (
            <button
              key={dif}
              className={` text-lg capitalize ${
                dif === difficulty && "text-red-500"
              }`}
              onClick={() => changeDifficulty(dif)}
            >
              {dif}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultyOptions;
