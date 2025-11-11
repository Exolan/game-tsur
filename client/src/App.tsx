import React, { useEffect, useState } from "react";
import { socket } from "./socket";

import styles from "./App.module.css";
import Game from "./components/Game/Game";

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  function handleConnect() {
    if (socket.connected) {
      setIsConnected(true);
      socket.emit("playerConnect");
    } else {
      socket.connect();
    }
  }

  useEffect(() => {
    function handleConnectEvent() {
      setIsConnected(true);
      socket.emit("playerConnect");
    }

    function handleDisconnect() {
      setIsConnected(false);
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
        <img className={styles.img} src="./images/gerb.png" alt="" />
        <img className={styles.img} src="./images/cso.png" alt="" />
        <img className={styles.img} src="./images/tsur.png" alt="" />
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
};

export default App;
