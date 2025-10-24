import React, { useState, useEffect } from "react";
import { socket } from "../../socket";

import styles from "./GameCards.module.css";
import RoleCard from "../RoleCard/RoleCard.js";

function GameCards({ roles }) {
  const [roleSelect, setRoleSelect] = useState(false);
  const [currentRoles, setCurrentRoles] = useState(roles);

  useEffect(() => {
    function handleCardsUpdate(data) {
      setCurrentRoles(data);
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
          {currentRoles.map(([roleKey, roleData]) => {
            return (
              <RoleCard
                key={roleKey}
                roleKey={roleKey}
                disabled={roleSelect}
                roleData={roleData}
                setRoleSelect={setRoleSelect}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GameCards;
