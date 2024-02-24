import axios from "axios";

interface PostGameParams {
  difficulty: string;
  board: string[];
  winner?: string;
  email: string;
}

export const useGame = () => {
  async function postGame(
    params: PostGameParams
  ): Promise<{ board: string[]; winner?: string } | undefined> {
    try {
      const gameData: Omit<PostGameParams, "difficulty" | "email"> = {
        board: params.board,
        winner: params.winner,
      };

      const response = await axios.post(
        `http://localhost:8000/game?difficulty=${params.difficulty}`,
        gameData,
        {
          headers: { Authorization: params.email },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function getGame(
    email: string
  ): Promise<{ board: string[] } | undefined> {
    try {
      const response = await axios.get("http://localhost:8000/game", {
        headers: { Authorization: email },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function saveGame(board: string[], email: string) {
    await axios.post(
      "http://localhost:8000/game/save",
      { board },
      {
        headers: {
          Authorization: email,
        },
      }
    );
  }

  return { postGame, getGame, saveGame };
};
