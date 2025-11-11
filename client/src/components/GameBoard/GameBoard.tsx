import React, { useEffect, useState } from "react";
import styles from "./GameBoard.module.css";
import { GameBoardProps, ObjectEvent } from "../../interfaces";

const GameBoard: React.FC<GameBoardProps> = ({ socket, userRoleData }) => {
  const [modalData, setModalData] = useState<ObjectEvent | null>(null);
  const [isActionsModal, setIsActionsModal] = useState<boolean>(false);

  function handleEmit(action: string, playerSocket: string | null) {
    if (playerSocket) {
      console.log(`Создан emit ${action} для игрока ${playerSocket}`);
      socket.emit(action, playerSocket);
      return;
    }
    socket.emit(action);
  }

  function onOpen() {
    setIsActionsModal(true);
  }

  function onClose() {
    setIsActionsModal(false);
  }

  function handleNewModal(objectEvent: ObjectEvent) {
    setModalData(objectEvent);
  }

  useEffect(() => {
    if (userRoleData?.roleKey === "therapist") {
      socket.on("new-patient", handleNewModal);
    }
    return () => {
      if (userRoleData?.roleKey === "therapist") {
        socket.off("new-patient", handleNewModal);
      }
    };
  }, []);

  return (
    <div className={styles.conteiner}>
      {modalData && (
        <div className={styles.modal}>
          <p>{modalData.textEvent}</p>
          <div className={styles.modalButtons}>
            {modalData.buttonsEvent.map((button) => {
              return (
                <button
                  key={button.id}
                  onClick={() => {
                    handleEmit(button.actionButton, modalData.playerSocket);
                  }}
                >
                  {button.textButton}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {isActionsModal && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <h2 className={styles.title}>Выберите одно из действий</h2>
              </div>
              <button className={styles.headerButton} onClick={() => onClose()}>
                <img src="/images/close.png" alt="close modal" />
              </button>
            </div>
            <div className={styles.modalButtons}>
              {userRoleData?.roleGameData.buttons.map((button) => {
                return (
                  button.isActive && (
                    <button
                      key={button.id}
                      onClick={() => {
                        handleEmit(button.action, null);
                      }}
                      className={styles.button}
                    >
                      <p>{button.label}</p>
                    </button>
                  )
                );
              })}
            </div>
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
              <img
                src={userRoleData?.roleGameData.image}
                className={styles.cardImg}
                alt=""
              />
            </div>
            <div className={styles.cardBlockText}>
              <h4 className={styles.cardText}>
                {userRoleData?.roleGameData.displayName}
              </h4>
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
                <p className={styles.text}>
                  {userRoleData?.roleGameData.profile}
                </p>
              </div>
              <div className={styles.textBlock}>
                <img
                  src="/images/desc.png"
                  alt=""
                  className={styles.textImage}
                />
                <p className={styles.text}>
                  {userRoleData?.roleGameData.description}
                </p>
              </div>
              <div className={styles.textBlock}>
                <img
                  src="/images/task.png"
                  alt=""
                  className={styles.textImage}
                />
                <p className={styles.text}>{userRoleData?.roleGameData.task}</p>
              </div>
            </div>
          </div>
          <div className={styles.numberBlock}>
            <header className={styles.dataTitle}>
              <h4 className={styles.titleText}>Номер телефона</h4>
            </header>
            <div className={styles.dataText}>
              <p className={styles.text}>{userRoleData?.roleGameData.number}</p>
            </div>
          </div>
          <div className={styles.passwordBlock}>
            <header className={styles.dataTitle}>
              <h4 className={styles.titleText}>Пароль от Госуслуг</h4>
            </header>
            <div className={styles.dataText}>
              <p className={styles.text}>
                {userRoleData?.roleGameData.password}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.buttonBlock}>
          <button className={styles.button} onClick={() => onOpen()}>
            <h4 className={styles.buttonText}>перейти к действиям</h4>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
