"use client";

import { FC, useEffect, useLayoutEffect, useState } from "react";
import DifficultyOptions from "./DifficultyOptions";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGame } from "@/hooks/useGame";

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const Board = () => {
  const [gameBoard, setGameBoard] = useState<string[]>(Array(9).fill(""));
  const [turn, setTurn] = useState("");
  const [winner, setWinner] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const authCtx = useAuthContext();
  const router = useRouter();
  const { postGame, getGame, saveGame } = useGame();

  useEffect(() => {
    getGame(authCtx.email).then((res) => {
      console.log(res);
      if (res && res.board) {
        setGameBoard(res.board);
        setTurn("Player");
        setDifficulty("medium");
      }
    });
  }, []);

  useEffect(() => {
    if (!turn && difficulty) {
      const randNum = Math.random();
      if (randNum > 0.5) {
        setTurn("Player");
      } else {
        setTurn("AI");
        postGame({
          board: gameBoard,
          difficulty,
          email: authCtx.email,
          winner: "",
        }).then((res) => {
          if (res) {
            setGameBoard(res.board);
            setTurn("Player");
          }
        });
      }
    }
  }, [difficulty]);

  if (!authCtx.email) {
    return null;
  }

  function changeDifficulty(dif: string) {
    setDifficulty(dif);
  }

  function checkWinner(board: string[]) {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  function isBoardFull(board: string[]) {
    return board.every((val) => val !== "");
  }

  async function makePlayerMove(index: number) {
    if (!gameBoard[index] && turn === "Player") {
      const newBoard = [...gameBoard];
      newBoard[index] = "X";
      setGameBoard(newBoard);
      setTurn("AI");

      let newWinner = "";

      if (checkWinner(newBoard)) {
        setWinner("Player");
        newWinner = "Player";
      }

      if (isBoardFull(newBoard) && !winner) {
        setWinner("Draw");
        newWinner = "Draw";
      }

      const data = await postGame({
        board: newBoard,
        difficulty,
        email: authCtx.email,
        winner: newWinner,
      });

      if (data?.board) {
        setGameBoard(data.board);
        setTurn("Player");
        if (data.winner) {
          setWinner("AI");
        }
      }
    }
  }

  async function logout() {
    if (gameBoard.some((el) => el !== "") && !winner) {
      await saveGame(gameBoard, authCtx.email);
    }
    authCtx.logout();
    router.replace("/login");
  }

  function startOver() {
    setTurn("");
    setDifficulty("");
    setWinner("");
    setGameBoard(Array(9).fill(""));
  }

  return (
    <div>
      <button onClick={logout} className="fixed top-20 right-10">
        Logout
      </button>
      <div className="flex flex-col gap-8">
        {winner && (
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-bold">
              {winner === "Draw" ? "It's a draw" : `Winner is ${winner}`}
            </h1>
            <button
              className="bg-blue-500 hover:bg-blue-600 py-2 px-7 rounded-md text-white"
              onClick={startOver}
            >
              Start Over
            </button>
          </div>
        )}

        <DifficultyOptions
          changeDifficulty={changeDifficulty}
          difficulty={difficulty}
        />

        {difficulty && (
          <div className="grid grid-cols-3 gap-1">
            {gameBoard.map((val, index) => {
              return (
                <button
                  disabled={winner !== ""}
                  onClick={() => makePlayerMove(index)}
                  className="bg-gray-200 border border-gray-400 w-24 h-24 text-4xl font-bold text-center cursor-pointer"
                  key={index}
                >
                  {val}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
