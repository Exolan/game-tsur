import React, { useState, useEffect } from "react";
import { socket } from "../../socket";

import styles from "./PlayersLobby.module.css";
import PlayerCard from "../PlayerCard/PlayerCard";

function PlayersLobby() {
  const [players, setPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);

  function renderPlayers() {
    console.log("Render players:", players);

    const sockets = [];
    for (let i = 0; i < 10; i++) {
      if (players.length > i && players[i]) {
        const [socketID, playerData] = players[i];
        sockets.push(
          <div className={styles.socket} key={i}>
            <PlayerCard key={i} isReady={playerData?.isReady} />
          </div>
        );
        continue;
      }
      sockets.push(<div className={styles.socket} key={i}></div>);
    }

    return sockets;
  }

  function handleReady() {
    setIsReady(true);
    socket.emit("playerIsReady");
  }

  useEffect(() => {
    function handleLobbyUpdate(data) {
      console.log("Lobby update received:", data);
      setPlayers(data);
    }

    socket.on("lobbyUpdate", handleLobbyUpdate);

    return () => {
      socket.off("lobbyUpdate", handleLobbyUpdate);
    };
  }, []);

  return (
    <div className={styles.conteiner}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h4 className={styles.title}>ФАБРИКА ПРОЦЕССОВ</h4>
        </div>
        <div className={styles.headerCounter}>
          <h2 className={styles.counter}>
            Игроков: {players.length} из{" "}
            {players.length > 4 ? players.length : 4}
          </h2>
        </div>
      </header>
      <div className={styles.block}>
        <div className={styles.players}>{renderPlayers()}</div>
        <div className={styles.footer}>
          {isReady ? (
            <p>Ожидайте остальных игроков</p>
          ) : (
            <button onClick={handleReady} className={styles.button}>
              <h4 className={styles.buttonText}>готов</h4>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayersLobby;
