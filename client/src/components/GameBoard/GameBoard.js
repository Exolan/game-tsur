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

  function handleNewModal(data) {
    setModalData(data);
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
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h4 className={styles.title}>ФАБРИКА ПРОЦЕССОВ</h4>
        </div>
        <div className={styles.headerPageName}>
          <h2 className={styles.pageName}>КАРТОЧКА ПЕРСОНАЖА</h2>
        </div>
      </header>
      <div className={styles.block}>
        <div className={styles.infoBlock}>
          <div className={styles.cardBlock}>
            <div className={styles.cardBlockImg}>
              <img src={roleData.image} className={styles.cardImg} />
            </div>
            <div className={styles.cardBlockText}>
              <h4 className={styles.cardText}>{roleData.displayName}</h4>
            </div>
          </div>
          <div className={styles.descBlock}>
            <header className={styles.dataTitle}>
              <h4 className={styles.titleText}>Описание персонажа</h4>
            </header>
            <div className={styles.dataText}>
              <div className={styles.textBlock}>
                <img
                  src="/images/profile.png"
                  alt=""
                  className={styles.textImage}
                />
                <p className={styles.text}>{roleData.profile}</p>
              </div>
              <div className={styles.textBlock}>
                <img
                  src="/images/desc.png"
                  alt=""
                  className={styles.textImage}
                />
                <p className={styles.text}>{roleData.description}</p>
              </div>
              <div className={styles.textBlock}>
                <img
                  src="/images/task.png"
                  alt=""
                  className={styles.textImage}
                />
                <p className={styles.text}>{roleData.task}</p>
              </div>
            </div>
          </div>
          <div className={styles.numberBlock}>
            <header className={styles.dataTitle}>
              <h4 className={styles.titleText}>Номер телефона</h4>
            </header>
            <div className={styles.dataText}>
              <p className={styles.text}>{roleData.number}</p>
            </div>
          </div>
          <div className={styles.passwordBlock}>
            <header className={styles.dataTitle}>
              <h4 className={styles.titleText}>Пароль от Госуслуг</h4>
            </header>
            <div className={styles.dataText}>
              <p className={styles.text}>{roleData.password}</p>
            </div>
          </div>
        </div>
        <div className={styles.buttonBlock}>
          <button className={styles.button}>
            <h4 className={styles.buttonText} onClick={() => onClick()}>
              перейти к действиям
            </h4>
          </button>
        </div>
      </div>
      {/* <div className={styles.buttons}>
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
      </div> */}
    </div>
  );
}

export default GameBoard;
