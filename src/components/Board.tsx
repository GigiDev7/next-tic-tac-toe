"use client";

import { FC, useEffect, useState } from "react";
import DifficultyOptions from "./DifficultyOptions";

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

/* interface BoardProps {
  difficulty: string;
} */

const Board = () => {
  const [gameBoard, setGameBoard] = useState<string[]>(Array(9).fill(""));
  const [turn, setTurn] = useState("");
  const [winner, setWinner] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    if (!turn && difficulty) {
      const randNum = Math.random();
      if (randNum > 0.5) {
        setTurn("Player");
      } else {
        setTurn("AI");
        makeMove(gameBoard, difficulty);
      }
    }
  }, [difficulty]);

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

  function makeRandomMove(board: string[]) {
    const emptyCells = [];
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) emptyCells.push(i);
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCellIndex = emptyCells[randomIndex];
      const newBoard = [...board];
      newBoard[randomCellIndex] = "O";
      setGameBoard(newBoard);
      setTurn("Player");

      if (checkWinner(newBoard)) {
        setWinner("AI");
        return;
      }

      if (isBoardFull(newBoard)) {
        setWinner("Draw");
      }
    }
  }

  function makeMediumMove(board: string[]) {
    //check if bot can win
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = "O";
        setGameBoard(newBoard);

        if (checkWinner(newBoard)) {
          setWinner("AI");
          return;
        }
      }
    }

    //check if the player can win and block it
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = "X";
        if (checkWinner(newBoard)) {
          newBoard[i] = "O";
          setGameBoard(newBoard);
          setTurn("Player");

          if (isBoardFull(newBoard)) {
            setWinner("Draw");
          }
          return;
        }
      }
    }

    makeRandomMove(board);
  }

  function minimax(board: string[], player: string) {
    if (checkWinner(board) === "O") {
      return { score: 10 };
    } else if (checkWinner(board) === "X") {
      return { score: -10 };
    } else if (isBoardFull(board)) {
      return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const move: any = {};
        move.index = i;

        board[i] = player;

        if (player === "O") {
          const result = minimax(board, "X");
          move.score = result.score;
        } else {
          const result = minimax(board, "O");
          move.score = result.score;
        }

        board[i] = "";

        moves.push(move);
      }
    }

    let bestMove;
    if (player === "O") {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = moves[i];
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = moves[i];
        }
      }
    }

    return bestMove;
  }

  function makeHardMove(board: string[]) {
    const bestMove = minimax(board, "O");
    const newBoard = [...board];
    newBoard[bestMove.index] = "O";
    setGameBoard(newBoard);
    setTurn("Player");

    if (checkWinner(newBoard)) {
      setWinner("AI");
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner("Draw");
    }
  }

  function makePlayerMove(index: number) {
    if (!gameBoard[index] && turn === "Player") {
      const newBoard = [...gameBoard];
      newBoard[index] = "X";
      setGameBoard(newBoard);
      setTurn("AI");

      if (checkWinner(newBoard)) {
        setWinner("Player");
        return;
      }

      if (isBoardFull(newBoard)) {
        setWinner("Draw");
        return;
      }

      makeMove(newBoard, difficulty);
    }
  }

  function makeMove(board: string[], difficulty: string) {
    if (difficulty === "easy") {
      makeRandomMove(board);
    } else if (difficulty === "medium") {
      makeMediumMove(board);
    } else if (difficulty === "hard") {
      makeHardMove(board);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {winner && (
        <h1>{winner === "Draw" ? "It's a draw" : `Winner is ${winner}`}</h1>
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
  );
};

export default Board;
