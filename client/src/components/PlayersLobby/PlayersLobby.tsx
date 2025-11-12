import React, { useState, useEffect, useMemo } from "react";

import styles from "./PlayersLobby.module.css";
import PlayerCard from "../PlayerCard/PlayerCard";
import { GameProps, Player } from "../../interfaces";

const PlayersLobby: React.FC<GameProps> = ({ socket }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  const renderPlayers = useMemo(() => {
    const cells = [];
    for (let i = 0; i < 10; i++) {
      if (players.length > i && players[i]) {
        const player = players[i];
        cells.push(
          <div className={styles.socket} key={i}>
            <PlayerCard
              key={i}
              playerId={i}
              isReady={player.playerData?.isReady}
            />
          </div>
        );
        continue;
      }
      cells.push(<div className={styles.socket} key={i}></div>);
    }

    return cells;
  }, [players]);

  function handleReady() {
    setIsReady(true);
    socket.emit("playerIsReady");
  }

  useEffect(() => {
    function handleLobbyUpdate(players: Player[]) {
      setPlayers(players);
    }

    localStorage.setItem("gamePhase", "lobby");

    socket.on("lobbyUpdate", handleLobbyUpdate);

    socket.emit("getLobbyState");

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
            Игроков: {players.length} из {Math.max(players.length, 4)}
          </h2>
        </div>
      </header>
      <div className={styles.block}>
        <div className={styles.players}>{renderPlayers}</div>
        <div className={styles.footer}>
          {isReady ? (
            <div className={styles.waitingBlock}>
              <h4 className={styles.waitingText}>ожидайте остальных игроков</h4>
            </div>
          ) : (
            <button onClick={handleReady} className={styles.button}>
              <h4 className={styles.buttonText}>готов</h4>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayersLobby;
