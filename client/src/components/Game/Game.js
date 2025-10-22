import React, { useEffect, useState } from "react";
import PlayersLobby from "../PlayersLobby/PlayersLobby.js";
import GameCards from "../GameCards/GameCards.js";
import GameBoard from "../GameBoard/GameBoard.js";

import styles from "./Game.module.css";

function Game({ socket }) {
  const [gamePhase, setGamePhase] = useState("lobby");
  const [roles, setRoles] = useState([]);
  const [userGameData, setUserGameData] = useState(null);

  function renderPage() {
    switch (gamePhase) {
      case "lobby":
        return <PlayersLobby />;
      case "gameCards":
        return <GameCards roles={roles} />;
      case "game":
        return <GameBoard userGameData={userGameData} />;
    }
  }

  useEffect(() => {
    function handleGameCards(data) {
      setGamePhase("gameCards");
      setRoles(data);
    }

    function handleStartGame(data) {
      setGamePhase("game");
      setUserGameData(data);
    }

    socket.on("gameCards", handleGameCards);
    socket.on("startGame", handleStartGame);

    return () => {
      socket.off("gameCards", handleGameCards);
      socket.off("startGame", handleStartGame);
    };
  }, []);

  return socket && renderPage();
}

export default Game;
