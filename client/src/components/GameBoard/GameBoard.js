import React, { useEffect, useState } from "react";
import { socket } from "../../socket";
import styles from "./GameBoard.module.css";

function GameBoard({ userGameData }) {
  const [modalData, setModalData] = useState(null);
  const { role, roleData } = userGameData;

  function handleEmit(action, data) {
    if (data) {
      console.log(`Создан emit ${action} с данными ${data}`);
      socket.emit(action, data);
      return;
    }
    console.log(`Создан emit ${action}`);

    socket.emit(action, data);
  }

  function handleNewModal(obj) {
    console.log("СОБЫТИЕ !!!");

    setModalData(obj);
  }

  function onClose() {
    setModalData(null);
  }

  useEffect(() => {
    if (role === "therapist") {
      socket.on("new-patient", handleNewModal);
    }

    return () => {
      if (role === "therapist") {
        socket.off("new-patient", handleNewModal);
      }
    };
  }, []);

  return (
    <div className={styles.conteiner}>
      {modalData && (
        <div className={styles.modal}>
          <p>{modalData.text}</p>
          <div className={styles.modalButtons}>
            {modalData.buttons.map((button) => {
              return (
                <button
                  onClick={() => {
                    handleEmit(button.action, modalData.playerID);
                    onClose();
                  }}
                >
                  {button.text}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className={styles.info}>
        <div className={styles.infoImg}>
          <img src={roleData.image} />
        </div>
        <div className={styles.infoText}>
          <div className={styles.textBlock}>
            <h2 className={styles.textLabel}>Описание персонажа</h2>
            <p className={styles.text}>{roleData.description}</p>
          </div>
          {roleData.condition && (
            <div className={styles.textBlock}>
              <h2 className={styles.textLabel}>Симптомы</h2>
              <p className={styles.text}>{roleData.condition}</p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.buttons}>
        {roleData.buttons.map((button, index) => {
          return (
            button.isActive && (
              <button
                key={index}
                onClick={() => handleEmit(button.action)}
                className={styles.button}
              >
                {button.label}
              </button>
            )
          );
        })}
      </div>
    </div>
  );
}

export default GameBoard;
