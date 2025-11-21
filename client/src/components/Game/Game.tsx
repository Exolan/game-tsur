import React, { useEffect, useState } from "react";
import PlayersLobby from "../PlayersLobby/PlayersLobby";
import GameCards from "../GameCards/GameCards";
import GameBoard from "../GameBoard/GameBoard";
import { GameProps, Role } from "../../types";

type Phase = "lobby" | "gameCards" | "game";

function getLocalStorageData() {
  const userData = localStorage.getItem("userData");
  if (userData !== null) {
    return JSON.parse(userData);
  }
  return null;
}

function uploadLocalStorageData(data: Role) {
  if (localStorage.getItem("userData")) {
    localStorage.removeItem("userData");
  }

  localStorage.setItem("userData", JSON.stringify(data));
}

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
    function getGameState() {
      const userData = getLocalStorageData();

      if (userData) {
        socket.emit("getGameState", userData.roleKey);
      } else {
        console.log("Local storage is clear");
      }

      socket.emit("getGameState");
    }

    getGameState();

    function handleGameState(currentGamePhase: Phase) {
      if (currentGamePhase === "game") {
        const userData = getLocalStorageData();

        if (userData) {
          setUserRoleData(userData);
        } else {
          console.log("Local storage is clear");
        }
      }
      setGamePhase(currentGamePhase);
    }

    function handleGameCards(roles: Role[]) {
      setRoles(roles);
      setGamePhase("gameCards");
    }

    function handleStartGame(userData: Role) {
      console.log(userData);
      uploadLocalStorageData(userData);
      setUserRoleData(userData);
      setGamePhase("game");
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
