import React, { useEffect, useState } from "react";
import PlayersLobby from "../PlayersLobby/PlayersLobby";
import GameCards from "../GameCards/GameCards";
import GameBoard from "../GameBoard/GameBoard";
import { GameProps, Role } from "../../interfaces";

type Phase = "lobby" | "gameCards" | "game";

const Game: React.FC<GameProps> = ({ socket }) => {
  const [gamePhase, setGamePhase] = useState<Phase>("lobby");
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoleData, setUserRoleData] = useState<Role | null>(null);

  function renderPage() {
    switch (gamePhase) {
      case "lobby":
        return <PlayersLobby socket={socket} />;
      case "gameCards":
        return <GameCards roles={roles} socket={socket} />;
      case "game":
        return <GameBoard socket={socket} userRoleData={userRoleData} />;
    }
  }

  useEffect(() => {
    function handleGameCards(roles: Role[]) {
      setGamePhase("gameCards");
      setRoles(roles);
    }

    function handleStartGame(userData: Role) {
      setGamePhase("game");

      console.log(userData);
      setUserRoleData(userData);
    }

    socket.on("gameCards", handleGameCards);
    socket.on("startGame", handleStartGame);

    return () => {
      socket.off("gameCards", handleGameCards);
      socket.off("startGame", handleStartGame);
    };
  }, []);

  return socket && renderPage();
};

export default Game;
