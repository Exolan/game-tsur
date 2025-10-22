import React, { useState, useEffect } from "react";
import { socket } from "../../socket";

import styles from "./GameCards.module.css";

function GameCards({ roles }) {
  const [roleSelect, setRoleSelect] = useState(false);
  const [currentRoles, setCurrentRoles] = useState(roles);

  function handleSelect(roleKey) {
    setRoleSelect(true);
    socket.emit("selectRole", roleKey);
  }

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
    <div className={styles.board}>
      {currentRoles.map(([roleKey, roleData]) => {
        return (
          <div key={roleKey} className={styles.card}>
            <h4 className={styles.label}>{roleKey}</h4>
            {!roleData.isSelect && !roleSelect && (
              <button
                onClick={() => handleSelect(roleKey)}
                className={styles.button}
              >
                Выбрать
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default GameCards;
