import React, { useState, useEffect } from "react";

import styles from "./GameCards.module.css";
import RoleCard from "../RoleCard/RoleCard";
import { GameCardsProps, Role } from "../../interfaces";

const GameCards: React.FC<GameCardsProps> = ({ roles, socket }) => {
  const [roleSelect, setRoleSelect] = useState<string | null>(null);
  const [currentRoles, setCurrentRoles] = useState<Role[]>(roles);

  useEffect(() => {
    function handleCardsUpdate(newRoles: Role[]) {
      setCurrentRoles(newRoles);
    }

    socket.on("cardsUpdate", handleCardsUpdate);

    return () => {
      socket.off("cardsUpdate", handleCardsUpdate);
    };
  }, []);

  return (
    <div className={styles.conteiner}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h4 className={styles.title}>ФАБРИКА ПРОЦЕССОВ</h4>
        </div>
        <div className={styles.headerPageName}>
          <h2 className={styles.pageName}>ПЕРСОНАЖИ</h2>
        </div>
      </header>
      <div className={styles.block}>
        <div className={styles.cards}>
          {currentRoles.map(({ roleKey, roleGameData }) => {
            return (
              <RoleCard
                key={roleKey}
                roleKey={roleKey}
                roleGameData={roleGameData}
                roleSelect={roleSelect}
                setRoleSelect={setRoleSelect}
                socket={socket}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameCards;
