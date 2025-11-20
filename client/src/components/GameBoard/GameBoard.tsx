import React, { useEffect, useState } from "react";
import styles from "./GameBoard.module.css";
import { GameBoardProps, GameEvent } from "../../types";

const GameBoard: React.FC<GameBoardProps> = ({ socket, userRoleData }) => {
  const [modalData, setModalData] = useState<GameEvent | null>(null);
  const [isEventModal, setIsEventModal] = useState<boolean>(false);
  const [isActionsModal, setIsActionsModal] = useState<boolean>(false);

  function handleEmit(action: string) {
    if (isEventModal) {
      setIsEventModal(false);
    } else {
      setIsActionsModal(false);
    }
    socket.emit("activateEvent", action);
  }

  function onOpen() {
    setIsActionsModal(true);
  }

  function onClose() {
    setIsActionsModal(false);
  }

  function handleModalData(eventData: GameEvent) {
    setModalData(eventData);
    setIsEventModal(true);
  }

  useEffect(() => {
    userRoleData?.roleGameData.events.forEach((eventKey) =>
      socket.on(eventKey, handleModalData)
    );

    return () => {
      userRoleData?.roleGameData.events.forEach((eventKey) =>
        socket.off(eventKey, handleModalData)
      );
    };
  }, []);

  return (
    <div className={styles.conteiner}>
      {isEventModal && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h2>{modalData?.data[modalData.step].text}</h2>
            </div>
            <div className={styles.modalButtons}>
              {modalData?.data[modalData.step].buttons.map((button) => {
                return (
                  <button
                    key={button.id}
                    className={styles.button}
                    onClick={() => {
                      handleEmit(button.action);
                    }}
                  >
                    {button.text}
                  </button>
                );
              })}
            </div>
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
                        handleEmit(button.action);
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
