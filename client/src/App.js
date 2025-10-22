import React, { useEffect, useState } from "react";
import { socket } from "./socket";

import styles from "./App.module.css";
import Game from "./components/Game/Game";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [playerSocket, setPlayerSocket] = useState(null);

  function handleConnect() {
    if (socket.connected) {
      setIsConnected(true);
      setPlayerSocket(socket);
      socket.emit("playerConnect");
    } else {
      socket.connect();
    }
  }

  useEffect(() => {
    function handleConnectEvent() {
      setIsConnected(true);
      setPlayerSocket(socket);
      socket.emit("playerConnect");
    }

    function handleDisconnect() {
      setIsConnected(false);
      setPlayerSocket(null);
    }

    socket.on("connect", handleConnectEvent);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      handleConnectEvent();
    }

    return () => {
      socket.off("connect", handleConnectEvent);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  if (isConnected) {
    return <Game socket={socket} />;
  }
  return (
    <div className={styles.conteiner}>
      <header className={styles.header}>
        <img className={styles.img} src="./images/gerb.png" />
        <img className={styles.img} src="./images/cso.png" />
        <img className={styles.img} src="./images/tsur.png" />
      </header>
      <div className={styles.block}>
        <div className={styles.textBlock}>
          <h1 className={styles.title}>ФАБРИКА ПРОЦЕССОВ</h1>
          <h3 className={styles.text}>Совершенствуй, играя!</h3>
        </div>
        <div className={styles.infoBlock}>
          <h4 className={styles.infoText}>
            <span className={styles.infoText_span}>P.S.</span> Помните: даже
            маленькое улучшение лучше большого беспорядка
          </h4>
          <div className={styles.buttonBlock}>
            <button className={styles.button} onClick={() => handleConnect()}>
              <h4 className={styles.buttonText}>играть</h4>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
