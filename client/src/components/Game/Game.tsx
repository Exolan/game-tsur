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
    socket.emit("getGameState");

    function handleGameState(currentGamePhase: Phase) {
      setGamePhase(currentGamePhase);
    }

    function handleGameCards(roles: Role[]) {
      setGamePhase("gameCards");
      setRoles(roles);
    }

    function handleStartGame(userData: Role) {
      setGamePhase("game");
      setUserRoleData(userData);
    }

    function handleBackToLobby() {
      setGamePhase("lobby");
    }

    socket.on("gameState", handleGameState);
    socket.on("gameCards", handleGameCards);
    socket.on("startGame", handleStartGame);
    socket.on("backToLobby", handleBackToLobby);

    return () => {
      socket.off("gameState", handleGameState);
      socket.off("gameCards", handleGameCards);
      socket.off("startGame", handleStartGame);
      socket.off("backToLobby", handleBackToLobby);
    };
  }, []);

  return socket && renderPage();
};

export default Game;
