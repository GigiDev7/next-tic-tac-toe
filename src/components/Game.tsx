"use client";
import { useState } from "react";
import Board from "./Board";

const Game = () => {
  const [difficulty, setDifficulty] = useState("");
  return (
    <div>
      {!difficulty ? (
        <>
          <h1 className="text-center mb-4 text-lg">Choose Difficulty</h1>
          <div className="flex gap-8">
            {["easy", "medium", "hard"].map((dif) => {
              return (
                <button
                  className="capitalize hover:text-gray-700 text-lg"
                  onClick={() => setDifficulty(dif)}
                  key={dif}
                >
                  {dif}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <Board difficulty={difficulty} />
      )}
    </div>
  );
};

export default Game;
